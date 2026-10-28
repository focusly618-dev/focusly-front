import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { ensureSyntaxTree } from '@codemirror/language';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';
import { livePreviewExtensions } from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview';
import { setCalloutFold } from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview/foldState';
import { createImperativeApi } from '@/pages/Workspace/components/Editor/codemirror/imperativeApi';
import {
  normalizeInsertedMarkdown,
  prepareMarkdownInsert,
} from '@/pages/Workspace/components/Editor/codemirror/markdownInsert';
import { applyFragment } from '@/pages/Workspace/components/Editor/components/EditorAskAI/editorAssistant.utils';

if (typeof window !== 'undefined') {
  window.Range.prototype.getClientRects = () => [] as unknown as DOMRectList;
  window.Range.prototype.getBoundingClientRect = () =>
    ({ top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 }) as DOMRect;
}

const TABLE = '| Capa | Estado |\n|------|--------|\n| Red | Activo |';

/** The top-level blocks markdown reads in a document. */
const blocks = (doc: string): string[] => {
  const state = EditorState.create({ doc, extensions: [markdownExtension] });
  const tree = ensureSyntaxTree(state, doc.length, 5000)!;
  const out: string[] = [];
  tree.iterate({
    enter: (n) => {
      if (n.node.parent?.name === 'Document') out.push(n.name);
    },
  });
  return out;
};

/** An editor with the live preview, the cursor parked at the very start. */
const render = (doc: string) =>
  new EditorView({
    state: EditorState.create({
      doc,
      selection: { anchor: 0 },
      extensions: [markdownExtension, livePreviewExtensions],
    }),
  });

describe('text inserted from the AI', () => {
  it('gives a table its own lines when it lands mid-sentence', () => {
    const doc = 'Resumen de capas';
    const insert = prepareMarkdownInsert(doc, doc.length, doc.length, TABLE);
    expect(blocks(doc + insert)).toEqual(['Paragraph', 'Table']);
  });

  it('keeps text after an inserted table from becoming one of its rows', () => {
    const doc = 'Antes\n\nDespués';
    const insert = prepareMarkdownInsert(doc, 7, 7, TABLE);
    expect(blocks(doc.slice(0, 7) + insert + doc.slice(7))).toEqual([
      'Paragraph',
      'Table',
      'Paragraph',
    ]);
  });

  it('adds nothing where the blank lines are already there, or at the edges', () => {
    expect(prepareMarkdownInsert('', 0, 0, TABLE)).toBe(TABLE);
    expect(prepareMarkdownInsert('Antes\n\n', 7, 7, TABLE)).toBe(TABLE);
  });

  it('leaves a few words alone, mid-sentence', () => {
    expect(prepareMarkdownInsert('Hola mundo', 5, 5, 'gran ')).toBe('gran ');
  });

  it('unwraps a reply sent whole inside a ```markdown fence, and Windows newlines', () => {
    expect(
      normalizeInsertedMarkdown('```markdown\n# Título\n\nTexto\n```'),
    ).toBe('# Título\n\nTexto');
    expect(normalizeInsertedMarkdown('a\r\nb')).toBe('a\nb');
    // A real code sample stays a code sample
    expect(normalizeInsertedMarkdown('```js\nx()\n```')).toBe(
      '```js\nx()\n```',
    );
  });

  it('applies the same to a fragment Lumina proposes as an edit', () => {
    const proposed = applyFragment(
      { doc: 'Intro del documento', from: 19, to: 19 },
      '```text\n[A] ---> [B]\n```',
    );
    expect(blocks(proposed)).toEqual(['Paragraph', 'FencedCode']);
  });

  it('inserts at the cursor through the editor with the block on its own lines', () => {
    const view = render('Resumen de capas');
    view.dispatch({ selection: { anchor: 16 } });
    createImperativeApi(() => view).insertAtCursor(TABLE);
    expect(blocks(view.state.doc.toString())).toEqual(['Paragraph', 'Table']);
  });
});

describe('block math', () => {
  it('starts right under a paragraph line, like a code fence', () => {
    expect(blocks('Texto\n$$\nx^2\n$$')).toEqual(['Paragraph', 'MathBlock']);
  });
});

