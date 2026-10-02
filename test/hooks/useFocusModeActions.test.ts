import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { Task } from '@/redux/tasks/task.types';

const mutate = vi.fn();
const query = vi.fn();
const dispatch = vi.fn();

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  return {
    ...actual,
    useMutation: () => [mutate, {}],
    useApolloClient: () => ({ query }),
  };
});

vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => dispatch,
}));

const handleMutationError = vi.fn();
vi.mock('@/utils', () => ({ handleMutationError }));

const { useFocusModeActions } =
  await import('@/pages/Home/components/FocusMode/hooks/useFocusModeActions.hook');

const task = { id: 'task-1', title: 'Write report' } as Task;

// What the server holds, as Apollo returns it (with __typename).
const serverTask = {
  __typename: 'Task',
  id: 'task-1',
  real_timer: 30,
  time_logs: [{ __typename: 'TimeLog', date: '2026-10-01', minutes: 30 }],
};

const sentInput = () => mutate.mock.calls[0][0].variables.updateTaskInput;

describe('useFocusModeActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    // Local noon, so the "today" log date doesn't depend on the time zone.
    vi.setSystemTime(new Date(2026, 9, 2, 12, 0, 0));
    query.mockResolvedValue({ data: { task: serverTask } });
    mutate.mockImplementation(async ({ variables }) => ({
      data: {
        updateTask: { ...serverTask, ...variables.updateTaskInput },
      },
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('logFocusTime adds the minutes to real_timer and a log for today, reading the task fresh', async () => {
    const { result } = renderHook(() => useFocusModeActions());

    const saved = await result.current.logFocusTime('task-1', 25);

    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { id: 'task-1' },
        fetchPolicy: 'network-only',
      }),
    );
    expect(sentInput()).toEqual({
      id: 'task-1',
      real_timer: 55,
      time_logs: [
        { date: '2026-10-01', minutes: 30 },
        { date: '2026-10-02', minutes: 25 },
      ],
    });
    expect(saved?.real_timer).toBe(55);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("logFocusTime merges into today's existing log", async () => {
    query.mockResolvedValue({
      data: {
        task: {
          ...serverTask,
          time_logs: [
            { __typename: 'TimeLog', date: '2026-10-02', minutes: 10 },
          ],
          real_timer: 10,
        },
      },
    });
    const { result } = renderHook(() => useFocusModeActions());

    await result.current.logFocusTime('task-1', 15);

    expect(sentInput().time_logs).toEqual([
      { date: '2026-10-02', minutes: 25 },
    ]);
    expect(sentInput().real_timer).toBe(25);
  });

  it('handleCompleteTask marks the task Done and logs the session once', async () => {
    const { result } = renderHook(() => useFocusModeActions());

    const updated = await result.current.handleCompleteTask(task, 20);

    expect(sentInput()).toMatchObject({
      id: 'task-1',
      status: 'Done',
      real_timer: 50,
    });
    expect(updated?.status).toBe('Done');
  });

  it('handleCompleteTask with no minutes skips the time fields', async () => {
    const { result } = renderHook(() => useFocusModeActions());

    await result.current.handleCompleteTask(task, 0);

    expect(query).not.toHaveBeenCalled();
    expect(sentInput()).toEqual({
      id: 'task-1',
      status: 'Done',
      duration: null,
    });
  });

  it('reports a failed save and returns null', async () => {
    query.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useFocusModeActions());

    const saved = await result.current.logFocusTime('task-1', 5);

    expect(saved).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
    expect(handleMutationError).toHaveBeenCalledTimes(1);
  });
});
