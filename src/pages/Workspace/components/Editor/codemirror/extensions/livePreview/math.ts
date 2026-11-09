import {
  EditorSelection,
  EditorState,
  type Extension,
} from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNodeRef } from '@lezer/common';
import {
  isEditingBlock,
  overlaps,
  type BlockHandler,
  type Handler,
} from './utils';
import { MathWidget } from './mathWidget';

const extractBlockSource = (
  node: SyntaxNodeRef,
  state: EditorState,
): string => {
  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'CodeText') {
      return state.sliceDoc(cursor.from, cursor.to);
    }
  }
  return '';
};

// Block math ($$ alone on its own line, content, closing $$) — see
// extensions/mathExtension.ts for the Lezer-level parsing. Registered as a
// BlockHandler (state-based, full-document walk) since it needs `block: true`,
// which CM6 only allows from a source provided directly by state, not a
// view-dependent plugin — see blockDecorations.ts.
export const handleMathBlock: BlockHandler = (node, state, _sel, push) => {
  const startLine = state.doc.lineAt(node.from);
  const endLine = state.doc.lineAt(node.to);
  const source = extractBlockSource(node, state);

  // Being edited: the formula's source, its $$ lines hidden, and the
  // rendered formula right under it, live
  if (isEditingBlock(state, node.from, node.to)) {
    if (endLine.number - startLine.number < 2) return;
    push(startLine.from, startLine.to, Decoration.replace({ block: true }));
    for (let n = startLine.number + 1; n < endLine.number; n++) {
      const line = state.doc.line(n);
      push(
        line.from,
        line.from,
        Decoration.line({ class: 'cm-math-source-line' }),
      );
    }
    push(
      endLine.from,
      endLine.to,
      Decoration.replace({
        widget: new MathWidget(source.trim() || ' ', true),
        block: true,
      }),
    );
    return;
  }

  push(
    startLine.from,
    endLine.to,
    Decoration.replace({ widget: new MathWidget(source, true), block: true }),
  );
};

// Inline math ($...$) — content is just the text between the two
// single-character CodeMark delimiters, no separate CodeMark child.
export const handleInlineMath: Handler = (node, view, sel, push) => {
  if (
    sel.main.empty
      ? overlaps(sel, node.from + 1, node.to - 1)
      : sel.main.from > node.from && sel.main.to < node.to
  ) {
    return;
  }

  const source = view.state.sliceDoc(node.from + 1, node.to - 1);
  push(
    node.from,
    node.to,
    Decoration.replace({ widget: new MathWidget(source, false) }),
  );
};

/** The cursor never rests on a math block's hidden $$ lines (typing there
 * would break the block): entering from outside steps into the formula, and
 * moving onto a $$ line from inside steps out past the block. Pointer clicks
 * on the outer boundary stay outside (clicking the widget itself enters it). */
export const mathFenceGuard: Extension = EditorState.transactionFilter.of(
  (tr) => {
    if (!tr.selection) return tr;
    const sel = tr.newSelection.main;
    if (!sel.empty || tr.newSelection.ranges.length > 1) return tr;
    const state = tr.state;
    const oldHead = tr.startState.selection.main.head;
    const isPointer = tr.isUserEvent('select.pointer');
    const line = state.doc.lineAt(sel.head);
    let target: number | null = null;
    syntaxTree(state).iterate({
      from: line.from,
      to: line.to,
      enter: (ref) => {
        if (ref.name !== 'MathBlock') return;
        const start = state.doc.lineAt(ref.from);
        const end = state.doc.lineAt(ref.to);
        if (end.number - start.number < 2) return false;
        const firstInner = state.doc.line(start.number + 1);
        const lastInner = state.doc.line(end.number - 1);
        const wasInside = oldHead >= firstInner.from && oldHead <= lastInner.to;
        if (isPointer && !wasInside) {
          if (line.number === start.number && start.from > 0) {
            target = start.from - 1;
          } else if (line.number === end.number && end.to < state.doc.length) {
            target = end.to + 1;
          }
          return false;
        }
        if (line.number === start.number) {
          target =
            !isPointer && wasInside && start.from > 0
              ? start.from - 1
              : firstInner.from;
        } else if (line.number === end.number) {
          target =
            !isPointer && wasInside
              ? end.to < state.doc.length
                ? end.to + 1
                : end.to
              : lastInner.to;
        }
        return false;
      },
    });
    if (target === null || target === sel.head) return tr;
    return [
      tr,
      { selection: EditorSelection.cursor(target), sequential: true },
    ];
  },
);
