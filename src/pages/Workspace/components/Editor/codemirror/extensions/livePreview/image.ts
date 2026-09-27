import {
  Decoration,
  WidgetType,
  EditorView,
  type Command,
} from '@codemirror/view';
import {
  EditorState,
  RangeSet,
  RangeSetBuilder,
  RangeValue,
} from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import type { Handler } from './utils';

export interface ImageInfo {
  from: number;
  to: number;
  deleteFrom: number;
  deleteTo: number;
  isWholeLine: boolean;
}

const IMAGE_REGEX =
  /!\[([^\]]*)\]\((https?:\/\/[^\s)\n\r]+|data:image\/[^)\n\r]+)(\)?)/g;

function computeImageInfo(
  state: EditorState,
  from: number,
  to: number,
): ImageInfo {
  const doc = state.doc;
  const line = doc.lineAt(from);
  const imageText = doc.sliceString(from, to).trim();
  const isWholeLine = line.text.trim() === imageText;

  let deleteFrom = from;
  let deleteTo = to;

  if (isWholeLine) {
    if (line.from > 0) {
      deleteFrom = line.from - 1;
      deleteTo = line.to;
    } else if (line.to < doc.length) {
      deleteFrom = line.from;
      deleteTo = line.to + 1;
    } else {
      deleteFrom = line.from;
      deleteTo = line.to;
    }
  }

  return { from, to, deleteFrom, deleteTo, isWholeLine };
}

export function findImageAt(
  state: EditorState,
  pos: number,
  direction: -1 | 0 | 1 = 0,
): ImageInfo | null {
  const tree = syntaxTree(state);
  const doc = state.doc;

  const checkPositions: { p: number; side: -1 | 1 }[] = [];
  if (direction < 0) {
    if (pos > 0) checkPositions.push({ p: pos - 1, side: -1 });
  } else if (direction > 0) {
    if (pos < doc.length) checkPositions.push({ p: pos, side: 1 });
  } else {
    checkPositions.push({ p: pos, side: 1 });
    if (pos > 0) checkPositions.push({ p: pos - 1, side: -1 });
  }

  for (const { p, side } of checkPositions) {
    let node = tree.resolveInner(p, side);
    while (node && node.name !== 'Image' && node.parent) {
      node = node.parent;
    }
    if (node && node.name === 'Image') {
      const from = node.from;
      let to = node.to;

      const nodeText = doc.sliceString(from, to);
      const line = doc.lineAt(from);
      if (!nodeText.endsWith(')')) {
        const lineAfter = doc.sliceString(from, line.to);
        const match = lineAfter.match(
          /^!\[([^\]]*)\]\((https?:\/\/[^\s)\n\r]+|data:image\/[^)\n\r]+)(\)?)/,
        );
        if (match) {
          to = from + match[0].length;
        }
      }

      if (direction < 0 && !(pos > from && pos <= to)) {
        continue;
      }
      if (direction > 0 && !(pos >= from && pos < to)) {
        continue;
      }

      return computeImageInfo(state, from, to);
    }
  }

  // Fallback: check regex on current line
  if (pos >= 0 && pos <= doc.length) {
    const line = doc.lineAt(Math.min(pos, doc.length > 0 ? doc.length - 1 : 0));
    IMAGE_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = IMAGE_REGEX.exec(line.text)) !== null) {
      const imgFrom = line.from + match.index;
      const imgTo = imgFrom + match[0].length;
      if (
        (direction < 0 && pos > imgFrom && pos <= imgTo) ||
        (direction > 0 && pos >= imgFrom && pos < imgTo) ||
        (direction === 0 && pos >= imgFrom && pos <= imgTo)
      ) {
        return computeImageInfo(state, imgFrom, imgTo);
      }
    }
  }

  return null;
}

export function deleteImageAtPos(view: EditorView, pos: number): boolean {
  const info = findImageAt(view.state, pos, 0);
  if (!info) return false;
  view.dispatch({
    changes: { from: info.deleteFrom, to: info.deleteTo },
    selection: { anchor: info.deleteFrom },
    userEvent: 'delete.image',
    scrollIntoView: true,
  });
  view.focus();
  return true;
}

export function selectImageAtPos(view: EditorView, pos: number): boolean {
  const info = findImageAt(view.state, pos, 0);
  if (!info) return false;
  view.dispatch({
    selection: { anchor: info.from, head: info.to },
    userEvent: 'select',
  });
  view.focus();
  return true;
}

export const deleteImageBackward: Command = (view) => {
  const { from, to, empty } = view.state.selection.main;

  if (!empty) {
    const info = findImageAt(view.state, from, 0);
    if (info && info.from === from && info.to === to) {
      return deleteImageAtPos(view, from);
    }
    return false;
  }

  const info = findImageAt(view.state, from, -1);
  if (info) {
    return deleteImageAtPos(view, from);
  }

  return false;
};

