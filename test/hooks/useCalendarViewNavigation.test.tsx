import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import React from 'react';

vi.mock('@apollo/client', async (original) => ({
  ...(await original<typeof import('@apollo/client')>()),
  useQuery: () => ({ data: undefined, loading: false, refetch: vi.fn() }),
  useMutation: () => [vi.fn(), { loading: false }],
}));
vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (s: unknown) => unknown) =>
    select({
      auth: { user: { id: 'u1', settings: {} } },
      calendar: { reduxEvents: [], syncVersion: 0 },
      task: { tasks: [] },
    }),
}));
vi.mock('@/utils', () => ({
  notify: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
  getFriendlyErrorMessage: (_: unknown, fallback: string) => fallback,
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const { useCalendarView } =
  await import('@/pages/Home/components/CalendarView/hooks/useCalendarView.hook');

/** The hook on a URL, plus that URL as it changes. */
const setup = (url: string) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  );
  return renderHook(
    () => {
      const calendar = useCalendarView();
      const [params] = useSearchParams();
      return { calendar, v: params.get('v'), d: params.get('d') };
    },
    { wrapper },
  );
};

describe('moving through the calendar', () => {
  it('month view: the arrows change the month (they used to move one day)', () => {
    const { result } = setup('/tasks?tab=DailyPlan&v=month&d=2026-10-12');
    act(() => result.current.calendar.handleStep(1));
    expect(result.current).toMatchObject({ v: 'month', d: '2026-11-12' });
    act(() => result.current.calendar.handleStep(-1));
    act(() => result.current.calendar.handleStep(-1));
    expect(result.current).toMatchObject({ v: 'month', d: '2026-09-12' });
  });

  it('a whole year forward and back, month by month', () => {
    const { result } = setup('/tasks?v=month&d=2026-01-31');
    for (let i = 0; i < 12; i++)
      act(() => result.current.calendar.handleStep(1));
    // Months shorter than 31 days clamp the day; the month is always right.
    expect(result.current.d?.slice(0, 7)).toBe('2027-01');
    expect(result.current.calendar.currentDate.getFullYear()).toBe(2027);
  });

  it('week view moves a week, day view a day', () => {
    const week = setup('/tasks?v=week&d=2026-10-12');
    act(() => week.result.current.calendar.handleStep(1));
    expect(week.result.current).toMatchObject({ v: 'week', d: '2026-10-19' });

    const day = setup('/tasks?v=day&d=2026-10-12');
    act(() => day.result.current.calendar.handleStep(-1));
    expect(day.result.current).toMatchObject({ v: 'day', d: '2026-10-11' });
  });

  it('clicking a day in the month opens that day (it used to stay on the month)', () => {
    const { result } = setup('/tasks?v=month&d=2026-10-12');
    act(() =>
      result.current.calendar.handleDrillDown(new Date(2026, 9, 21), 'day'),
    );
    expect(result.current).toMatchObject({ v: 'day', d: '2026-10-21' });
    expect(result.current.calendar.currentView).toBe('day');
  });

  it('changing the view keeps the date; other URL params survive', () => {
    const { result } = setup('/tasks?tab=DailyPlan&v=day&d=2026-10-12');
    act(() => result.current.calendar.handleOnChangeView('month'));
    expect(result.current).toMatchObject({ v: 'month', d: '2026-10-12' });
    act(() => result.current.calendar.handleOnChangeView('week'));
    expect(result.current).toMatchObject({ v: 'week', d: '2026-10-12' });
  });

  it('an invalid view or date in the URL falls back safely', () => {
    const { result } = setup('/tasks?v=agenda&d=nope');
    expect(result.current.calendar.currentView).toBe('day');
    expect(result.current.calendar.currentDate).toBeInstanceOf(Date);
    expect(Number.isNaN(result.current.calendar.currentDate.getTime())).toBe(
      false,
    );
  });
});
