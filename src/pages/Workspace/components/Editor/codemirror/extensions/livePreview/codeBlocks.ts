import type { EditorState } from '@codemirror/state';
import { Decoration, WidgetType } from '@codemirror/view';
import i18n from '@/i18n';
import type { SyntaxNode } from '@lezer/common';
import {
  isEditingBlock,
  showsMarkup,
  type BlockHandler,
  type Handler,
} from './utils';
import {
  CODE_MODE_FENCES,
  HTML_APP_FENCE,
  isDiagramInCodeMode,
} from './foldState';
import {
  MermaidHeaderToolbarWidget,
  MermaidRowWidget,
  MermaidWidget,
  parseMermaidMeta,
} from './mermaidWidget';
import { MathWidget } from './mathWidget';
import { GeoJsonWidget } from './geojsonWidget';
import { HtmlAppWidget, htmlAppModeLabels } from './htmlAppWidget';

// Fences drawn as what they describe (a diagram, a formula, a map) while the
// cursor is elsewhere, instead of as code.
const RENDERED_FENCES = new Set(['mermaid', 'math', 'geojson', HTML_APP_FENCE]);

/** A fence's language: the first word of its info string, lowercased. */
const fenceLanguage = (info: string) =>
  info.trim().split(/\s+/)[0]?.toLowerCase() ?? '';

/** Optional height (`h=<px>`) stored on a ` ```mermaid h=240 ` fence. */
export const parseFenceHeight = (info: string): number | null => {
  const match = /\bh=(\d+)\b/.exec(info);
  return match ? Number(match[1]) : null;
};

const extractFenceInfo = (
  node: SyntaxNode,
  state: EditorState,
): { info: string; code: string } => {
  let info = '';
  let code = '';
  const cursor = node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'CodeInfo') {
      info = state.sliceDoc(cursor.from, cursor.to).trim();
    } else if (cursor.type.name === 'CodeText') {
      code = state.sliceDoc(cursor.from, cursor.to);
    }
  }
  return { info, code };
};

// Fenced ``` code blocks — continuous card framing.
// When cursor is NOT on the opening fence line, the opening ``` is hidden and
// the language name is shown as a neat badge.
// When cursor is NOT on the closing fence line, the closing ``` is hidden,
// forming the rounded bottom of the code container.
// Clicking on either fence line reveals the raw ``` backticks for editing.
// Formats drawn as something (not code): named for what they are
const FRIENDLY_LABELS: Record<string, string> = {
  mermaid: 'editor.diagram.badge',
  math: 'editor.slash.items.math',
  geojson: 'editor.diagram.mapBadge',
  [HTML_APP_FENCE]: 'editor.htmlApp.badge',
};

class LangLabelWidget extends WidgetType {
  constructor(readonly label: string) {
    super();
  }

  eq(other: LangLabelWidget) {
    return other.label === this.label;
  }

  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-code-lang-badge';
    span.textContent = this.label;
    return span;
  }
}

export const handleFencedCode: Handler = (node, view, sel, push) => {
  const { doc } = view.state;
  const startLine = doc.lineAt(node.from);
  const endLine = doc.lineAt(node.to);

  // If startLine === endLine, it's an unclosed single line fence (e.g. user just typed ```)
  if (startLine.number === endLine.number) {
    push(
      startLine.from,
      startLine.from,
      Decoration.line({ attributes: { class: 'cm-code-block-line' } }),
    );
    return;
  }

  // Find fence tokens (opening CodeMark, CodeInfo, closing CodeMark)
  const cursor = node.node.cursor();
  let openMark: { from: number; to: number } | null = null;
  let codeInfo: { from: number; to: number; text: string } | null = null;
  let closeMark: { from: number; to: number } | null = null;

  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'CodeMark') {
      if (!openMark) {
        openMark = { from: cursor.from, to: cursor.to };
      } else {
        closeMark = { from: cursor.from, to: cursor.to };
      }
    } else if (cursor.type.name === 'CodeInfo') {
      codeInfo = {
        from: cursor.from,
        to: cursor.to,
        text: view.state.sliceDoc(cursor.from, cursor.to).trim(),
      };
    }
  }

  const lang = codeInfo ? fenceLanguage(codeInfo.text) : '';
  const hasCodeMode = CODE_MODE_FENCES.has(lang);

  // A drawn fence (mermaid, math, geojson) in preview mode is replaced by its
  // widget in blockDecorations.ts
  if (codeInfo && RENDERED_FENCES.has(lang)) {
    const editing = hasCodeMode
      ? isDiagramInCodeMode(view.state, node.from)
      : isEditingBlock(view.state, node.from, node.to);
    if (!editing) return false;
  }

  // The ``` fences never show (markupEditing.ts keeps the cursor off them)
  const cursorOnStart = showsMarkup(sel, startLine.from, startLine.to);
  const cursorOnEnd = showsMarkup(sel, endLine.from, endLine.to);

  for (let ln = startLine.number; ln <= endLine.number; ln++) {
    const line = doc.line(ln);
    let cls = 'cm-code-block-line';
    if (ln === startLine.number) {
      cls += ' cm-code-block-header';
      if (hasCodeMode) cls += ' cm-mermaid-code-header';
      if (cursorOnStart) cls += ' cm-code-fence-active';
    } else if (ln === endLine.number) {
      cls += ' cm-code-block-footer';
      if (cursorOnEnd) cls += ' cm-code-fence-active';
    }
    push(line.from, line.from, Decoration.line({ attributes: { class: cls } }));
  }

  // When cursor is NOT on the opening fence line, hide the opening backticks (```)
  if (!cursorOnStart && openMark) {
    push(openMark.from, openMark.to, Decoration.replace({}));
    if (codeInfo) {
      const langWordLen =
        codeInfo.text.split(/\s+/)[0]?.length ?? codeInfo.text.length;
      const badgeEnd = Math.min(codeInfo.to, codeInfo.from + langWordLen);
      const friendly = FRIENDLY_LABELS[fenceLanguage(codeInfo.text)];
      push(
        codeInfo.from,
        badgeEnd,
        // A drawn block says what it is ("Diagrama"), not its format's
        // name ("mermaid"); code keeps its language's name
        friendly
          ? Decoration.replace({
              widget: new LangLabelWidget(i18n.t(friendly)),
            })
          : Decoration.mark({ class: 'cm-code-lang-badge' }),
      );
      if (codeInfo.to > badgeEnd) {
        push(badgeEnd, codeInfo.to, Decoration.replace({}));
      }
    }
  }

  if (hasCodeMode) {
    push(
      startLine.to,
      startLine.to,
      Decoration.widget({
        widget: new MermaidHeaderToolbarWidget(
          node.from,
          lang === HTML_APP_FENCE ? htmlAppModeLabels() : undefined,
        ),
        side: 1,
      }),
    );
  }

  // When cursor is NOT on the closing fence line, hide the closing backticks (```)
  if (!cursorOnEnd && closeMark) {
    push(closeMark.from, closeMark.to, Decoration.replace({}));
  }

  return false;
};

