// Dates and durations in the plan, in the interface language.

export const formatWhen = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const formatTime = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

export const formatDay = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(
    date,
  );

/** "vie 3 oct, 10:00 – 10:45" */
export const formatSlot = (start: Date, minutes: number, locale: string) => {
  const end = new Date(start.getTime() + minutes * 60000);
  return `${formatWhen(start, locale)} – ${formatTime(end, locale)}`;
};

/** "3 oct – 10 oct", or a single day. */
export const formatRange = (first: Date, last: Date, locale: string) => {
  const a = formatDay(first, locale);
  const b = formatDay(last, locale);
  return a === b ? a : `${a} – ${b}`;
};

/** "1 h 30 min" style, short. */
export const formatMinutes = (minutes: number) => {
  if (!Number.isFinite(minutes) || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

/** A value for <input type="datetime-local"> from a plan date. */
export const toDateTimeInput = (date: Date | null) => {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** Minutes from a model-supplied estimate (some send seconds). */
export const normalizeEstimateTimer = (value?: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1800;
  if (value > 1000 && value % 60 === 0) return Math.round(value / 60);
  return value;
};

/** Parses the LLM-supplied "deadline" (ISO date, e.g. "2026-09-07"); null if missing/invalid. */
// The system prompt only ever asks the model for a bare "YYYY-MM-DD" — no
// time of day — so every deadline anchors here. 9 AM matches the app's own
// default working hours (see scheduler_service.py's workingHours default)
// and this user's stated productive window, giving created tasks a sensible
// visible start time instead of a literal "12:00 AM".
const DEFAULT_DEADLINE_HOUR = 9;

export const parseDeadline = (value?: string): Date | null => {
  if (!value) return null;
  // A bare YYYY-MM-DD date must be read as a *local* calendar date, not UTC
  // midnight — `new Date('2026-09-07')` parses as UTC, which lands on the
  // previous day in any timezone behind UTC (e.g. Sep 6 in Mexico/Central
  // Time instead of the intended Sep 7). It also has no time of day, so we
  // anchor it to DEFAULT_DEADLINE_HOUR rather than midnight — otherwise a
  // task's estimated_start_date/estimated_end_date (derived from this) ends
  // up showing as "12:00 AM - 1:30 AM" on the calendar.
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const local = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      DEFAULT_DEADLINE_HOUR,
    );
    return Number.isNaN(local.getTime()) ? null : local;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
