import type { EditorSelection } from '@codemirror/state';
import type { Decoration } from '@codemirror/view';
import type { SyntaxNodeRef } from '@lezer/common';

export type Push = (from: number, to: number, value: Decoration) => void;

export type Handler = (
  node: SyntaxNodeRef,
  view: import('@codemirror/view').EditorView,
  sel: EditorSelection,
  push: Push,
) => void;

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
