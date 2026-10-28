import { EditorState, StateField } from '@codemirror/state';
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNodeRef } from '@lezer/common';
import { handleTable } from './table';
import { handleCallout } from './callout';
import { handleMathBlock } from './math';
import { handleRenderedFence } from './codeBlocks';
import { decorateDetails } from './details';
import { calloutFoldField } from './foldState';
import type { BlockHandler, Push } from './utils';
import { diffRangesField } from '../diffReview';

// Constructs that can render as a `block: true` replace decoration (tables,
// callouts, mermaid diagrams, math blocks). CM6 only allows block decorations
// from a source "provided directly" by state — never from a source that's a
// function of the view/viewport, which is exactly what a ViewPlugin's
// `decorations` is considered to be (see the EditorView.decorations facet
// docs). So unlike the rest of live-preview (index.ts, viewport-scoped), this
// walks the *whole* document on every relevant state change.
const BLOCK_HANDLERS: Record<string, BlockHandler> = {
  Table: handleTable,
  Blockquote: handleCallout,
  MathBlock: handleMathBlock,
  FencedCode: handleRenderedFence,
};

function buildBlockDecorations(state: EditorState): DecorationSet {
  const ranges: { from: number; to: number; value: Decoration }[] = [];
  // While an AI edit is under review, a table or diagram it touches stays
  // as text, so its struck-out and added parts can be seen
  const diffRanges = state.field(diffRangesField, false) ?? [];
  const push: Push = (from, to, value) => {
    if (
      from !== to &&
      diffRanges.some((range) => range.from < to && range.to > from)
    ) {
      return;
    }
    ranges.push({ from, to, value });
  };
  const foldOverrides = state.field(calloutFoldField);
  // Folded <details> bodies: nothing inside them is drawn
  const hidden = decorateDetails(state, foldOverrides, push);

  syntaxTree(state).iterate({
    enter(node: SyntaxNodeRef) {
      if (hidden.some((r) => node.from >= r.from && node.to <= r.to)) {
        return false;
      }
      const handler = BLOCK_HANDLERS[node.type.name];
      if (handler) {
        const result = handler(
          node,
          state,
          state.selection,
          push,
          foldOverrides,
        );
        if (result === false) return false;
      }
    },
  });

  return Decoration.set(
    ranges.map((r) => r.value.range(r.from, r.to)),
    true,
  );
}

export const blockDecorationsField = StateField.define<DecorationSet>({
  create(state) {
    return buildBlockDecorations(state);
  },
  update(value, tr) {
    if (
      !tr.docChanged &&
      !tr.selection &&
      tr.startState.field(calloutFoldField) ===
        tr.state.field(calloutFoldField) &&
      tr.startState.field(diffRangesField, false) ===
        tr.state.field(diffRangesField, false) &&
      syntaxTree(tr.state) === syntaxTree(tr.startState)
    ) {
      return value;
    }
    return buildBlockDecorations(tr.state);
  },
  provide: (field) => EditorView.decorations.from(field),
});
