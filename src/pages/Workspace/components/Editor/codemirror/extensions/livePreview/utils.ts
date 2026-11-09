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

/**
 * True when the user is editing inside a rendered block (diagram, formula):
 * the cursor (or a selection that both started and stayed inside the block)
 * is strictly within the block's inner body lines (excluding the opening and
 * closing fence lines). Selecting all, clicking below the block at the end of
 * the document, or dragging across the block from outside keeps the rendered
 * widget closed and stable.
 */
export const isEditingBlock = (
  state: EditorState,
  from: number,
  to: number,
): boolean => {
  const { anchor, head, empty } = state.selection.main;
  const startLine = state.doc.lineAt(from);
  const endLine = state.doc.lineAt(to);
  if (endLine.number - startLine.number < 2) return false;
  const bodyFrom = startLine.to + 1;
  const bodyTo = endLine.from - 1;
  if (empty) return head >= bodyFrom && head <= bodyTo;
  return (
    anchor >= bodyFrom && anchor <= bodyTo && head >= bodyFrom && head <= bodyTo
  );
};

/**
 * Whether formatting markup (a heading's #, **bold** stars, list markers,
 * > quotes, link brackets and addresses, ``` fences...) shows. Never: the
 * user formats through the "/" menu, the toolbar and shortcuts, and never
 * sees Markdown. markupEditing.ts keeps the cursor and deletions off the
 * hidden markup. Tables, equations and diagrams still show their source
 * while being edited (`overlaps`): their source is their content.
 */
export const showsMarkup = (
  sel: EditorSelection,
  from: number,
  to: number,
): boolean => {
  void sel;
  void from;
  void to;
  return false;
};
