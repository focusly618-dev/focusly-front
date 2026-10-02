import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFocusModeTimer } from '@/pages/Home/components/FocusMode/hooks/useFocusModeTimer.hook';
import {
  FOCUS_SESSION_STORAGE_KEY,
  createFocusSession,
  readStoredSession,
} from '@/pages/Home/components/FocusMode/focusSession';

const T0 = new Date('2026-10-02T10:00:00.000Z').getTime();
const MIN = 60_000;

const render = (taskId: string | null = 'task-1', onTimeUp = vi.fn()) =>
  renderHook(() =>
    useFocusModeTimer({
      taskId,
      trackTime: true,
      initialMinutes: 25,
      onTimeUp,
    }),
  );

describe('useFocusModeTimer', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(T0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down from the planned length while active', () => {
    const { result } = render();
    expect(result.current.timeLeft).toBe(25 * 60);

    act(() => result.current.setIsActive(true));
    act(() => {
      vi.advanceTimersByTime(10 * MIN);
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.timeLeft).toBe(15 * 60);
    expect(result.current.progress).toBe(40);
  });

  it('stops at zero and calls onTimeUp once with the stopped session', () => {
    const onTimeUp = vi.fn();
    const { result } = render('task-1', onTimeUp);

    act(() => result.current.setIsActive(true));
    act(() => {
      vi.advanceTimersByTime(30 * MIN);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isActive).toBe(false);
    expect(onTimeUp).toHaveBeenCalledTimes(1);
    expect(onTimeUp.mock.calls[0][0]).toMatchObject({
      runningSince: null,
      accumulatedMs: 25 * MIN,
    });
  });

  it('addTime extends the countdown', () => {
    const { result } = render();
    act(() => result.current.addTime(5 * 60));
    expect(result.current.timeLeft).toBe(30 * 60);
  });

  it('persists the session and resumes it after a reload', () => {
    const first = render();
    act(() => first.result.current.setIsActive(true));
    act(() => {
      vi.advanceTimersByTime(5 * MIN);
    });
    first.unmount();

    // Ten minutes pass with the page closed: a running timer keeps counting.
    vi.setSystemTime(T0 + 15 * MIN);
    const second = render();

    expect(second.result.current.isActive).toBe(true);
    expect(second.result.current.timeLeft).toBe(10 * 60);
    expect(second.result.current.orphan).toBeNull();
  });

  it("hands back another task's stored session as an orphan and starts fresh", () => {
    const other = {
      ...createFocusSession({
        taskId: 'task-old',
        trackTime: true,
        plannedSeconds: 1500,
        now: T0,
      }),
      accumulatedMs: 12 * MIN,
    };
    localStorage.setItem(FOCUS_SESSION_STORAGE_KEY, JSON.stringify(other));

    const { result } = render('task-new');

    expect(result.current.orphan?.sessionId).toBe(other.sessionId);
    expect(result.current.session.taskId).toBe('task-new');
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(readStoredSession()?.taskId).toBe('task-new');
  });

  it('reset starts a new session', () => {
    const { result } = render();
    act(() => result.current.setIsActive(true));
    act(() => {
      vi.advanceTimersByTime(3 * MIN);
    });
    const before = result.current.session.sessionId;

    act(() => result.current.reset());

    expect(result.current.session.sessionId).not.toBe(before);
    expect(result.current.isActive).toBe(false);
    expect(result.current.timeLeft).toBe(25 * 60);
  });
});
