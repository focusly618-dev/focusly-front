import { describe, it, expect } from 'vitest';
import reducer, {
  setEvents,
  addEvent,
  updateEvent,
  removeEvent,
  incrementSyncVersion,
} from '@/redux/calendar/calendar.slice';
import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';

const baseEvent = (
  overrides: Partial<GoogleCalendarEvent> = {},
): GoogleCalendarEvent =>
  ({
    id: 'ev-1',
    title: 'Sample event',
    deadline: '2026-01-01T00:00:00.000Z',
    estimated_start_date: '2026-01-01T00:00:00.000Z',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    is_all_day: false,
    ...overrides,
  }) as GoogleCalendarEvent;

const initialState = { reduxEvents: [], syncVersion: 0 };

describe('calendar.slice reducer', () => {
  it('setEvents replaces the whole list', () => {
    const state = reducer(
      { reduxEvents: [baseEvent()], syncVersion: 0 },
      setEvents([]),
    );
    expect(state.reduxEvents).toEqual([]);
  });

  it('updateEvent silently no-ops for an id that is not in the store — a task-calendar-sync trap', () => {
    // This is the exact shape of bug the calendar/task sync depends on:
    // dispatching updateEvent for a task that was never mirrored into
    // reduxEvents (e.g. a platform task, which this slice never stores)
    // produces zero feedback and zero effect.
    const original = baseEvent({ id: 'ev-1', title: 'Original' });
    const state = reducer(
      { reduxEvents: [original], syncVersion: 0 },
      updateEvent(
        baseEvent({ id: 'platform-task-not-in-calendar-slice', title: 'New' }),
      ),
    );
    expect(state.reduxEvents).toEqual([original]);
  });

  it('removeEvent on an empty list is a safe no-op', () => {
    const state = reducer(initialState, removeEvent({ id: 'anything' }));
    expect(state.reduxEvents).toEqual([]);
  });

  it('addEvent allows duplicate ids to coexist (no upsert semantics, unlike task.slice)', () => {
    const event = baseEvent();
    const state = reducer(
      { reduxEvents: [event], syncVersion: 0 },
      addEvent(event),
    );
    // BUG-ish asymmetry: task.slice has upsertTask (dedupe-by-id), but
    // calendar.slice has no equivalent — addEvent always pushes, so any
    // caller that dispatches addEvent twice for the same id (e.g. a
    // duplicate Google webhook delivery) duplicates the calendar entry.
    expect(state.reduxEvents).toHaveLength(2);
  });

  it('incrementSyncVersion increments from a numeric value', () => {
    const state = reducer(
      { reduxEvents: [], syncVersion: 5 },
      incrementSyncVersion(),
    );
    expect(state.syncVersion).toBe(6);
  });

  it('incrementSyncVersion recovers from a corrupt undefined syncVersion instead of producing NaN', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const corruptState = { reduxEvents: [], syncVersion: undefined as any };
    const state = reducer(corruptState, incrementSyncVersion());
    expect(state.syncVersion).toBe(1);
  });
});

describe('calendar.slice — task/calendar drift adversarial cases', () => {
  it('deleting a task from task.slice does NOT automatically remove it from calendar.slice (slices are fully independent)', () => {
    // This documents the structural sync risk found in useCalendarView.hook.ts:
    // task.slice and calendar.slice have no shared reducer or selector —
    // any call site that dispatches removeTask() but forgets removeEvent()
    // (or vice versa) leaves the two slices disagreeing about whether the
    // item still exists. The calendar.slice reducer itself cannot prevent
    // this; it has no knowledge that task.slice exists.
    const orphanEvent = baseEvent({ id: 'shared-id' });
    const calendarState = reducer(
      { reduxEvents: [orphanEvent], syncVersion: 0 },
      // Simulates a caller that only cleaned up the task list, not the
      // calendar mirror — calendar.slice has no removeTask action at all,
      // so there is no way to even accidentally do the right thing here.
      incrementSyncVersion(),
    );
    expect(calendarState.reduxEvents).toEqual([orphanEvent]);
  });
});
