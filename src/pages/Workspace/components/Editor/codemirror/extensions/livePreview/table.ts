import {
  EditorSelection,
  EditorState,
  Prec,
  type Extension,
} from '@codemirror/state';
import { Decoration, EditorView, WidgetType, keymap } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';
import type { SyntaxNodeRef } from '@lezer/common';
import i18n from '@/i18n';
import { showsMarkup, type BlockHandler } from './utils';
import { renderInlineMarkdown } from './inlineMarkdown';

/**
 * GFM tables, edited as tables. The table is always drawn (its | and ---
 * never show): click a cell and type; Tab / Shift+Tab move between cells
 * (Tab on the last one adds a row), Enter goes down a row (adding one at
 * the end), ↑ on the first row / ↓ on the last leave the table, Esc leaves
 * it below. A small toolbar over the focused cell adds or removes rows and
 * columns, or the whole table. Every edit is written back as Markdown.
 */

export type Align = 'left' | 'center' | 'right' | null;

export interface TableModel {
  header: string[];
  rows: string[][];
  aligns: Align[];
}

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

/** A row's cells from its line. Empty cells have no node in the tree, so
 * the line is split on unescaped pipes instead. */
export const splitRow = (line: string): string[] => {
  let text = line.trim();
  if (text.startsWith('|')) text = text.slice(1);
  if (text.endsWith('|') && !text.endsWith('\\|')) text = text.slice(0, -1);
  const cells: string[] = [];
  let current = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '\\' && text[i + 1] === '|') {
      current += '\\|';
      i += 1;
    } else if (text[i] === '|') {
      cells.push(current.trim());
      current = '';
    } else {
      current += text[i];
    }
  }
  cells.push(current.trim());
  return cells;
};

const unescapeCell = (cell: string) => cell.replace(/\\\|/g, '|');
const escapeCell = (cell: string) =>
  cell.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();

export const parseTable = (
  state: EditorState,
  node: SyntaxNodeRef,
): TableModel => {
  let header: string[] = [];
  const rows: string[][] = [];
  let aligns: Align[] = [];
  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    const line = state.doc.lineAt(cursor.from).text;
    if (cursor.type.name === 'TableHeader')
      header = splitRow(line).map(unescapeCell);
    else if (cursor.type.name === 'TableDelimiter')
      aligns = parseAlignments(line);
    else if (cursor.type.name === 'TableRow')
      rows.push(splitRow(line).map(unescapeCell));
  }
  const width = header.length;
  return {
    header,
    // Every row as wide as the header: short ones padded, long ones cut
    rows: rows.map((r) => Array.from({ length: width }, (_, i) => r[i] ?? '')),
    aligns: Array.from({ length: width }, (_, i) => aligns[i] ?? null),
  };
};

const delimiter = (align: Align) =>
  align === 'center'
    ? ':---:'
    : align === 'right'
      ? '---:'
      : align === 'left'
        ? ':---'
        : '---';

export const serializeTable = ({
  header,
  rows,
  aligns,
}: TableModel): string => {
  const line = (cells: string[]) => `| ${cells.map(escapeCell).join(' | ')} |`;
  return [
    line(header),
    `| ${header.map((_, i) => delimiter(aligns[i] ?? null)).join(' | ')} |`,
    ...rows.map(line),
  ].join('\n');
};

const t = (key: string) => i18n.t(`editor.table.${key}`);

/** The Table node starting at (or containing) `pos`. */
const tableNodeAt = (state: EditorState, pos: number): SyntaxNode | null => {
  let found: SyntaxNode | null = null;
  syntaxTree(state).iterate({
    from: pos,
    to: Math.min(pos + 1, state.doc.length),
    enter: (ref) => {
      if (ref.name === 'Table') {
        found = ref.node;
        return false;
      }
    },
  });
  return found;
};

const tableRange = (state: EditorState, node: SyntaxNode) => ({
  from: state.doc.lineAt(node.from).from,
  to: state.doc.lineAt(node.to).to,
});

