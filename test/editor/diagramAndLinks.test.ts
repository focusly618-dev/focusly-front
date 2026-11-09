import { afterEach, describe, expect, it } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { ensureSyntaxTree } from '@codemirror/language';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';
import { createImperativeApi } from '@/pages/Workspace/components/Editor/codemirror/imperativeApi';
import {
  asMermaidBlock,
  diagramPrompt,
} from '@/pages/Workspace/components/Editor/components/EditorContent/diagram.utils';

let views: EditorView[] = [];
const api = (doc: string) => {
  const view = new EditorView({
    state: EditorState.create({ doc, extensions: [markdownExtension] }),
    parent: document.body,
  });
  ensureSyntaxTree(view.state, view.state.doc.length, 5000);
  views.push(view);
  return { view, editor: createImperativeApi(() => view) };
};

afterEach(() => {
  views.forEach((v) => v.destroy());
  views = [];
});

describe('asMermaidBlock', () => {
  const code = 'flowchart TD\n  A[Usuario] --> B[Servidor]';

  it.each([
    ['bare code', code],
    ['a mermaid fence', `\`\`\`mermaid\n${code}\n\`\`\``],
    ['an unlabelled fence', `\`\`\`\n${code}\n\`\`\``],
    [
      'a fence inside other text',
      `Aquí está:\n\n\`\`\`mermaid\n${code}\n\`\`\`\n\nListo.`,
    ],
  ])('takes %s', (_, reply) => {
    expect(asMermaidBlock(reply)).toBe(`\`\`\`mermaid\n${code}\n\`\`\``);
  });

  it('refuses what is not Mermaid', () => {
    expect(asMermaidBlock('+-----+\n| Usuario |\n+-----+')).toBeNull();
    expect(asMermaidBlock('Lo siento, no puedo.')).toBeNull();
  });

  it('asks for quoted labels and a single fenced block', () => {
    const prompt = diagramPrompt('1. Login');
    expect(prompt).toContain('```mermaid');
    expect(prompt).toContain('double quotes');
    expect(prompt).toContain('1. Login');
  });
});

describe('editor API', () => {
  it('fencedBlockAt: the whole code block around a position', () => {
    const doc = 'Intro\n\n```\n+---+\n| A |\n+---+\n```\n\nFin';
    const { editor } = api(doc);
    const block = editor.fencedBlockAt(doc.indexOf('| A |'));
    expect(block?.text).toBe('```\n+---+\n| A |\n+---+\n```');
    expect(editor.fencedBlockAt(doc.indexOf('Fin'))).toBeNull();
  });

  it('linkAt: a link with its address', () => {
    const doc = 'Ver [el sitio](https://cafe.example) hoy';
    const { editor } = api(doc);
    const link = editor.linkAt(doc.indexOf('sitio'));
    expect(link).toMatchObject({
      text: 'el sitio',
      url: 'https://cafe.example',
    });
    expect(doc.slice(link!.urlFrom, link!.urlTo)).toBe('https://cafe.example');
    expect(editor.linkAt(doc.indexOf('hoy'))).toBeNull();
  });

  it('linkAt: not a canvas link (it opens its canvas) nor an image', () => {
    const doc = '[🎨 Plan](#canvas-123) y ![foto](https://img.example/a.png)';
    const { editor } = api(doc);
    expect(editor.linkAt(doc.indexOf('Plan'))).toBeNull();
    expect(editor.linkAt(doc.indexOf('foto'))).toBeNull();
  });
});
