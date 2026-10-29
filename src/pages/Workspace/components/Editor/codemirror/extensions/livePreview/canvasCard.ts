import { StateEffect, StateField } from '@codemirror/state';
import { WidgetType } from '@codemirror/view';

/** A canvas's preview: a link to a small picture of its drawing, and when
 * that picture changed (the link is re-signed on every read; this isn't). */
export interface CanvasPreview {
  url: string;
  version: string;
}

/** Hands the editor the previews of the document's canvases, by id. */
export const setCanvasPreviews =
  StateEffect.define<ReadonlyMap<string, CanvasPreview>>();

export const canvasPreviewsField = StateField.define<
  ReadonlyMap<string, CanvasPreview>
>({
  create: () => new Map(),
  update(previews, tr) {
    for (const effect of tr.effects)
      if (effect.is(setCanvasPreviews)) return effect.value;
    return previews;
  },
});

const SVG_NS = 'http://www.w3.org/2000/svg';

const chevron = (): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M9 6l6 6-6 6');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
};

const span = (className: string, text?: string): HTMLSpanElement => {
  const el = document.createElement('span');
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};

/** The small picture of the drawing; the icon again if it can't load (its
 * link expired, or the upload never finished). */
const previewImage = (preview: CanvasPreview, icon: string): HTMLElement => {
  const frame = span('cm-canvas-card-preview');
  const img = document.createElement('img');
  img.src = preview.url;
  img.alt = '';
  img.loading = 'lazy';
  img.draggable = false;
  img.addEventListener('error', () =>
    frame.replaceWith(span('cm-canvas-card-icon', icon)),
  );
  frame.appendChild(img);
  return frame;
};

/** A canvas link with a line to itself, drawn as a full-width card: a small
 * picture of the drawing (or its icon, until it has one), its name and an
 * "open" button. The data attributes carry what the editor needs to open it
 * (see EditorContent's click handler). */
export class CanvasCardWidget extends WidgetType {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly icon: string,
    readonly preview: CanvasPreview | null = null,
  ) {
    super();
  }

  // By the picture's version, not its link: a re-signed link to the same
  // picture keeps the card (and the image already loaded) as it is.
  eq(other: CanvasCardWidget) {
    return (
      other.id === this.id &&
      other.name === this.name &&
      other.icon === this.icon &&
      other.preview?.version === this.preview?.version
    );
  }

  toDOM() {
    const card = document.createElement('div');
    card.className = 'cm-canvas-card';
    card.dataset.canvasId = this.id;
    card.dataset.canvasName = this.name;
    card.dataset.canvasIcon = this.icon;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Abrir canvas ${this.name}`);

    const text = span('cm-canvas-card-text');
    text.append(
      // With the picture in the icon's place, the icon goes before the name
      span(
        'cm-canvas-card-title',
        this.preview ? `${this.icon} ${this.name}` : this.name,
      ),
      span('cm-canvas-card-sub', 'Canvas'),
    );

    const action = span('cm-canvas-card-action', 'Abrir canvas');
    action.appendChild(chevron());

    card.append(
      this.preview
        ? previewImage(this.preview, this.icon)
        : span('cm-canvas-card-icon', this.icon),
      text,
      action,
    );
    return card;
  }

  // Clicks open the canvas instead of placing the cursor in the link; the
  // markdown is still reachable with the arrow keys.
  ignoreEvent() {
    return true;
  }
}
