import type {
  GoogleCalendarEvent,
  GoogleEventAttendee,
} from '@/redux/calendar/calendar.types';
import type { LuminaActionPayload } from '@/utils';
import { DEFAULT_EVENT_MINUTES, eventWindow } from './eventBody';
import { formatRange, formatSlot, parseDeadline } from './planFormat';

// What the preview shows about calendar events: the event as the app has it
// (from the calendar list) and what an action will make of it.

export interface EventTimes {
  start: Date | null;
  end: Date | null;
  allDay: boolean;
}

const NO_TIMES: EventTimes = { start: null, end: null, allDay: false };

export const findCalendarEvent = (
  events: GoogleCalendarEvent[],
  id?: string,
): GoogleCalendarEvent | undefined =>
  id ? events.find((e) => e.id === id || e.google_event_id === id) : undefined;

/** Whether an event already has a Google Meet link. */
export const hasMeetLink = (event?: GoogleCalendarEvent | null) =>
  Boolean(event?.links?.some((link) => link.url?.includes('meet.google.com')));

/** Everyone invited except the user. */
export const eventGuests = (
  event?: GoogleCalendarEvent | null,
): GoogleEventAttendee[] =>
  (event?.attendees ?? []).filter((a) => a.email && !a.self);

// The calendar list sends naive UTC date-times ("2026-10-05T16:00:00").
const utcInstant = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(
    /Z$|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`,
  );
  return Number.isNaN(date.getTime()) ? null : date;
};

// All-day events are calendar days, whatever the time zone.
const calendarDay = (value?: string | null) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};

export const existingEventTimes = (
  event?: GoogleCalendarEvent | null,
): EventTimes => {
  if (!event) return NO_TIMES;
  if (event.is_all_day) {
    const start = calendarDay(event.estimated_start_date);
    // Google's end date is exclusive.
    const after = calendarDay(event.deadline);
    const end =
      start && after && after > start
        ? new Date(after.getFullYear(), after.getMonth(), after.getDate() - 1)
        : start;
    return { start, end, allDay: true };
  }
  return {
    start: utcInstant(event.estimated_start_date),
    end: utcInstant(event.deadline),
    allDay: false,
  };
};

/** When a new event happens. */
export const newEventTimes = (payload: LuminaActionPayload): EventTimes =>
  eventWindow(payload);

/**
 * When the event will be after an UPDATE_EVENT (null if it doesn't move).
 * Mirrors buildEventPatchBody: a moved event keeps its length.
 */
export const updatedEventTimes = (
  payload: LuminaActionPayload,
  event?: GoogleCalendarEvent | null,
): EventTimes | null => {
  if (!payload.start && !payload.end) return null;
  if (payload.all_day) {
    const start = parseDeadline(payload.start) ?? parseDeadline(payload.end);
    return { start, end: parseDeadline(payload.end) ?? start, allDay: true };
  }
  const before = existingEventTimes(event);
  const length =
    !before.allDay && before.start && before.end && before.end > before.start
      ? before.end.getTime() - before.start.getTime()
      : (Number(payload.duration_minutes) || DEFAULT_EVENT_MINUTES) * 60000;
  const start = parseDeadline(payload.start) ?? before.start;
  const end =
    parseDeadline(payload.end) ??
    (start ? new Date(start.getTime() + length) : null);
  return { start, end, allDay: false };
};

export const eventMinutes = (times: EventTimes) =>
  times.start && times.end && !times.allDay
    ? Math.max(
        0,
        Math.round((times.end.getTime() - times.start.getTime()) / 60000),
      )
    : null;

/** "vie 3 oct, 10:00 – 10:30", or "3 oct – 5 oct · Todo el día". */
export const formatEventTimes = (
  times: EventTimes,
  locale: string,
  allDayLabel: string,
): string | null => {
  if (!times.start) return null;
  if (times.allDay) {
    return `${formatRange(times.start, times.end ?? times.start, locale)} · ${allDayLabel}`;
  }
  return formatSlot(
    times.start,
    eventMinutes(times) ?? DEFAULT_EVENT_MINUTES,
    locale,
  );
};
