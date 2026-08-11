import { WidgetType, EditorView } from '@codemirror/view';
import mermaid from 'mermaid';

let lastInitializedDark: boolean | null = null;
let renderCounter = 0;

const ensureMermaidTheme = (isDark: boolean) => {
  if (lastInitializedDark === isDark) return;
  lastInitializedDark = isDark;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: isDark ? 'dark' : 'default',
  });
};

export class MermaidWidget extends WidgetType {
  constructor(readonly code: string) {
    super();
  }

  eq(other: MermaidWidget) {
    return this.code === other.code;
  }

  toDOM(view: EditorView) {
    ensureMermaidTheme(view.state.facet(EditorView.darkTheme));

    const container = document.createElement('div');
    container.className = 'cm-live-mermaid';
    container.textContent = 'Rendering diagram…';

    const id = `cm-mermaid-${Date.now()}-${renderCounter++}`;
    mermaid
      .render(id, this.code)
      .then(({ svg }) => {
        container.innerHTML = svg;
      })
      .catch((error: unknown) => {
        container.classList.add('cm-live-mermaid-error');
        container.textContent = `Mermaid error: ${
          error instanceof Error ? error.message : String(error)
        }`;
      });

    return container;
  }

  ignoreEvent() {
    return false;
  }
}
