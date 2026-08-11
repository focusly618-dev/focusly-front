import { WidgetType } from '@codemirror/view';
import katex from 'katex';

// Unlike Mermaid, KaTeX's renderToString is synchronous, so toDOM can render
// directly instead of needing a placeholder-then-mutate step.
export class MathWidget extends WidgetType {
  constructor(
    readonly source: string,
    readonly displayMode: boolean,
  ) {
    super();
  }

  eq(other: MathWidget) {
    return (
      this.source === other.source && this.displayMode === other.displayMode
    );
  }

  toDOM() {
    const container = document.createElement(this.displayMode ? 'div' : 'span');
    container.className = this.displayMode
      ? 'cm-live-math-block'
      : 'cm-live-math-inline';
    try {
      container.innerHTML = katex.renderToString(this.source, {
        displayMode: this.displayMode,
        throwOnError: false,
      });
    } catch (error: unknown) {
      container.classList.add('cm-live-math-error');
      container.textContent = `Math error: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
    return container;
  }

  ignoreEvent() {
    return false;
  }
}
