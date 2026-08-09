import { Decoration } from '@codemirror/view';
import { overlaps, type Handler } from './utils';

// > quote — revealed per LINE (not for the whole blockquote, which can span
// many lines), matching Obsidian. Hides the ">" plus one following space.
export const handleQuoteMark: Handler = (node, view, sel, push) => {
  const line = view.state.doc.lineAt(node.from);
  push(
    line.from,
    line.from,
    Decoration.line({ attributes: { class: 'cm-live-quote-line' } }),
  );

  if (overlaps(sel, line.from, line.to)) return;
  const hideEnd = Math.min(node.to + 1, line.to);
  push(node.from, hideEnd, Decoration.replace({}));
};
