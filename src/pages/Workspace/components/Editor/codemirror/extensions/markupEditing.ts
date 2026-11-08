import {
  EditorSelection,
  EditorState,
  type Extension,
} from '@codemirror/state';
import { keymap, type EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode } from '@lezer/common';
import { findDetailsBlocks } from './livePreview/details';

/**
 * Editing while Markdown syntax is hidden:
 * 1. Keeps the cursor out of hidden line prefixes (`# `, `- `, `- [ ] `, `> `, ```` ``` ````)
 *    and steps cleanly past hidden opening/closing fences (` ``` `, `<details>`).
 * 2. Snaps pointer range-selections across whole blocks (tables, diagrams,
 *    equations, toggles) when dragging from above or below so selecting and
 *    deleting them in either direction never gets stuck halfway.
 * 3. Backspace/Delete removes whole blocks when empty, when at their outer
 *    boundary, or when a selection partially crosses a block boundary, and
 *    never merges inner lines into hidden fence lines.
 * 4. Backspace at the edge of inline formatting (`**bold**`, `*italic*`,
 *    `~~strike~~`, `` `code` ``) edits the text inside instead of exposing raw markers.
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

const STRUCTURED_BLOCKS = new Set(['Table', 'FencedCode', 'MathBlock']);

interface InlineSpan {
  from: number;
  openTo: number;
  closeFrom: number;
  to: number;
}

interface FencedBlockBounds {
  kind: 'Table' | 'FencedCode' | 'MathBlock' | 'Details';
  from: number;
  to: number;
  bodyFrom: number;
  bodyTo: number;
}

/** Collects line-aligned bounds for tables, fenced code blocks (including
 * diagrams), math blocks, and `<details>` sections in the document. */
const collectStructuredBlocks = (state: EditorState): FencedBlockBounds[] => {
  const { doc } = state;
  const blocks: FencedBlockBounds[] = [];

  syntaxTree(state).iterate({
    enter(ref) {
      if (!STRUCTURED_BLOCKS.has(ref.name)) return;
      const startLine = doc.lineAt(ref.from);
      const endLine = doc.lineAt(ref.to);
      if (ref.name === 'Table') {
        blocks.push({
          kind: 'Table',
          from: startLine.from,
          to: endLine.to,
          bodyFrom: startLine.from,
          bodyTo: endLine.to,
        });
        return false;
      }
      if (endLine.number - startLine.number >= 2) {
        const firstInner = doc.line(startLine.number + 1);
        const lastInner = doc.line(endLine.number - 1);
        blocks.push({
          kind: ref.name as 'FencedCode' | 'MathBlock',
          from: startLine.from,
          to: endLine.to,
          bodyFrom: firstInner.from,
          bodyTo: lastInner.to,
        });
      }
      return false;
    },
  });

  for (const d of findDetailsBlocks(state)) {
    const headerEndLine = doc.lineAt(d.headerTo);
    const closeStartLine = doc.lineAt(d.closeFrom);
    if (closeStartLine.number > headerEndLine.number) {
      const firstInner = doc.line(
        Math.min(headerEndLine.number + 1, closeStartLine.number),
      );
      const lastInner = doc.line(
        Math.max(headerEndLine.number, closeStartLine.number - 1),
      );
      blocks.push({
        kind: 'Details',
        from: d.from,
        to: d.to,
        bodyFrom: firstInner.from,
        bodyTo: lastInner.to,
      });
    }
  }

  return blocks.sort((a, b) => a.from - b.from);
};

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
          closeFrom = Math.min(closeFrom, innerMarkStart(cursor.from));
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

const innerMarkStart = (pos: number) => pos;

/** If a range selection `[from, to]` starts or ends partly inside a structured
 * block while the other end is outside it, expands the range to cover the whole
 * block so deleting a selection never leaves half a table, diagram or equation. */
