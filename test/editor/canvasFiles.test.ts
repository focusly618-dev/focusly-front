import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type {
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

const apollo = vi.hoisted(() => ({
  createUpload: vi.fn(),
  query: vi.fn(),
}));
vi.mock('@apollo/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client')>()),
  useMutation: () => [apollo.createUpload],
  useApolloClient: () => ({ query: apollo.query }),
}));
const notify = vi.hoisted(() => ({ warning: vi.fn(), error: vi.fn() }));
vi.mock('@/utils', () => ({ notify }));

const { useCanvasFiles } =
  await import('@/pages/Workspace/components/Editor/components/EditorContent/useCanvasFiles.hook');
const { imagesToStore, canvasFileProblem } =
  await import('@/pages/Workspace/components/Editor/components/EditorContent/canvasFiles.utils');

const PNG = 'data:image/png;base64,iVBORw0KGgo=';

const image = (fileId: string, isDeleted = false) =>
  ({
    id: `el-${fileId}`,
    type: 'image',
    fileId,
    isDeleted,
  }) as unknown as ExcalidrawElement;
const file = (id: string, mimeType = 'image/png') => ({
  id,
  mimeType,
  dataURL: PNG,
  created: 7,
});

describe('which images still need storing', () => {
  it('takes the live images Excalidraw has the data of, once each', () => {
    const files = {
      a: file('a'),
      b: file('b'),
      c: file('c'),
    } as unknown as BinaryFiles;
    const elements = [
      image('a'),
      image('a'), // the same image placed twice
      image('b', true), // deleted
      image('c'),
      image('missing'), // no data yet
      {
        id: 'r',
        type: 'rectangle',
        isDeleted: false,
      } as unknown as ExcalidrawElement,
    ];
    const ids = imagesToStore(elements, files, (id) => id === 'c').map(
      (f) => f.id,
    );
    expect(ids).toEqual(['a']);
  });

  it('accepts the image types and sizes the server does', () => {
    expect(canvasFileProblem('image/png', 1000)).toBeNull();
    expect(canvasFileProblem('image/webp', 10 * 1024 * 1024)).toBeNull();
    expect(canvasFileProblem('image/svg+xml', 1000)).toBe('type');
    expect(canvasFileProblem('image/png', 10 * 1024 * 1024 + 1)).toBe('size');
  });
});

describe('useCanvasFiles', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Responses carry jsdom's own Blob: a real Response would wrap it in
    // Node's, losing its type and size in this test environment
    const ok = (blob: Blob | null) => ({
      ok: true,
      status: 200,
      blob: async () => blob,
    });
    fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.startsWith('data:'))
        return ok(new Blob(['png-bytes'], { type: 'image/png' }));
      if (init?.method === 'PUT') return ok(null);
      return ok(new Blob(['stored-bytes'], { type: 'image/png' }));
    });
    vi.stubGlobal('fetch', fetchMock);
    apollo.createUpload.mockResolvedValue({
      data: {
        createCanvasFileUpload: { uploadUrl: 'https://bucket.test/put' },
      },
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  const setup = () => {
    const onStored = vi.fn();
    const hook = renderHook(() =>
      useCanvasFiles({ canvasId: 'cv-1', onStored }),
    );
    return { hook, onStored };
  };

  it('uploads a pasted image once, signed for its type and size, then records it', async () => {
    const { hook, onStored } = setup();
    const files = { a: file('a') } as unknown as BinaryFiles;

    await act(async () => {
      hook.result.current.storeNewImages([image('a')], files);
      // A change while it's on its way up doesn't send it twice
      hook.result.current.storeNewImages([image('a')], files);
    });

    expect(apollo.createUpload).toHaveBeenCalledTimes(1);
    expect(apollo.createUpload.mock.calls[0][0].variables.input).toEqual({
      canvasId: 'cv-1',
      fileId: 'a',
      mimeType: 'image/png',
      size: 'png-bytes'.length,
    });
    const put = fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT');
    expect(put?.[0]).toBe('https://bucket.test/put');
    expect(put?.[1].headers).toEqual({ 'Content-Type': 'image/png' });

    expect(onStored).toHaveBeenCalledTimes(1);
    expect(hook.result.current.storedFiles()).toEqual({
      a: { mimeType: 'image/png', created: 7 },
    });

    // Stored now: later changes leave it alone
    await act(async () =>
      hook.result.current.storeNewImages([image('a')], files),
    );
    expect(apollo.createUpload).toHaveBeenCalledTimes(1);
  });

  it("says so, once, for an image type the bucket won't keep", async () => {
    const { hook } = setup();
    const files = { s: file('s', 'image/svg+xml') } as unknown as BinaryFiles;

    await act(async () =>
      hook.result.current.storeNewImages([image('s')], files),
    );
    await act(async () =>
      hook.result.current.storeNewImages([image('s')], files),
    );

    expect(apollo.createUpload).not.toHaveBeenCalled();
    expect(notify.warning).toHaveBeenCalledTimes(1);
    expect(hook.result.current.storedFiles()).toEqual({});
  });

  it('retries an upload that failed on the next change', async () => {
    const { hook, onStored } = setup();
    const files = { a: file('a') } as unknown as BinaryFiles;
    apollo.createUpload.mockRejectedValueOnce(new Error('offline'));

    await act(async () =>
      hook.result.current.storeNewImages([image('a')], files),
    );
    expect(notify.error).toHaveBeenCalledTimes(1);
    expect(onStored).not.toHaveBeenCalled();

    await act(async () =>
      hook.result.current.storeNewImages([image('a')], files),
    );
    expect(onStored).toHaveBeenCalledTimes(1);
  });

  it('brings the stored images back into the canvas on opening', async () => {
    const { hook } = setup();
    hook.result.current.resetStored({
      a: { mimeType: 'image/png', created: 3 },
    });
    apollo.query.mockResolvedValue({
      data: {
        canvasFiles: [
          { id: 'a', mimeType: 'image/png', url: 'https://bucket.test/a' },
        ],
      },
    });
    const api = { addFiles: vi.fn() };

    await act(async () => {
      await hook.result.current.loadStoredImages(
        api as unknown as ExcalidrawImperativeAPI,
      );
    });

    expect(apollo.query.mock.calls[0][0].variables).toEqual({
      canvasId: 'cv-1',
    });
    expect(fetchMock).toHaveBeenCalledWith('https://bucket.test/a');
    const [added] = api.addFiles.mock.calls[0];
    expect(added).toHaveLength(1);
    expect(added[0]).toMatchObject({
      id: 'a',
      mimeType: 'image/png',
      created: 3,
    });
    expect(added[0].dataURL).toMatch(/^data:image\/png;base64,/);
  });

  it("doesn't ask for images when the canvas has none", async () => {
    const { hook } = setup();
    hook.result.current.resetStored(undefined);
    await act(async () =>
      hook.result.current.loadStoredImages({
        addFiles: vi.fn(),
      } as unknown as ExcalidrawImperativeAPI),
    );
    expect(apollo.query).not.toHaveBeenCalled();
  });
});
