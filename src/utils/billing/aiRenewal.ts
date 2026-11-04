// When the AI limits start over. The backend counts in UTC (the free messages
// by calendar month, Pro's fair use by day), so the instant is the same for
// everyone; each user sees it in their own time zone and language: "1 de
// noviembre, 18:00" in Mexico City, "11月2日 9:00" in Tokyo.

/** The start of next month in UTC, as the backend counts. */
export const nextUtcMonthStart = (now = new Date()) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

/** The start of tomorrow in UTC, as the backend counts. */
export const nextUtcDayStart = (now = new Date()) =>
  new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

/** The backend's instant (ISO), or the one worked out here until it says. */
const instant = (iso: string | null | undefined, fallback: Date) => {
  const date = iso ? new Date(iso) : fallback;
  return Number.isNaN(date.getTime()) ? fallback : date;
};

/** A reset instant as a date and time in the user's own time zone. */
export const formatRenewal = (
  iso: string | null | undefined,
  fallback: Date,
  language: string,
  timeZone?: string,
) =>
  new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(instant(iso, fallback));

/** When the month's free messages come back. */
export const freeMessagesRenewal = (
  iso: string | null | undefined,
  language: string,
  timeZone?: string,
) => formatRenewal(iso, nextUtcMonthStart(), language, timeZone);

/** When Pro's fair use for today starts over. */
export const dailyUseRenewal = (
  iso: string | null | undefined,
  language: string,
  timeZone?: string,
) => formatRenewal(iso, nextUtcDayStart(), language, timeZone);
