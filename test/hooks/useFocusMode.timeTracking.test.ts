import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { Task } from '@/redux/tasks/task.types';
import {
  FOCUS_SESSION_STORAGE_KEY,
  createFocusSession,
} from '@/pages/Home/components/FocusMode/focusSession';

const logFocusTime = vi.fn();
const handleCompleteTask = vi.fn();

vi.mock(
  '@/pages/Home/components/FocusMode/hooks/useFocusModeActions.hook',
  () => ({
    useFocusModeActions: () => ({
      logFocusTime,
      handleCompleteTask,
      handleUpdateStatus: vi.fn(),
      handleUpdatePriority: vi.fn(),
    }),
  }),
);

// The real hook also queries today's tasks; only the active task matters here.
vi.mock(
  '@/pages/Home/components/FocusMode/hooks/useFocusModeTasks.hook',
  async () => {
    const { useState } = await import('react');
    return {
      useFocusModeTasks: ({ initialTask }: { initialTask?: Task | null }) => {
        const [activeTask, setActiveTask] = useState<Task | null>(
          initialTask ?? null,
        );
        return {
          activeTask,
          setActiveTask,
          activeItem: activeTask,
          todaysTasks: [],
          tasksData: undefined,
          tasksLoading: false,
        };
      },
    };
  },
);

vi.mock('@/redux/hooks', () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { user: { id: 'u-1', settings: {} } } }),
}));

const { useFocusMode } =
  await import('@/pages/Home/components/FocusMode/hooks/useFocusMode.hooks');

const T0 = new Date('2026-10-02T10:00:00.000Z').getTime();
const MIN = 60_000;

const task = {
  id: 'task-1',
  title: 'Write report',
  estimate_timer: 25,
  real_timer: 0,
  source: 'platform',
  task_type: 'PlatformTask',
} as Task;

const render = (focusTask: Task = task) => {
  const onClose = vi.fn();
  const hook = renderHook(() =>
    useFocusMode({ open: true, task: focusTask, onClose }),
  );
  return { ...hook, onClose };
};

const runFor = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe('useFocusMode time tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(T0);
    logFocusTime.mockImplementation(async (id: string, minutes: number) => ({
      ...task,
      id,
      real_timer: minutes,
    }));
    handleCompleteTask.mockImplementation(async (t: Task, minutes: number) => ({
      ...t,
      status: 'Done',
      real_timer: (t.real_timer || 0) + minutes,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('completing logs the time worked once, not twice', async () => {
    const { result } = render();
    act(() => result.current.timer.setIsActive(true));
    runFor(20 * MIN);

    await act(async () => {
      await result.current.tasks.handleCompleteTask();
    });

    expect(handleCompleteTask).toHaveBeenCalledTimes(1);
    expect(handleCompleteTask.mock.calls[0][1]).toBe(20);
    expect(result.current.tasks.activeTask?.real_timer).toBe(20);
    expect(result.current.ui.isSessionCompleted).toBe(true);
  });

  it('+5m does not lower the time logged', async () => {
    const { result } = render();
    act(() => result.current.timer.setIsActive(true));
    runFor(10 * MIN);
    act(() => result.current.timer.addTime(5 * 60));
    runFor(10 * MIN);

    await act(async () => {
      await result.current.tasks.handleCompleteTask();
    });

    expect(handleCompleteTask.mock.calls[0][1]).toBe(20);
  });

  it('ending the session early saves the time instead of dropping it', async () => {
    const { result, onClose } = render();
    act(() => result.current.timer.setIsActive(true));
    runFor(12 * MIN);

    await act(async () => {
      result.current.ui.confirmExit();
    });

    expect(logFocusTime).toHaveBeenCalledWith('task-1', 12);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(result.current.timer.timeLeft).toBe(25 * 60);
  });

  it('time up saves the session, and exiting right after does not log it again', async () => {
    const { result } = render();
    act(() => result.current.timer.setIsActive(true));
    runFor(26 * MIN);

    expect(result.current.timer.timeLeft).toBe(0);
    expect(result.current.ui.isSessionCompleted).toBe(false);
    expect(logFocusTime).toHaveBeenCalledTimes(1);
    expect(logFocusTime).toHaveBeenCalledWith('task-1', 25);

    await act(async () => {
      result.current.ui.confirmExit();
    });

    expect(logFocusTime).toHaveBeenCalledTimes(1);
  });

  it("logs the unsaved time of the previous task's session on mount", async () => {
    const previous = {
      ...createFocusSession({
        taskId: 'task-old',
        trackTime: true,
        plannedSeconds: 1500,
        now: T0,
      }),
      accumulatedMs: 18 * MIN,
      savedMinutes: 5,
    };
    localStorage.setItem(FOCUS_SESSION_STORAGE_KEY, JSON.stringify(previous));

    render();
    await act(async () => {});

    expect(logFocusTime).toHaveBeenCalledTimes(1);
    expect(logFocusTime).toHaveBeenCalledWith('task-old', 13);
  });

  it('does not try to log time on Google Calendar events', async () => {
    const googleEvent = {
      ...task,
      id: 'gcal-1',
      source: 'google',
      task_type: 'GoogleTask',
    } as Task;
    const { result } = render(googleEvent);
    act(() => result.current.timer.setIsActive(true));
    runFor(10 * MIN);

    await act(async () => {
      result.current.ui.confirmExit();
    });

    expect(logFocusTime).not.toHaveBeenCalled();
  });
});
