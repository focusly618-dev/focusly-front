import { Decoration } from '@codemirror/view';
import { overlaps, type Handler } from './utils';

// --- / *** / ___ — draws a real rule (border-top on the now-empty line)
// unless the cursor is on that line, in which case the raw dashes show.
export const handleHorizontalRule: Handler = (node, view, sel, push) => {
  const line = view.state.doc.lineAt(node.from);
  push(
    line.from,
    line.from,
    Decoration.line({ attributes: { class: 'cm-hr-line' } }),
  );

  if (overlaps(sel, line.from, line.to)) return;
  push(node.from, node.to, Decoration.replace({}));
};
