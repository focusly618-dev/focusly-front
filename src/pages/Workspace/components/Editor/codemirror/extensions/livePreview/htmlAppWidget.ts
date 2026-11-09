import { EditorView, WidgetType } from '@codemirror/view';
import i18n from '@/i18n';
import { createMermaidModeToolbar } from './mermaidWidget';

// Only scripts: without allow-same-origin the block has an opaque origin, so
// it can't reach the session, the cookies, storage or this page; and without
// the others it can't open windows, submit forms or move the app's tab.
export const HTML_APP_SANDBOX = 'allow-scripts';

// Everything it needs travels inside the block: nothing leaves or comes in
// over the network. A second policy written in the block can only narrow
// this one, never widen it.
export const HTML_APP_CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  'img-src data: blob:',
  'font-src data:',
  'media-src data: blob:',
  "form-action 'none'",
  "base-uri 'none'",
].join('; ');

const MIN_HEIGHT = 60;
const MAX_HEIGHT = 720;
const HEIGHT_MESSAGE = 'focuslyHtmlAppHeight';

// Blocks the user ran since the app was opened. On purpose only in memory: if
// a block hangs the tab, reloading brings its "Run" button back, so the
// document can still be opened and fixed.
const approved = new Set<string>();

// A block always fills the width of where it sits, whatever it was written
// with: a narrow or centered page can't shrink it, and nothing overflows it.
export const HTML_APP_FULL_WIDTH =
  '*,*::before,*::after{box-sizing:border-box}html,body{display:block!important;width:100%!important;max-width:none!important;margin:0!important}body>*{max-width:100%!important}img,svg,video,canvas,table{max-width:100%}';

const reportHeight = `(function(){var last=0;function send(){var h=document.documentElement.getBoundingClientRect().height;if(h!==last){last=h;var m={};m['${HEIGHT_MESSAGE}']=h;parent.postMessage(m,'*');}}new ResizeObserver(send).observe(document.documentElement);addEventListener('load',send);document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(a&&a.getAttribute('href').charAt(0)!=='#')e.preventDefault();});})();`;

/** The page a block runs as. The policy goes first, before anything the
 * block wrote can run. */
export const buildHtmlAppDocument = (code: string, dark: boolean): string =>
  `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${HTML_APP_CSP}"><style>:root{color-scheme:${dark ? 'dark' : 'light'}}${HTML_APP_FULL_WIDTH}html{display:flow-root!important}body{padding:12px 14px;font:15px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;color:${dark ? '#e7e7ea' : '#1f2328'};background:transparent}button,input,select,textarea{font:inherit}</style><script>${reportHeight}</script></head><body>${code}</body></html>`;

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const relayHeight = `var f=document.querySelector('iframe');addEventListener('message',function(e){var h=e.source===f.contentWindow&&e.data&&e.data['${HEIGHT_MESSAGE}'];if(typeof h==='number'){var m={};m['${HEIGHT_MESSAGE}']=h;parent.postMessage(m,'*');}});`;

/**
 * The frame around a block. The sandbox can't stop a frame navigating itself,
 * and another site shown here could pass for Focusly. But the browser checks
 * a frame's navigations against the policy of the page that holds it, and
 * this one allows none: the block can only ever show its own page.
 */
export const buildHtmlAppShell = (page: string): string =>
  `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${HTML_APP_CSP}"><style>html,body{margin:0;height:100%}iframe{display:block;width:100%;height:100%;border:0}</style></head><body><iframe sandbox="${HTML_APP_SANDBOX}" srcdoc="${escapeAttribute(page)}"></iframe><script>${relayHeight}</script></body></html>`;

export const htmlAppModeLabels = () => ({
  preview: i18n.t('editor.htmlApp.previewMode'),
  code: i18n.t('editor.htmlApp.codeMode'),
});

