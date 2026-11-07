import { Decoration } from '@codemirror/view';
import { showsMarkup, type Handler } from './utils';

// **bold** / *italic* / ~~strikethrough~~ (StrongEmphasis / Emphasis / Strikethrough)
export const handleEmphasis: Handler = (node, _view, sel, push) => {
  const revealed = showsMarkup(sel, node.from, node.to);
  const cls =
    node.type.name === 'StrongEmphasis'
      ? 'cm-live-strong'
      : node.type.name === 'Strikethrough'
        ? 'cm-live-strike'
        : 'cm-live-em';
  push(node.from, node.to, Decoration.mark({ class: cls }));
  if (revealed) return;

  const cursor = node.node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (
      cursor.type.name === 'EmphasisMark' ||
      cursor.type.name === 'StrikethroughMark'
    ) {
      push(cursor.from, cursor.to, Decoration.replace({}));
    }
  }
};
