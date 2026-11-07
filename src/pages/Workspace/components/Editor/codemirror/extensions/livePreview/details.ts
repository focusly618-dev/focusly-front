import { EditorSelection, type EditorState } from '@codemirror/state';
import { Decoration, WidgetType, type EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { renderInlineMarkdown } from './inlineMarkdown';
import { showsMarkup, type Push } from './utils';

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

  toDOM(view: EditorView) {
    const header = document.createElement('div');
    header.className = 'cm-live-details-header';
    header.setAttribute('aria-expanded', String(!this.folded));

    // The chevron folds it (same toggle contract as callouts); the title is
    // edited in place
    const chevron = document.createElement('span');
    chevron.className = `cm-live-details-chevron${this.folded ? '' : ' cm-live-details-chevron-open'}`;
    chevron.textContent = '▸';
    chevron.setAttribute('role', 'button');
    chevron.dataset.calloutToggle = 'true';
    chevron.dataset.calloutPos = String(this.pos);
    chevron.dataset.calloutFolded = String(this.folded);

    const summary = document.createElement('span');
    summary.className = 'cm-live-details-summary';
    summary.setAttribute('contenteditable', 'true');
    summary.spellcheck = true;
    summary.dataset.raw = this.summary;
    summary.innerHTML = renderInlineMarkdown(this.summary);

    summary.addEventListener('focus', () => {
      summary.textContent = summary.dataset.raw ?? '';
    });
    summary.addEventListener('blur', () => {
      summary.innerHTML = renderInlineMarkdown(summary.dataset.raw ?? '');
    });
    summary.addEventListener('input', () => {
      const text = (summary.textContent ?? '').replace(/\s+/g, ' ');
      summary.dataset.raw = text;
      writeSummary(view, Number(chevron.dataset.calloutPos), text);
    });
    summary.addEventListener('keydown', (e) => {
      // Select all: the title, not the whole document around it
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const range = document.createRange();
        range.selectNodeContents(summary);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        return;
      }
      if (e.key !== 'Enter' && e.key !== 'Escape') return;
      e.preventDefault();
      // Done: on to the section's content
      const block = findDetailsBlocks(view.state).find(
        (b) => b.from === Number(chevron.dataset.calloutPos),
      );
      view.focus();
      if (block) {
        view.dispatch({
          selection: EditorSelection.cursor(
            Math.min(block.headerTo + 1, block.closeFrom),
          ),
        });
      }
    });
    summary.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData?.getData('text/plain') ?? '').replace(
        /\s+/g,
        ' ',
      );
      document.execCommand('insertText', false, text);
    });

    header.append(chevron, summary);
    return header;
  }

  /** Same fold state: updated in place, so the title being typed keeps
   * its focus. */
  updateDOM(dom: HTMLElement) {
    const chevron = dom.querySelector<HTMLElement>('.cm-live-details-chevron');
    const summary = dom.querySelector<HTMLElement>('.cm-live-details-summary');
    if (!chevron || !summary) return false;
    if (chevron.dataset.calloutFolded !== String(this.folded)) return false;
    chevron.dataset.calloutPos = String(this.pos);
    if (
      document.activeElement !== summary &&
      summary.dataset.raw !== this.summary
    ) {
      summary.dataset.raw = this.summary;
      summary.innerHTML = renderInlineMarkdown(this.summary);
    }
    return true;
  }

  // Typing and clicks in the title are the title's, not the editor's
  ignoreEvent(event: Event) {
    return Boolean(
      (event.target as HTMLElement | null)?.closest?.(
        '.cm-live-details-summary',
      ),
    );
  }
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Writes a section's title into its <summary>, adding one when missing. */
const writeSummary = (view: EditorView, pos: number, text: string) => {
  const block = findDetailsBlocks(view.state).find((b) => b.from === pos);
  if (!block) return;
  const header = view.state.sliceDoc(block.from, block.headerTo);
  const match = /<summary>(.*?)<\/summary>/i.exec(header);
  const value = escapeHtml(text.trim());
  const changes = match
    ? {
        from: block.from + match.index + '<summary>'.length,
        to: block.from + match.index + '<summary>'.length + match[1].length,
        insert: value,
      }
    : { from: block.headerTo, insert: `\n<summary>${value}</summary>` };
  view.dispatch({ changes, userEvent: 'input.summary' });
};

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
    if (showsMarkup(sel, block.from, block.to)) continue;

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