describe('fences drawn as what they describe', () => {
  it('draws ```math as a formula', () => {
    const view = render('Intro\n\n```math\n\\sqrt{3}\n```');
    expect(view.dom.querySelector('.cm-live-math-block .katex')).not.toBeNull();
  });

  it('draws ```geojson as a map of its shapes', () => {
    const geo = JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-99.13, 19.43] },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-99.3, 19.2],
                [-98.9, 19.2],
                [-98.9, 19.6],
                [-99.3, 19.2],
              ],
            ],
          },
        },
      ],
    });
    const view = render(`Intro\n\n\`\`\`geojson\n${geo}\n\`\`\``);
    const map = view.dom.querySelector('.cm-live-geojson');
    expect(map?.querySelector('path.area')).not.toBeNull();
    expect(map?.querySelector('circle.point')).not.toBeNull();
    expect(map?.textContent).toContain('2 geometrías');
  });

  it('says so when the GeoJSON is broken, instead of failing', () => {
    const view = render('Intro\n\n```geojson\n{ not json\n```');
    expect(view.dom.querySelector('.cm-live-geojson-error')).not.toBeNull();
  });

  it('keeps ordinary code as highlighted code', () => {
    const view = render('Intro\n\n```text\n[A] ---> [B]\n```');
    expect(view.dom.querySelector('.cm-code-block-line')).not.toBeNull();
    // The bracketed words are drawing, not links
    expect(view.dom.querySelector('.cm-live-link')).toBeNull();
  });
});

describe('collapsed sections', () => {
  const DETAILS =
    'Intro\n\n<details>\n<summary>Ver detalles</summary>\n\nTexto **oculto**\n\n</details>\n\nFin';

  it('shows only the summary until opened', () => {
    const view = render(DETAILS);
    const header = view.dom.querySelector<HTMLElement>(
      '.cm-live-details-header',
    );
    expect(header?.textContent).toContain('Ver detalles');
    expect(header?.getAttribute('aria-expanded')).toBe('false');
    expect(view.dom.textContent).not.toContain('oculto');
    expect(view.dom.textContent).not.toContain('<details>');
  });

  it('opens on a toggle, showing its body and hiding the tags', () => {
    const view = render(DETAILS);
    view.dispatch({
      effects: setCalloutFold.of({
        pos: DETAILS.indexOf('<details>'),
        folded: false,
      }),
    });
    expect(view.dom.textContent).toContain('oculto');
    expect(view.dom.querySelector('.cm-live-details-body')).not.toBeNull();
    expect(view.dom.textContent).not.toContain('</details>');
  });

  it('starts open when written <details open>', () => {
    const view = render(DETAILS.replace('<details>', '<details open>'));
    expect(view.dom.textContent).toContain('oculto');
  });

  it('leaves <details> inside a code block as code', () => {
    const view = render(
      'Intro\n\n```html\n<details>\n<summary>S</summary>\n</details>\n```',
    );
    expect(view.dom.querySelector('.cm-live-details-header')).toBeNull();
  });
});

describe('while an AI edit is under review', () => {
  it('shows a table it touches as text, so the changes can be seen', async () => {
    const { diffReviewExtensions, setPendingDiff } =
      await import('@/pages/Workspace/components/Editor/codemirror/extensions/diffReview');
    const doc = `Intro\n\n${TABLE}`;
    const view = new EditorView({
      state: EditorState.create({
        doc,
        selection: { anchor: 0 },
        extensions: [
          markdownExtension,
          livePreviewExtensions,
          diffReviewExtensions,
        ],
      }),
    });
    expect(view.dom.querySelector('.cm-live-table')).not.toBeNull();

    const at = doc.indexOf('Activo');
    view.dispatch({
      effects: setPendingDiff.of([{ from: at, to: at + 6, kind: 'add' }]),
    });
    expect(view.dom.querySelector('.cm-live-table')).toBeNull();
    expect(view.dom.textContent).toContain('| Red | Activo |');
  });
});
