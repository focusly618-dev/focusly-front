import type { EditorState } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import type { SyntaxNode } from '@lezer/common';
import { overlaps, type BlockHandler, type Handler } from './utils';
import { MermaidWidget } from './mermaidWidget';

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

  // If mermaid and cursor outside, MermaidWidget in blockDecorations.ts handles replacement
  if (
    codeInfo?.text.toLowerCase() === 'mermaid' &&
    !overlaps(sel, node.from, node.to)
  ) {
    return false;
  }

  const cursorOnStart = overlaps(sel, startLine.from, startLine.to);
  const cursorOnEnd = overlaps(sel, endLine.from, endLine.to);

  for (let ln = startLine.number; ln <= endLine.number; ln++) {
    const line = doc.line(ln);
    let cls = 'cm-code-block-line';
    if (ln === startLine.number) {
      cls += ' cm-code-block-header';
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
      push(
        codeInfo.from,
        codeInfo.to,
        Decoration.mark({ class: 'cm-code-lang-badge' }),
      );
    }
  }

  // When cursor is NOT on the closing fence line, hide the closing backticks (```)
  if (!cursorOnEnd && closeMark) {
    push(closeMark.from, closeMark.to, Decoration.replace({}));
  }

  return false;
};

// Renders a ```mermaid fence as an actual diagram. A BlockHandler (state-based,
// full-document walk) since it needs `block: true` — see blockDecorations.ts.
// The framing lines from handleFencedCode above still get computed for this
// same range, but stay inert underneath the widget until the cursor enters it.
export const handleMermaidBlock: BlockHandler = (node, state, sel, push) => {
  if (overlaps(sel, node.from, node.to)) return;

  const { info, code } = extractFenceInfo(node.node, state);
  if (info.toLowerCase() !== 'mermaid') return;

  const startLine = state.doc.lineAt(node.from);
  const endLine = state.doc.lineAt(node.to);
  push(
    startLine.from,
    endLine.to,
    Decoration.replace({ widget: new MermaidWidget(code), block: true }),
  );
};