const expandPartialBlockRange = (
  state: EditorState,
  from: number,
  to: number,
): { from: number; to: number } | null => {
  let nextFrom = from;
  let nextTo = to;
  for (const b of collectStructuredBlocks(state)) {
    const overlaps = nextFrom <= b.to && nextTo >= b.from;
    const strictlyInside = nextFrom >= b.bodyFrom && nextTo <= b.bodyTo;
    if (overlaps && !strictlyInside && (nextFrom < b.from || nextTo > b.to)) {
      nextFrom = Math.min(nextFrom, b.from);
      nextTo = Math.max(nextTo, b.to);
    }
  }
  if (nextFrom !== from || nextTo !== to) {
    return { from: nextFrom, to: nextTo };
  }
  return null;
};

export const handleMarkupBackspace = (view: EditorView): boolean => {
  const { state } = view;
  const range = state.selection.main;

  // Range selection: if it cuts partway across a table, diagram, math block or
  // toggle, expand to delete the entire block cleanly
  if (!range.empty) {
    const expanded = expandPartialBlockRange(state, range.from, range.to);
    if (!expanded) return false;
    view.dispatch({
      changes: { from: expanded.from, to: expanded.to, insert: '' },
      selection: EditorSelection.cursor(expanded.from),
      scrollIntoView: true,
      userEvent: 'delete.selection',
    });
    return true;
  }

  const pos = range.head;
  const line = state.doc.lineAt(pos);
  const blocks = collectStructuredBlocks(state);

  // Backspace at the start of a line inside or right under a structured block
  if (pos === line.from) {
    for (const b of blocks) {
      // 1a. At the start of the first inner line of a fenced block:
      // delete the whole block when empty, or guard the opening fence newline
      if (b.kind !== 'Table' && pos === b.bodyFrom) {
        const innerText = state.sliceDoc(b.bodyFrom, b.bodyTo);
        if (innerText.trim() === '') {
          const to = b.to < state.doc.length ? b.to + 1 : b.to;
          view.dispatch({
            changes: { from: b.from, to, insert: '' },
            selection: EditorSelection.cursor(b.from),
            scrollIntoView: true,
            userEvent: 'delete.backward',
          });
          return true;
        }
        if (line.length === 0 && line.to < b.bodyTo) {
          view.dispatch({
            changes: { from: line.from, to: line.to + 1, insert: '' },
            selection: EditorSelection.cursor(line.from),
            scrollIntoView: true,
            userEvent: 'delete.backward',
          });
          return true;
        }
        return true;
      }

      // 1b. At the start of the line immediately below a block: delete the block
      if (line.number > 1 && state.doc.line(line.number - 1).to === b.to) {
        const to =
          line.length === 0
            ? line.to < state.doc.length
              ? line.to + 1
              : line.to
            : b.to + 1;
        view.dispatch({
          changes: { from: b.from, to, insert: '' },
          selection: EditorSelection.cursor(b.from),
          scrollIntoView: true,
          userEvent: 'delete.backward',
        });
        return true;
      }
    }
  }

  // 2. Backspace right after a block prefix removes the whole prefix at once
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

  // 3. Backspace on or inside an inline formatted span
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

export const handleMarkupDelete = (view: EditorView): boolean => {
  const { state } = view;
  const range = state.selection.main;
  if (!range.empty) {
    const expanded = expandPartialBlockRange(state, range.from, range.to);
    if (!expanded) return false;
    view.dispatch({
      changes: { from: expanded.from, to: expanded.to, insert: '' },
      selection: EditorSelection.cursor(expanded.from),
      scrollIntoView: true,
      userEvent: 'delete.selection',
    });
    return true;
  }
  return false;
};

/** Keeps a collapsed cursor out of hidden line prefixes (`# `, `- `, `> `...)
 * and hidden fence lines (` ``` `, `<details>`), and snaps pointer range
 * selections cleanly across blocks when dragging from above or below. */
const cursorPrefixGuard = EditorState.transactionFilter.of((tr) => {
  if (!tr.selection && !tr.docChanged) return tr;
  const sel = tr.newSelection.main;

  // When dragging a range selection from outside a block into it, snap `head`
  // across the whole block so selecting from bottom-to-top or top-to-bottom
  // highlights and deletes the entire block smoothly. When selecting inside a
  // fenced block, clamp to its inner body lines so the hidden ``` fences are
  // never overwritten or deleted.
  if (!sel.empty) {
    const { anchor, head } = sel;
    for (const b of collectStructuredBlocks(tr.state)) {
      if (
        (b.kind === 'FencedCode' || b.kind === 'Details') &&
        sel.from >= b.from &&
        sel.to <= b.to &&
        (sel.from < b.bodyFrom || sel.to > b.bodyTo)
      ) {
        const clampedAnchor = Math.max(b.bodyFrom, Math.min(b.bodyTo, anchor));
        const clampedHead = Math.max(b.bodyFrom, Math.min(b.bodyTo, head));
        return [
          tr,
          {
            selection: EditorSelection.range(clampedAnchor, clampedHead),
            sequential: true,
          },
        ];
      }
      if (tr.isUserEvent('select.pointer')) {
        if (anchor < b.from && head >= b.from && head <= b.to && head < b.to) {
          return [
            tr,
            {
              selection: EditorSelection.range(anchor, b.to),
              sequential: true,
            },
          ];
        }
        if (anchor > b.to && head >= b.from && head <= b.to && head > b.from) {
          return [
            tr,
            {
              selection: EditorSelection.range(anchor, b.from),
              sequential: true,
            },
          ];
        }
      }
    }
    return tr;
  }

  const doc = tr.newDoc;
  const line = doc.lineAt(sel.head);
  const oldSel = tr.startState.selection.main;
  const isPointer = tr.isUserEvent('select.pointer');

  // Guard hidden opening/closing lines of FencedCode and <details> blocks
  for (const b of collectStructuredBlocks(tr.state)) {
    if (b.kind !== 'FencedCode' && b.kind !== 'Details') continue;
    if (sel.head < b.from || sel.head > b.to) continue;
    const wasInside = oldSel.head >= b.bodyFrom && oldSel.head <= b.bodyTo;

    // A pointer click on the outer boundary of a collapsed block (e.g. clicking
    // in the empty space below a diagram at the end of the document) stays
    // outside the block so the diagram never opens unless clicked directly.
    if (isPointer && !wasInside) {
      if (sel.head < b.bodyFrom && b.from > 0) {
        return [
          tr,
          { selection: EditorSelection.cursor(b.from - 1), sequential: true },
        ];
      }
      if (sel.head > b.bodyTo && b.to < doc.length) {
        return [
          tr,
          { selection: EditorSelection.cursor(b.to + 1), sequential: true },
        ];
      }
      return tr;
    }

    // Cursor is on the opening fence/header line(s)
    if (sel.head < b.bodyFrom) {
      const target =
        !isPointer && wasInside && b.from > 0 ? b.from - 1 : b.bodyFrom;
      if (target !== sel.head) {
        return [
          tr,
          { selection: EditorSelection.cursor(target), sequential: true },
        ];
      }
      return tr;
    }
    // Cursor is on the closing fence/tag line
    if (sel.head > b.bodyTo) {
      const target = wasInside
        ? b.to < doc.length
          ? b.to + 1
          : b.to
        : b.bodyTo;
      if (target !== sel.head) {
        return [
          tr,
          { selection: EditorSelection.cursor(target), sequential: true },
        ];
      }
      return tr;
    }
  }

  const match = HIDDEN_LINE_PREFIX.exec(line.text);
  if (!match) return tr;

  const prefixEnd = line.from + match[0].length;
  if (sel.head >= prefixEnd) return tr;

  const movingLeftFromContentStart =
    !tr.docChanged &&
    oldSel.empty &&
    oldSel.head === prefixEnd &&
    sel.head < prefixEnd &&
    !isPointer;

  const target =
    movingLeftFromContentStart && line.from > 0 ? line.from - 1 : prefixEnd;

  return [tr, { selection: EditorSelection.cursor(target) }];
});

export const markupEditingKeymap = keymap.of([
  { key: 'Backspace', run: handleMarkupBackspace },
  { key: 'Delete', run: handleMarkupDelete },
]);

export const markupEditingExtensions: Extension[] = [
  markupEditingKeymap,
  cursorPrefixGuard,
];
