import type { EditorState } from '@codemirror/state';
import { Decoration, WidgetType } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { renderInlineMarkdown } from './inlineMarkdown';
import { overlaps, type Push } from './utils';

// <details><summary>…</summary> … </details>, GitHub's collapsed section.
// Markdown parses it as loose HTML (the tags end their HTML block at the
// first blank line), so it's found by scanning lines rather than by node.
const OPEN_RE =
  /^\s*<details(\s+open)?\s*>\s*(?:<summary>(.*?)<\/summary>)?\s*$/i;
const SUMMARY_RE = /^\s*<summary>(.*?)<\/summary>\s*$/i;
const CLOSE_RE = /^\s*<\/details>\s*$/i;

export interface DetailsBlock {
  /** Start of the <details> line: also its fold-state key. */
  from: number;
  /** End of the </details> line. */
  to: number;
  /** End of the header: the <details> line, or the <summary> line after it. */
  headerTo: number;
  /** Start of the </details> line. */
  closeFrom: number;
  summary: string;
  openByDefault: boolean;
}

const inCode = (state: EditorState, pos: number): boolean => {
  for (
    let node: ReturnType<ReturnType<typeof syntaxTree>['resolveInner']> | null =
      syntaxTree(state).resolveInner(pos, 1);
    node;
    node = node.parent
  ) {
    if (node.name === 'FencedCode' || node.name === 'CodeBlock') return true;
  }
  return false;
};

/** Every closed <details> section in the document, nested ones included. */
export const findDetailsBlocks = (state: EditorState): DetailsBlock[] => {
  const { doc } = state;
  const blocks: DetailsBlock[] = [];
  const open: Omit<DetailsBlock, 'to' | 'closeFrom'>[] = [];

  for (let n = 1; n <= doc.lines; n++) {
    const line = doc.line(n);
    if (!line.text.includes('details')) continue;
    if (inCode(state, line.from + line.text.search(/\S|$/))) continue;

    const opening = OPEN_RE.exec(line.text);
    if (opening) {
      let summary = opening[2];
      let headerTo = line.to;
      if (summary === undefined && n < doc.lines) {
        const next = SUMMARY_RE.exec(doc.line(n + 1).text);
        if (next) {
          summary = next[1];
          headerTo = doc.line(n + 1).to;
        }
      }
      open.push({
        from: line.from,
        headerTo,
        summary: (summary ?? '').trim() || 'Detalles',
        openByDefault: Boolean(opening[1]),
      });
      continue;
    }
    if (CLOSE_RE.test(line.text) && open.length > 0) {
      const start = open.pop()!;
      blocks.push({ ...start, closeFrom: line.from, to: line.to });
    }
  }
  return blocks.sort((a, b) => a.from - b.from);
};

class DetailsHeaderWidget extends WidgetType {
  constructor(
    readonly summary: string,
    readonly folded: boolean,
    readonly pos: number,
  ) {
    super();
  }

  eq(other: DetailsHeaderWidget) {
    return (
      this.summary === other.summary &&
      this.folded === other.folded &&
      this.pos === other.pos
    );
  }

  toDOM() {
    // Same toggle contract as callouts, so the plugin's click handler folds it
    const header = document.createElement('div');
    header.className = 'cm-live-details-header';
    header.dataset.calloutToggle = 'true';
    header.dataset.calloutPos = String(this.pos);
    header.dataset.calloutFolded = String(this.folded);
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', String(!this.folded));

    const chevron = document.createElement('span');
    chevron.className = `cm-live-details-chevron${this.folded ? '' : ' cm-live-details-chevron-open'}`;
    chevron.textContent = '▸';

    const summary = document.createElement('span');
    summary.className = 'cm-live-details-summary';
    summary.innerHTML = renderInlineMarkdown(this.summary);

    header.append(chevron, summary);
    return header;
  }

  ignoreEvent() {
    return false;
  }
}

/**
 * Draws the document's <details> sections; returns the ranges now hidden
 * (folded bodies), whose own blocks must not be decorated on top.
 */
export const decorateDetails = (
  state: EditorState,
  foldOverrides: Map<number, boolean>,
  push: Push,
): { from: number; to: number }[] => {
  const hidden: { from: number; to: number }[] = [];
  const sel = state.selection;

  for (const block of findDetailsBlocks(state)) {
    // Inside a folded section: already out of sight
    if (hidden.some((r) => block.from >= r.from && block.to <= r.to)) continue;
    // The cursor in it shows the raw HTML, for editing
    if (overlaps(sel, block.from, block.to)) continue;

    const folded = foldOverrides.get(block.from) ?? !block.openByDefault;
    const header = new DetailsHeaderWidget(block.summary, folded, block.from);

    if (folded) {
      push(
        block.from,
        block.to,
        Decoration.replace({ widget: header, block: true }),
      );
      hidden.push({ from: block.from, to: block.to });
      continue;
    }

    push(
      block.from,
      block.headerTo,
      Decoration.replace({ widget: header, block: true }),
    );
    const firstBody = state.doc.lineAt(block.headerTo).number + 1;
    const lastBody = state.doc.lineAt(block.closeFrom).number - 1;
    for (let n = firstBody; n <= lastBody; n++) {
      const line = state.doc.line(n);
      push(
        line.from,
        line.from,
        Decoration.line({ attributes: { class: 'cm-live-details-body' } }),
      );
    }
    push(block.closeFrom, block.to, Decoration.replace({ block: true }));
  }
  return hidden;
};