/** Puts the running block in `stage`; returns what takes it down. */
const mountFrame = (
  stage: HTMLElement,
  srcdoc: string,
  view: EditorView,
): (() => void) => {
  const frame = document.createElement('iframe');
  frame.className = 'cm-html-app-frame';
  frame.setAttribute('sandbox', HTML_APP_SANDBOX);
  frame.setAttribute('referrerpolicy', 'no-referrer');
  frame.title = i18n.t('editor.htmlApp.badge');
  frame.srcdoc = srcdoc;

  const onMessage = (event: MessageEvent) => {
    if (event.source !== frame.contentWindow) return;
    const height = (event.data as Record<string, unknown> | null)?.[
      HEIGHT_MESSAGE
    ];
    if (typeof height !== 'number' || !Number.isFinite(height)) return;
    const clamped = Math.min(
      MAX_HEIGHT,
      Math.max(MIN_HEIGHT, Math.ceil(height)),
    );
    frame.style.height = `${clamped}px`;
    view.requestMeasure();
  };

  window.addEventListener('message', onMessage);
  stage.replaceChildren(frame);

  return () => {
    window.removeEventListener('message', onMessage);
    frame.remove();
  };
};

const teardowns = new WeakMap<HTMLElement, () => void>();

/**
 * A ```html-app block: HTML, CSS and JavaScript that run isolated from the
 * app, for what is meant to be used rather than read (a calculator, a quiz, a
 * simulator). It's still one fenced block of text in the document's Markdown.
 */
export class HtmlAppWidget extends WidgetType {
  constructor(
    readonly code: string,
    readonly pos: number,
  ) {
    super();
  }

  eq(other: HtmlAppWidget) {
    return this.code === other.code && this.pos === other.pos;
  }

  get estimatedHeight() {
    return 120;
  }

  // Typing above the block only moves it: it keeps running as it is
  updateDOM(dom: HTMLElement, view: EditorView) {
    const dark = view.state.facet(EditorView.darkTheme);
    if (
      dom.dataset.htmlAppCode !== this.code ||
      dom.dataset.htmlAppDark !== String(dark)
    ) {
      return false;
    }
    dom
      .querySelectorAll<HTMLElement>('[data-mermaid-pos]')
      .forEach((button) => {
        button.dataset.mermaidPos = String(this.pos);
      });
    return true;
  }

  toDOM(view: EditorView) {
    const { code, pos } = this;
    const dark = view.state.facet(EditorView.darkTheme);
    const container = document.createElement('div');
    container.className = 'cm-live-html-app';
    container.dataset.htmlAppCode = code;
    container.dataset.htmlAppDark = String(dark);

    const header = document.createElement('div');
    header.className = 'cm-html-app-header';
    const badge = document.createElement('span');
    badge.className = 'cm-code-lang-badge';
    badge.textContent = i18n.t('editor.htmlApp.badge');
    const stopButton = document.createElement('button');
    stopButton.type = 'button';
    stopButton.className = 'cm-html-app-stop';
    stopButton.textContent = i18n.t('editor.htmlApp.stop');
    stopButton.hidden = true;
    header.append(
      badge,
      stopButton,
      createMermaidModeToolbar(pos, 'preview', 100, htmlAppModeLabels()),
    );

    const stage = document.createElement('div');
    stage.className = 'cm-html-app-stage';
    container.append(header, stage);

    let unmount: (() => void) | null = null;
    const takeDown = () => {
      unmount?.();
      unmount = null;
    };

    const showGate = (message: string) => {
      takeDown();
      stopButton.hidden = true;
      const gate = document.createElement('div');
      gate.className = 'cm-html-app-gate';
      const text = document.createElement('span');
      text.textContent = message;
      const runButton = document.createElement('button');
      runButton.type = 'button';
      runButton.className = 'cm-html-app-run';
      runButton.textContent = i18n.t('editor.htmlApp.run');
      runButton.addEventListener('click', run);
      gate.append(text, runButton);
      stage.replaceChildren(gate);
      view.requestMeasure();
    };

    const run = () => {
      approved.add(code);
      takeDown();
      stopButton.hidden = false;
      unmount = mountFrame(
        stage,
        buildHtmlAppShell(buildHtmlAppDocument(code, dark)),
        view,
      );
      view.requestMeasure();
    };

    stopButton.addEventListener('click', () => {
      approved.delete(code);
      showGate(i18n.t('editor.htmlApp.gate'));
    });
    teardowns.set(container, takeDown);

    if (approved.has(code)) run();
    else showGate(i18n.t('editor.htmlApp.gate'));
    return container;
  }

  destroy(dom: HTMLElement) {
    teardowns.get(dom)?.();
  }

  // The block's own buttons work by themselves; the view/code toggle is
  // handled by the editor, like a diagram's
  ignoreEvent(event: Event) {
    return !(event.target as HTMLElement | null)?.closest?.(
      '[data-mermaid-mode]',
    );
  }
}
