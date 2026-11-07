import {
  EditorSelection,
  EditorState,
  type Extension,
} from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNodeRef } from '@lezer/common';
import { overlaps, type BlockHandler, type Handler } from './utils';
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
export const handleMathBlock: BlockHandler = (node, state, sel, push) => {
  const startLine = state.doc.lineAt(node.from);
  const endLine = state.doc.lineAt(node.to);
  const source = extractBlockSource(node, state);

  // Being edited: the formula's source, its $$ lines hidden, and the
  // rendered formula right under it, live
  if (overlaps(sel, node.from, node.to)) {
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
// single-character CodeMark delimiters, no separate CodeText child.
export const handleInlineMath: Handler = (node, view, sel, push) => {
  if (overlaps(sel, node.from, node.to)) return;

  const source = view.state.sliceDoc(node.from + 1, node.to - 1);
  push(
    node.from,
    node.to,
    Decoration.replace({ widget: new MathWidget(source, false) }),
  );
};

/** The cursor never rests on a math block's hidden $$ lines (typing there
 * would break the block): it goes to the formula's first or last line. */
export const mathFenceGuard: Extension = EditorState.transactionFilter.of(
  (tr) => {
    if (!tr.selection) return tr;
    const sel = tr.newSelection.main;
    if (!sel.empty || tr.newSelection.ranges.length > 1) return tr;
    const state = tr.state;
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
        if (line.number === start.number)
          target = state.doc.line(start.number + 1).from;
        else if (line.number === end.number)
          target = state.doc.line(end.number - 1).to;
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
