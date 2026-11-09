import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { ensureSyntaxTree } from '@codemirror/language';
import i18n from '@/i18n';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';
import { livePreviewExtensions } from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview';
import {
  applySlashItem,
  SLASH_ITEMS,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/slashMenu';
import {
  buildHtmlAppDocument,
  buildHtmlAppShell,
  HTML_APP_CSP,
  HTML_APP_SANDBOX,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview/htmlAppWidget';

let views: EditorView[] = [];

const editor = (doc: string, cursor = doc.length) => {
  const view = new EditorView({
    state: EditorState.create({
      doc,
      selection: { anchor: cursor },
      extensions: [markdownExtension, livePreviewExtensions],
    }),
    parent: document.body,
  });
  ensureSyntaxTree(view.state, view.state.doc.length, 5000);
  view.dispatch({ selection: { anchor: cursor } });
  views.push(view);
  return view;
};

const block = (code: string) =>
  `Intro\n\n\`\`\`html-app\n${code}\n\`\`\`\n\nFin`;

const run = (view: EditorView) =>
  view.dom.querySelector<HTMLButtonElement>('.cm-html-app-run')!.click();

beforeAll(async () => {
  await i18n.changeLanguage('es');
});

afterEach(() => {
  views.forEach((v) => v.destroy());
  views = [];
});

describe('the page a block runs as', () => {
  it('has no way out to the session or the network', () => {
    expect(HTML_APP_SANDBOX).toBe('allow-scripts');
    expect(HTML_APP_CSP).toContain("default-src 'none'");
    expect(HTML_APP_CSP).not.toMatch(/https?:|\*|'self'/);
  });

  it('sets the policy before anything the block wrote', () => {
    const page = buildHtmlAppDocument('<script>go()</script>', false);
    const policy = page.indexOf('Content-Security-Policy');
    expect(policy).toBeGreaterThan(-1);
    expect(policy).toBeLessThan(page.indexOf('<script>go()'));
  });

  it('always fills its container, even written narrow or centered', () => {
    const page = buildHtmlAppDocument(
      '<style>body{max-width:400px;margin:auto}</style>',
      false,
    );
    expect(page.indexOf('max-width:none!important')).toBeGreaterThan(-1);
    expect(page).toContain('width:100%!important');
    expect(page).toContain('display:block!important');
    expect(page).toContain('body>*{max-width:100%!important}');
  });

  it('holds the block in a frame that allows no other page', () => {
    const shell = buildHtmlAppShell('<a title="x" href="?a&b">y</a>');
    const inner = new DOMParser()
      .parseFromString(shell, 'text/html')
      .querySelector('iframe')!;
    expect(shell.indexOf('Content-Security-Policy')).toBeLessThan(
      shell.indexOf('<iframe'),
    );
    expect(inner.getAttribute('sandbox')).toBe('allow-scripts');
    // The block's own quotes can't break out of the attribute it travels in
    expect(inner.getAttribute('srcdoc')).toBe('<a title="x" href="?a&b">y</a>');
  });
});

describe('the html-app block', () => {
  it("doesn't run until the user says so", () => {
    const view = editor(block('<b>uno</b>'));
    expect(view.dom.querySelector('.cm-live-html-app')).not.toBeNull();
    expect(view.dom.querySelector('iframe')).toBeNull();
    expect(view.dom.textContent).not.toContain('<b>uno</b>');
  });

  it('runs sandboxed, and only that block is remembered', () => {
    const view = editor(block('<b>dos</b>'));
    run(view);
    const frame = view.dom.querySelector('iframe')!;
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts');
    expect(frame.srcdoc).toContain('<b>dos</b>');

    expect(
      editor(block('<b>dos</b>')).dom.querySelector('iframe'),
    ).not.toBeNull();
    expect(editor(block('<b>otro</b>')).dom.querySelector('iframe')).toBeNull();
  });

  it('Stop takes it down and asks again', () => {
    const view = editor(block('<b>tres</b>'));
    run(view);
    view.dom.querySelector<HTMLButtonElement>('.cm-html-app-stop')!.click();
    expect(view.dom.querySelector('iframe')).toBeNull();
    expect(view.dom.querySelector('.cm-html-app-run')).not.toBeNull();
    expect(editor(block('<b>tres</b>')).dom.querySelector('iframe')).toBeNull();
  });

  it('takes its height only from its own frame, within limits', () => {
    const view = editor(block('<b>cuatro</b>'));
    run(view);
    const frame = view.dom.querySelector('iframe')!;
    const send = (height: unknown, source: MessageEventSource | null) =>
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { focuslyHtmlAppHeight: height },
          source,
        }),
      );

    send(300, frame.contentWindow);
    expect(frame.style.height).toBe('300px');
    send(99999, frame.contentWindow);
    expect(frame.style.height).toBe('720px');
    send('1px', frame.contentWindow);
    expect(frame.style.height).toBe('720px');
    send(200, null);
    expect(frame.style.height).toBe('720px');
  });

  it('keeps running when text above it moves it', () => {
    const view = editor(block('<b>cinco</b>'));
    run(view);
    const frame = view.dom.querySelector('iframe')!;
    view.dispatch({ changes: { from: 0, insert: 'Más ' } });
    expect(view.dom.querySelector('iframe')).toBe(frame);
    expect(
      view.dom.querySelector<HTMLElement>('[data-mermaid-mode="code"]')!.dataset
        .mermaidPos,
    ).toBe(String(view.state.doc.toString().indexOf('```')));
  });

  it('a plain html code block stays as code', () => {
    const view = editor('Intro\n\n```html\n<b>x</b>\n```\n\nFin');
    expect(view.dom.querySelector('.cm-live-html-app')).toBeNull();
    expect(view.dom.textContent).toContain('<b>x</b>');
  });

  it('"/" opens a new block as code, with the toggle', () => {
    const view = editor('/');
    applySlashItem(
      view,
      SLASH_ITEMS.find((i) => i.id === 'interactive')!,
      0,
      1,
    );
    expect(view.state.doc.toString()).toContain('```html-app');
    expect(view.dom.querySelector('.cm-live-html-app')).toBeNull();
    expect(
      view.dom.querySelector('[data-mermaid-mode="preview"]'),
    ).not.toBeNull();
    expect(view.dom.querySelector('.cm-code-lang-badge')?.textContent).toBe(
      'Bloque interactivo',
    );
  });
});
