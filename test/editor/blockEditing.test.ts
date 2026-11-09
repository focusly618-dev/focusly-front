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
import {
  handleMarkupBackspace,
  markupEditingExtensions,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/markupEditing';
import {
  applyDiagramDrop,
  applySvgSize,
  resolveValidMermaidCode,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview/mermaidWidget';

let views: EditorView[] = [];

const editor = (doc: string, cursor = doc.length) => {
  const view = new EditorView({
    state: EditorState.create({
      doc,
      selection: { anchor: cursor },
      extensions: [
        markdownExtension,
        livePreviewExtensions,
        ...markupEditingExtensions,
      ],
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

  it('the cursor never rests on its edge, and moves past it in both directions', () => {
    const doc = `Intro\n\n${TABLE}\n\nFin`;
    const view = editor(doc, 0);
    const tableStart = doc.indexOf('| Tarea');
    const tableEnd = doc.indexOf('|  |  |') + '|  |  |'.length;

    // Moving down onto the table's start steps past the table
    view.dispatch({ selection: EditorSelection.cursor(tableStart) });
    expect(view.state.selection.main.head).toBe(tableEnd + 1);

    // Moving up from below onto the table's end steps above the table
    view.dispatch({ selection: EditorSelection.cursor(tableEnd) });
    expect(view.state.selection.main.head).toBe(tableStart - 1);
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

  it('can step out of the formula upwards and downwards without getting trapped', () => {
    const doc = 'Intro\n\n$$\nE = mc^2\n$$\n\nFin';
    const view = editor(doc, doc.indexOf('E ='));
    const openFence = doc.indexOf('$$');
    const closeFence = doc.lastIndexOf('$$');

    // Moving up onto the opening $$ steps to the line above the math block
    view.dispatch({ selection: EditorSelection.cursor(openFence) });
    expect(view.state.selection.main.head).toBe(openFence - 1);

    // Re-enter and move down onto the closing $$: steps to the line below
    view.dispatch({ selection: EditorSelection.cursor(doc.indexOf('E =')) });
    view.dispatch({ selection: EditorSelection.cursor(closeFence) });
    expect(view.state.selection.main.head).toBe(closeFence + 3);
  });
});

describe('selecting and deleting blocks smoothly', () => {
  it('dragging a selection from below or above across a diagram or table snaps across the whole block without expanding code', () => {
    const doc = 'Arriba\n\n```mermaid\nflowchart TD\n  A --> B\n```\n\nAbajo';
    const blockStart = doc.indexOf('```mermaid');
    const blockEnd = doc.lastIndexOf('```') + 3;
    const view = editor(doc, doc.length);

    // Dragging from below into the middle of the mermaid block snaps head to blockStart
    view.dispatch({
      selection: EditorSelection.range(doc.length, doc.indexOf('flowchart')),
      userEvent: 'select.pointer',
    });
    expect(view.state.selection.main.from).toBe(blockStart);
    expect(view.state.selection.main.to).toBe(doc.length);
    // The diagram stays a rendered widget (never expands into code lines mid-drag)
    expect(view.dom.querySelector('.cm-code-block-line')).toBeNull();

    // Dragging from above into the middle of the mermaid block snaps head to blockEnd
    view.dispatch({
      selection: EditorSelection.range(0, doc.indexOf('flowchart')),
      userEvent: 'select.pointer',
    });
    expect(view.state.selection.main.from).toBe(0);
    expect(view.state.selection.main.to).toBe(blockEnd);
  });

  it('backspace on the line under a diagram or empty block deletes the whole block', () => {
    const doc = 'Intro\n\n```mermaid\nflowchart TD\n  A --> B\n```\n';
    const view = editor(doc, doc.length);
    expect(handleMarkupBackspace(view)).toBe(true);
    expect(view.state.doc.toString()).toBe('Intro\n\n');
  });

  it('selecting all or clicking at the end of a document with a diagram at the bottom never opens the diagram for editing', () => {
    const doc = 'Intro\n\n```mermaid\nflowchart TD\n  A --> B\n```';
    const view = editor(doc, 0);
    expect(view.dom.querySelector('.cm-code-block-line')).toBeNull();

    // Select All (0 .. doc.length) where doc.length is the end of the closing ``` fence
    view.dispatch({
      selection: EditorSelection.range(0, doc.length),
      userEvent: 'select',
    });
    expect(view.dom.querySelector('.cm-code-block-line')).toBeNull();
    expect(view.dom.querySelector('.cm-live-mermaid')).not.toBeNull();

    // Pointer click at the very end of the document (after the closing ``` fence)
    view.dispatch({
      selection: EditorSelection.cursor(doc.length),
      userEvent: 'select.pointer',
    });
    expect(view.state.selection.main.head).toBe(doc.length);
    expect(view.dom.querySelector('.cm-code-block-line')).toBeNull();
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

  it('an invalid mermaid diagram shows a friendly error and leaves no Syntax error DOM nodes on the page', async () => {
    const doc = 'Intro\n\n```mermaid\nflowchart TD\n  A -->\n```\n\nFin';
    const view = editor(doc, 0);
    await new Promise((r) => setTimeout(r, 80));
    const errEl = view.dom.querySelector('.cm-live-mermaid-error');
    expect(errEl?.textContent).toBe(
      'Este diagrama tiene un error de escritura. Revisa su código.',
    );
    expect(document.body.textContent).not.toContain('Syntax error in text');
  });

  it('a flowchart with parentheses inside unquoted node labels auto-quotes and parses without syntax error', async () => {
    const code = `flowchart TD
    classDef energy fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef storage fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;

    A[🍞 1. Ingestión: Alimentos ricos en Carbohidratos<br/>(Pan, Frutas, Arroz, Azúcares)] --> B[🦷 2. Digestión en Boca y Estómago<br/>(La amilasa salival inicia la descomposición)]
    B --> C[🧪 3. Intestino Delgado<br/>(Enzimas los convierten en Monosacáridos:<br/>Glucosa, Fructosa y Galactosa)]
    C --> D[🩸 4. Torrente Sanguíneo<br/>(La glucosa viaja por la sangre hacia las células)]
    D --> E{¿Qué necesita el cuerpo?}
    E -- Energía Inmediata ⚡ --> F[🔋 5A. Producción de ATP<br/>(Respiración celular en mitocondrias<br/>para cerebro, músculos y órganos)]:::energy
    E -- Exceso de Glucosa 🗄️ --> G[📦 5B. Almacenamiento (Glucogénesis)<br/>• Glucógeno en Hígado y Músculos]:::storage
    G --> H[⚖️ 5C. Si el glucógeno está lleno...<br/>Lipogénesis (Transformación en Grasa corporal)]:::storage`;
    const valid = await resolveValidMermaidCode(code);
    expect(valid).not.toBeNull();
  });

  it('inserting a diagram via "/" opens only the code editor (no diagram rendered below) with 2 toggle icons (Eye and Code)', () => {
    const view = editor('Intro\n\n/');
    const end = view.state.doc.length;
    applySlashItem(
      view,
      SLASH_ITEMS.find((i) => i.id === 'diagram')!,
      end - 1,
      end,
    );

    // In Code mode: code block lines are visible, NO diagram preview rendered below
    expect(view.dom.querySelector('.cm-code-block-line')).not.toBeNull();
    expect(view.dom.querySelector('.cm-live-mermaid')).toBeNull();

    // Both toggle icons (Eye = preview, </> = code) are rendered in the header
    const previewBtn = view.dom.querySelector<HTMLElement>(
      '[data-mermaid-mode="preview"]',
    );
    const codeBtn = view.dom.querySelector<HTMLElement>(
      '[data-mermaid-mode="code"]',
    );
    expect(previewBtn).not.toBeNull();
    expect(codeBtn).not.toBeNull();
    expect(codeBtn?.classList.contains('is-active')).toBe(true);

    // Clicking the Eye icon switches to Preview mode (shows only the diagram, hides code)
    previewBtn!.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(view.dom.querySelector('.cm-code-block-line')).toBeNull();
    expect(view.dom.querySelector('.cm-live-mermaid')).not.toBeNull();

    // Clicking the Code icon on the rendered diagram switches back to Code mode
    const renderedCodeBtn = view.dom.querySelector<HTMLElement>(
      '.cm-live-mermaid [data-mermaid-mode="code"]',
    );
    expect(renderedCodeBtn).not.toBeNull();
    renderedCodeBtn!.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(view.dom.querySelector('.cm-code-block-line')).not.toBeNull();
    expect(view.dom.querySelector('.cm-live-mermaid')).toBeNull();

    // Moving the cursor with the keyboard or selecting text inside the diagram
    // never switches back to the Eye view on its own
    const docText = view.state.doc.toString();
    view.dispatch({
      selection: EditorSelection.range(
        docText.indexOf('flowchart'),
        docText.lastIndexOf('```'),
      ),
    });
    expect(view.dom.querySelector('.cm-code-block-line')).not.toBeNull();
    expect(view.dom.querySelector('.cm-live-mermaid')).toBeNull();

    view.dispatch({
      selection: EditorSelection.cursor(0),
      userEvent: 'select',
    });
    expect(view.dom.querySelector('.cm-code-block-line')).not.toBeNull();
    expect(view.dom.querySelector('.cm-live-mermaid')).toBeNull();
  });

  it('scales tall diagrams compactly by default and resizes proportionally when dragging the bottom handle with the mouse', () => {
    const doc = 'Intro\n\n```mermaid\nflowchart TD\n  A --> B\n```\n';
    const view = editor(doc, 0);
    const body = view.dom.querySelector<HTMLElement>('.cm-live-mermaid-body')!;
    const handle = view.dom.querySelector<HTMLElement>(
      '.cm-mermaid-resize-handle',
    )!;
    expect(body).not.toBeNull();
    expect(handle).not.toBeNull();

    // Inject a tall SVG (480x960) to verify default compact scaling and mouse drag resize
    body.innerHTML = '<svg viewBox="0 0 480 960" width="100%"></svg>';
    const svg = body.querySelector<SVGSVGElement>('svg')!;
    applySvgSize(svg, null);
    expect(svg.style.maxHeight).toBe('320px');
    expect(svg.style.width).toBe('160px');

    // Drag the resize handle upwards by 100px (320 -> 220)
    handle.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        button: 0,
        clientX: 200,
        clientY: 320,
      }),
    );
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        clientX: 200,
        clientY: 220,
      }),
    );
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    expect(svg.style.maxHeight).toBe('220px');
    expect(svg.style.width).toBe('110px');
    expect(view.state.doc.toString()).toContain('```mermaid h=220');

    // Drag the resize handle downwards by 100px: scales at 3x speed (220 + 300 = 520)
    handle.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        button: 0,
        clientX: 200,
        clientY: 220,
      }),
    );
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        clientX: 120,
        clientY: 320,
      }),
    );
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    expect(svg.style.maxHeight).toBe('520px');
    expect(svg.style.width).toBe('260px');
    expect(view.state.doc.toString()).toContain('```mermaid h=520');
  });

  it('can move diagrams side-by-side into the same row/column and reorder them in the note', () => {
    const doc =
      'Intro\n\n```mermaid\nflowchart TD\n  A --> B\n```\n\nMedio\n\n```mermaid\nflowchart TD\n  C --> D\n```\n';
    const view = editor(doc, 0);
    const firstPos = doc.indexOf('```mermaid');
    const secondPos = doc.lastIndexOf('```mermaid');

    // Initially, the two diagrams are separate blocks (no side-by-side row)
    expect(view.dom.querySelector('.cm-live-mermaid-row')).toBeNull();

    // Drop the second diagram onto the right side of the first diagram
    applyDiagramDrop(view, secondPos, {
      kind: 'diagram',
      targetPos: firstPos,
      side: 'right',
    });

    // Both diagrams now sit side-by-side inside a single .cm-live-mermaid-row
    const row = view.dom.querySelector('.cm-live-mermaid-row');
    expect(row).not.toBeNull();
    expect(row?.querySelectorAll('.cm-live-mermaid')).toHaveLength(2);
  });

  it('zooms in, zooms out, and resets the diagram size via toolbar buttons and persists z=<zoom>', () => {
    const doc =
      'Intro\n\n```mermaid\nflowchart TD\n  A --> B\n  B --> C\n```\n';
    const view = editor(doc, 0);
    const body = view.dom.querySelector<HTMLElement>('.cm-live-mermaid-body')!;
    body.innerHTML = '<svg viewBox="0 0 400 800" width="100%"></svg>';
    const svg = body.querySelector<SVGSVGElement>('svg')!;
    applySvgSize(svg, null, 100);
    expect(svg.style.maxHeight).toBe('320px');
    expect(svg.style.width).toBe('160px');

    const zoomInBtn = view.dom.querySelector<HTMLElement>(
      '[data-mermaid-zoom="in"]',
    )!;
    const zoomOutBtn = view.dom.querySelector<HTMLElement>(
      '[data-mermaid-zoom="out"]',
    )!;
    const zoomResetBtn = view.dom.querySelector<HTMLElement>(
      '[data-mermaid-zoom="reset"]',
    )!;
    expect(zoomInBtn).not.toBeNull();
    expect(zoomOutBtn).not.toBeNull();
    expect(zoomResetBtn.dataset.zoomLabel).toBe('100%');

    // Zoom In (+20% -> 120%)
    zoomInBtn.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(zoomResetBtn.dataset.zoomLabel).toBe('120%');
    expect(svg.style.maxHeight).toBe('384px');
    expect(svg.style.width).toBe('192px');
    expect(view.state.doc.toString()).toContain('```mermaid z=120');

    // Zoom Out twice (-40% -> 80%)
    zoomOutBtn.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    zoomOutBtn.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(zoomResetBtn.dataset.zoomLabel).toBe('80%');
    expect(svg.style.maxHeight).toBe('256px');
    expect(svg.style.width).toBe('128px');
    expect(view.state.doc.toString()).toContain('```mermaid z=80');

    // Reset zoom (100%)
    zoomResetBtn.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, button: 0 }),
    );
    expect(zoomResetBtn.dataset.zoomLabel).toBe('100%');
    expect(svg.style.maxHeight).toBe('320px');
    expect(svg.style.width).toBe('160px');
    expect(view.state.doc.toString()).not.toContain('z=');
  });
});