export const deleteImageForward: Command = (view) => {
  const { from, to, empty } = view.state.selection.main;

  if (!empty) {
    const info = findImageAt(view.state, from, 0);
    if (info && info.from === from && info.to === to) {
      return deleteImageAtPos(view, from);
    }
    return false;
  }

  const info = findImageAt(view.state, from, 1);
  if (info) {
    return deleteImageAtPos(view, from);
  }

  return false;
};

export const imageKeymap = [
  { key: 'Backspace', run: deleteImageBackward },
  { key: 'Delete', run: deleteImageForward },
  { key: 'Mod-Backspace', run: deleteImageBackward },
  { key: 'Alt-Backspace', run: deleteImageBackward },
];

class AtomicImageValue extends RangeValue {}
const atomicImageValue = new AtomicImageValue();

export const imageAtomicRangesExtension = EditorView.atomicRanges.of((view) => {
  const ranges: { from: number; to: number }[] = [];
  const tree = syntaxTree(view.state);
  for (const { from, to } of view.visibleRanges) {
    tree.iterate({
      from,
      to,
      enter(node) {
        if (node.name === 'Image') {
          ranges.push({ from: node.from, to: node.to });
          return false;
        }
      },
    });
  }

  if (ranges.length === 0) return RangeSet.empty;
  ranges.sort((a, b) => a.from - b.from);
  const builder = new RangeSetBuilder<AtomicImageValue>();
  let lastTo = -1;
  for (const r of ranges) {
    if (r.from >= lastTo) {
      builder.add(r.from, r.to, atomicImageValue);
      lastTo = r.to;
    }
  }
  return builder.finish();
});

class ImageWidget extends WidgetType {
  private cleanupDocClick: (() => void) | null = null;

  constructor(
    readonly src: string,
    readonly alt: string,
  ) {
    super();
  }

  eq(other: ImageWidget) {
    return other.src === this.src && other.alt === this.alt;
  }

  toDOM(view: EditorView) {
    const container = document.createElement('span');
    container.className = 'cm-live-image-container';

    const img = document.createElement('img');
    img.src = this.src;
    img.alt = this.alt;
    img.className = 'cm-live-image';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'cm-live-image-delete-btn';
    deleteBtn.title = 'Eliminar imagen';
    deleteBtn.setAttribute('aria-label', 'Eliminar imagen');
    deleteBtn.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>';

    deleteBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const pos = view.posAtDOM(container);
        deleteImageAtPos(view, pos);
      } catch (err) {
        console.error('Failed to delete image at pos:', err);
      }
    });

    img.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        const pos = view.posAtDOM(container);
        selectImageAtPos(view, pos);
        container.classList.add('cm-selected');
      } catch (err) {
        console.error('Failed to select image at pos:', err);
      }
    });

    const handleDocClick = (e: MouseEvent) => {
      if (!container.contains(e.target as Node)) {
        container.classList.remove('cm-selected');
      }
    };
    document.addEventListener('click', handleDocClick);
    this.cleanupDocClick = () => {
      document.removeEventListener('click', handleDocClick);
    };

    container.appendChild(img);
    container.appendChild(deleteBtn);
    return container;
  }

  ignoreEvent(event: Event) {
    return event.type === 'click' || event.type === 'mousedown';
  }

  destroy() {
    if (this.cleanupDocClick) {
      this.cleanupDocClick();
      this.cleanupDocClick = null;
    }
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

  // Standard 4 LinkMarks: "![" (0), "]" (1), "(" (2), ")" (3)
  if (marks.length >= 4) {
    const alt = view.state.sliceDoc(marks[0].to, marks[1].from);
    const src = view.state.sliceDoc(marks[2].to, marks[3].from);
    if (!src) return;

    push(
      node.from,
      node.to,
      Decoration.replace({ widget: new ImageWidget(src, alt) }),
    );
    return;
  }

  // Damaged / unclosed image: e.g. "![" and "]" exist, followed by "(url" without ")"
  if (marks.length >= 2) {
    const line = view.state.doc.lineAt(node.from);
    const lineAfter = view.state.sliceDoc(marks[1].to, line.to);
    const match = lineAfter.match(
      /^\((https?:\/\/[^\s)\n\r]+|data:image\/[^)\n\r]+)(\)?)/,
    );
    if (match) {
      const alt = view.state.sliceDoc(marks[0].to, marks[1].from);
      const src = match[1];
      const endPos = marks[1].to + match[0].length;
      push(
        node.from,
        endPos,
        Decoration.replace({ widget: new ImageWidget(src, alt) }),
      );
    }
  }
};
