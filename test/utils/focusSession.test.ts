import { describe, it, expect } from 'vitest';
import {
  createFocusSession,
  getElapsedMinutes,
  getElapsedMs,
  getTimeLeftSeconds,
  getUnsavedMinutes,
  pauseSession,
  startSession,
} from '@/pages/Home/components/FocusMode/focusSession';

const T0 = 1_700_000_000_000;
const MIN = 60_000;

const session = (overrides = {}) => ({
  ...createFocusSession({
    taskId: 'task-1',
    trackTime: true,
    plannedSeconds: 25 * 60,
    now: T0,
  }),
  ...overrides,
});

describe('focusSession timing', () => {
  it('counts time only while running', () => {
    const running = startSession(session(), T0);
    expect(getElapsedMs(running, T0 + 10 * MIN)).toBe(10 * MIN);

    const paused = pauseSession(running, T0 + 10 * MIN);
    expect(paused.runningSince).toBeNull();
    // Time passing while paused doesn't count.
    expect(getElapsedMs(paused, T0 + 60 * MIN)).toBe(10 * MIN);

    const resumed = startSession(paused, T0 + 60 * MIN);
    expect(getElapsedMs(resumed, T0 + 65 * MIN)).toBe(15 * MIN);
  });

  it('derives the time left from timestamps', () => {
    const running = startSession(session(), T0);
    expect(getTimeLeftSeconds(running, T0)).toBe(25 * 60);
    expect(getTimeLeftSeconds(running, T0 + 1500)).toBe(25 * 60 - 1);
    expect(getTimeLeftSeconds(running, T0 + 25 * MIN)).toBe(0);
  });

  it('caps elapsed time at the countdown length (timer left running in a closed tab)', () => {
    const running = startSession(session(), T0);
    expect(getElapsedMinutes(running, T0 + 5 * 60 * MIN)).toBe(25);
  });

  it('adding time extends the countdown without lowering the time worked', () => {
    const running = startSession(session(), T0);
    const extended = { ...running, extraSeconds: 5 * 60 };
    expect(getElapsedMinutes(extended, T0 + 20 * MIN)).toBe(20);
    expect(getTimeLeftSeconds(extended, T0 + 20 * MIN)).toBe(10 * 60);
  });

  it('does not start once the time is up', () => {
    const done = { ...session(), accumulatedMs: 25 * MIN };
    expect(startSession(done, T0)).toBe(done);
  });

  it('reports only the minutes not saved yet', () => {
    const running = startSession(session({ savedMinutes: 10 }), T0);
    expect(getUnsavedMinutes(running, T0 + 22 * MIN)).toBe(12);
  });

  it('reports nothing to save for tasks that cannot track time', () => {
    const google = startSession(session({ trackTime: false }), T0);
    expect(getUnsavedMinutes(google, T0 + 20 * MIN)).toBe(0);
  });
});