// Which cell to focus once a table is redrawn (rows/columns changed)
let pendingFocus: {
  pos: number;
  row: number;
  col: number;
  select: boolean;
} | null = null;

/** Puts the caret in a table's cell (row -1: the header), selecting its
 * text when `select`. For a table just inserted or redrawn. */
export const focusTableCell = (
  view: EditorView,
  tablePos: number,
  row: number,
  col: number,
  select = false,
) => {
  pendingFocus = { pos: tablePos, row, col, select };
  requestAnimationFrame(() => {
    const target = pendingFocus;
    pendingFocus = null;
    if (!target) return;
    for (const wrapper of view.dom.querySelectorAll<HTMLElement>(
      '.cm-live-table-wrapper',
    )) {
      let pos: number;
      try {
        pos = view.posAtDOM(wrapper);
      } catch {
        continue;
      }
      if (Math.abs(pos - target.pos) > 1) continue;
      const cell = wrapper.querySelector<HTMLElement>(
        `[data-row="${target.row}"][data-col="${target.col}"]`,
      );
      if (cell) focusCell(cell, target.select);
      return;
    }
  });
};

const focusCell = (cell: HTMLElement, select: boolean) => {
  cell.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(cell);
  if (!select) range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

const ICONS: Record<string, string> = {
  addRow: '<path d="M4 6h16M4 12h16M12 15v6M9 18h6"/>',
  addColumn: '<path d="M6 4v16M12 4v16M15 12h6M18 9v6"/>',
  deleteRow: '<path d="M4 6h16M4 12h16M9 18h6"/>',
  deleteColumn: '<path d="M6 4v16M12 4v16M15 12h6"/>',
  deleteTable: '<path d="M5 7h14M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3"/>',
};

class TableWidget extends WidgetType {
  constructor(readonly model: TableModel) {
    super();
  }

  eq(other: TableWidget) {
    return JSON.stringify(this.model) === JSON.stringify(other.model);
  }

  private fillCell(cell: HTMLElement, raw: string) {
    cell.dataset.raw = raw;
    // Formatting shows applied, never as ** or `
    if (document.activeElement === cell) cell.textContent = raw;
    else cell.innerHTML = raw ? renderInlineMarkdown(raw) : '';
  }

  toDOM(view: EditorView) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cm-live-table-wrapper';

    const toolbar = document.createElement('div');
    toolbar.className = 'cm-live-table-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    for (const action of Object.keys(ICONS)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cm-live-table-action';
      button.dataset.action = action;
      const label = t(action);
      button.title = label;
      button.setAttribute('aria-label', label);
      button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[action]}</svg>`;
      // Keep the cell's focus (and know which cell) while clicking
      button.addEventListener('mousedown', (e) => e.preventDefault());
      toolbar.appendChild(button);
    }
    wrapper.appendChild(toolbar);

    const table = document.createElement('table');
    table.className = 'cm-live-table';
    const makeCell = (
      tag: 'th' | 'td',
      raw: string,
      row: number,
      col: number,
    ) => {
      const cell = document.createElement(tag);
      cell.setAttribute('contenteditable', 'true');
      cell.spellcheck = true;
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      const align = this.model.aligns[col];
      if (align) cell.style.textAlign = align;
      this.fillCell(cell, raw);
      return cell;
    };
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    this.model.header.forEach((c, i) =>
      headRow.appendChild(makeCell('th', c, -1, i)),
    );
    thead.appendChild(headRow);
    const tbody = document.createElement('tbody');
    this.model.rows.forEach((row, r) => {
      const tr = document.createElement('tr');
      row.forEach((c, i) => tr.appendChild(makeCell('td', c, r, i)));
      tbody.appendChild(tr);
    });
    table.append(thead, tbody);
    wrapper.appendChild(table);

    this.listen(wrapper, view);
    return wrapper;
  }

  /** Same shape (rows × columns): the cells are updated in place, so the
   * one being typed in keeps its focus. */
  updateDOM(dom: HTMLElement) {
    const cells = dom.querySelectorAll<HTMLElement>('[data-row]');
    const { header, rows } = this.model;
    if (cells.length !== header.length * (rows.length + 1)) return false;
    if (dom.querySelectorAll('tbody tr').length !== rows.length) return false;
    for (const cell of cells) {
      const r = Number(cell.dataset.row);
      const c = Number(cell.dataset.col);
      const raw = r < 0 ? header[c] : rows[r]?.[c];
      if (raw === undefined) return false;
      if (cell.dataset.raw !== raw) this.fillCell(cell, raw);
    }
    return true;
  }

  private listen(wrapper: HTMLElement, view: EditorView) {
    const model = (): TableModel => {
      const read = (row: number) =>
        Array.from(
          wrapper.querySelectorAll<HTMLElement>(`[data-row="${row}"]`),
        ).map((c) => c.dataset.raw ?? '');
      return {
        header: read(-1),
        rows: Array.from(
          { length: wrapper.querySelectorAll('tbody tr').length },
          (_, r) => read(r),
        ),
        aligns: this.model.aligns,
      };
    };
    const place = () => {
      const node = tableNodeAt(view.state, view.posAtDOM(wrapper));
      return node ? tableRange(view.state, node) : null;
    };
    const write = (
      next: TableModel,
      focus?: { row: number; col: number; select?: boolean },
    ) => {
      const range = place();
      if (!range) return;
      view.dispatch({
        changes: { ...range, insert: serializeTable(next) },
        userEvent: 'input.table',
      });
      if (focus)
        focusTableCell(
          view,
          range.from,
          focus.row,
          focus.col,
          focus.select ?? true,
        );
    };
    const cellOf = (el: EventTarget | null) =>
      (el as HTMLElement | null)?.closest?.<HTMLElement>('[data-row]') ?? null;
    let current: HTMLElement | null = null;

    wrapper.addEventListener('focusin', (e) => {
      const cell = cellOf(e.target);
      if (!cell) return;
      current = cell;
      wrapper.classList.add('cm-live-table-editing');
      // Edited as plain text; formatting shows again on leaving
      if (cell.textContent !== cell.dataset.raw)
        cell.textContent = cell.dataset.raw ?? '';
    });
    wrapper.addEventListener('focusout', (e) => {
      const cell = cellOf(e.target);
      if (cell) this.fillCell(cell, cell.dataset.raw ?? '');
      if (!wrapper.contains(e.relatedTarget as Node))
        wrapper.classList.remove('cm-live-table-editing');
    });
    wrapper.addEventListener('input', (e) => {
      const cell = cellOf(e.target);
      if (!cell) return;
      cell.dataset.raw = (cell.textContent ?? '').replace(/\n/g, ' ');
      write(model());
    });
    wrapper.addEventListener('paste', (e) => {
      if (!cellOf(e.target)) return;
      e.preventDefault();
      const text = (e.clipboardData?.getData('text/plain') ?? '').replace(
        /\s*\n\s*/g,
        ' ',
      );
      document.execCommand('insertText', false, text);
    });

    const leave = (where: 'before' | 'after') => {
      const range = place();
      if (!range) return;
      const doc = view.state.doc;
      let anchor: number;
      const changes = [];
      if (where === 'after') {
        if (range.to < doc.length) anchor = range.to + 1;
        else {
          changes.push({ from: range.to, insert: '\n' });
          anchor = range.to + 1;
        }
      } else if (range.from > 0) anchor = range.from - 1;
      else {
        changes.push({ from: 0, insert: '\n' });
        anchor = 0;
      }
      view.focus();
      view.dispatch({
        changes,
        selection: EditorSelection.cursor(anchor),
        scrollIntoView: true,
      });
    };

    wrapper.addEventListener('keydown', (e) => {
      const cell = cellOf(e.target);
      if (!cell) return;
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      const m = model();
      const width = m.header.length;
      const lastRow = m.rows.length - 1;
      const go = (r: number, c: number) => {
        const next = wrapper.querySelector<HTMLElement>(
          `[data-row="${r}"][data-col="${c}"]`,
        );
        // As in a spreadsheet: typing replaces what the cell had
        if (next) focusCell(next, true);
      };
      const addRowAfter = (r: number) => {
        const rows = [...m.rows];
        rows.splice(r + 1, 0, Array(width).fill(''));
        return { ...m, rows };
      };

      // Select all: the cell, not the whole document around the table
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        focusCell(cell, true);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          if (col > 0) go(row, col - 1);
          else if (row > -1) go(row - 1, width - 1);
        } else if (col < width - 1) go(row, col + 1);
        else if (row < lastRow) go(row + 1, 0);
        else write(addRowAfter(row), { row: row + 1, col: 0 });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (row < lastRow) go(row + 1, col);
        else write(addRowAfter(row), { row: row + 1, col });
      } else if (e.key === 'ArrowDown' && row === lastRow) {
        e.preventDefault();
        leave('after');
      } else if (e.key === 'ArrowUp' && row === -1) {
        e.preventDefault();
        leave('before');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        go(row + 1, col);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        go(row - 1, col);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        leave('after');
      }
    });

    wrapper
      .querySelector('.cm-live-table-toolbar')
      ?.addEventListener('click', (e) => {
        const action = (e.target as HTMLElement).closest<HTMLElement>(
          '[data-action]',
        )?.dataset.action;
        const cell = current;
        if (!action || !cell) return;
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);
        const m = model();
        const width = m.header.length;
        if (action === 'addRow') {
          const rows = [...m.rows];
          rows.splice(row + 1, 0, Array(width).fill(''));
          write({ ...m, rows }, { row: row + 1, col });
        } else if (action === 'addColumn') {
          const insert = <T>(list: T[], value: T) => [
            ...list.slice(0, col + 1),
            value,
            ...list.slice(col + 1),
          ];
          write(
            {
              header: insert(m.header, ''),
              rows: m.rows.map((r) => insert(r, '')),
              aligns: insert(m.aligns, null),
            },
            { row, col: col + 1 },
          );
        } else if (action === 'deleteRow') {
          // The header row stays: it's what makes it a table
          if (row < 0 || m.rows.length === 0) return;
          const rows = m.rows.filter((_, i) => i !== row);
          write({ ...m, rows }, { row: Math.min(row, rows.length - 1), col });
        } else if (action === 'deleteColumn') {
          if (width <= 1) return;
          const drop = <T>(list: T[]) => list.filter((_, i) => i !== col);
          write(
            {
              header: drop(m.header),
              rows: m.rows.map(drop),
              aligns: drop(m.aligns),
            },
            { row, col: Math.min(col, width - 2) },
          );
        } else if (action === 'deleteTable') {
          const range = place();
          if (!range) return;
          const doc = view.state.doc;
          const to = range.to < doc.length ? range.to + 1 : range.to;
          view.focus();
          view.dispatch({
            changes: { from: range.from, to },
            selection: EditorSelection.cursor(range.from),
            userEvent: 'delete.table',
          });
        }
      });
  }

  // The cells handle their own typing, clicks and keys
  ignoreEvent() {
    return true;
  }
}

export const handleTable: BlockHandler = (node, state, sel, push) => {
  // The source never shows (an AI edit under review shows it: see
  // blockDecorations.ts)
  if (showsMarkup(sel, node.from, node.to)) return;
  const model = parseTable(state, node);
  if (model.header.length === 0) return;
  // A block decoration must cover whole lines
  const { from, to } = tableRange(state, node.node);
  push(
    from,
    to,
    Decoration.replace({ widget: new TableWidget(model), block: true }),
  );
};

/** The tables around the cursor's line, as line ranges. */
const tableLineRanges = (
  state: EditorState,
  lineFrom: number,
  lineTo: number,
) => {
  const ranges: { from: number; to: number }[] = [];
  syntaxTree(state).iterate({
    from: Math.max(0, lineFrom - 1),
    to: Math.min(state.doc.length, lineTo + 1),
    enter: (ref) => {
      if (ref.name === 'Table') {
        ranges.push(tableRange(state, ref.node));
        return false;
      }
    },
  });
  return ranges;
};

/** The cursor never rests on a table's edge, where typing would land in its
 * first or last row: it goes to the line before or after. */
const tableEdgeGuard = EditorState.transactionFilter.of((tr) => {
  if (!tr.selection) return tr;
  const sel = tr.newSelection.main;
  if (!sel.empty || tr.newSelection.ranges.length > 1) return tr;
  const state = tr.state;
  const line = state.doc.lineAt(sel.head);
  for (const table of tableLineRanges(state, line.from, line.to)) {
    if (sel.head < table.from || sel.head > table.to) continue;
    const goingDown = tr.startState.selection.main.head < table.from;
    const target =
      goingDown || sel.head === table.to
        ? table.to < state.doc.length
          ? table.to + 1
          : null
        : table.from > 0
          ? table.from - 1
          : null;
    if (target === null || target === sel.head) return tr;
    return [
      tr,
      { selection: EditorSelection.cursor(target), sequential: true },
    ];
  }
  return tr;
});

/** Backspace at the start of the line under a table, or Delete at the end
 * of the line over one, would merge text into its rows: nothing happens
 * (an empty line under it goes, though). */
const protectTable = (view: EditorView, direction: 'back' | 'forward') => {
  const { state } = view;
  const sel = state.selection.main;
  if (!sel.empty) return false;
  const line = state.doc.lineAt(sel.head);
  if (direction === 'back' && sel.head === line.from && line.number > 1) {
    const above = state.doc.line(line.number - 1);
    if (
      !tableLineRanges(state, above.from, above.to).some(
        (r) => r.to === above.to,
      )
    )
      return false;
    if (line.length === 0 && line.number < state.doc.lines) {
      view.dispatch({
        changes: { from: line.from, to: line.to + 1 },
        selection: EditorSelection.cursor(line.from),
      });
    }
    return true;
  }
  if (
    direction === 'forward' &&
    sel.head === line.to &&
    line.number < state.doc.lines
  ) {
    const below = state.doc.line(line.number + 1);
    return tableLineRanges(state, below.from, below.to).some(
      (r) => r.from === below.from,
    );
  }
  return false;
};

/** In Markdown a line right under a table is one more row of it (and one
 * right over it swallows its header): typing on the empty line next to a
 * table first puts a blank line in between. */
const tableSeparationGuard = EditorState.transactionFilter.of((tr) => {
  if (
    !tr.docChanged ||
    !tr.isUserEvent('input') ||
    tr.isUserEvent('input.table')
  ) {
    return tr;
  }
  const start = tr.startState;
  const line = start.doc.lineAt(start.selection.main.head);
  if (line.length > 0) return tr;
  // Only typing on that very line (not a change elsewhere, like a cell's)
  let onLine = false;
  tr.changes.iterChangedRanges((from, to) => {
    if (from <= line.to && to >= line.from) onLine = true;
  });
  if (!onLine) return tr;
  const tables = tableLineRanges(start, line.from, line.to);
  if (tables.some((table) => table.to + 1 === line.from)) {
    return [
      tr,
      {
        changes: { from: tr.changes.mapPos(line.from, -1), insert: '\n' },
        sequential: true,
      },
    ];
  }
  if (tables.some((table) => line.to + 1 === table.from)) {
    return [
      tr,
      {
        changes: { from: tr.changes.mapPos(line.to, 1), insert: '\n' },
        sequential: true,
      },
    ];
  }
  return tr;
});

export const tableEditingExtension: Extension = [
  tableEdgeGuard,
  tableSeparationGuard,
  Prec.highest(
    keymap.of([
      { key: 'Backspace', run: (view) => protectTable(view, 'back') },
      { key: 'Delete', run: (view) => protectTable(view, 'forward') },
    ]),
  ),
];
