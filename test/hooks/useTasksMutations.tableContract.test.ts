import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const updateTaskMutation = vi.fn();
const deleteTasksMutation = vi.fn();

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  return {
    ...actual,
    useMutation: (doc: { loc?: { source?: { body?: string } } }) => {
      const body = doc?.loc?.source?.body || '';
      if (body.includes('DeleteTasks')) return [deleteTasksMutation, {}];
      return [updateTaskMutation, {}];
    },
  };
});

vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock('@/redux/tasks/task.slice', () => ({
  upsertTask: (p: unknown) => ({ type: 'upsert', payload: p }),
  removeTasks: (p: unknown) => ({ type: 'remove', payload: p }),
}));

vi.mock('@/utils', () => ({
  handleMutationError: vi.fn(),
}));

const { useTasksMutations } =
  await import('@/pages/Tasks/hooks/useTasksMutations.hook');

const tableRowTask = {
  id: 'task-1',
  user_id: 'u-1',
  title: 'Ship table fix',
  notes_encrypted: 'notes',
  estimate_timer: 45,
  real_timer: 10,
  priority_level: 3,
  deadline: '2026-08-29T18:00:00.000Z',
  status: 'Todo' as const,
  category: 'General',
  tags: [{ name: 'work' }],
  use_ai: false,
};

describe('useTasksMutations — table row contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateTaskMutation.mockResolvedValue({
      data: { updateTask: tableRowTask },
    });
  });

  it('must send estimate_timer from the row field (estimate_timer), not estimate_minutes', async () => {
    const { result } = renderHook(() =>
      useTasksMutations({ userId: 'u-1', tasks: [], onSuccess: vi.fn() }),
    );

    await act(async () => {
      await result.current.updateTask('task-1', {
        ...tableRowTask,
        use_ai: true,
      });
    });

    expect(updateTaskMutation).toHaveBeenCalledTimes(1);
    const input =
      updateTaskMutation.mock.calls[0][0].variables.updateTaskInput;

    expect(input.use_ai).toBe(true);
    expect(input.estimate_timer).toBe(45);
  });

  it('refetchQueries for GET_TASKS must include the same paginated variables the table uses', async () => {
    const { result } = renderHook(() =>
      useTasksMutations({ userId: 'u-1', tasks: [], onSuccess: vi.fn() }),
    );

    await act(async () => {
      await result.current.updateTask('task-1', tableRowTask);
    });

    const { refetchQueries } = updateTaskMutation.mock.calls[0][0];
    const getTasksRefetch = refetchQueries.find(
      (q: { query?: { loc?: { source?: { body?: string } } }; variables?: object }) =>
        q.query?.loc?.source?.body?.includes('getTasksByUserPaginated'),
    );

    expect(getTasksRefetch).toBeDefined();
    expect(getTasksRefetch.variables).toMatchObject({
      userId: 'u-1',
      offset: expect.any(Number),
      limit: expect.any(Number),
    });
  });
});
