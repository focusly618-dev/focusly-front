import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import type { BinaryFiles } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values ? `${key} ${JSON.stringify(values)}` : key,
    i18n: { language: 'es' },
  }),
}));
const notify = vi.hoisted(() => ({ warning: vi.fn(), error: vi.fn() }));
vi.mock('@/utils', () => ({
  notify,
  getFriendlyErrorMessage: (_e: unknown, fallback: string) => fallback,
}));
const billing = vi.hoisted(() => ({
  isPro: false,
  openUpgrade: vi.fn(),
  canvasLimits: null as null | { max_image_bytes: number },
}));
vi.mock('@/hooks/useBilling', () => ({ useBilling: () => billing }));

// The drawing tool, standing in: it records what it was given
const excalidraw = vi.hoisted(() => ({
  props: null as null | Record<string, unknown>,
}));
vi.mock('@excalidraw/excalidraw', () => ({
  Excalidraw: (props: Record<string, unknown>) => {
    excalidraw.props = props;
    return null;
  },
  hashElementsVersion: (elements: unknown[]) => elements.length,
  exportToBlob: vi.fn(),
}));
vi.mock('@excalidraw/excalidraw/index.css', () => ({}));

const apollo = vi.hoisted(() => ({
  createUpload: vi.fn(),
  updateCanvas: vi.fn(),
  query: vi.fn(),
}));
vi.mock('@apollo/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@apollo/client')>()),
  useQuery: () => ({
    data: {
      canvas: {
        id: 'cv-1',
        name: 'Plan',
        icon: null,
        data: { elements: [], appState: {} },
      },
    },
    loading: false,
    error: undefined,
  }),
  useMutation: (doc: { definitions: { name?: { value: string } }[] }) => {
    const name = doc.definitions[0].name?.value;
    if (name === 'UpdateCanvas') return [apollo.updateCanvas];
    return [apollo.createUpload];
  },
  useApolloClient: () => ({ query: apollo.query, refetchQueries: vi.fn() }),
}));

const { canvasLimitError, formatMegabytes, useCanvasLimitNotice } =
  await import('@/pages/Workspace/components/Editor/components/EditorContent/canvasPlan');
const { useCanvasFiles } =
  await import('@/pages/Workspace/components/Editor/components/EditorContent/useCanvasFiles.hook');
const { EditorCanvas } =
  await import('@/pages/Workspace/components/Editor/components/EditorContent/EditorCanvas');

const limitError = (code: string, limit: number) =>
  Object.assign(new Error(code), {
    graphQLErrors: [{ message: code, extensions: { code, limit } }],
  });

beforeEach(() => {
  vi.clearAllMocks();
  billing.isPro = false;
  billing.canvasLimits = null;
});

