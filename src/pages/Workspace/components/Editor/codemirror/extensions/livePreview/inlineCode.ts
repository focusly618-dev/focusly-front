import { Decoration } from '@codemirror/view';
import { overlaps, type Handler } from './utils';

// `inline code` — hides both backticks unless the cursor is inside.
export const handleInlineCode: Handler = (node, _view, sel, push) => {
  const revealed = overlaps(sel, node.from, node.to);
  push(node.from, node.to, Decoration.mark({ class: 'cm-live-inlinecode' }));
  if (revealed) return;

  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'CodeMark') {
      push(cursor.from, cursor.to, Decoration.replace({}));
    }
  }
};