const isPreviewMermaidNode = (
  n: SyntaxNode | null,
  state: EditorState,
): { info: string; code: string } | null => {
  if (!n || n.name !== 'FencedCode') return null;
  if (isDiagramInCodeMode(state, n.from)) return null;
  const extracted = extractFenceInfo(n, state);
  if (fenceLanguage(extracted.info) !== 'mermaid') return null;
  return extracted;
};

// Renders ```mermaid as a diagram, ```math as a formula (GitHub's other math
// syntax) and ```geojson as a map. A BlockHandler (state-based, full-document
// walk) since it needs `block: true` — see blockDecorations.ts.
export const handleRenderedFence: BlockHandler = (node, state, _sel, push) => {
  const { info, code } = extractFenceInfo(node.node, state);
  const language = fenceLanguage(info);

  if (language === 'mermaid') {
    // In code mode (`</>` icon active), show only the code block — never render
    // the colorful diagram underneath the code editor.
    if (isDiagramInCodeMode(state, node.from)) return;

    const meta = parseMermaidMeta(info);
    const prev = node.node.prevSibling;
    if (
      meta.col &&
      prev &&
      isPreviewMermaidNode(prev, state) &&
      !/\S/.test(state.sliceDoc(prev.to, node.from))
    ) {
      // Already rendered as part of the row started by an earlier sibling
      return;
    }

    const items: MermaidWidget[] = [
      new MermaidWidget(code, node.from, meta.height, meta.align, meta.zoom),
    ];
    let lastTo = node.to;
    let cur = node.node.nextSibling;
    while (cur) {
      const nextMermaid = isPreviewMermaidNode(cur, state);
      if (!nextMermaid) break;
      const nextMeta = parseMermaidMeta(nextMermaid.info);
      if (!nextMeta.col || /\S/.test(state.sliceDoc(lastTo, cur.from))) {
        break;
      }
      items.push(
        new MermaidWidget(
          nextMermaid.code,
          cur.from,
          nextMeta.height,
          nextMeta.align,
          nextMeta.zoom,
        ),
      );
      lastTo = cur.to;
      cur = cur.nextSibling;
    }

    const startLine = state.doc.lineAt(node.from);
    const endLine = state.doc.lineAt(lastTo);
    push(
      startLine.from,
      endLine.to,
      Decoration.replace({
        widget: items.length > 1 ? new MermaidRowWidget(items) : items[0],
        block: true,
      }),
    );
    return;
  }

  if (language === HTML_APP_FENCE) {
    if (isDiagramInCodeMode(state, node.from)) return;
    push(
      state.doc.lineAt(node.from).from,
      state.doc.lineAt(node.to).to,
      Decoration.replace({
        widget: new HtmlAppWidget(code, node.from),
        block: true,
      }),
    );
    return;
  }

  // Being edited: a math fence shows its source and the formula under it
  if (isEditingBlock(state, node.from, node.to)) {
    const preview =
      language === 'math' ? new MathWidget(code.trim() || ' ', true) : null;
    if (preview && code.trim()) {
      push(
        state.doc.lineAt(node.to).to,
        state.doc.lineAt(node.to).to,
        Decoration.widget({ widget: preview, block: true, side: 1 }),
      );
    }
    return;
  }
  const widget =
    language === 'math'
      ? new MathWidget(code, true)
      : language === 'geojson'
        ? new GeoJsonWidget(code)
        : null;
  if (!widget) return;

  const startLine = state.doc.lineAt(node.from);
  const endLine = state.doc.lineAt(node.to);
  push(startLine.from, endLine.to, Decoration.replace({ widget, block: true }));
};
