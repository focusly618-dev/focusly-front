import type { EditorState } from '@codemirror/state';
import { Decoration, WidgetType } from '@codemirror/view';
import type { SyntaxNodeRef } from '@lezer/common';
import { overlaps, type BlockHandler, type Handler } from './utils';
import { renderInlineMarkdown } from './inlineMarkdown';

// Obsidian's callout syntax: the blockquote's first line is `[!type]`,
// optionally followed by a fold marker (`-` collapsed, `+` expanded-but-
// foldable) and a custom title. Not CommonMark/GFM — this is plain text
// inside a regular Blockquote as far as the parser is concerned, so it's
// detected here by pattern rather than by a dedicated node type.
const CALLOUT_RE = /^\[!([a-zA-Z][\w-]*)\]([+-])?\s*(.*)$/;

const CALLOUT_ICONS: Record<string, string> = {
  note: '📔',
  info: 'ℹ️',
  tip: '💡',
  hint: '💡',
  important: '📌',
  success: '✅',
  check: '✅',
  done: '✅',
  warning: '⚠️',
  caution: '⚠️',
  attention: '⚠️',
  failure: '❌',
  fail: '❌',
  missing: '❌',
  danger: '⚡',
  error: '⚡',
  bug: '🐛',
  example: '📋',
  question: '❓',
  help: '❓',
  faq: '❓',
  quote: '❝',
  cite: '❝',
  abstract: '📄',
  summary: '📄',
  tldr: '📄',
  todo: '☑️',
};

const DEFAULT_ICON = '📌';

export class CalloutHeaderWidget extends WidgetType {
  constructor(
    readonly type: string,
    readonly title: string,
    readonly foldable: boolean,
    readonly folded: boolean,
    readonly pos: number,
  ) {
    super();
  }

  eq(other: CalloutHeaderWidget) {
    return (
      this.type === other.type &&
      this.title === other.title &&
      this.foldable === other.foldable &&
      this.folded === other.folded &&
      this.pos === other.pos
    );
  }

  toDOM() {
    const header = document.createElement('div');
    header.className = `cm-live-callout-header cm-live-callout-${this.type}`;
    if (this.foldable) {
      header.dataset.calloutToggle = 'true';
      header.dataset.calloutPos = String(this.pos);
      header.dataset.calloutFolded = String(this.folded);
      header.style.cursor = 'pointer';
    }

    const icon = document.createElement('span');
    icon.className = 'cm-live-callout-icon';
    icon.textContent = CALLOUT_ICONS[this.type] || DEFAULT_ICON;
    header.appendChild(icon);

    const title = document.createElement('span');
    title.className = 'cm-live-callout-title';
    title.innerHTML = renderInlineMarkdown(this.title || this.type);
    header.appendChild(title);

    if (this.foldable) {
      const chevron = document.createElement('span');
      chevron.className = 'cm-live-callout-chevron';
      chevron.textContent = this.folded ? '▸' : '▾';
      header.appendChild(chevron);
    }

    return header;
  }

  ignoreEvent() {
    return false;
  }
}

// Shared by both walks: the ViewPlugin only needs to know "is this a callout"
// (to stop QuoteMark from also decorating it), while the StateField needs the
// full parsed match to render it.
const detectCallout = (
  state: EditorState,
  node: SyntaxNodeRef,
): RegExpExecArray | null => {
  const startLine = state.doc.lineAt(node.from);
  const stripped = /^>\s?(.*)$/.exec(
    state.sliceDoc(startLine.from, startLine.to),
  );
  if (!stripped) return null;
  return CALLOUT_RE.exec(stripped[1].trim());
};

// Registered for `Blockquote` in the viewport-scoped ViewPlugin — its only
// job is to skip descending into a callout's children so QuoteMark doesn't
// separately (and redundantly) decorate its `>` markers. The actual callout
// rendering happens in handleCallout below, via the block-only StateField.
export const handleCalloutMarker: Handler = (node, view) => {
  return detectCallout(view.state, node) ? false : undefined;
};

export const handleCallout: BlockHandler = (
  node,
  state,
  sel,
  push,
  foldOverrides,
) => {
  const match = detectCallout(state, node);
  if (!match) return; // a plain blockquote — let QuoteMark handle it per-line

  const startLine = state.doc.lineAt(node.from);
  const [, rawType, foldMarker, rawTitle] = match;
  const type = rawType.toLowerCase();
  const title = rawTitle.trim();
  const pos = node.from;
  const foldable = foldMarker === '-' || foldMarker === '+';
  const folded = foldOverrides.get(pos) ?? foldMarker === '-';
  const endLine = state.doc.lineAt(node.to);

  // Color bar on every line of the callout, header included — stays even
  // while the header's raw syntax is revealed for editing.
  for (let n = startLine.number; n <= endLine.number; n++) {
    const line = state.doc.line(n);
    push(
      line.from,
      line.from,
      Decoration.line({
        attributes: {
          class: `cm-live-callout-line cm-live-callout-line-${type}`,
        },
      }),
    );
  }

  if (!overlaps(sel, startLine.from, startLine.to)) {
    push(
      startLine.from,
      startLine.to,
      Decoration.replace({
        widget: new CalloutHeaderWidget(type, title, foldable, folded, pos),
        block: true,
      }),
    );
  }

  if (folded && endLine.number > startLine.number) {
    const bodyStart = state.doc.line(startLine.number + 1).from;
    push(bodyStart, endLine.to, Decoration.replace({ block: true }));
  }

  return false;
};

// Reads the clicked header's own dataset (already resolved at render time)
// rather than needing the fold map directly — the caller dispatches the
// resulting {pos, folded} as a setCalloutFold effect.
export const handleCalloutToggleClick = (
  event: MouseEvent,
): { pos: number; folded: boolean } | null => {
  const target = event.target as HTMLElement;
  const header = target.closest(
    '[data-callout-toggle="true"]',
  ) as HTMLElement | null;
  if (!header) return null;

  const pos = Number(header.dataset.calloutPos);
  const currentlyFolded = header.dataset.calloutFolded === 'true';
  event.preventDefault();
  return { pos, folded: !currentlyFolded };
};
