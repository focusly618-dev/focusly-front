import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  del: vi.fn(),
  create: vi.fn(),
  success: vi.fn(() => 'toast-1'),
  error: vi.fn(),
  dismiss: vi.fn(),
  refetchQueries: vi.fn(),
  evict: vi.fn(),
}));

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  const BY_NAME: Record<string, keyof typeof mocks> = {
    UpdateTask: 'update',
    DeleteTask: 'del',
    CreateTask: 'create',
  };
  return {
    ...actual,
    useMutation: (document: {
      definitions: { name?: { value: string } }[];
    }) => [
      mocks[BY_NAME[document.definitions[0]?.name?.value ?? '']],
      { loading: false },
    ],
    useApolloClient: () => ({
      cache: {
        evict: mocks.evict,
        identify: ({ id }: { id: string }) => `Task:${id}`,
        gc: vi.fn(),
      },
      refetchQueries: mocks.refetchQueries,
    }),
  };
});

vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { user: { id: 'u-1' } } }),
}));

vi.mock('@/utils', () => ({
  sileo: {
    success: mocks.success,
    error: mocks.error,
    dismiss: mocks.dismiss,
  },
}));

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

const { useTaskMutations, mapStatusFromBackend, mapStatusToBackend } =
  await import('@/pages/Projects/components/ProjectTasks/hooks/useTaskMutations.hook');

const sentStatus = (call: number) =>
  mocks.update.mock.calls[call][0].variables.updateTaskInput.status;

describe('project task statuses', () => {
  it('every backend status keeps its own name', () => {
    for (const status of [
      'Pending',
      'Todo',
      'Planning',
      'Scheduled',
      'Review',
      'On Hold',
      'Backlog',
      'Done',
    ]) {
      expect(mapStatusToBackend(mapStatusFromBackend(status))).toBe(status);
    }
  });
});

describe('useTaskMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.update.mockResolvedValue({ data: { updateTask: null } });
    mocks.del.mockResolvedValue({ data: { deleteTask: true } });
  });

  const task = {
    id: 't-1',
    title: 'Escribir informe',
    status: 'planning',
    completed: false,
  };

  it('reopening a task puts it back where it was, and Undo does too', async () => {
    const { result } = renderHook(() => useTaskMutations());

    await act(async () => {
      await result.current.toggleProjectTaskComplete(task);
    });
    expect(sentStatus(0)).toBe('Done');
    const toast = (
      mocks.success.mock.calls[0] as unknown as [
        { button: { onClick: () => void } },
      ]
    )[0];
    expect(toast.button).toBeDefined();

    await act(async () => {
      await result.current.toggleProjectTaskComplete({
        ...task,
        status: 'completed',
        completed: true,
      });
    });
    expect(sentStatus(1)).toBe('Planning');

    act(() => toast.button.onClick());
    expect(sentStatus(2)).toBe('Planning');
  });

  it('deletes several tasks with one refetch and one toast', async () => {
    const { result } = renderHook(() => useTaskMutations());
    await act(async () => {
      await result.current.deleteProjectTasks(['a', 'b', 'c']);
    });
    expect(mocks.del).toHaveBeenCalledTimes(3);
    expect(mocks.evict).toHaveBeenCalledTimes(3);
    expect(mocks.refetchQueries).toHaveBeenCalledTimes(1);
    expect(mocks.success).toHaveBeenCalledTimes(1);
  });
});
