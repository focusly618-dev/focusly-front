import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { markdownExtension } from '@/pages/Workspace/components/Editor/codemirror/extensions/markdownLanguage';
import { livePreviewExtensions } from '@/pages/Workspace/components/Editor/codemirror/extensions/livePreview';
import { createImperativeApi } from '@/pages/Workspace/components/Editor/codemirror/imperativeApi';

const excalidraw = vi.hoisted(() => ({ exportToBlob: vi.fn() }));
vi.mock('@excalidraw/excalidraw', () => excalidraw);
const apollo = vi.hoisted(() => ({
  createUpload: vi.fn(),
  removePreview: vi.fn(),
  refetchQueries: vi.fn(),
}));
vi.mock('@apollo/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client')>()),
  useMutation: (doc: { definitions: { name?: { value: string } }[] }) =>
    doc.definitions[0].name?.value === 'RemoveCanvasPreview'
      ? [apollo.removePreview]
      : [apollo.createUpload],
  useApolloClient: () => ({ refetchQueries: apollo.refetchQueries }),
}));

const { useCanvasPreview } =
  await import('@/pages/Workspace/components/Editor/components/EditorContent/useCanvasPreview.hook');

const ID = '3f2b8c1e-9a4d-4e6f-8b7a-1c2d3e4f5a6b';
const PREVIEW = { url: 'https://bucket.test/preview?sig=1', version: 'v1' };

describe('the picture on a canvas card', () => {
  const setup = () => {
    const view = new EditorView({
      state: EditorState.create({
        doc: `Intro\n\n[🧠 Ideas](#canvas-${ID})`,
        extensions: [markdownExtension, livePreviewExtensions],
      }),
    });
    return { view, api: createImperativeApi(() => view) };
  };
  const card = (view: EditorView) =>
    view.contentDOM.querySelector<HTMLElement>('.cm-canvas-card')!;

  it('shows the icon until the canvas has a picture', () => {
    const { view, api } = setup();
    expect(card(view).querySelector('.cm-canvas-card-icon')?.textContent).toBe(
      '🧠',
    );

    api.setCanvasPreviews(new Map([[ID, PREVIEW]]));

    const img = card(view).querySelector('.cm-canvas-card-preview img');
    expect(img?.getAttribute('src')).toBe(PREVIEW.url);
    expect(card(view).querySelector('.cm-canvas-card-icon')).toBeNull();
    // The icon moves before the name
    expect(card(view).querySelector('.cm-canvas-card-title')?.textContent).toBe(
      '🧠 Ideas',
    );
  });

  it('keeps the loaded picture when only its link is signed again', () => {
    const { view, api } = setup();
    api.setCanvasPreviews(new Map([[ID, PREVIEW]]));
    const before = card(view);

    api.setCanvasPreviews(
      new Map([[ID, { ...PREVIEW, url: 'https://bucket.test/preview?sig=2' }]]),
    );
    expect(card(view)).toBe(before);

    api.setCanvasPreviews(
      new Map([[ID, { url: 'https://new', version: 'v2' }]]),
    );
    expect(card(view).querySelector('img')?.getAttribute('src')).toBe(
      'https://new',
    );
  });

  it('falls back to the icon when the picture fails to load', () => {
    const { view, api } = setup();
    api.setCanvasPreviews(new Map([[ID, PREVIEW]]));
    card(view).querySelector('img')!.dispatchEvent(new Event('error'));
    expect(card(view).querySelector('.cm-canvas-card-icon')?.textContent).toBe(
      '🧠',
    );
  });
});

describe('keeping the picture up to date', () => {
  const fetchMock = vi.fn();
  const element = (isDeleted = false) =>
    ({ id: 'r', type: 'rectangle', isDeleted }) as unknown as ExcalidrawElement;
  const scene = (elements: ExcalidrawElement[]) => ({
    elements,
    appState: { viewBackgroundColor: 'transparent' },
    files: {},
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    excalidraw.exportToBlob.mockResolvedValue(
      new Blob(['webp-bytes'], { type: 'image/webp' }),
    );
    apollo.createUpload.mockResolvedValue({
      data: {
        createCanvasPreviewUpload: { uploadUrl: 'https://bucket.test/put' },
      },
    });
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('draws and uploads one picture once the drawing is left alone', async () => {
    const { result } = renderHook(() => useCanvasPreview('cv-1'));

    act(() => {
      result.current(scene([element()]));
      result.current(scene([element(), element()]));
    });
    expect(excalidraw.exportToBlob).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTimeAsync(4000));

    expect(excalidraw.exportToBlob).toHaveBeenCalledTimes(1);
    expect(excalidraw.exportToBlob.mock.calls[0][0]).toMatchObject({
      maxWidthOrHeight: 480,
      appState: { viewBackgroundColor: '#ffffff', exportWithDarkMode: false },
    });
    expect(apollo.createUpload.mock.calls[0][0].variables.input).toEqual({
      canvasId: 'cv-1',
      mimeType: 'image/webp',
      size: 'webp-bytes'.length,
    });
    expect(fetchMock).toHaveBeenCalledWith('https://bucket.test/put', {
      method: 'PUT',
      headers: { 'Content-Type': 'image/webp' },
      body: expect.any(Blob),
    });
    expect(apollo.refetchQueries).toHaveBeenCalledWith({
      include: ['GetCanvasesByWorkspace'],
    });
  });

  it('removes the picture of a drawing left empty', async () => {
    const { result } = renderHook(() => useCanvasPreview('cv-1'));
    act(() => result.current(scene([element(true)])));
    await act(async () => vi.advanceTimersByTimeAsync(4000));

    expect(apollo.removePreview).toHaveBeenCalledWith({
      variables: { canvasId: 'cv-1' },
    });
    expect(apollo.createUpload).not.toHaveBeenCalled();
  });

  it('sends the last change right away when the canvas closes', async () => {
    const { result, unmount } = renderHook(() => useCanvasPreview('cv-1'));
    act(() => result.current(scene([element()])));
    await act(async () => {
      unmount();
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(apollo.createUpload).toHaveBeenCalledTimes(1);
  });

  it('stays quiet when the upload fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce({ ok: false, status: 403 });
    const { result } = renderHook(() => useCanvasPreview('cv-1'));
    act(() => result.current(scene([element()])));
    await act(async () => vi.advanceTimersByTimeAsync(4000));

    expect(warn).toHaveBeenCalled();
    expect(apollo.refetchQueries).not.toHaveBeenCalled();
  });
});
