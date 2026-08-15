import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@/redux/tasks/task.slice';
import calendarReducer from '@/redux/calendar/calendar.slice';
import authReducer from '@/redux/auth/auth.slice';
import schedulingReducer from '@/redux/scheduling/scheduling.slice';
import type { Task } from '@/redux/tasks/task.types';

vi.mock('@/api/GoogleCalendar/googleCalendarApi', () => ({
  deleteGoogleEvent: vi.fn(),
  fetchGoogleEvents: vi.fn().mockResolvedValue([]),
  updateGoogleEvent: vi.fn(),
  createGoogleEvent: vi.fn(),
}));

const { useCalendarView } =
  await import('@/pages/Home/components/CalendarView/hooks/useCalendarView.hook');

// With auth.user === null, `useQuery(GET_TASKS, { skip: !user?.id })` never
// fires and the Google Calendar fetch effect (gated on the same condition)
// never runs either — so `tasks` for the `events` memo comes entirely from
// the Redux store we seed directly, with no need to mock any GraphQL
// response shape. This isolates exactly the task -> calendar-event date
// math this suite targets.
const renderWithTasks = (tasks: Task[]) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      calendar: calendarReducer,
      task: taskReducer,
      scheduling: schedulingReducer,
    },
    preloadedState: {
      auth: {
        isLogged: false,
        user: null,
        authProvider: null,
        onboardingCompleted: false,
        sessionExpiredNotice: false,
      },
      task: { tasks, loading: false, error: null },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      MemoryRouter,
      null,
      createElement(
        MockedProvider,
        { mocks: [], addTypename: false },
        createElement(Provider, { store, children }),
      ),
    );

  return renderHook(() => useCalendarView(), { wrapper });
};

const baseTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't-1',
  user_id: 'u-1',
  title: 'Task',
  notes_encrypted: '',
  priority_level: 2,
  deadline: '2026-01-01T10:00:00.000Z',
  status: 'Todo',
  category: 'General',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  estimate_timer: 30,
  ...overrides,
});

