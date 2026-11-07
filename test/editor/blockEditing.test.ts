import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { EditorSelection, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { ensureSyntaxTree } from '@codemirror/language';
import i18n from '@/i18n';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';
import { livePreviewExtensions } from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview';
import {
  parseTable,
  serializeTable,
  splitRow,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview/table';
import {
  applySlashItem,
  SLASH_ITEMS,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/slashMenu';

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
  views.push(view);
  return view;
};

const visible = (view: EditorView) =>
  (view.contentDOM.textContent ?? '').replace(/\u200b/g, '');

beforeAll(async () => {
  await i18n.changeLanguage('es');
});

afterEach(() => {
  views.forEach((v) => v.destroy());
  views = [];
});

const TABLE = '| Tarea | Estado |\n| --- | :---: |\n| Logo | Listo |\n|  |  |';

describe('table model', () => {
  it('reads empty cells and escaped pipes', () => {
    expect(splitRow('|  | a \\| b |')).toEqual(['', 'a \\| b']);
  });

  it('reads a table, rows as wide as the header', () => {
    const view = editor(`Intro\n\n${TABLE}\n| solo |`);
    let model = null as ReturnType<typeof parseTable> | null;
    ensureSyntaxTree(view.state, view.state.doc.length)!.iterate({
      enter: (ref) => {
        if (ref.name === 'Table') model = parseTable(view.state, ref);
      },
    });
    expect(model).toEqual({
      header: ['Tarea', 'Estado'],
      rows: [
        ['Logo', 'Listo'],
        ['', ''],
        ['solo', ''],
      ],
      aligns: [null, 'center'],
    });
  });

  it('writes it back as Markdown, pipes escaped', () => {
    expect(
      serializeTable({
        header: ['A', 'B'],
        rows: [['x | y', '']],
        aligns: [null, 'right'],
      }),
    ).toBe('| A | B |\n| --- | ---: |\n| x \\| y |  |');
  });
});

describe('a table in the editor', () => {
  it('is drawn as a table, its pipes never shown, even with the cursor next to it', () => {
    const view = editor(`Intro\n\n${TABLE}\n\nFin`);
    expect(view.dom.querySelector('.cm-live-table')).not.toBeNull();
    expect(visible(view)).not.toContain('|');
    // Its empty row is drawn too
    expect(view.dom.querySelectorAll('.cm-live-table tbody tr')).toHaveLength(
      2,
    );
  });

  it('its cells are editable', () => {
    const view = editor(`Intro\n\n${TABLE}\n`);
    const cells = view.dom.querySelectorAll(
      '.cm-live-table [contenteditable="true"]',
    );
    expect(cells).toHaveLength(6);
  });

  it('typing on the empty line under it keeps a blank line in between', () => {
    const view = editor(`Intro\n\n${TABLE}\n`);
    const end = view.state.doc.length;
    view.dispatch({
      changes: { from: end, insert: 'D' },
      selection: { anchor: end + 1 },
      userEvent: 'input.type',
    });
    expect(view.state.doc.toString()).toBe(`Intro\n\n${TABLE}\n\nD`);
  });

  it('the cursor never rests on its edge', () => {
    const view = editor(`Intro\n\n${TABLE}\n\nFin`, 0);
    const tableStart = view.state.doc.toString().indexOf('| Tarea');
    view.dispatch({ selection: EditorSelection.cursor(tableStart) });
    const head = view.state.selection.main.head;
    expect(head === tableStart).toBe(false);
  });
});

describe('a callout', () => {
  it("shows its title and body, never a '>'", () => {
    const view = editor(
      'Intro\n\n> [!note] Nota\n> Primera línea\n> Segunda\n\nFin',
      0,
    );
    expect(visible(view)).toContain('Nota');
    expect(visible(view)).toContain('Primera línea');
    expect(visible(view)).not.toContain('>');
  });
});

describe('a math block', () => {
  it('the cursor stays off its hidden $$ lines', () => {
    const doc = 'Intro\n\n$$\nE = mc^2\n$$\n\nFin';
    const view = editor(doc, 0);
    view.dispatch({ selection: EditorSelection.cursor(doc.indexOf('$$')) });
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    expect(line.text).toBe('E = mc^2');
  });

  it('being edited, shows the formula rendered under its source', () => {
    const doc = 'Intro\n\n$$\nE = mc^2\n$$\n\nFin';
    const view = editor(doc, doc.indexOf('E ='));
    expect(visible(view)).not.toContain('$$');
    expect(view.dom.querySelector('.cm-math-source-line')).not.toBeNull();
  });
});

describe('"/" templates', () => {
  const insert = (id: string) => {
    const view = editor('Intro\n\n/');
    const end = view.state.doc.length;
    applySlashItem(view, SLASH_ITEMS.find((i) => i.id === id)!, end - 1, end);
    return view.state.doc.toString().replace('Intro\n\n', '');
  };

  it('a table comes with a line under it for the cursor', () => {
    expect(insert('table')).toBe(
      '| Columna 1 | Columna 2 |\n| --- | --- |\n|  |  |\n',
    );
  });

  it('a callout comes with a translated title', () => {
    expect(insert('callout')).toBe('> [!note] Nota\n> ');
  });
});
