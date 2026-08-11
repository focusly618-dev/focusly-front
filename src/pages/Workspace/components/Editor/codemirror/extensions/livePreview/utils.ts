import type { EditorSelection, EditorState } from '@codemirror/state';
import type { Decoration, EditorView } from '@codemirror/view';
import type { SyntaxNodeRef } from '@lezer/common';

export type Push = (from: number, to: number, value: Decoration) => void;

// Returning `false` tells the tree walk to skip this node's children —
// used by constructs (like callouts) that fully own their subtree's
// decoration and don't want a child handler (e.g. QuoteMark) also firing
// and producing conflicting ranges.

// Used by the viewport-scoped ViewPlugin walk (inline marks/hides + line
// decorations only — CM6 forbids block decorations from a view-dependent
// source, see blockDecorations.ts).
export type Handler = (
  node: SyntaxNodeRef,
  view: EditorView,
  sel: EditorSelection,
  push: Push,
) => void | false;

// Used by the full-document StateField walk (the only source allowed to
// produce `block: true` replace decorations, since it's provided directly
// from state rather than as a function of the view/viewport).
export type BlockHandler = (
  node: SyntaxNodeRef,
  state: EditorState,
  sel: EditorSelection,
  push: Push,
  foldOverrides: Map<number, boolean>,
) => void | false;

/** True when the current selection touches any part of [from, to) — the
 * "cursor is on this construct" test that decides reveal vs. hide. */
export const overlaps = (
  sel: EditorSelection,
  from: number,
  to: number,
): boolean => {
  const { from: selFrom, to: selTo } = sel.main;
  return selFrom <= to && selTo >= from;
};