describe('reading a plan limit from a GraphQL error', () => {
  it('finds the code and limit the server sends', () => {
    expect(canvasLimitError(limitError('canvas_limit_reached', 3))).toEqual({
      code: 'canvas_limit_reached',
      limit: 3,
    });
  });

  it("ignores errors that aren't about the plan", () => {
    expect(canvasLimitError(new Error('offline'))).toBeNull();
    expect(
      canvasLimitError({ graphQLErrors: [{ extensions: { code: 'OTHER' } }] }),
    ).toBeNull();
  });

  it('writes sizes in megabytes', () => {
    expect(formatMegabytes(2 * 1024 * 1024)).toBe('2 MB');
    expect(formatMegabytes(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });
});

describe('telling the user about a limit', () => {
  it('opens Pro right away when creating one more canvas', () => {
    const { result } = renderHook(() => useCanvasLimitNotice());
    result.current({ code: 'canvas_limit_reached', limit: 3 });

    expect(billing.openUpgrade).toHaveBeenCalledWith('canvas');
    expect(notify.warning.mock.calls[0][0]).toMatchObject({
      title: 'workspaceEditor.canvases.limitReached {"count":3}',
      button: undefined,
    });
  });

  it('leaves Pro behind a button while drawing', () => {
    const { result } = renderHook(() => useCanvasLimitNotice());
    result.current({ code: 'canvas_too_large', limit: 1024 * 1024 });

    expect(billing.openUpgrade).not.toHaveBeenCalled();
    const toast = notify.warning.mock.calls[0][0];
    expect(toast.description).toContain('1 MB');
    toast.button.onClick();
    expect(billing.openUpgrade).toHaveBeenCalledWith('canvas');
  });

  it("doesn't offer Pro to a Pro account", () => {
    billing.isPro = true;
    const { result } = renderHook(() => useCanvasLimitNotice());
    result.current({ code: 'canvas_limit_reached', limit: 3 });
    expect(billing.openUpgrade).not.toHaveBeenCalled();
    expect(notify.warning.mock.calls[0][0].button).toBeUndefined();
  });
});

describe('images over the plan', () => {
  const image = {
    id: 'el',
    type: 'image',
    fileId: 'a',
    isDeleted: false,
  } as unknown as ExcalidrawElement;
  const files = {
    a: {
      id: 'a',
      mimeType: 'image/png',
      dataURL: 'data:image/png;base64,AA==',
      created: 1,
    },
  } as unknown as BinaryFiles;

  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        blob: async () => new Blob(['x'.repeat(300)], { type: 'image/png' }),
      })),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("aren't sent when the plan is known not to take them", async () => {
    const onPlanLimit = vi.fn();
    const { result } = renderHook(() =>
      useCanvasFiles({
        canvasId: 'cv-1',
        onStored: vi.fn(),
        maxImageBytes: 100,
        onPlanLimit,
      }),
    );
    await act(async () => result.current.storeNewImages([image], files));
    await act(async () => result.current.storeNewImages([image], files));

    expect(apollo.createUpload).not.toHaveBeenCalled();
    expect(onPlanLimit).toHaveBeenCalledTimes(1);
    expect(onPlanLimit).toHaveBeenCalledWith({
      code: 'canvas_image_too_large',
      limit: 100,
    });
  });

  it('stop being tried once the server says the plan is full', async () => {
    apollo.createUpload.mockRejectedValue(limitError('canvas_image_limit', 10));
    const onPlanLimit = vi.fn();
    const { result } = renderHook(() =>
      useCanvasFiles({ canvasId: 'cv-1', onStored: vi.fn(), onPlanLimit }),
    );
    await act(async () => result.current.storeNewImages([image], files));
    await act(async () => result.current.storeNewImages([image], files));

    expect(apollo.createUpload).toHaveBeenCalledTimes(1);
    expect(onPlanLimit).toHaveBeenCalledWith({
      code: 'canvas_image_limit',
      limit: 10,
    });
    expect(notify.error).not.toHaveBeenCalled();
  });
});

describe('a canvas on a phone', () => {
  const stubScreen = (phone: boolean) =>
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: phone && query.includes('pointer: coarse'),
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        dispatchEvent: vi.fn(),
      })),
    );
  afterEach(() => vi.unstubAllGlobals());

  const renderCanvas = () =>
    render(
      <EditorCanvas
        title="Plan"
        icon={null}
        onLoaded={vi.fn()}
        onClose={vi.fn()}
        canvasId="cv-1"
      />,
    );
  const draw = () => {
    const onChange = excalidraw.props!.onChange as (...args: unknown[]) => void;
    vi.useFakeTimers();
    act(() => {
      onChange([{ id: 'r', type: 'rectangle', isDeleted: false }], {}, {});
      vi.advanceTimersByTime(10_000);
    });
    vi.useRealTimers();
  };

  it('opens to be looked at, and saves nothing', () => {
    stubScreen(true);
    renderCanvas();

    expect(excalidraw.props?.viewModeEnabled).toBe(true);
    expect(screen.getByText(/canvases\.readOnlyPhone "/)).toBeInTheDocument();
    draw();
    expect(apollo.updateCanvas).not.toHaveBeenCalled();
  });

  it('still edits on a computer', () => {
    stubScreen(false);
    apollo.updateCanvas.mockResolvedValue({});
    renderCanvas();

    expect(excalidraw.props?.viewModeEnabled).toBe(false);
    expect(screen.queryByText(/canvases\.readOnlyPhone "/)).toBeNull();
    draw();
    expect(apollo.updateCanvas).toHaveBeenCalled();
  });
});
