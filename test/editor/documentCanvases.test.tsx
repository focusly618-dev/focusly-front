import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { Canvas } from '@/pages/Workspace/canvas.types';
import type { MarkdownEditorRef } from '@/pages/Workspace/components/Editor/codemirror/MarkdownEditor.types';
import type { CanvasView } from '@/pages/Workspace/components/Editor/useCanvasView.hook';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (
      key: string,
      fallback?: string | { defaultValue?: string; name?: string },
    ) =>
      typeof fallback === 'string'
        ? fallback
        : (fallback?.defaultValue ?? key).replace(
            '{{name}}',
            fallback?.name ?? '',
          ),
    i18n: { language: 'es' },
  }),
}));
const apollo = vi.hoisted(() => ({
  data: undefined as { canvasesByWorkspace: Canvas[] } | undefined,
  refetch: vi.fn(),
  removeCanvas: vi.fn(),
}));
vi.mock('@apollo/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client')>()),
  useQuery: () => ({ data: apollo.data, refetch: apollo.refetch }),
  useMutation: () => [apollo.removeCanvas],
}));
const notify = vi.hoisted(() => ({ error: vi.fn() }));
vi.mock('@/utils', () => ({ notify }));

const { CANVAS_DRAG_TYPE, canvasLink, canvasLinkRemovals, linkedCanvasIds } =
  await import('@/pages/Workspace/components/Editor/components/EditorContent/canvasLinks.utils');
const { ownLineInsert } =
  await import('@/pages/Workspace/components/Editor/codemirror/markdownInsert');
const { canvasDropExtension } =
  await import('@/pages/Workspace/components/Editor/codemirror/extensions/canvasDrop');
const { CanvasesMenu } =
  await import('@/pages/Workspace/components/Editor/components/EditorHeader/components/CanvasesMenu/CanvasesMenu');

const canvas = (id: string, name: string, icon: string | null = '🧭') =>
  ({
    __typename: 'Canvas',
    id,
    name,
    icon,
    workspaceId: 'ws-1',
    data: null,
    createdAt: '',
    updatedAt: '',
  }) as Canvas;

describe('the links a document has to its canvases', () => {
  it('collects the ids of every canvas the text links to', () => {
    const doc = [
      canvasLink('a', 'Plan'),
      `Inline ${canvasLink('b', 'Map')} here`,
      '[old style](canvas:c)',
      '[not a canvas](https://x.test)',
    ].join('\n');
    expect([...linkedCanvasIds(doc)].sort()).toEqual(['a', 'b', 'c']);
  });

  it('takes a card out with its line, and an inline link alone', () => {
    const card = canvasLink('a', 'Plan');
    const doc = `Intro\n${card}\nSee ${canvasLink('a', 'Plan')} again\n${card}`;
    const changes = canvasLinkRemovals(doc, 'a');
    const state = EditorState.create({ doc }).update({ changes }).state;
    expect(state.doc.toString()).toBe('Intro\nSee  again\n');
  });
});

describe('putting a line of its own into the text', () => {
  it('fills a blank line', () => {
    const doc = 'One\n\nTwo';
    expect(ownLineInsert(doc, 4, 'X')).toEqual({ from: 4, to: 4, insert: 'X' });
  });

  it('goes after the line it lands in, not inside it', () => {
    const doc = 'One two\nThree';
    expect(ownLineInsert(doc, 3, 'X')).toEqual({
      from: 7,
      to: 7,
      insert: '\nX',
    });
  });

  it('starts the document when dropped on its first, blank, line', () => {
    expect(ownLineInsert('\nText', 0, 'X')).toEqual({
      from: 0,
      to: 0,
      insert: 'X',
    });
  });
});

describe('dropping a canvas into the editor', () => {
  it('lands as its card on a line of its own', () => {
    const view = new EditorView({
      state: EditorState.create({
        doc: 'Hello world\nBye',
        extensions: canvasDropExtension,
      }),
    });
    vi.spyOn(view, 'posAtCoords').mockReturnValue(3);
    const link = canvasLink('a', 'Plan');
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.assign(drop, {
      clientX: 10,
      clientY: 10,
      dataTransfer: {
        types: [CANVAS_DRAG_TYPE, 'text/plain'],
        getData: (type: string) => (type === CANVAS_DRAG_TYPE ? link : ''),
      },
    });

    view.contentDOM.dispatchEvent(drop);

    expect(view.state.doc.toString()).toBe(`Hello world\n${link}\nBye`);
    expect(drop.defaultPrevented).toBe(true);
    view.destroy();
  });
});

