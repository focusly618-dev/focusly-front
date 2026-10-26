import { Decoration } from '@codemirror/view';
import { overlaps, type Handler } from './utils';

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
  push(
    node.from,
    node.to,
    Decoration.mark({
      class: isCanvas ? 'cm-live-link cm-live-canvas-link' : 'cm-live-link',
      attributes: canvasId ? { 'data-canvas-id': canvasId } : undefined,
    }),
  );
  if (revealed) return;

  const marks: { from: number; to: number }[] = [];
  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'LinkMark')
      marks.push({ from: cursor.from, to: cursor.to });
  }
  // A link mid-typing (e.g. just "[text" with no closing yet) won't have
  // both bracket marks — leave it alone rather than guess.
  if (marks.length < 2) return;

  const openBracket = marks[0];
  const closeBracket = marks[1];
  push(openBracket.from, openBracket.to, Decoration.replace({}));
  push(closeBracket.from, node.to, Decoration.replace({}));
};
