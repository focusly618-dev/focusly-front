import type { EditorState } from '@codemirror/state';
import { Decoration, WidgetType } from '@codemirror/view';
import type { SyntaxNodeRef } from '@lezer/common';
import { overlaps, type BlockHandler } from './utils';
import { renderInlineMarkdown } from './inlineMarkdown';

type Align = 'left' | 'center' | 'right' | null;

const parseAlignments = (delimiterText: string): Align[] =>
  delimiterText
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      const left = s.startsWith(':');
      const right = s.endsWith(':');
      if (left && right) return 'center';
      if (right) return 'right';
      if (left) return 'left';
      return null;
    });

const parseRowCells = (
  state: EditorState,
  rowNode: SyntaxNodeRef,
): string[] => {
  const cells: string[] = [];
  const cursor = rowNode.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'TableCell') {
      cells.push(state.sliceDoc(cursor.from, cursor.to));
    }
  }
  return cells;
};

class TableWidget extends WidgetType {
  constructor(
    readonly header: string[],
    readonly rows: string[][],
    readonly aligns: Align[],
  ) {
    super();
  }

  eq(other: TableWidget) {
    return (
      JSON.stringify(this.header) === JSON.stringify(other.header) &&
      JSON.stringify(this.rows) === JSON.stringify(other.rows) &&
      JSON.stringify(this.aligns) === JSON.stringify(other.aligns)
    );
  }

  toDOM() {
    const wrapper = document.createElement('div');
    wrapper.className = 'cm-live-table-wrapper';

    const table = document.createElement('table');
    table.className = 'cm-live-table';

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    this.header.forEach((cell, i) => {
      const th = document.createElement('th');
      th.innerHTML = renderInlineMarkdown(cell);
      if (this.aligns[i]) th.style.textAlign = this.aligns[i] as string;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    this.rows.forEach((row) => {
      const tr = document.createElement('tr');
      row.forEach((cell, i) => {
        const td = document.createElement('td');
        td.innerHTML = renderInlineMarkdown(cell);
        if (this.aligns[i]) td.style.textAlign = this.aligns[i] as string;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    wrapper.appendChild(table);
    return wrapper;
  }

  ignoreEvent() {
    return false;
  }
}

// GFM tables render as a real <table> when the cursor is elsewhere, and
// fall back to raw pipe syntax the moment the cursor touches any part of
// the table — editing cell-by-cell inside a rendered widget isn't
// supported, so revealing the source is how you edit it, same trade-off
// images make.
export const handleTable: BlockHandler = (node, state, sel, push) => {
  if (overlaps(sel, node.from, node.to)) return;

  let header: string[] = [];
  const rows: string[][] = [];
  let aligns: Align[] = [];

  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'TableHeader') {
      header = parseRowCells(state, cursor.node);
    } else if (cursor.type.name === 'TableDelimiter') {
      aligns = parseAlignments(state.sliceDoc(cursor.from, cursor.to));
    } else if (cursor.type.name === 'TableRow') {
      rows.push(parseRowCells(state, cursor.node));
    }
  }

  if (header.length === 0) return;

  // A table spans multiple lines, so this has to be a block decoration —
  // CM6 requires those to align exactly to line boundaries, not wherever
  // the last cell's text happens to end.
  const startLine = state.doc.lineAt(node.from);
  const endLine = state.doc.lineAt(node.to);
  push(
    startLine.from,
    endLine.to,
    Decoration.replace({
      widget: new TableWidget(header, rows, aligns),
      block: true,
    }),
  );
};
