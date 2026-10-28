import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';
import { livePreviewPlugin } from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview';

const ID = '3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b';

// By default the cursor sits at the very start, away from the canvas links,
// so they render collapsed — the way they look while not being edited.
const render = (doc: string, cursor = 0) =>
  new EditorView({
    state: EditorState.create({
      doc,
      selection: { anchor: cursor },
      extensions: [markdownExtension, livePreviewPlugin],
    }),
  }).contentDOM;

describe('canvas links in the live preview', () => {
  it('shows a link alone on its line as a full-width card', () => {
    const dom = render(`Intro\n\n[🧠 Ideas](#canvas-${ID})\n\nOutro`);

    const card = dom.querySelector<HTMLElement>('.cm-canvas-card');
    expect(card).not.toBeNull();
    expect(card?.dataset).toMatchObject({
      canvasId: ID,
      canvasName: 'Ideas',
      canvasIcon: '🧠',
    });
    expect(card?.querySelector('.cm-canvas-card-icon')?.textContent).toBe('🧠');
    expect(card?.querySelector('.cm-canvas-card-title')?.textContent).toBe(
      'Ideas',
    );
    expect(card?.querySelector('.cm-canvas-card-action')?.textContent).toBe(
      'Abrir canvas',
    );
    // The markdown itself is hidden behind the card
    expect(dom.textContent).not.toContain('#canvas-');
  });

  it('gives a card without an icon the default one', () => {
    const dom = render(`Intro\n\n[Ideas](#canvas-${ID})`);
    expect(
      dom.querySelector<HTMLElement>('.cm-canvas-card')?.dataset.canvasIcon,
    ).toBe('🎨');
  });

  it('shows the markdown again while the cursor is on it', () => {
    const doc = `Intro\n\n[🧠 Ideas](#canvas-${ID})`;
    const dom = render(doc, doc.indexOf('Ideas'));

    expect(dom.querySelector('.cm-canvas-card')).toBeNull();
    expect(dom.textContent).toContain(`(#canvas-${ID})`);
  });

  it('keeps a link inside a sentence inline, with its icon apart', () => {
    const dom = render(`Intro\n\nSee [🧠 Ideas](#canvas-${ID}) for more`);

    expect(dom.querySelector('.cm-canvas-card')).toBeNull();
    expect(dom.querySelector('.cm-canvas-icon')?.textContent).toBe('🧠');
    expect(dom.querySelector('.cm-canvas-title')?.textContent).toBe('Ideas');
  });

  it('leaves ordinary links alone', () => {
    const dom = render('Intro\n\n[docs](https://example.com)');

    expect(dom.querySelector('.cm-canvas-card')).toBeNull();
    expect(dom.querySelector('.cm-canvas-title')).toBeNull();
  });
});
