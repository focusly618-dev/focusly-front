import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  isSameYear,
  isThisMonth,
  isThisWeek,
  isToday,
  startOfWeek,
  type Locale,
} from 'date-fns';
import { enUS, es, ja } from 'date-fns/locale';

// Moving through the calendar: what one step is in each view, and how the
// period on screen is named. The header's arrows used to move one day in
// every view, so in the month view they changed nothing visible.

export type CalendarViewName = 'day' | 'week' | 'month';

/** Weeks start on Monday, as in the calendar's localizer. */
export const WEEK_STARTS_ON = 1 as const;

export const dateLocale = (language?: string): Locale =>
  language?.startsWith('es') ? es : language?.startsWith('ja') ? ja : enUS;

/** One step back (-1) or forward (+1) in the view: a day, a week or a month. */
export const stepDate = (
  view: CalendarViewName,
  date: Date,
  direction: -1 | 1,
): Date => {
  if (view === 'month') return addMonths(date, direction);
  if (view === 'week') return addWeeks(date, direction);
  return addDays(date, direction);
};

const capitalize = (text: string) =>
  text.charAt(0).toLocaleUpperCase() + text.slice(1);

/** The week shown for a date, Monday to Sunday. */
export const weekRange = (date: Date) => ({
  start: startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }),
  end: endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }),
});

/** The week as "6 – 12 oct 2026", "29 sep – 5 oct 2026" or
 * "29 dic 2026 – 4 ene 2027". */
export const formatWeekRange = (date: Date, locale: Locale) => {
  const { start, end } = weekRange(date);
  if (!isSameYear(start, end)) {
    return `${format(start, 'd MMM yyyy', { locale })} – ${format(end, 'd MMM yyyy', { locale })}`;
  }
  if (!isSameMonth(start, end)) {
    return `${format(start, 'd MMM', { locale })} – ${format(end, 'd MMM yyyy', { locale })}`;
  }
  return `${format(start, 'd', { locale })} – ${format(end, 'd MMM yyyy', { locale })}`;
};

/** A day's title per language: "Lunes, 12 de octubre", "Monday, October
 * 12", "10月12日 月曜日". */
const DAY_TITLE: Record<string, string> = {
  es: "EEEE, d 'de' MMMM",
  'en-US': 'EEEE, MMMM d',
  ja: 'M月d日 EEEE',
};

/** The big title over the calendar, for the view on screen. */
export const periodTitle = (
  view: CalendarViewName,
  date: Date,
  locale: Locale,
): string => {
  if (view === 'month')
    return capitalize(format(date, 'LLLL yyyy', { locale }));
  if (view === 'week') return formatWeekRange(date, locale);
  return capitalize(
    format(date, DAY_TITLE[locale.code ?? ''] ?? 'EEEE, MMMM d', { locale }),
  );
};

/** Whether "today" is inside the period on screen (the "Today" button is
 * then already where it would go). */
export const isCurrentPeriod = (view: CalendarViewName, date: Date) =>
  view === 'month'
    ? isThisMonth(date)
    : view === 'week'
      ? isThisWeek(date, { weekStartsOn: WEEK_STARTS_ON })
      : isToday(date);

/** The short label between the arrows: "Hoy", "12 oct", "6 – 12 oct" or
 * "oct 2026". */
export const periodShortLabel = (
  view: CalendarViewName,
  date: Date,
  locale: Locale,
  todayLabel: string,
): string => {
  if (view === 'month') return format(date, 'LLL yyyy', { locale });
  if (view === 'week') {
    const { start, end } = weekRange(date);
    return isSameMonth(start, end)
      ? `${format(start, 'd', { locale })} – ${format(end, 'd MMM', { locale })}`
      : `${format(start, 'd MMM', { locale })} – ${format(end, 'd MMM', { locale })}`;
  }
  return isToday(date) ? todayLabel : format(date, 'd MMM', { locale });
};

/** Monday-first short week day names ("Lu", "Ma", "Mi"…): two letters, as
 * one is ambiguous in Spanish (martes and miércoles). */
export const weekdayInitials = (locale: Locale) => {
  const monday = startOfWeek(new Date(2026, 0, 5), {
    weekStartsOn: WEEK_STARTS_ON,
  });
  return Array.from({ length: 7 }, (_, i) =>
    capitalize(format(addDays(monday, i), 'EEEEEE', { locale })),
  );
};
