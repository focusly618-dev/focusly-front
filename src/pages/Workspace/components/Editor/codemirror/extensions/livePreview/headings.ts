import { Decoration } from '@codemirror/view';
import { overlaps, type Handler } from './utils';

// ATX headings (# .. ######) — hides the `#` marker(s) plus the following
// space unless the cursor is on the heading's line. Only a mark-level style
// is applied (font-size/weight), never a block-level one, so the heading
// stays on its own single line instead of reflowing like a real <h1>.
export const handleHeading: Handler = (node, _view, sel, push) => {
  const revealed = overlaps(sel, node.from, node.to);
  const level = Number(node.type.name.slice('ATXHeading'.length));
  push(node.from, node.to, Decoration.mark({ class: `cm-live-h${level}` }));
  if (revealed) return;

  const cursor = node.node.cursor();
  if (!cursor.firstChild() || cursor.type.name !== 'HeaderMark') return;
  // Plain-text heading content never gets its own child node in the Lezer
  // tree (only recognized inline markup does), so there's often no sibling
  // to anchor on — hide the marker plus exactly one following space instead
  // of walking to a sibling that may not exist.
  const hideEnd = Math.min(cursor.to + 1, node.to);
  push(node.from, hideEnd, Decoration.replace({}));
};
