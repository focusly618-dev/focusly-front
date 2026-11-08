import {
  ViewPlugin,
  type ViewUpdate,
  Decoration,
  type DecorationSet,
  EditorView,
} from '@codemirror/view';
import { EditorSelection, type Extension } from '@codemirror/state';
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
import { handleImage, imageAtomicRangesExtension, imageKeymap } from './image';
import { handleCalloutMarker, handleCalloutToggleClick } from './callout';
import { handleInlineMath, mathFenceGuard } from './math';
import { handleListMark } from './list';
import {
  setCalloutFold,
  calloutFoldField,
  setDiagramCodeMode,
  diagramCodeModeField,
} from './foldState';
import { blockDecorationsField } from './blockDecorations';
import { tableEditingExtension } from './table';
import { canvasPreviewsField } from './canvasCard';
import type { Handler, Push } from './utils';

export { imageKeymap };

// Dispatch table for the viewport-scoped walk: inline marks/hides and line
// decorations only — never `block: true` (see blockDecorations.ts for the
// constructs that need that, via a full-document StateField instead).
const HANDLERS: Record<string, Handler> = {
  StrongEmphasis: handleEmphasis,
  Emphasis: handleEmphasis,
  Strikethrough: handleEmphasis,
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
  ListMark: handleListMark,
  FencedCode: handleFencedCode,
  HorizontalRule: handleHorizontalRule,
  Image: handleImage,
  Blockquote: handleCalloutMarker,
  InlineMath: handleInlineMath,
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
        if (handler) {
          const result = handler(node, view, state.selection, push);
          if (result === false) return false;
        }
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
        syntaxTree(update.state) !== syntaxTree(update.startState) ||
        update.state.field(diagramCodeModeField, false) !==
          update.startState.field(diagramCodeModeField, false) ||
        update.state.field(canvasPreviewsField, false) !==
          update.startState.field(canvasPreviewsField, false)
      ) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
    eventHandlers: {
      mousedown(event, view) {
        if (handleTaskCheckboxMousedown(event, view)) return true;
        const toggle = handleCalloutToggleClick(event);
        if (toggle) {
          view.dispatch({ effects: setCalloutFold.of(toggle) });
          return true;
        }
        const target = event.target as HTMLElement | null;

        // Two-button Mermaid toolbar: Eye (`preview`) vs Code (`code`)
        const mermaidBtn =
          event.button === 0
            ? target?.closest?.<HTMLElement>('[data-mermaid-mode]')
            : null;
        if (mermaidBtn) {
          event.preventDefault();
          event.stopPropagation();
          const mode = mermaidBtn.dataset.mermaidMode;
          const pos = Number(mermaidBtn.dataset.mermaidPos);
          if (!Number.isNaN(pos)) {
            let blockFrom = pos;
            let blockTo = pos;
            syntaxTree(view.state).iterate({
              from: Math.max(0, pos - 1),
              to: Math.min(view.state.doc.length, pos + 1),
              enter(ref) {
                if (ref.name === 'FencedCode') {
                  blockFrom = ref.from;
                  blockTo = ref.to;
                  return false;
                }
              },
            });
            if (mode === 'code') {
              const startLine = view.state.doc.lineAt(blockFrom);
              const cursorTarget = Math.min(
                startLine.to + 1,
                view.state.doc.length,
              );
              view.dispatch({
                effects: setDiagramCodeMode.of({
                  pos: blockFrom,
                  codeMode: true,
                }),
                selection: EditorSelection.cursor(cursorTarget),
                scrollIntoView: true,
              });
              view.focus();
            } else {
              const endLine = view.state.doc.lineAt(blockTo);
              const docLen = view.state.doc.length;
              if (endLine.to >= docLen) {
                view.dispatch({
                  changes: { from: docLen, insert: '\n' },
                  selection: EditorSelection.cursor(docLen + 1),
                  effects: setDiagramCodeMode.of({
                    pos: blockFrom,
                    codeMode: false,
                  }),
                });
              } else {
                view.dispatch({
                  selection: EditorSelection.cursor(endLine.to + 1),
                  effects: setDiagramCodeMode.of({
                    pos: blockFrom,
                    codeMode: false,
                  }),
                });
              }
            }
          }
          return true;
        }

        const renderedMath =
          !event.shiftKey &&
          event.button === 0 &&
          target?.closest?.<HTMLElement>('.cm-live-math-block');
        if (renderedMath) {
          const downX = event.clientX;
          const downY = event.clientY;
          const onUp = (upEvent: MouseEvent) => {
            window.removeEventListener('mouseup', onUp, true);
            if (
              Math.hypot(upEvent.clientX - downX, upEvent.clientY - downY) > 5
            )
              return;
            let pos: number;
            try {
              pos = view.posAtDOM(renderedMath);
            } catch {
              return;
            }
            syntaxTree(view.state).iterate({
              from: Math.max(0, pos - 1),
              to: Math.min(view.state.doc.length, pos + 1),
              enter(ref) {
                if (ref.name === 'FencedCode' || ref.name === 'MathBlock') {
                  const startLine = view.state.doc.lineAt(ref.from);
                  const endLine = view.state.doc.lineAt(ref.to);
                  if (endLine.number - startLine.number >= 2) {
                    view.dispatch({
                      selection: { anchor: startLine.to + 1 },
                      scrollIntoView: true,
                    });
                  }
                  return false;
                }
              },
            });
          };
          window.addEventListener('mouseup', onUp, true);
        }
        const interactiveWidget =
          !event.shiftKey &&
          Boolean(
            target?.closest?.(
              '[data-row], .cm-live-table-toolbar, .cm-live-details-summary, .cm-canvas-card, .cm-live-image-delete-btn, .cm-mermaid-toolbar, .cm-mermaid-resize-handle, .cm-mermaid-drag-handle',
            ),
          );
        if (!interactiveWidget && event.button === 0) {
          view.dom.classList.add('cm-dragging-selection');
          const clear = () => {
            view.dom.classList.remove('cm-dragging-selection');
            window.removeEventListener('mouseup', clear, true);
            window.removeEventListener('blur', clear);
          };
          window.addEventListener('mouseup', clear, true);
          window.removeEventListener('blur', clear);
        }
        return false;
      },
    },
  },
);

// The block-only StateField and its supporting fold-state field must be
// installed alongside the plugin for callouts/tables/mermaid/math to render
// at all — bundled here so extensions/index.ts only needs one import.
export const livePreviewExtensions: Extension[] = [
  livePreviewPlugin,
  calloutFoldField,
  diagramCodeModeField,
  canvasPreviewsField,
  blockDecorationsField,
  imageAtomicRangesExtension,
  tableEditingExtension,
  mathFenceGuard,
];
