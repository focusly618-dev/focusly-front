import { describe, it, expect } from 'vitest';
import {
  eventGuests,
  existingEventTimes,
  findCalendarEvent,
  formatEventTimes,
  hasMeetLink,
  updatedEventTimes,
} from '@/components/chat/actionPlan/eventPreview';
import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';

const event = (over: Partial<GoogleCalendarEvent> = {}) =>
  ({
    id: 'ev1',
    google_event_id: 'ev1',
    title: 'Sync con Ana',
    // The calendar list sends naive UTC date-times.
    estimated_start_date: '2026-10-05T16:00:00',
    deadline: '2026-10-05T16:45:00',
    is_all_day: false,
    links: [{ title: 'Google Meet', url: 'https://meet.google.com/abc' }],
    attendees: [
      { email: 'yo@example.com', self: true },
      { email: 'ana@example.com', responseStatus: 'accepted' },
    ],
    ...over,
  }) as GoogleCalendarEvent;

describe('event preview', () => {
  it('finds events by either id and reads naive dates as UTC', () => {
    const found = findCalendarEvent([event()], 'ev1');
    const times = existingEventTimes(found);
    expect(times.start?.toISOString()).toBe('2026-10-05T16:00:00.000Z');
    expect(times.end?.toISOString()).toBe('2026-10-05T16:45:00.000Z');
    expect(findCalendarEvent([event()], undefined)).toBeUndefined();
  });

  it('shows all-day events on their calendar days (end is exclusive)', () => {
    const times = existingEventTimes(
      event({
        is_all_day: true,
        estimated_start_date: '2026-10-05T00:00:00',
        deadline: '2026-10-07T00:00:00',
      }),
    );
    expect(times.allDay).toBe(true);
    expect(times.start).toEqual(new Date(2026, 9, 5));
    expect(times.end).toEqual(new Date(2026, 9, 6));
  });

  it('a moved event keeps its length', () => {
    const moved = updatedEventTimes({ start: '2026-10-06T09:00:00' }, event());
    expect(moved?.start).toEqual(new Date('2026-10-06T09:00:00'));
    expect(moved?.end).toEqual(new Date('2026-10-06T09:45:00'));
    expect(updatedEventTimes({ title: 'x' }, event())).toBeNull();
  });

  it('lists guests without the user, and spots Meet links', () => {
    expect(eventGuests(event()).map((g) => g.email)).toEqual([
      'ana@example.com',
    ]);
    expect(hasMeetLink(event())).toBe(true);
    expect(hasMeetLink(event({ links: [] }))).toBe(false);
  });

  it('formats times for the chips', () => {
    const allDay = formatEventTimes(
      { start: new Date(2026, 9, 5), end: new Date(2026, 9, 5), allDay: true },
      'en',
      'All day',
    );
    expect(allDay).toMatch(/Oct.*All day$/);
    expect(
      formatEventTimes({ start: null, end: null, allDay: false }, 'en', 'x'),
    ).toBeNull();
  });
});
