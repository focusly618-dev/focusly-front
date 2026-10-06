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
  modify: vi.fn(),
  recordOptimistic: vi.fn(),
  removeOptimistic: vi.fn(),
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
        identify: ({ __typename, id }: { __typename?: string; id: string }) =>
          `${__typename ?? 'Task'}:${id}`,
        gc: vi.fn(),
        modify: mocks.modify,
        // Runs the transaction right away, like the real cache does.
        recordOptimisticTransaction: (
          transaction: (cache: unknown) => void,
          id: string,
        ) => {
          mocks.recordOptimistic(id);
          transaction({
            identify: ({
              __typename,
              id: entityId,
            }: {
              __typename: string;
              id: string;
            }) => `${__typename}:${entityId}`,
            modify: mocks.modify,
          });
        },
        removeOptimistic: mocks.removeOptimistic,
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
  notify: {
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

  it('shows a new status before the server answers and drops it afterwards', async () => {
    let answer: (value: unknown) => void = () => {};
    mocks.update.mockReturnValueOnce(
      new Promise((resolve) => {
        answer = resolve;
      }),
    );
    const { result } = renderHook(() => useTaskMutations());

    let pending: Promise<unknown> = Promise.resolve();
    act(() => {
      pending = result.current.setProjectTaskStatus(task, 'completed');
    });

    const change = mocks.modify.mock.calls[0][0];
    expect(change.id).toBe('Task:t-1');
    expect(change.fields.status()).toBe('Done');
    expect(mocks.removeOptimistic).not.toHaveBeenCalled();

    await act(async () => {
      answer({ data: { updateTask: null } });
      await pending;
    });
    expect(mocks.removeOptimistic).toHaveBeenCalledWith(
      mocks.recordOptimistic.mock.calls[0][0],
    );
  });

  it('drops the optimistic change when the server rejects it', async () => {
    mocks.update.mockRejectedValueOnce(new Error('offline'));
    const { result } = renderHook(() => useTaskMutations());

    await act(async () => {
      await expect(
        result.current.toggleProjectSubtask('t-1', 's-2', [
          { id: 's-1', title: 'Uno', completed: true },
          { id: 's-2', title: 'Dos', completed: false },
        ]),
      ).rejects.toThrow('offline');
    });

    const change = mocks.modify.mock.calls[0][0];
    expect(change.id).toBe('Subtask:s-2');
    expect(change.fields.completed(false)).toBe(true);
    expect(mocks.removeOptimistic).toHaveBeenCalledTimes(1);
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
