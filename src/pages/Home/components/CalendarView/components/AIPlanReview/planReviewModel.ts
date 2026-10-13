import { isSameDay, startOfDay } from 'date-fns';
import type { ICalendarEvent } from '../../../CalendarEvent';

// The proposal's preview: the days it touches, the hours shown, and where
// each block (and each event already there) sits in its day's column.

export const minutesOf = (e: { start: Date; end: Date }) =>
  Math.round((e.end.getTime() - e.start.getTime()) / 60_000);

/** The proposed blocks the user kept checked. */
export const includedDrafts = (drafts: ICalendarEvent[], excluded: string[]) =>
  drafts.filter((d) => !excluded.includes(d.id));

/** Total focus time as hours and minutes. */
export const focusTime = (drafts: ICalendarEvent[]) => {
  const total = drafts.reduce((sum, d) => sum + minutesOf(d), 0);
  return { total, hours: Math.floor(total / 60), minutes: total % 60 };
};

/** The days with proposed blocks, in order, each with its blocks by time. */
export const groupByDay = (drafts: ICalendarEvent[]) => {
  const days = new Map<number, ICalendarEvent[]>();
  [...drafts]
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .forEach((d) => {
      const day = startOfDay(d.start).getTime();
      days.set(day, [...(days.get(day) ?? []), d]);
    });
  return [...days.entries()].map(([day, items]) => ({
    day: new Date(day),
    items,
  }));
};

/** The hours the preview shows: the proposal's, with an hour of context
 * around it, whole hours, within the day. */
export const hourRange = (drafts: ICalendarEvent[]) => {
  if (drafts.length === 0) return { from: 9, to: 18 };
  const hourOf = (d: Date) => d.getHours() + d.getMinutes() / 60;
  const from = Math.min(...drafts.map((d) => hourOf(d.start)));
  const to = Math.max(
    ...drafts.map((d) =>
      // A block ending at midnight belongs to the end of its day.
      isSameDay(d.start, d.end) ? hourOf(d.end) : 24,
    ),
  );
  return {
    from: Math.max(0, Math.floor(from) - 1),
    to: Math.min(24, Math.ceil(to) + 1),
  };
};

export interface PlacedItem {
  event: ICalendarEvent;
  /** Percent of the column height. */
  top: number;
  height: number;
}

/** Where an event sits in a day column showing hours `from`–`to`, clipped
 * to it; null when it's outside. */
export const placeInColumn = (
  event: ICalendarEvent,
  day: Date,
  from: number,
  to: number,
): PlacedItem | null => {
  const dayStart = startOfDay(day).getTime();
  const windowStart = dayStart + from * 3_600_000;
  const windowEnd = dayStart + to * 3_600_000;
  const start = Math.max(event.start.getTime(), windowStart);
  const end = Math.min(event.end.getTime(), windowEnd);
  if (end <= start) return null;
  const span = windowEnd - windowStart;
  return {
    event,
    top: ((start - windowStart) / span) * 100,
    height: ((end - start) / span) * 100,
  };
};

/** What's already on the calendar those days (not drafts, placeholders or
 * all-day events), to show the blocks among them. */
export const busyOn = (events: ICalendarEvent[], day: Date) =>
  events.filter(
    (e) =>
      !e.isDraft &&
      !e.allDay &&
      e.type !== 'skeleton' &&
      e.start < new Date(startOfDay(day).getTime() + 86_400_000) &&
      e.end > startOfDay(day),
  );
