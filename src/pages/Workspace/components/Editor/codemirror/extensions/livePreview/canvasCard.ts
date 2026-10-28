import { WidgetType } from '@codemirror/view';

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

/** A canvas link with a line to itself, drawn as a full-width card: its icon,
 * its name and an "open" button. The data attributes carry what the editor
 * needs to open it (see EditorContent's click handler). */
export class CanvasCardWidget extends WidgetType {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly icon: string,
  ) {
    super();
  }

  eq(other: CanvasCardWidget) {
    return (
      other.id === this.id &&
      other.name === this.name &&
      other.icon === this.icon
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
      span('cm-canvas-card-title', this.name),
      span('cm-canvas-card-sub', 'Canvas'),
    );

    const action = span('cm-canvas-card-action', 'Abrir canvas');
    action.appendChild(chevron());

    card.append(span('cm-canvas-card-icon', this.icon), text, action);
    return card;
  }

  // Clicks open the canvas instead of placing the cursor in the link; the
  // markdown is still reachable with the arrow keys.
  ignoreEvent() {
    return true;
  }
}
