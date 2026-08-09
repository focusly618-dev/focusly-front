import { Decoration, WidgetType } from '@codemirror/view';
import type { Handler } from './utils';

class ImageWidget extends WidgetType {
  constructor(
    readonly src: string,
    readonly alt: string,
  ) {
    super();
  }

  eq(other: ImageWidget) {
    return other.src === this.src && other.alt === this.alt;
  }

  toDOM() {
    const img = document.createElement('img');
    img.src = this.src;
    img.alt = this.alt;
    img.className = 'cm-live-image';
    return img;
  }
}

// ![alt](url) — rendered as a real <img>, unconditionally (never reveals raw
// markdown on cursor, unlike every other construct here). Pasted images are
// stored as base64 data URLs that can run tens of KB of raw text — showing
// that instead of the picture would be unreadable and there'd be no way to
// actually see what was pasted. Matches Obsidian's own image embeds, which
// also never "un-render" just because the cursor is on that line.
export const handleImage: Handler = (node, view, _sel, push) => {
  const cursor = node.node.cursor();
  const marks: { from: number; to: number }[] = [];
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'LinkMark')
      marks.push({ from: cursor.from, to: cursor.to });
  }
  // "![", "]", "(", ")" — a mid-typing image (e.g. just "![alt") won't have
  // all four yet, so leave it as plain text rather than guess.
  if (marks.length < 4) return;

  const alt = view.state.sliceDoc(marks[0].to, marks[1].from);
  const src = view.state.sliceDoc(marks[2].to, marks[3].from);
  if (!src) return;

  push(
    node.from,
    node.to,
    Decoration.replace({ widget: new ImageWidget(src, alt) }),
  );
};