describe('the header list of canvases', () => {
  const plan = canvas('a', 'Plan');
  const map = canvas('b', 'Mapa', null);

  const setup = (
    canvases: Canvas[],
    documentText = canvasLink('a', 'Plan'),
  ) => {
    apollo.data = { canvasesByWorkspace: canvases };
    const editor = {
      insertLine: vi.fn(),
      applyChanges: vi.fn(),
      getValue: vi.fn(() => documentText),
    };
    const canvasView = {
      isActive: false,
      id: null,
      open: vi.fn(),
      close: vi.fn(),
    } as unknown as CanvasView;
    const utils = render(
      <CanvasesMenu
        workspaceId="ws-1"
        documentText={documentText}
        markdownEditorRef={{
          current: editor as unknown as MarkdownEditorRef,
        }}
        canvasView={canvasView}
      />,
    );
    const openList = () =>
      fireEvent.click(
        screen.getByRole('button', { name: 'Canvas del documento' }),
      );
    return { ...utils, editor, canvasView, openList };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    apollo.removeCanvas.mockResolvedValue({ data: { removeCanvas: true } });
  });

  it("isn't there while the document has no canvas", () => {
    const { container } = setup([]);
    expect(container).toBeEmptyDOMElement();
  });

  it('lists them, telling which one the text lost', () => {
    const { openList } = setup([plan, map]);
    openList();

    expect(apollo.refetch).toHaveBeenCalled();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('En el documento')).toBeInTheDocument();
    expect(screen.getByText('Mapa')).toBeInTheDocument();
    expect(screen.getByText('No está en el documento')).toBeInTheDocument();
  });

  it('shows the picture of a drawing, or its icon when it has none', () => {
    const drawn = {
      ...plan,
      previewUrl: 'https://bucket.test/preview',
      previewAt: '2026-10-28T10:00:00',
    };
    const { openList } = setup([drawn, map]);
    openList();

    const row = screen.getByText('Plan').closest('[draggable]')!;
    const img = row.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('https://bucket.test/preview');
    expect(
      screen.getByText('Mapa').closest('[draggable]')!.textContent,
    ).toContain('🎨');

    // An expired link shows the icon instead
    fireEvent.error(img);
    expect(row.querySelector('img')).toBeNull();
    expect(row.textContent).toContain('🧭');
  });

  it('opens a canvas', () => {
    const { openList, canvasView } = setup([plan]);
    openList();
    fireEvent.click(screen.getByText('Plan'));
    expect(canvasView.open).toHaveBeenCalledWith('a', 'Plan', '🧭');
  });

  it('puts a lost canvas back as its card', () => {
    const { openList, editor } = setup([plan, map]);
    openList();
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Insertar en el documento' })[1],
    );
    expect(editor.insertLine).toHaveBeenCalledWith(
      canvasLink('b', 'Mapa', null),
    );
  });

  it('hands its card to a drag into the text', () => {
    const { openList } = setup([plan]);
    openList();
    const data: Record<string, string> = {};
    const row = screen.getByText('Plan').closest('[draggable="true"]')!;
    fireEvent.dragStart(row, {
      dataTransfer: {
        setData: (type: string, value: string) => (data[type] = value),
        effectAllowed: '',
      },
    });
    expect(data[CANVAS_DRAG_TYPE]).toBe(canvasLink('a', 'Plan', '🧭'));
  });

  it('deletes a canvas only once confirmed, and its links with it', async () => {
    const { openList, editor } = setup([plan]);
    openList();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(apollo.removeCanvas).not.toHaveBeenCalled();
    expect(screen.getByText('¿Eliminar «Plan»?')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    });

    expect(apollo.removeCanvas.mock.calls[0][0].variables).toEqual({ id: 'a' });
    expect(editor.applyChanges).toHaveBeenCalledWith(
      canvasLinkRemovals(canvasLink('a', 'Plan'), 'a'),
    );
  });

  it('keeps the canvas and its links when the delete fails', async () => {
    apollo.removeCanvas.mockRejectedValueOnce(new Error('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { openList, editor } = setup([plan]);
    openList();
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    });

    expect(notify.error).toHaveBeenCalledTimes(1);
    expect(editor.applyChanges).not.toHaveBeenCalled();
    expect(screen.getByText('¿Eliminar «Plan»?')).toBeInTheDocument();
  });
});
