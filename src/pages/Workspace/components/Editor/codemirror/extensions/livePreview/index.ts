import {
  ViewPlugin,
  type ViewUpdate,
  Decoration,
  type DecorationSet,
  EditorView,
} from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNodeRef } from '@lezer/common';
import { handleEmphasis } from './emphasis';
import { handleHeading } from './headings';
import { handleInlineCode } from './inlineCode';
import { handleLink } from './links';
import { handleQuoteMark } from './blockquote';
import { handleTaskMarker, handleTaskCheckboxMousedown } from './taskList';
import { handleFencedCode } from './codeBlocks';
import { handleHorizontalRule } from './horizontalRule';
import { handleImage } from './image';
import type { Handler, Push } from './utils';

// Dispatch table: one syntax-tree walk per relevant update, routed by Lezer
// node type name to the construct-specific handler that knows how to hide/
// reveal/style it. Adding a new construct means adding one entry here plus
// its handler file — the walk itself never changes.
const HANDLERS: Record<string, Handler> = {
  StrongEmphasis: handleEmphasis,
  Emphasis: handleEmphasis,
  ATXHeading1: handleHeading,
  ATXHeading2: handleHeading,
  ATXHeading3: handleHeading,
  ATXHeading4: handleHeading,
  ATXHeading5: handleHeading,
  ATXHeading6: handleHeading,
  InlineCode: handleInlineCode,
  Link: handleLink,
  QuoteMark: handleQuoteMark,
  TaskMarker: handleTaskMarker,
  FencedCode: handleFencedCode,
  HorizontalRule: handleHorizontalRule,
  Image: handleImage,
};

function buildDecorations(view: EditorView): DecorationSet {
  const ranges: { from: number; to: number; value: Decoration }[] = [];
  const push: Push = (from, to, value) => ranges.push({ from, to, value });
  const { state } = view;
  const tree = syntaxTree(state);

  // Scoped to the visible ranges only — CM6 already limits this to roughly
  // the viewport regardless of total document length, which is what keeps
  // this affordable on multi-thousand-word notes. Never iterate the whole
  // tree here.
  for (const { from, to } of view.visibleRanges) {
    tree.iterate({
      from,
      to,
      enter(node: SyntaxNodeRef) {
        const handler = HANDLERS[node.type.name];
        if (handler) handler(node, view, state.selection, push);
      },
    });
  }

  // `true` sorts for us — decorations from different handlers can interleave
  // once mark + replace ranges from nested nodes combine.
  return Decoration.set(
    ranges.map((r) => r.value.range(r.from, r.to)),
    true,
  );
}

export const livePreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.viewportChanged ||
        update.selectionSet ||
        syntaxTree(update.state) !== syntaxTree(update.startState)
      ) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
    eventHandlers: {
      mousedown: (event, view) => handleTaskCheckboxMousedown(event, view),
    },
  },
);
