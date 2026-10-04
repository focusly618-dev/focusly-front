// Due dates in the project tasks view are calendar days. They are saved as
// local midnight, like the rest of the app's date pickers.
//
// This view used to save them as UTC midnight ("2026-10-03T00:00:00Z"), which
// west of UTC reads as the evening before and showed a day early. Those
// values are read by their UTC date; anything else by the local date. Local
// midnight is never exactly UTC midnight unless the user is on UTC, where both
// readings agree.

const isUtcMidnight = (d: Date) =>
  d.getUTCHours() === 0 &&
  d.getUTCMinutes() === 0 &&
  d.getUTCSeconds() === 0 &&
  d.getUTCMilliseconds() === 0;

/** The calendar day a stored deadline falls on, as a local-midnight Date. */
export const getCalendarDay = (raw?: string | null): Date | null => {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return null;
  return isUtcMidnight(d)
    ? new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    : new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/** A stored deadline as the "YYYY-MM-DD" value of a date input. */
export const toDateInputValue = (raw?: string | null): string => {
  const day = getCalendarDay(raw);
  if (!day) return '';
  const mm = String(day.getMonth() + 1).padStart(2, '0');
  const dd = String(day.getDate()).padStart(2, '0');
  return `${day.getFullYear()}-${mm}-${dd}`;
};

/** A date input value ("YYYY-MM-DD") as the ISO string to store. */
export const dateInputToISO = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (match) {
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d)).toISOString();
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

export type DueDateHighlight = 'overdue' | 'today' | 'tomorrow' | 'normal';

/** Whole days from today to the deadline's day (negative when past). */
export const daysUntil = (
  raw?: string | null,
  now = new Date(),
): number | null => {
  const day = getCalendarDay(raw);
  if (!day) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((day.getTime() - today.getTime()) / 86_400_000);
};

export const getDueDateHighlight = (
  raw?: string | null,
  now = new Date(),
): DueDateHighlight | undefined => {
  const days = daysUntil(raw, now);
  if (days === null) return undefined;
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  return 'normal';
};
