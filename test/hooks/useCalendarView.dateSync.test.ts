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

  it('FIXED: estimate_timer of 0 (an explicit zero-minute task) is honored as zero, not silently bumped to 30', () => {
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
    expect(durationMinutes).toBe(0);
  });

  it('FIXED: a negative estimate_timer is clamped to zero-duration instead of putting the end before the start', () => {
    const { result } = renderWithTasks([
      baseTask({
        estimated_start_date: '2026-01-01T09:00:00.000Z',
        estimated_end_date: undefined,
        estimate_timer: -60,
      }),
    ]);
    const event = result.current.events.find((e) => e.id === 't-1');
    expect(event!.end.getTime()).toBe(event!.start.getTime());
  });

  it('FIXED: a task with a [START_DATE:] marker and a garbage deadline now falls back to a valid `end` instead of Invalid Date', () => {
    // The `[START_DATE:...]` regex branch (used for tasks whose real start
    // time is embedded in notes_encrypted rather than estimated_start_date)
    // used to recompute `end` from `task.deadline` with no isNaN guard —
    // it now falls back to start + the task's own duration, same as every
    // other date derivation in this memo.
    const { result } = renderWithTasks([
      baseTask({
        id: 'corrupted-task',
        notes_encrypted: '[START_DATE:2026-01-01T09:00:00.000Z]',
        deadline: 'not-a-real-date',
        estimate_timer: 30,
      }),
    ]);
    const event = result.current.events.find((e) => e.id === 'corrupted-task');
    expect(event).toBeDefined();
    expect(Number.isNaN(event!.end.getTime())).toBe(false);
    expect(event!.end.getTime() - event!.start.getTime()).toBe(30 * 60000);
  });

  it('FIXED: two different tasks that both fall back to a synthetic end date no longer collapse into one calendar event', () => {
    // Even though the fallback is now always a valid date, two distinct
    // tasks sharing a title/START_DATE marker could still land on the
    // exact same fallback start+end and collide via the content-based
    // dedup key. unreliableDateTaskIds tracks any task whose end came from
    // a fallback (not real data) and keys those by id instead, so this
    // no longer happens.
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
    // Two genuinely different tasks were created; both remain visible.
    expect(survivors).toHaveLength(2);
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
