import {
  EditorSelection,
  EditorState,
  type Extension,
} from '@codemirror/state';
import { keymap, type EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';

/**
 * Editing while Markdown syntax is hidden:
 * 1. Keeps the cursor out of hidden line prefixes (`# `, `- `, `- [ ] `, `> `, ```` ``` ````).
 * 2. Backspace at the start of a formatted block removes the whole prefix at once.
 * 3. Backspace at the edge of inline formatting (`**bold**`, `*italic*`,
 *    `~~strike~~`, `` `code` ``) edits the text inside (or removes the whole
 *    span when its last character is deleted) instead of exposing raw markers.
 */

const HIDDEN_LINE_PREFIX = /^(#{1,6} |[-*+] \[[ xX]\] |[-*+] |> ?|`{3,})/;
const REMOVABLE_BLOCK_PREFIX =
  /^(#{1,6} |[-*+] \[[ xX]\] |[-*+] |\d+[.)] |> ?)/;

const INLINE_CONSTRUCTS = new Set([
  'StrongEmphasis',
  'Emphasis',
  'Strikethrough',
  'InlineCode',
]);

const INLINE_MARKS = new Set(['EmphasisMark', 'StrikethroughMark', 'CodeMark']);

interface InlineSpan {
  from: number;
  openTo: number;
  closeFrom: number;
  to: number;
}

/** Finds the outermost inline formatting construct touching `pos` and its
 * opening/closing marker bounds. */
const findInlineSpan = (state: EditorState, pos: number): InlineSpan | null => {
  const tree = syntaxTree(state);
  const candidates = [tree.resolveInner(pos, -1), tree.resolveInner(pos, 1)];

  let target: SyntaxNode | null = null;
  for (const start of candidates) {
    for (let cur: SyntaxNode | null = start; cur; cur = cur.parent) {
      if (INLINE_CONSTRUCTS.has(cur.name) && pos >= cur.from && pos <= cur.to) {
        target = cur;
      }
    }
    if (target) break;
  }
  if (!target) return null;

  let openTo = target.from;
  let closeFrom = target.to;
  const cursor = target.cursor();
  if (cursor.firstChild()) {
    do {
      if (INLINE_MARKS.has(cursor.type.name)) {
        if (cursor.from === openTo) {
          openTo = cursor.to;
        } else if (cursor.to <= target.to && cursor.from >= openTo) {
          closeFrom = Math.min(closeFrom, cursor.from);
        }
      } else if (INLINE_CONSTRUCTS.has(cursor.type.name)) {
        const inner = cursor.node.cursor();
        if (inner.firstChild()) {
          do {
            if (INLINE_MARKS.has(inner.type.name)) {
              if (inner.from === openTo) {
                openTo = inner.to;
              } else if (inner.to <= target.to && inner.from >= openTo) {
                closeFrom = Math.min(closeFrom, inner.from);
              }
            }
          } while (inner.nextSibling());
        }
      }
    } while (cursor.nextSibling());
  }

  if (openTo === target.from || closeFrom === target.to || openTo > closeFrom) {
    return null;
  }
  return { from: target.from, openTo, closeFrom, to: target.to };
};

export const handleMarkupBackspace = (view: EditorView): boolean => {
  const { state } = view;
  const range = state.selection.main;
  if (!range.empty) return false;
  const pos = range.head;

  // 1. Backspace right after a block prefix removes the whole prefix at once
  const line = state.doc.lineAt(pos);
  const blockMatch = REMOVABLE_BLOCK_PREFIX.exec(line.text);
  if (blockMatch && pos === line.from + blockMatch[0].length) {
    view.dispatch({
      changes: { from: line.from, to: pos, insert: '' },
      selection: EditorSelection.cursor(line.from),
      scrollIntoView: true,
      userEvent: 'delete.backward',
    });
    return true;
  }

  // 2. Backspace on or inside an inline formatted span
  const span = findInlineSpan(state, pos);
  if (!span) return false;

  const innerLen = span.closeFrom - span.openTo;

  // Cursor is inside or right after the closing marker (e.g. `**mundo**|`)
  if (pos > span.closeFrom && pos <= span.to) {
    if (innerLen <= 1) {
      view.dispatch({
        changes: { from: span.from, to: span.to, insert: '' },
        selection: EditorSelection.cursor(span.from),
        scrollIntoView: true,
        userEvent: 'delete.backward',
      });
      return true;
    }
    view.dispatch({
      changes: { from: span.closeFrom - 1, to: span.closeFrom, insert: '' },
      selection: EditorSelection.cursor(span.closeFrom - 1),
      scrollIntoView: true,
      userEvent: 'delete.backward',
    });
    return true;
  }

  // Cursor is at the end of a 1-char formatted word (`**m|**`): remove the
  // whole construct so we never leave empty `****` markers behind
  if (pos === span.closeFrom && innerLen <= 1) {
    view.dispatch({
      changes: { from: span.from, to: span.to, insert: '' },
      selection: EditorSelection.cursor(span.from),
      scrollIntoView: true,
      userEvent: 'delete.backward',
    });
    return true;
  }

  // Cursor is right after the opening marker (`hola **|mundo**`): delete the
  // character before the formatted word instead of eating the opening `**`
  if (pos > span.from && pos <= span.openTo) {
    if (innerLen === 0) {
      view.dispatch({
        changes: { from: span.from, to: span.to, insert: '' },
        selection: EditorSelection.cursor(span.from),
        scrollIntoView: true,
        userEvent: 'delete.backward',
      });
      return true;
    }
    if (span.from > 0) {
      view.dispatch({
        changes: { from: span.from - 1, to: span.from, insert: '' },
        selection: EditorSelection.cursor(span.openTo - 1),
        scrollIntoView: true,
        userEvent: 'delete.backward',
      });
      return true;
    }
    return true;
  }

  return false;
};

/** Keeps a collapsed cursor out of hidden line prefixes (`# `, `- `, `> `...).
 * Moving left from the start of the visible text steps to the end of the
 * previous line; clicking or jumping into the prefix snaps to `prefixEnd`. */
const cursorPrefixGuard = EditorState.transactionFilter.of((tr) => {
  if (!tr.selection && !tr.docChanged) return tr;
  const sel = tr.newSelection.main;
  if (!sel.empty) return tr;

  const line = tr.newDoc.lineAt(sel.head);
  const match = HIDDEN_LINE_PREFIX.exec(line.text);
  if (!match) return tr;

  const prefixEnd = line.from + match[0].length;
  if (sel.head >= prefixEnd) return tr;

  const oldSel = tr.startState.selection.main;
  const movingLeftFromContentStart =
    !tr.docChanged &&
    oldSel.empty &&
    oldSel.head === prefixEnd &&
    sel.head < prefixEnd &&
    !tr.isUserEvent('select.pointer');

  const target =
    movingLeftFromContentStart && line.from > 0 ? line.from - 1 : prefixEnd;

  return [tr, { selection: EditorSelection.cursor(target) }];
});

export const markupEditingKeymap = keymap.of([
  { key: 'Backspace', run: handleMarkupBackspace },
]);

export const markupEditingExtensions: Extension[] = [
  markupEditingKeymap,
  cursorPrefixGuard,
];
