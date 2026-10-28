import { Decoration, type EditorView } from '@codemirror/view';
import {
  DEFAULT_CANVAS_ICON,
  LEADING_EMOJI,
  splitCanvasLabel,
} from '../../../components/EditorContent/canvasLinks.utils';
import { CanvasCardWidget } from './canvasCard';
import { overlaps, type Handler, type Push } from './utils';

// A canvas link inside a sentence reads like a Notion page link: its icon
// apart from an underlined title. [textFrom, textTo) is the link's text, its
// brackets already hidden.
const decorateInlineCanvasLink = (
  view: EditorView,
  textFrom: number,
  textTo: number,
  push: Push,
) => {
  const label = view.state.sliceDoc(textFrom, textTo);
  const icon = label.match(LEADING_EMOJI);
  const titleFrom = textFrom + (icon ? icon[0].length : 0);
  if (icon) {
    push(
      textFrom,
      textFrom + icon[1].length,
      Decoration.mark({ class: 'cm-canvas-icon' }),
    );
  }
  if (titleFrom < textTo) {
    push(titleFrom, textTo, Decoration.mark({ class: 'cm-canvas-title' }));
  }
};

// [text](url) — renders just "text" styled as a link (no real <a>, so
// clicking only ever places the cursor — there is nothing to navigate).
// Hides the opening "[" and collapses "](url)" into nothing unless the
// cursor is anywhere inside the link.
export const handleLink: Handler = (node, view, sel, push) => {
  const linkText = view.state.sliceDoc(node.from, node.to);
  const isCanvas =
    linkText.includes('(canvas:') || linkText.includes('(#canvas');

  let canvasId: string | undefined;
  if (isCanvas) {
    const match = linkText.match(/\((?:canvas:|#canvas-?)([^\s)]*)\)/);
    if (match && match[1]) {
      canvasId = match[1];
    }
  }

  const revealed = overlaps(sel, node.from, node.to);

  const marks: { from: number; to: number }[] = [];
  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'LinkMark')
      marks.push({ from: cursor.from, to: cursor.to });
  }

  // A canvas link with a line to itself becomes a full-width card, until the
  // cursor comes onto it to edit the markdown.
  const line = view.state.doc.lineAt(node.from);
  if (
    canvasId &&
    !revealed &&
    marks.length >= 2 &&
    line.text.trim() === linkText
  ) {
    const { icon, name } = splitCanvasLabel(
      view.state.sliceDoc(marks[0].to, marks[1].from),
    );
    push(
      node.from,
      node.to,
      Decoration.replace({
        widget: new CanvasCardWidget(
          canvasId,
          name || 'Canvas',
          icon || DEFAULT_CANVAS_ICON,
        ),
      }),
    );
    return;
  }

  push(
    node.from,
    node.to,
    Decoration.mark({
      class: isCanvas ? 'cm-live-link cm-live-canvas-link' : 'cm-live-link',
      attributes: canvasId ? { 'data-canvas-id': canvasId } : undefined,
    }),
  );
  if (revealed) return;

  // A link mid-typing (e.g. just "[text" with no closing yet) won't have
  // both bracket marks — leave it alone rather than guess.
  if (marks.length < 2) return;

  const openBracket = marks[0];
  const closeBracket = marks[1];
  push(openBracket.from, openBracket.to, Decoration.replace({}));
  push(closeBracket.from, node.to, Decoration.replace({}));
  if (isCanvas) {
    decorateInlineCanvasLink(view, openBracket.to, closeBracket.from, push);
  }
};
