import { WidgetType, EditorView } from '@codemirror/view';
import mermaid from 'mermaid';
import i18n from '@/i18n';

let lastInitializedDark: boolean | null = null;
let renderCounter = 0;

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

/** Builds the two-icon toggle bar (Eye = rendered diagram, `</>` = Markdown code). */
export const createMermaidModeToolbar = (
  pos: number,
  activeMode: 'preview' | 'code',
): HTMLElement => {
  const toolbar = document.createElement('div');
  toolbar.className = 'cm-mermaid-toolbar';

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

export class MermaidWidget extends WidgetType {
  constructor(
    readonly code: string,
    readonly pos = 0,
  ) {
    super();
  }

  eq(other: MermaidWidget) {
    return this.code === other.code && this.pos === other.pos;
  }

  toDOM(view: EditorView) {
    const dark = view.state.facet(EditorView.darkTheme);
    ensureMermaidTheme(dark);

    const container = document.createElement('div');
    container.className = 'cm-live-mermaid';
    container.appendChild(createMermaidModeToolbar(this.pos, 'preview'));

    const body = document.createElement('div');
    body.className = 'cm-live-mermaid-body';
    body.textContent = i18n.t('editor.diagram.rendering');
    container.appendChild(body);

    const showError = () => {
      container.classList.add('cm-live-mermaid-error');
      body.textContent = i18n.t('editor.diagram.error');
    };

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
        });
      })
      .catch(showError)
      .finally(() => removeLeftovers(id, container));

    return container;
  }

  ignoreEvent() {
    return false;
  }
}