describe('useCalendarView events memo — task changes reflecting on the calendar', () => {
  it('places a well-formed task at its estimated_start_date/estimated_end_date', () => {
    const { result } = renderWithTasks([
      baseTask({
        estimated_start_date: '2026-01-01T09:00:00.000Z',
        estimated_end_date: '2026-01-01T09:30:00.000Z',
      }),
    ]);
    const event = result.current.events.find((e) => e.id === 't-1');
    expect(event).toBeDefined();
    expect(event!.start.toISOString()).toBe('2026-01-01T09:00:00.000Z');
    expect(event!.end.toISOString()).toBe('2026-01-01T09:30:00.000Z');
  });

  it('falls back to "now" (not a crash) when both deadline and estimated_start_date are null', () => {
    const { result } = renderWithTasks([
      baseTask({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deadline: null as any,
        estimated_start_date: null,
      }),
    ]);
    const event = result.current.events.find((e) => e.id === 't-1');
    expect(event).toBeDefined();
    expect(Number.isNaN(event!.start.getTime())).toBe(false);
    // Silent wrong-placement, not a crash — a task that legitimately had no
    // deadline renders "now" on the calendar with no indication of that.
  });

  it('BUG: estimate_timer of 0 (an explicit zero-minute task) is silently treated as 30 minutes, not zero', () => {
    const { result } = renderWithTasks([
      baseTask({
        estimated_start_date: '2026-01-01T09:00:00.000Z',
        estimated_end_date: undefined,
        estimate_timer: 0,
      }),
    ]);
    const event = result.current.events.find((e) => e.id === 't-1');
    const durationMinutes =
      (event!.end.getTime() - event!.start.getTime()) / 60000;
    expect(durationMinutes).toBe(30);
  });

  it('BUG: a negative estimate_timer produces an end time before the start time, with no guard', () => {
    const { result } = renderWithTasks([
      baseTask({
        estimated_start_date: '2026-01-01T09:00:00.000Z',
        estimated_end_date: undefined,
        estimate_timer: -60,
      }),
    ]);
    const event = result.current.events.find((e) => e.id === 't-1');
    expect(event!.end.getTime()).toBeLessThan(event!.start.getTime());
  });

  it('TRAGIC: a task with a [START_DATE:] marker and a garbage deadline produces an Invalid Date `end`, silently corrupting downstream duration math', () => {
    // The `[START_DATE:...]` regex branch (used for tasks whose real start
    // time is embedded in notes_encrypted rather than estimated_start_date)
    // recomputes `end = new Date(task.deadline || new Date())` with NO
    // isNaN guard — unlike every other date derivation in this same memo.
    const { result } = renderWithTasks([
      baseTask({
        id: 'corrupted-task',
        notes_encrypted: '[START_DATE:2026-01-01T09:00:00.000Z]',
        deadline: 'not-a-real-date',
      }),
    ]);
    const event = result.current.events.find((e) => e.id === 'corrupted-task');
    expect(event).toBeDefined();
    expect(Number.isNaN(event!.end.getTime())).toBe(true);
    // Any later code computing (end.getTime() - start.getTime()) gets NaN,
    // and `NaN || 0` (a pattern used in this codebase's overlap-sort logic)
    // silently coerces that to a duration of exactly 0 — this event will
    // misbehave in any overlap/duration-based layout or sort without ever
    // throwing an error a developer or user could notice.
  });

  it('TRAGIC: two different tasks with the same title, same valid START_DATE marker, and a garbage deadline collapse into a single calendar event — one task silently vanishes', () => {
    // The reassignment branch (`if (startDateMatch && !isNaN(parsedStart...))`)
    // only fires when the [START_DATE:] marker itself parses successfully —
    // when it does, `end` is recomputed from `task.deadline` with NO isNaN
    // guard (unlike every other date derivation in this memo). Two distinct
    // tasks sharing a title and START_DATE marker, each with its own garbage
    // deadline, both land on `end = Invalid Date`. The dedup key is
    // `${title}_${start.getTime()}_${end.getTime()}`; Invalid Date always
    // stringifies its NaN getTime() identically, so both keys are equal and
    // only one of the two genuinely different tasks survives the Map.
    const { result } = renderWithTasks([
      baseTask({
        id: 'ghost-1',
        title: 'Duplicate Title',
        notes_encrypted: '[START_DATE:2026-01-01T09:00:00.000Z]',
        deadline: 'invalid-date-a',
      }),
      baseTask({
        id: 'ghost-2',
        title: 'Duplicate Title',
        notes_encrypted: '[START_DATE:2026-01-01T09:00:00.000Z]',
        deadline: 'invalid-date-b',
      }),
    ]);

    const survivors = result.current.events.filter(
      (e) => e.title === 'Duplicate Title',
    );
    // Two genuinely different tasks were created; only one is visible.
    expect(survivors).toHaveLength(1);
  });

  it('two tasks with different titles but both Invalid Date `end` do NOT collide (title is part of the key)', () => {
    const { result } = renderWithTasks([
      baseTask({
        id: 'ghost-a',
        title: 'Task A',
        notes_encrypted: '[START_DATE:2026-01-01T09:00:00.000Z]',
        deadline: 'invalid-date-a',
      }),
      baseTask({
        id: 'ghost-b',
        title: 'Task B',
        notes_encrypted: '[START_DATE:2026-01-01T09:00:00.000Z]',
        deadline: 'invalid-date-a',
      }),
    ]);
    const survivors = result.current.events.filter((e) =>
      ['Task A', 'Task B'].includes(e.title),
    );
    expect(survivors).toHaveLength(2);
  });
});

describe("useCalendarView's own GET_TASKS query — does it ever populate Redux from live data?", () => {
  it('BUG: tasksData?.tasks is read directly, but the real GET_TASKS (=GET_TASKS_PAGINATED) response shape is { result: { tasks } } — this field is always undefined', async () => {
    // This test documents the shape mismatch directly against the actual
    // gql documents used, without needing a live network round trip:
    // Tasks.graphql.ts re-exports `GET_TASKS_PAGINATED` as `GET_TASKS`,
    // whose selection set aliases everything under `result`, never a
    // top-level `tasks` field.
    const { GET_TASKS } = await import('@/pages/Tasks/Tasks.graphql');
    const source =
      typeof GET_TASKS.loc?.source.body === 'string'
        ? GET_TASKS.loc.source.body
        : '';
    // The query text defines `result: getTasksByUserPaginated(...)`, so a
    // response comes back as `{ result: { tasks, totalCount } }`.
    expect(source).toMatch(/result\s*:\s*getTasksByUserPaginated/);
    expect(source).not.toMatch(/^\s*tasks\s*:/m);
  });
});
