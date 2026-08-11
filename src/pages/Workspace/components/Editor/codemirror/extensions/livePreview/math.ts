import type { EditorState } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
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
  if (overlaps(sel, node.from, node.to)) return;

  const startLine = state.doc.lineAt(node.from);
  const endLine = state.doc.lineAt(node.to);
  const source = extractBlockSource(node, state);

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
