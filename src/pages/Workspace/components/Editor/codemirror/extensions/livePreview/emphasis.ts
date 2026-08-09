import { Decoration } from '@codemirror/view';
import { overlaps, type Handler } from './utils';

// **bold** / *italic* (StrongEmphasis / Emphasis) — hides both `**`/`*`
// marks unless the cursor is anywhere inside the construct, in which case
// both markers reveal together (matches Obsidian: entering the bold text
// reveals the whole `**...**`, not just the nearer marker).
export const handleEmphasis: Handler = (node, _view, sel, push) => {
  const revealed = overlaps(sel, node.from, node.to);
  const cls =
    node.type.name === 'StrongEmphasis' ? 'cm-live-strong' : 'cm-live-em';
  push(node.from, node.to, Decoration.mark({ class: cls }));
  if (revealed) return;

  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'EmphasisMark') {
      push(cursor.from, cursor.to, Decoration.replace({}));
    }
  }
};
