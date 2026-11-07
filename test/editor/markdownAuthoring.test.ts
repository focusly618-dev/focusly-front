import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { EditorSelection, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { CompletionContext } from '@codemirror/autocomplete';
import i18n from '@/i18n';
import {
  insertLink,
  toggleBlock,
  toggleInline,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/formatting';
import {
  applySlashItem,
  matchSlashItems,
  SLASH_ITEMS,
  slashSource,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/slashMenu';
import { htmlToMarkdown } from '@/pages/Workspace/components/Editor/codemirror/extensions/htmlPaste';
import {
  handleMarkupBackspace,
  markupEditingExtensions,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/markupEditing';
import { livePreviewPlugin } from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';

let views: EditorView[] = [];

/** An editor holding `doc`, with the selection where `[` `]` are (or the
 * cursor at `|`). */
const editor = (doc: string) => {
  let anchor = doc.indexOf('[');
  let head: number;
  let text: string;
  if (anchor >= 0 && doc.includes(']')) {
    text = doc.replace('[', '').replace(']', '');
    head = doc.indexOf(']') - 1;
  } else {
    anchor = doc.indexOf('|');
    text = doc.replace('|', '');
    head = anchor;
  }
  const view = new EditorView({
    state: EditorState.create({
      doc: text,
      selection: EditorSelection.single(anchor, head),
      extensions: [
        markdownExtension,
        livePreviewPlugin,
        ...markupEditingExtensions,
      ],
    }),
    parent: document.body,
  });
  views.push(view);
  return view;
};

const docOf = (view: EditorView) => view.state.doc.toString();
const selected = (view: EditorView) =>
  view.state.sliceDoc(
    view.state.selection.main.from,
    view.state.selection.main.to,
  );

beforeAll(async () => {
  await i18n.changeLanguage('es');
});

afterEach(() => {
  views.forEach((v) => v.destroy());
  views = [];
});

describe('inline formatting', () => {
  it('wraps the selection and keeps it selected', () => {
    const view = editor('hola [mundo] bonito');
    toggleInline(view, 'bold');
    expect(docOf(view)).toBe('hola **mundo** bonito');
    expect(selected(view)).toBe('mundo');
  });

  it('unwraps when applied again (from inside or around)', () => {
    const inside = editor('hola **[mundo]** bonito');
    toggleInline(inside, 'bold');
    expect(docOf(inside)).toBe('hola mundo bonito');

    const around = editor('hola [**mundo**] bonito');
    toggleInline(around, 'bold');
    expect(docOf(around)).toBe('hola mundo bonito');
  });

  it("italic doesn't strip a bold's stars", () => {
    const view = editor('**[mundo]**');
    toggleInline(view, 'italic');
    expect(docOf(view)).toBe('***mundo***');
  });

  it('an empty selection gets an empty pair with the cursor inside', () => {
    const view = editor('a |b');
    toggleInline(view, 'strike');
    expect(docOf(view)).toBe('a ~~~~b');
    expect(view.state.selection.main.head).toBe(4);
  });

  it('a link selects the address to type over', () => {
    const view = editor('ver [el sitio]');
    insertLink(view, 'enlace');
    expect(docOf(view)).toBe('ver [el sitio](https://)');
    expect(selected(view)).toBe('https://');
  });
});

describe('block formatting', () => {
  it('prefixes every selected line, and toggles off', () => {
    const view = editor('[uno\ndos]\ntres');
    toggleBlock(view, 'bullet');
    expect(docOf(view)).toBe('- uno\n- dos\ntres');
    view.dispatch({ selection: EditorSelection.range(0, 9) });
    toggleBlock(view, 'bullet');
    expect(docOf(view)).toBe('uno\ndos\ntres');
  });

  it('replaces another block prefix instead of stacking it', () => {
    const view = editor('## Tí|tulo');
    toggleBlock(view, 'quote');
    expect(docOf(view)).toBe('> Título');
  });

  it("a to-do isn't taken for a bullet", () => {
    const view = editor('|');
    view.dispatch({
      changes: { from: 0, insert: '- [ ] tarea' },
      selection: { anchor: 8 },
    });
    toggleBlock(view, 'bullet');
    expect(docOf(view)).toBe('- tarea');
  });
});

describe('slash menu', () => {
  const result = (doc: string) => {
    const view = editor(doc);
    return slashSource(
      new CompletionContext(view.state, view.state.selection.main.head, false),
    );
  };

  it('opens on "/" at a line start or after a space, with every block', () => {
    expect(result('/|')?.options).toHaveLength(SLASH_ITEMS.length);
    expect(result('texto /|')?.options.length).toBe(SLASH_ITEMS.length);
  });

  it('stays closed in a URL, a path or code', () => {
    expect(result('https://foo.com/|')).toBeNull();
    expect(result('carpeta/archivo|')).toBeNull();
    expect(result('```\n/|\n```')).toBeNull();
    expect(result('`a /|`')).toBeNull();
  });

  it("filters in the app's language and English, ignoring accents", () => {
    const ids = (q: string) => matchSlashItems(q).map((i) => i.id);
    expect(ids('tab')).toContain('table');
    expect(ids('tabla')).toEqual(['table']);
    expect(ids('ecuacion')).toEqual(['math']);
    expect(ids('heading')).toEqual(['h1', 'h2', 'h3']);
    expect(ids('numer')).toContain('numbered');
    expect(ids('canvas')).toContain('canvas');
    expect(ids('pizarra')).toEqual(['canvas']);
    expect(ids('zzz')).toEqual([]);
  });

  it('labels show in the current language without raw Markdown hints', () => {
    const option = result('/tabla|')?.options[0];
    expect(option?.label).toBe('Tabla');
    expect(option?.detail).toBeUndefined();
  });

  it('picking "/canvas" clears the slash query and triggers the canvas popover', () => {
    const view = editor('Notas\n/canv|');
    const item = SLASH_ITEMS.find((i) => i.id === 'canvas')!;
    let openedAt: { top: number; left: number } | null = null;
    applySlashItem(view, item, 6, 11, (anchor) => {
      openedAt = anchor;
    });
    expect(docOf(view)).toBe('Notas\n');
    expect(openedAt).not.toBeNull();
  });

  it('replaces "/query" with the block, cursor in place', () => {
    const view = editor('/lis|');
    const item = SLASH_ITEMS.find((i) => i.id === 'todo')!;
    applySlashItem(view, item, 0, 4);
    expect(docOf(view)).toBe('- [ ] ');
    expect(view.state.selection.main.head).toBe(6);
  });

  it('a block chosen mid-sentence starts on its own line', () => {
    const view = editor('Notas /cod|');
    const item = SLASH_ITEMS.find((i) => i.id === 'code')!;
    applySlashItem(view, item, 6, 10);
    expect(docOf(view)).toBe('Notas \n```\n\n```');
    expect(view.state.selection.main.head).toBe(11);
  });

  it('templates are translated', () => {
    const view = editor('/|');
    applySlashItem(view, SLASH_ITEMS.find((i) => i.id === 'table')!, 0, 1);
    expect(docOf(view).split('\n')[0]).toBe('| Columna 1 | Columna 2 |');
  });
});

describe('pasting formatted text', () => {
  it('keeps headings, bold, links and lists', () => {
    expect(
      htmlToMarkdown(
        '<h2>Plan</h2><p>Un <strong>texto</strong> con <a href="https://x.com">enlace</a></p><ul><li>uno</li><li>dos</li></ul>',
      ),
    ).toBe(
      '## Plan\n\nUn **texto** con [enlace](https://x.com)\n\n- uno\n- dos',
    );
  });

  it("Google Docs: its wrapper isn't bold, its styled spans are", () => {
    const html =
      '<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-abc"><p dir="ltr"><span style="font-weight:400">Hola </span><span style="font-weight:700">mundo</span> <span style="font-style:italic">bonito</span></p></b>';
    expect(htmlToMarkdown(html)).toBe('Hola **mundo** *bonito*');
  });

  it('tables become Markdown tables', () => {
    const md = htmlToMarkdown(
      '<table><thead><tr><th>Tarea</th><th>Estado</th></tr></thead><tbody><tr><td>Logo</td><td>Listo</td></tr></tbody></table>',
    );
    expect(md).toContain('| Tarea | Estado |');
    expect(md).toContain('| Logo | Listo |');
  });

  it('plain text or a code editor’s styled spans paste as plain text', () => {
    expect(htmlToMarkdown('')).toBeNull();
    expect(
      htmlToMarkdown(
        '<div><span style="color:#569cd6">const</span> a = 1;</div>',
      ),
    ).toBeNull();
  });
});

describe('hidden markup editing', () => {
  it('hides strikethrough markers even when the cursor is inside', () => {
    const view = editor('hola ~~mun|do~~');
    expect(view.contentDOM.querySelector('.cm-live-strike')?.textContent).toBe(
      'mundo',
    );
    expect(view.contentDOM.textContent).toBe('hola mundo');
  });

  it('keeps the cursor out of hidden block prefixes and steps to previous line on left', () => {
    const view = editor('Intro\n## |Título');
    // Clicking or jumping into the `# ` prefix snaps to after `## `
    view.dispatch({
      selection: EditorSelection.cursor(6),
      userEvent: 'select.pointer',
    });
    expect(view.state.selection.main.head).toBe(9);

    // Moving left from the start of the heading text jumps to the previous line end
    view.dispatch({ selection: EditorSelection.cursor(8) });
    expect(view.state.selection.main.head).toBe(5);
  });

  it('backspace at the start of a heading or list item removes the whole prefix', () => {
    const heading = editor('## |Título');
    expect(handleMarkupBackspace(heading)).toBe(true);
    expect(docOf(heading)).toBe('Título');
    expect(heading.state.selection.main.head).toBe(0);

    const todo = editor('|');
    todo.dispatch({
      changes: { from: 0, insert: '- [ ] Tarea' },
      selection: { anchor: 6 },
    });
    expect(handleMarkupBackspace(todo)).toBe(true);
    expect(docOf(todo)).toBe('Tarea');
  });

  it('backspace right after closing inline markers edits the text inside and removes empty spans', () => {
    const bold = editor('hola **mundo**|');
    expect(handleMarkupBackspace(bold)).toBe(true);
    expect(docOf(bold)).toBe('hola **mund**');

    const singleChar = editor('hola **m**|');
    expect(handleMarkupBackspace(singleChar)).toBe(true);
    expect(docOf(singleChar)).toBe('hola ');
  });
});
