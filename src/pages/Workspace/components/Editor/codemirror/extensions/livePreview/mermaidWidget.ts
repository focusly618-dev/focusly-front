import { WidgetType, EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import mermaid from 'mermaid';
import i18n from '@/i18n';

let lastInitializedDark: boolean | null = null;
let renderCounter = 0;

export interface MermaidFenceMeta {
  height: number | null;
  zoom: number;
  col: boolean;
  align: 'left' | 'center' | 'right';
}

export const parseMermaidMeta = (info: string): MermaidFenceMeta => {
  const heightMatch = /\bh=(\d+)\b/.exec(info);
  const zoomMatch = /\bz=(\d+)\b/.exec(info);
  const col = /\bcol\b/.test(info);
  const alignMatch = /\balign=(left|center|right)\b/.exec(info);
  return {
    height: heightMatch ? Number(heightMatch[1]) : null,
    zoom: zoomMatch ? Math.max(25, Math.min(300, Number(zoomMatch[1]))) : 100,
    col,
    align: (alignMatch?.[1] as 'left' | 'center' | 'right') ?? 'center',
  };
};

export const buildMermaidInfo = (meta: MermaidFenceMeta): string => {
  const parts = ['mermaid'];
  if (meta.height) parts.push(`h=${meta.height}`);
  if (meta.zoom && meta.zoom !== 100) parts.push(`z=${meta.zoom}`);
  if (meta.col) parts.push('col');
  return parts.join(' ');
};

export const rewriteMermaidFenceLine = (
  lineText: string,
  patch: Partial<MermaidFenceMeta>,
): string => {
  const match = /^(`{3,}\s*)mermaid(.*)$/i.exec(lineText);
  if (!match) return lineText;
  const current = parseMermaidMeta(`mermaid${match[2] ?? ''}`);
  const next: MermaidFenceMeta = { ...current, ...patch };
  return `${match[1]}${buildMermaidInfo(next)}`;
};

const ensureMermaidTheme = (isDark: boolean) => {
  if (lastInitializedDark === isDark) return;
  lastInitializedDark = isDark;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: isDark ? 'dark' : 'default',
    // On a syntax error Mermaid otherwise appends its "Syntax error in text"
    // picture to the page, where it stays: errors are shown here instead.
    suppressErrorRendering: true,
    flowchart: {
      nodeSpacing: 32,
      rankSpacing: 34,
      padding: 10,
    },
  });
};

const DEFAULT_MAX_HEIGHT = 320;
const COMPACT_SCALE = 0.8;
const diagramHeightsByCode = new Map<string, number>();
const diagramZoomsByCode = new Map<string, number>();

const parseViewBox = (
  svg: SVGSVGElement,
): { width: number; height: number } | null => {
  const vb = svg.getAttribute('viewBox');
  if (vb) {
    const parts = vb
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] };
    }
  }
  return null;
};

export const applySvgSize = (
  svg: SVGSVGElement,
  customHeight: number | null,
  zoom = 100,
) => {
  const scale = Math.max(0.25, Math.min(3, zoom / 100));
  const dims = parseViewBox(svg);
  if (!dims) {
    const baseH = customHeight ?? DEFAULT_MAX_HEIGHT;
    const maxH = Math.round(baseH * scale);
    svg.style.cssText = '';
    svg.style.maxHeight = `${maxH}px`;
    svg.style.width = 'auto';
    svg.style.maxWidth = scale > 1 ? 'none' : '100%';
    return;
  }
  const aspect = dims.width / dims.height;
  const defaultHeight = Math.min(
    DEFAULT_MAX_HEIGHT,
    Math.round(dims.height * COMPACT_SCALE),
  );
  const baseHeight = customHeight ?? defaultHeight;
  const targetHeight = Math.round(baseHeight * scale);
  const targetWidth = Math.round(targetHeight * aspect);

  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.style.cssText = '';
  svg.style.width = `${targetWidth}px`;
  svg.style.maxWidth = scale > 1 ? 'none' : '100%';
  svg.style.height = 'auto';
  svg.style.maxHeight = `${targetHeight}px`;
};

const persistDiagramHeight = (
  view: EditorView,
  pos: number,
  height: number,
) => {
  if (pos < 0 || pos > view.state.doc.length) return;
  const startLine = view.state.doc.lineAt(pos);
  const nextText = rewriteMermaidFenceLine(startLine.text, { height });
  if (nextText === startLine.text) return;
  view.dispatch({
    changes: { from: startLine.from, to: startLine.to, insert: nextText },
  });
};

const persistDiagramZoom = (view: EditorView, pos: number, zoom: number) => {
  if (pos < 0 || pos > view.state.doc.length) return;
  const startLine = view.state.doc.lineAt(pos);
  const nextText = rewriteMermaidFenceLine(startLine.text, { zoom });
  if (nextText === startLine.text) return;
  view.dispatch({
    changes: { from: startLine.from, to: startLine.to, insert: nextText },
  });
};

/** Mermaid's temporary nodes for a render, left on the page when it fails.
 * The drawn diagram carries the same id: anything inside `keep` stays. */
const removeLeftovers = (id: string, keep: HTMLElement) => {
  for (const nodeId of [id, `d${id}`]) {
    const node = document.getElementById(nodeId);
    if (node && !keep.contains(node)) node.remove();
  }
};

/**
 * In Mermaid flowcharts, parentheses or colons inside unquoted node labels
 * (e.g. `A[Texto (detalle)]`) cause a syntax error because `(` is parsed as a
 * shape token. Wrapping unquoted node labels in `"..."` lets these diagrams
 * render cleanly.
 */
export const quoteFlowchartLabels = (code: string): string =>
  code
    .replace(
      /\b([A-Za-z0-9_-]+)\[(?!["[({/\\])([^[\]\n]+)\]/g,
      (_m, id: string, label: string) =>
        `${id}["${label.replace(/"/g, '#quot;')}"]`,
    )
    .replace(
      /\b([A-Za-z0-9_-]+)\{(?!["{])([^{}\n]+)\}/g,
      (_m, id: string, label: string) =>
        `${id}{"${label.replace(/"/g, '#quot;')}"}`,
    );

export const resolveValidMermaidCode = async (
  code: string,
): Promise<string | null> => {
  if (await mermaid.parse(code, { suppressErrors: true })) return code;
  const quoted = quoteFlowchartLabels(code);
  if (
    quoted !== code &&
    (await mermaid.parse(quoted, { suppressErrors: true }))
  ) {
    return quoted;
  }
  return null;
};

const EYE_ICON_SVG = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

const CODE_ICON_SVG = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

const ZOOM_OUT_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

const ZOOM_IN_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

const DRAG_GRIP_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>`;

export type DiagramDropTarget =
  | {
      kind: 'diagram';
      targetPos: number;
      side: 'left' | 'right' | 'above' | 'below';
    }
  | { kind: 'align'; align: 'left' | 'center' | 'right' }
  | { kind: 'line'; insertPos: number };

const findFenceBoundsAt = (
  view: EditorView,
  pos: number,
): { from: number; to: number } | null => {
  let found: { from: number; to: number } | null = null;
  syntaxTree(view.state).iterate({
    from: Math.max(0, pos - 1),
    to: Math.min(view.state.doc.length, pos + 1),
    enter(ref) {
      if (ref.name === 'FencedCode') {
        const startLine = view.state.doc.lineAt(ref.from);
        const endLine = view.state.doc.lineAt(ref.to);
        found = { from: startLine.from, to: endLine.to };
        return false;
      }
    },
  });
  return found;
};

const rewriteBlockFirstLine = (
  blockText: string,
  patch: Partial<MermaidFenceMeta>,
): string => {
  const nl = blockText.indexOf('\n');
  if (nl < 0) return rewriteMermaidFenceLine(blockText, patch);
  return (
    rewriteMermaidFenceLine(blockText.slice(0, nl), patch) + blockText.slice(nl)
  );
};

export const applyDiagramDrop = (
  view: EditorView,
  sourcePos: number,
  drop: DiagramDropTarget,
) => {
  const { doc } = view.state;
  const src = findFenceBoundsAt(view, sourcePos);
  if (!src) return;

  if (drop.kind === 'align') {
    const startLine = doc.lineAt(src.from);
    const nextLine = rewriteMermaidFenceLine(startLine.text, {
      col: false,
      align: drop.align,
    });
    if (nextLine !== startLine.text) {
      view.dispatch({
        changes: { from: startLine.from, to: startLine.to, insert: nextLine },
      });
    }
    return;
  }

  const srcText = doc.sliceString(src.from, src.to);
  // Consume one surrounding newline when cutting the source block
  const cutFrom =
    src.from > 0 && doc.sliceString(src.from - 1, src.from) === '\n'
      ? src.from - 1
      : src.from;
  const cutTo =
    cutFrom === src.from &&
    src.to < doc.length &&
    doc.sliceString(src.to, src.to + 1) === '\n'
      ? src.to + 1
      : src.to;

  if (drop.kind === 'diagram') {
    if (drop.targetPos === sourcePos) return;
    const tgt = findFenceBoundsAt(view, drop.targetPos);
    if (!tgt || tgt.from === src.from) return;

    const tgtStartLine = doc.lineAt(tgt.from);
    const tgtMeta = parseMermaidMeta(tgtStartLine.text);

    if (drop.side === 'right') {
      const movedBlock = rewriteBlockFirstLine(srcText, { col: true });
      const insertAt = tgt.to;
      const changes =
        cutTo <= insertAt
          ? [
              { from: cutFrom, to: cutTo, insert: '' },
              { from: insertAt, to: insertAt, insert: `\n${movedBlock}` },
            ]
          : [
              { from: insertAt, to: insertAt, insert: `\n${movedBlock}` },
              { from: cutFrom, to: cutTo, insert: '' },
            ];
      view.dispatch({ changes });
      return;
    }

    if (drop.side === 'left') {
      // Source takes target's column state, and target becomes a column after source
      const movedBlock = rewriteBlockFirstLine(srcText, { col: tgtMeta.col });
      const updatedTgtLine = rewriteMermaidFenceLine(tgtStartLine.text, {
        col: true,
      });
      const replaceTgtStart = {
        from: tgtStartLine.from,
        to: tgtStartLine.to,
        insert: `${movedBlock}\n${updatedTgtLine}`,
      };
      const changes =
        cutTo <= tgtStartLine.from
          ? [{ from: cutFrom, to: cutTo, insert: '' }, replaceTgtStart]
          : [replaceTgtStart, { from: cutFrom, to: cutTo, insert: '' }];
      view.dispatch({ changes });
      return;
    }

    const movedBlock = rewriteBlockFirstLine(srcText, { col: false });
    if (drop.side === 'above') {
      const insertAt = tgt.from;
      const changes =
        cutTo <= insertAt
          ? [
              { from: cutFrom, to: cutTo, insert: '' },
              { from: insertAt, to: insertAt, insert: `${movedBlock}\n` },
            ]
          : [
              { from: insertAt, to: insertAt, insert: `${movedBlock}\n` },
              { from: cutFrom, to: cutTo, insert: '' },
            ];
      view.dispatch({ changes });
      return;
    }

    const insertAt = tgt.to;
    const changes =
      cutTo <= insertAt
        ? [
            { from: cutFrom, to: cutTo, insert: '' },
            { from: insertAt, to: insertAt, insert: `\n${movedBlock}` },
          ]
        : [
            { from: insertAt, to: insertAt, insert: `\n${movedBlock}` },
            { from: cutFrom, to: cutTo, insert: '' },
          ];
    view.dispatch({ changes });
    return;
  }

  // drop.kind === 'line'
  const line = doc.lineAt(Math.max(0, Math.min(doc.length, drop.insertPos)));
  if (line.from >= src.from && line.to <= src.to) return;
  const movedBlock = rewriteBlockFirstLine(srcText, { col: false });
  const insertAt = line.from <= src.from ? line.from : line.to;
  const insertText =
    line.from <= src.from ? `${movedBlock}\n` : `\n${movedBlock}`;
  const changes =
    cutTo <= insertAt
      ? [
          { from: cutFrom, to: cutTo, insert: '' },
          { from: insertAt, to: insertAt, insert: insertText },
        ]
      : [
          { from: insertAt, to: insertAt, insert: insertText },
          { from: cutFrom, to: cutTo, insert: '' },
        ];
  view.dispatch({ changes });
};

/** Builds the Mermaid toolbar (Zoom - / 100% / Zoom + in preview, plus Eye = rendered diagram and `</>` = Markdown code). */
export const createMermaidModeToolbar = (
  pos: number,
  activeMode: 'preview' | 'code',
  zoom = 100,
): HTMLElement => {
  const toolbar = document.createElement('div');
  toolbar.className = 'cm-mermaid-toolbar';

  if (activeMode === 'preview') {
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.type = 'button';
    zoomOutBtn.className = 'cm-mermaid-zoom-btn';
    zoomOutBtn.dataset.mermaidZoom = 'out';
    zoomOutBtn.dataset.mermaidPos = String(pos);
    const zoomOutLabel = i18n.t(
      'editor.diagram.zoomOut',
      'Alejar diagrama (Zoom -)',
    );
    zoomOutBtn.title = zoomOutLabel;
    zoomOutBtn.setAttribute('aria-label', zoomOutLabel);
    zoomOutBtn.innerHTML = ZOOM_OUT_ICON_SVG;

    const zoomResetBtn = document.createElement('button');
    zoomResetBtn.type = 'button';
    zoomResetBtn.className = 'cm-mermaid-zoom-reset';
    zoomResetBtn.dataset.mermaidZoom = 'reset';
    zoomResetBtn.dataset.mermaidPos = String(pos);
    zoomResetBtn.dataset.zoomLabel = `${zoom}%`;
    const zoomResetLabel = i18n.t(
      'editor.diagram.zoomReset',
      'Restablecer zoom (100%)',
    );
    zoomResetBtn.title = zoomResetLabel;
    zoomResetBtn.setAttribute('aria-label', zoomResetLabel);

    const zoomInBtn = document.createElement('button');
    zoomInBtn.type = 'button';
    zoomInBtn.className = 'cm-mermaid-zoom-btn';
    zoomInBtn.dataset.mermaidZoom = 'in';
    zoomInBtn.dataset.mermaidPos = String(pos);
    const zoomInLabel = i18n.t(
      'editor.diagram.zoomIn',
      'Acercar diagrama (Zoom +)',
    );
    zoomInBtn.title = zoomInLabel;
    zoomInBtn.setAttribute('aria-label', zoomInLabel);
    zoomInBtn.innerHTML = ZOOM_IN_ICON_SVG;

    const sep = document.createElement('span');
    sep.className = 'cm-mermaid-toolbar-sep';
    sep.setAttribute('aria-hidden', 'true');

    toolbar.append(zoomOutBtn, zoomResetBtn, zoomInBtn, sep);
  }

  const previewBtn = document.createElement('button');
  previewBtn.type = 'button';
  previewBtn.className = `cm-mermaid-mode-btn${activeMode === 'preview' ? ' is-active' : ''}`;
  previewBtn.dataset.mermaidMode = 'preview';
  previewBtn.dataset.mermaidPos = String(pos);
  const previewLabel = i18n.t('editor.diagram.previewMode', 'Ver diagrama');
  previewBtn.title = previewLabel;
  previewBtn.setAttribute('aria-label', previewLabel);
  previewBtn.innerHTML = EYE_ICON_SVG;

  const codeBtn = document.createElement('button');
  codeBtn.type = 'button';
  codeBtn.className = `cm-mermaid-mode-btn${activeMode === 'code' ? ' is-active' : ''}`;
  codeBtn.dataset.mermaidMode = 'code';
  codeBtn.dataset.mermaidPos = String(pos);
  const codeLabel = i18n.t('editor.diagram.codeMode', 'Editar código Markdown');
  codeBtn.title = codeLabel;
  codeBtn.setAttribute('aria-label', codeLabel);
  codeBtn.innerHTML = CODE_ICON_SVG;

  toolbar.append(previewBtn, codeBtn);
  return toolbar;
};

export class MermaidHeaderToolbarWidget extends WidgetType {
  constructor(readonly pos: number) {
    super();
  }

  eq(other: MermaidHeaderToolbarWidget) {
    return this.pos === other.pos;
  }

  toDOM() {
    return createMermaidModeToolbar(this.pos, 'code');
  }

  ignoreEvent() {
    return false;
  }
}

const attachDiagramMoveHandle = (
  container: HTMLElement,
  view: EditorView,
  getPos: () => number,
) => {
  const dragHandle = document.createElement('button');
  dragHandle.type = 'button';
  dragHandle.className = 'cm-mermaid-drag-handle';
  const moveLabel = i18n.t(
    'editor.diagram.move',
    'Arrastra para mover el diagrama o ponerlo junto a otro en la misma fila',
  );
  dragHandle.title = moveLabel;
  dragHandle.setAttribute('aria-label', moveLabel);
  dragHandle.innerHTML = DRAG_GRIP_SVG;
  container.appendChild(dragHandle);

  dragHandle.addEventListener('mousedown', (downEvent: MouseEvent) => {
    if (downEvent.button !== 0) return;
    downEvent.preventDefault();
    downEvent.stopPropagation();

    const startX = downEvent.clientX;
    const startY = downEvent.clientY;
    const sourceRect = container.getBoundingClientRect();
    let activeDrop: DiagramDropTarget | null = null;
    let highlightedCard: HTMLElement | null = null;

    const clearHighlights = () => {
      if (highlightedCard) {
        delete highlightedCard.dataset.dropSide;
        highlightedCard = null;
      }
    };

    const onMove = (moveEvent: MouseEvent) => {
      clearHighlights();
      activeDrop = null;

      if (
        Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 6
      ) {
        return;
      }
      container.classList.add('is-dragging-diagram');

      // 1. Check if hovering over another diagram card (to place side-by-side or above/below)
      const allCards = Array.from(
        view.dom.querySelectorAll<HTMLElement>('.cm-live-mermaid'),
      );
      for (const card of allCards) {
        if (card === container) continue;
        const rect = card.getBoundingClientRect();
        if (
          moveEvent.clientX >= rect.left &&
          moveEvent.clientX <= rect.right &&
          moveEvent.clientY >= rect.top &&
          moveEvent.clientY <= rect.bottom
        ) {
          const targetPos = Number(card.dataset.mermaidPos);
          if (Number.isNaN(targetPos)) break;
          const relX =
            (moveEvent.clientX - rect.left) / Math.max(1, rect.width);
          const relY =
            (moveEvent.clientY - rect.top) / Math.max(1, rect.height);
          const side: 'left' | 'right' | 'above' | 'below' =
            relX < 0.35
              ? 'left'
              : relX > 0.65
                ? 'right'
                : relY < 0.5
                  ? 'above'
                  : 'below';
          card.dataset.dropSide = side;
          highlightedCard = card;
          activeDrop = { kind: 'diagram', targetPos, side };
          return;
        }
      }

      // 2. While still inside the diagram's own vertical bounds, keep it centered
      // (never shift a standalone diagram left or right).
      if (
        moveEvent.clientY >= sourceRect.top &&
        moveEvent.clientY <= sourceRect.bottom
      ) {
        return;
      }

      // 3. Dragged above or below the diagram: move it to the hovered document line
      const coordsPos = view.posAtCoords({
        x: moveEvent.clientX,
        y: moveEvent.clientY,
      });
      if (coordsPos !== null) {
        activeDrop = { kind: 'line', insertPos: coordsPos };
      } else if (moveEvent.clientY < sourceRect.top) {
        activeDrop = { kind: 'line', insertPos: 0 };
      } else if (moveEvent.clientY > sourceRect.bottom) {
        activeDrop = { kind: 'line', insertPos: view.state.doc.length };
      }
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove, true);
      window.removeEventListener('mouseup', onUp, true);
      container.classList.remove('is-dragging-diagram');
      clearHighlights();
      if (activeDrop) {
        applyDiagramDrop(view, getPos(), activeDrop);
      }
    };

    window.addEventListener('mousemove', onMove, true);
    window.addEventListener('mouseup', onUp, true);
  });
};

export class MermaidWidget extends WidgetType {
  constructor(
    readonly code: string,
    readonly pos = 0,
    readonly customHeight: number | null = null,
    readonly align: 'left' | 'center' | 'right' = 'center',
    readonly customZoom = 100,
  ) {
    super();
  }

  private get effectiveHeight(): number | null {
    return (
      this.customHeight ?? diagramHeightsByCode.get(this.code.trim()) ?? null
    );
  }

  private get effectiveZoom(): number {
    return this.customZoom !== 100
      ? this.customZoom
      : (diagramZoomsByCode.get(this.code.trim()) ?? 100);
  }

  eq(other: MermaidWidget) {
    return (
      this.code === other.code &&
      this.pos === other.pos &&
      this.effectiveHeight === other.effectiveHeight &&
      this.effectiveZoom === other.effectiveZoom &&
      this.align === other.align
    );
  }

  toDOM(view: EditorView) {
    const dark = view.state.facet(EditorView.darkTheme);
    ensureMermaidTheme(dark);

    const container = document.createElement('div');
    container.className = 'cm-live-mermaid';
    container.dataset.mermaidCode = this.code;
    container.dataset.mermaidDark = String(dark);
    container.dataset.mermaidPos = String(this.pos);
    container.dataset.align = this.align;
    container.dataset.zoom = String(this.effectiveZoom);

    attachDiagramMoveHandle(container, view, () =>
      Number(container.dataset.mermaidPos ?? this.pos),
    );
    container.appendChild(
      createMermaidModeToolbar(this.pos, 'preview', this.effectiveZoom),
    );

    const body = document.createElement('div');
    body.className = 'cm-live-mermaid-body';
    body.textContent = i18n.t('editor.diagram.rendering');
    container.appendChild(body);

    const applyZoom = (nextZoomRaw: number) => {
      const nextZoom = Math.max(25, Math.min(300, Math.round(nextZoomRaw)));
      container.dataset.zoom = String(nextZoom);
      diagramZoomsByCode.set(this.code.trim(), nextZoom);
      const resetBtn = container.querySelector<HTMLElement>(
        '[data-mermaid-zoom="reset"]',
      );
      if (resetBtn) {
        resetBtn.dataset.zoomLabel = `${nextZoom}%`;
      }
      const svg = body.querySelector<SVGSVGElement>('svg');
      if (svg) {
        const currentHeight =
          diagramHeightsByCode.get(this.code.trim()) ?? this.effectiveHeight;
        applySvgSize(svg, currentHeight, nextZoom);
      }
      const currentPos = Number(container.dataset.mermaidPos ?? this.pos);
      persistDiagramZoom(view, currentPos, nextZoom);
    };

    container.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button !== 0) return;
      const zoomBtn = (
        event.target as HTMLElement | null
      )?.closest<HTMLElement>('button[data-mermaid-zoom]');
      if (!zoomBtn) return;
      event.preventDefault();
      event.stopPropagation();
      const currentZoom =
        Number(container.dataset.zoom) || this.effectiveZoom || 100;
      const action = zoomBtn.dataset.mermaidZoom;
      if (action === 'in') {
        applyZoom(currentZoom + 20);
      } else if (action === 'out') {
        applyZoom(currentZoom - 20);
      } else if (action === 'reset') {
        applyZoom(100);
      }
    });

    container.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        if (!event.ctrlKey && !event.metaKey) return;
        event.preventDefault();
        event.stopPropagation();
        const currentZoom =
          Number(container.dataset.zoom) || this.effectiveZoom || 100;
        const step = event.deltaY < 0 ? 10 : -10;
        applyZoom(currentZoom + step);
      },
      { passive: false },
    );

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'cm-mermaid-resize-handle';
    const resizeLabel = i18n.t(
      'editor.diagram.resize',
      'Arrastra para cambiar el tamaño del diagrama',
    );
    resizeHandle.title = resizeLabel;
    resizeHandle.setAttribute('aria-label', resizeLabel);
    resizeHandle.innerHTML = '<span class="cm-mermaid-resize-pill"></span>';
    container.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', (downEvent: MouseEvent) => {
      if (downEvent.button !== 0) return;
      downEvent.preventDefault();
      downEvent.stopPropagation();

      const svg = body.querySelector<SVGSVGElement>('svg');
      if (!svg) return;

      const currentZoom =
        Number(container.dataset.zoom) || this.effectiveZoom || 100;
      const zoomScale = Math.max(0.25, Math.min(3, currentZoom / 100));
      const startY = downEvent.clientY;
      const startRect = svg.getBoundingClientRect();
      const currentMaxH = Number.parseFloat(svg.style.maxHeight || '');
      const rawStartHeight =
        startRect.height > 0
          ? startRect.height / zoomScale
          : Number.isFinite(currentMaxH) && currentMaxH > 0
            ? currentMaxH / zoomScale
            : (this.effectiveHeight ?? DEFAULT_MAX_HEIGHT);
      let latestHeight = Math.round(rawStartHeight);

      container.classList.add('is-resizing');

      const onMove = (moveEvent: MouseEvent) => {
        const dy = moveEvent.clientY - startY;
        // 3x speed when stretching downward so tall vertical flowcharts zoom up
        // quickly in a single short drag without hitting the bottom of the screen.
        const delta = (dy > 0 ? dy * 3 : dy) / zoomScale;
        latestHeight = Math.max(
          100,
          Math.min(3200, Math.round(rawStartHeight + delta)),
        );
        applySvgSize(svg, latestHeight, currentZoom);
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove, true);
        window.removeEventListener('mouseup', onUp, true);
        container.classList.remove('is-resizing');
        diagramHeightsByCode.set(this.code.trim(), latestHeight);
        const currentPos = Number(container.dataset.mermaidPos ?? this.pos);
        persistDiagramHeight(view, currentPos, latestHeight);
      };

      window.addEventListener('mousemove', onMove, true);
      window.addEventListener('mouseup', onUp, true);
    });

    const showError = () => {
      container.classList.add('cm-live-mermaid-error');
      body.textContent = i18n.t('editor.diagram.error');
    };

    const initialHeight = this.effectiveHeight;
    const initialZoom = this.effectiveZoom;
    const id = `cm-mermaid-${Date.now()}-${renderCounter++}`;
    resolveValidMermaidCode(this.code)
      .then((validCode) => {
        if (!validCode) {
          showError();
          return;
        }
        return mermaid.render(id, validCode).then(({ svg }) => {
          container.classList.remove('cm-live-mermaid-error');
          body.innerHTML = svg;
          const svgEl = body.querySelector<SVGSVGElement>('svg');
          if (svgEl) {
            const currentZoom =
              Number(container.dataset.zoom) ||
              diagramZoomsByCode.get(this.code.trim()) ||
              initialZoom;
            applySvgSize(
              svgEl,
              diagramHeightsByCode.get(this.code.trim()) ?? initialHeight,
              currentZoom,
            );
          }
        });
      })
      .catch(showError)
      .finally(() => removeLeftovers(id, container));

    return container;
  }

  updateDOM(dom: HTMLElement, view: EditorView) {
    const dark = view.state.facet(EditorView.darkTheme);
    if (
      dom.dataset.mermaidCode !== this.code ||
      dom.dataset.mermaidDark !== String(dark)
    ) {
      return false;
    }
    dom.dataset.mermaidPos = String(this.pos);
    dom.dataset.align = this.align;
    dom.dataset.zoom = String(this.effectiveZoom);
    const resetBtn = dom.querySelector<HTMLElement>(
      '[data-mermaid-zoom="reset"]',
    );
    if (resetBtn) {
      resetBtn.dataset.zoomLabel = `${this.effectiveZoom}%`;
    }
    dom.querySelectorAll<HTMLElement>('[data-mermaid-pos]').forEach((btn) => {
      btn.dataset.mermaidPos = String(this.pos);
    });
    const svgEl = dom.querySelector<SVGSVGElement>('.cm-live-mermaid-body svg');
    if (svgEl) {
      applySvgSize(svgEl, this.effectiveHeight, this.effectiveZoom);
    }
    return true;
  }

  ignoreEvent(event: Event) {
    return Boolean(
      (event.target as HTMLElement | null)?.closest?.(
        '.cm-mermaid-resize-handle, .cm-mermaid-drag-handle, button[data-mermaid-zoom]',
      ),
    );
  }
}

export class MermaidRowWidget extends WidgetType {
  constructor(readonly items: MermaidWidget[]) {
    super();
  }

  eq(other: MermaidRowWidget) {
    return (
      this.items.length === other.items.length &&
      this.items.every((item, i) => item.eq(other.items[i]))
    );
  }

  toDOM(view: EditorView) {
    const row = document.createElement('div');
    row.className = 'cm-live-mermaid-row';
    for (const item of this.items) {
      row.appendChild(item.toDOM(view));
    }
    return row;
  }

  ignoreEvent(event: Event) {
    return Boolean(
      (event.target as HTMLElement | null)?.closest?.(
        '.cm-mermaid-resize-handle, .cm-mermaid-drag-handle, button[data-mermaid-zoom]',
      ),
    );
  }
}
