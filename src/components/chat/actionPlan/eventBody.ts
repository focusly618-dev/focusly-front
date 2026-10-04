import type { LuminaActionPayload } from '@/utils';
import type { RawGoogleEvent } from '@/redux/calendar/calendar.types';
import { parseDeadline } from './planFormat';

// Lumina's calendar actions → Google Calendar event bodies. Times arrive as
// the user's local date-times ("YYYY-MM-DDTHH:MM:SS"); Google gets an exact
// instant plus the user's time zone. All-day events use dates, with Google's
// exclusive end date.

export const DEFAULT_EVENT_MINUTES = 30;

const pad = (n: number) => String(n).padStart(2, '0');
const toDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const nextDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

const userTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valid, de-duplicated emails (case-insensitive). */
export const cleanEmails = (emails: unknown): string[] => {
  if (!Array.isArray(emails)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of emails) {
    const email = String(raw ?? '').trim();
    const key = email.toLowerCase();
    if (EMAIL.test(email) && !seen.has(key)) {
      seen.add(key);
      result.push(email);
    }
  }
  return result;
};

const meetRequest = () => ({
  createRequest: {
    requestId: `focusly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    conferenceSolutionKey: { type: 'hangoutsMeet' },
  },
});

/** Start and end of an event as the preview shows them. */
export const eventWindow = (
  payload: LuminaActionPayload,
): { start: Date | null; end: Date | null; allDay: boolean } => {
  const allDay = Boolean(payload.all_day);
  const start = parseDeadline(payload.start);
  if (!start) return { start: null, end: null, allDay };
  if (allDay) {
    return { start, end: parseDeadline(payload.end) ?? start, allDay };
  }
  const minutes = Number(payload.duration_minutes) || DEFAULT_EVENT_MINUTES;
  const end =
    parseDeadline(payload.end) ?? new Date(start.getTime() + minutes * 60000);
  return { start, end, allDay };
};

export const buildEventCreateBody = (
  payload: LuminaActionPayload,
  timeZone = userTimeZone(),
): Partial<RawGoogleEvent> => {
  const { start, end, allDay } = eventWindow(payload);
  if (!start || !end) throw new Error('The event has no start date');

  const body: Partial<RawGoogleEvent> = {
    summary: payload.title?.trim() || 'Evento',
    start: allDay
      ? { date: toDate(start) }
      : { dateTime: start.toISOString(), timeZone },
    end: allDay
      ? { date: toDate(nextDay(end)) }
      : { dateTime: end.toISOString(), timeZone },
  };
  if (payload.description) body.description = payload.description;
  if (payload.location) body.location = payload.location;
  const attendees = cleanEmails(payload.attendees);
  if (attendees.length) body.attendees = attendees.map((email) => ({ email }));
  if (payload.meet) body.conferenceData = meetRequest();
  return body;
};

const rawHasMeet = (event?: RawGoogleEvent | null) =>
  Boolean(
    event?.hangoutLink ||
    event?.conferenceData?.entryPoints?.some((e) =>
      e.uri?.includes('meet.google.com'),
    ),
  );

/** Length of a timed event, in ms (null for all-day or unknown). */
const rawLength = (event?: RawGoogleEvent | null) => {
  const start = event?.start?.dateTime ? new Date(event.start.dateTime) : null;
  const end = event?.end?.dateTime ? new Date(event.end.dateTime) : null;
  return start && end && end > start ? end.getTime() - start.getTime() : null;
};

/** Whether applying the action needs the event as Google has it now. */
export const patchNeedsCurrent = (payload: LuminaActionPayload) =>
  Boolean(
    payload.add_attendees?.length ||
    payload.remove_attendees?.length ||
    ((payload.start || payload.end) && !payload.all_day) ||
    payload.meet,
  );

/**
 * Only the fields the action changes, on top of the event as Google has it
 * now (`current`). The API replaces the guest list whole, so guests are added
 * to and removed from the current list — keeping everyone else, with their
 * answers. A moved event keeps its length unless a new end is given.
 */
export const buildEventPatchBody = (
  payload: LuminaActionPayload,
  current: RawGoogleEvent | null | undefined,
  timeZone = userTimeZone(),
): Partial<RawGoogleEvent> => {
  const body: Partial<RawGoogleEvent> = {};
  if (payload.title?.trim()) body.summary = payload.title.trim();
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.location !== undefined) body.location = payload.location;

  if (payload.start || payload.end) {
    if (payload.all_day) {
      const start = parseDeadline(payload.start) ?? parseDeadline(payload.end);
      const end = parseDeadline(payload.end) ?? start;
      if (start && end) {
        body.start = { date: toDate(start) };
        body.end = { date: toDate(nextDay(end)) };
      }
    } else {
      const oldStart = current?.start?.dateTime
        ? new Date(current.start.dateTime)
        : null;
      const length =
        rawLength(current) ??
        (Number(payload.duration_minutes) || DEFAULT_EVENT_MINUTES) * 60000;
      const start = parseDeadline(payload.start) ?? oldStart;
      const end =
        parseDeadline(payload.end) ??
        (start ? new Date(start.getTime() + length) : null);
      if (start) body.start = { dateTime: start.toISOString(), timeZone };
      if (end) body.end = { dateTime: end.toISOString(), timeZone };
    }
  }

  const adding = cleanEmails(payload.add_attendees);
  const removing = new Set(
    cleanEmails(payload.remove_attendees).map((e) => e.toLowerCase()),
  );
  if (adding.length || removing.size) {
    if (!current) throw new Error("Couldn't load the event's current guests");
    const kept = (current.attendees ?? []).filter(
      (a) => a.email && !removing.has(a.email.toLowerCase()),
    );
    const known = new Set(kept.map((a) => a.email!.toLowerCase()));
    const added = adding
      .filter((email) => !known.has(email.toLowerCase()))
      .map((email) => ({ email }));
    body.attendees = [...kept, ...added];
  }

  if (payload.meet && !rawHasMeet(current)) body.conferenceData = meetRequest();
  return body;
};
