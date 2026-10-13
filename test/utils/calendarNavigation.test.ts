import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { enUS, es, ja } from 'date-fns/locale';
import {
  dateLocale,
  formatWeekRange,
  isCurrentPeriod,
  periodShortLabel,
  periodTitle,
  stepDate,
  weekRange,
  weekdayInitials,
} from '@/pages/Home/components/CalendarView/utils/calendarNavigation';

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

describe('stepDate: one step is a day, a week or a month', () => {
  it('day view moves a day', () => {
    expect(stepDate('day', d(2026, 10, 12), 1)).toEqual(d(2026, 10, 13));
    expect(stepDate('day', d(2026, 11, 1), -1)).toEqual(d(2026, 10, 31));
  });

  it('week view moves a whole week', () => {
    expect(stepDate('week', d(2026, 10, 12), 1)).toEqual(d(2026, 10, 19));
    expect(stepDate('week', d(2026, 10, 12), -1)).toEqual(d(2026, 10, 5));
  });

  it('month view moves a whole month (it used to move one day: nothing changed)', () => {
    expect(stepDate('month', d(2026, 10, 12), 1)).toEqual(d(2026, 11, 12));
    expect(stepDate('month', d(2026, 1, 15), -1)).toEqual(d(2025, 12, 15));
  });

  it('month steps from the 31st land on the last day of shorter months', () => {
    expect(stepDate('month', d(2026, 1, 31), 1)).toEqual(d(2026, 2, 28));
    expect(stepDate('month', d(2028, 1, 31), 1)).toEqual(d(2028, 2, 29));
  });

  it('twelve months forward is next year, same day', () => {
    let date = d(2026, 10, 12);
    for (let i = 0; i < 12; i++) date = stepDate('month', date, 1);
    expect(date).toEqual(d(2027, 10, 12));
  });
});

describe('weeks start on Monday', () => {
  it('a Sunday belongs to the week that started the Monday before', () => {
    const { start, end } = weekRange(d(2026, 10, 18));
    expect(start).toEqual(d(2026, 10, 12));
    expect(end.getDate()).toBe(18);
  });

  it('the week label handles months and years crossing', () => {
    expect(formatWeekRange(d(2026, 10, 14), es)).toBe('12 – 18 oct 2026');
    expect(formatWeekRange(d(2026, 10, 1), es)).toBe('28 sep – 4 oct 2026');
    expect(formatWeekRange(d(2026, 12, 30), es)).toBe(
      '28 dic 2026 – 3 ene 2027',
    );
  });
});

describe('titles in the user language', () => {
  it('month: "Octubre 2026", "October 2026"', () => {
    expect(periodTitle('month', d(2026, 10, 12), es)).toBe('Octubre 2026');
    expect(periodTitle('month', d(2026, 10, 12), enUS)).toBe('October 2026');
  });

  it('day: weekday, day and month', () => {
    expect(periodTitle('day', d(2026, 10, 12), es)).toBe(
      'Lunes, 12 de octubre',
    );
    expect(periodTitle('day', d(2026, 10, 12), enUS)).toBe(
      'Monday, October 12',
    );
    expect(periodTitle('day', d(2026, 10, 12), ja)).toBe('10月12日 月曜日');
  });

  it('week: its range', () => {
    expect(periodTitle('week', d(2026, 10, 14), enUS)).toBe('12 – 18 Oct 2026');
  });

  it('short weekday names start on Monday, never ambiguous', () => {
    expect(weekdayInitials(es)).toEqual([
      'Lu',
      'Ma',
      'Mi',
      'Ju',
      'Vi',
      'Sá',
      'Do',
    ]);
    expect(weekdayInitials(enUS)).toEqual([
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
      'Su',
    ]);
  });

  it('picks the locale from the app language', () => {
    expect(dateLocale('es')).toBe(es);
    expect(dateLocale('es-MX')).toBe(es);
    expect(dateLocale('ja')).toBe(ja);
    expect(dateLocale('en')).toBe(enUS);
    expect(dateLocale(undefined)).toBe(enUS);
  });
});

describe('where "today" is', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(d(2026, 10, 14));
  });
  afterEach(() => vi.useRealTimers());

  it('is the current period for each view', () => {
    expect(isCurrentPeriod('day', d(2026, 10, 14))).toBe(true);
    expect(isCurrentPeriod('day', d(2026, 10, 15))).toBe(false);
    expect(isCurrentPeriod('week', d(2026, 10, 18))).toBe(true);
    expect(isCurrentPeriod('week', d(2026, 10, 19))).toBe(false);
    expect(isCurrentPeriod('month', d(2026, 10, 1))).toBe(true);
    expect(isCurrentPeriod('month', d(2026, 11, 1))).toBe(false);
  });

  it('the short label between the arrows', () => {
    expect(periodShortLabel('day', d(2026, 10, 14), es, 'Hoy')).toBe('Hoy');
    expect(periodShortLabel('day', d(2026, 10, 20), es, 'Hoy')).toBe('20 oct');
    expect(periodShortLabel('week', d(2026, 10, 14), es, 'Hoy')).toBe(
      '12 – 18 oct',
    );
    expect(periodShortLabel('month', d(2026, 10, 14), es, 'Hoy')).toBe(
      'oct 2026',
    );
  });
});
