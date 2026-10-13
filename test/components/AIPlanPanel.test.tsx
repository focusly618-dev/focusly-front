import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

vi.mock('@/components/ui', () => ({ LuminaOrb: () => <div>ORB</div> }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && 'count' in opts
        ? `${key}:${opts.count}`
        : opts && 'title' in opts
          ? `${key}:${opts.title}`
          : key,
    i18n: { language: 'es' },
  }),
}));

import { AIPlanPanel } from '@/pages/Home/components/CalendarView/components/AIPlanPanel/AIPlanPanel';
import { AIPlanReviewDialog } from '@/pages/Home/components/CalendarView/components/AIPlanReview/AIPlanReviewDialog';
import { AIPlanPill } from '@/pages/Home/components/CalendarView/components/AIPlanReview/AIPlanPill';
import {
  busyOn,
  focusTime,
  groupByDay,
  hourRange,
  placeInColumn,
} from '@/pages/Home/components/CalendarView/components/AIPlanReview/planReviewModel';
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';

const today = new Date();
const at = (dayOffset: number, h: number, m = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
};

const draft = (
  id: string,
  start: Date,
  end: Date,
  task: Record<string, unknown> = {},
  reason?: string,
): ICalendarEvent => ({
  id: `draft-${id}`,
  title: `Task ${id}`,
  start,
  end,
  type: 'task',
  isDraft: true,
  draftReason: reason,
  resource: { id, title: `Task ${id}`, priority_level: 2, ...task } as never,
});

const event = (
  id: string,
  start: Date,
  end: Date,
  over = {},
): ICalendarEvent => ({
  id,
  title: `Event ${id}`,
  start,
  end,
  type: 'event',
  ...over,
});

const drafts = [
  draft('b', at(1, 9), at(1, 10), {}, 'Mañana con energía'),
  draft('a', at(0, 15), at(0, 16, 30), {
    priority_level: 3,
    deadline: at(0, 18).toISOString(),
  }),
  draft('c', at(0, 17), at(0, 17, 30), {
    priority_level: 1,
    deadline: at(0, 12).toISOString(),
    estimated_start_date: at(-1, 9).toISOString(),
  }),
];

const dialog = (
  over: Partial<React.ComponentProps<typeof AIPlanReviewDialog>> = {},
) => {
  const props = {
    open: true,
    drafts,
    excluded: [],
    unplaced: [],
    busyEvents: [event('meet', at(0, 14), at(0, 15))],
    confirming: false,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    onDiscard: vi.fn(),
    onToggle: vi.fn(),
    ...over,
  };
  render(<AIPlanReviewDialog {...props} />);
  return props;
};

describe('AIPlanPanel: Lumina at work (side panel)', () => {
  it('shows the steps: done, current and still to come', () => {
    render(
      <AIPlanPanel
        onCancel={vi.fn()}
        plan={{ phase: 'thinking', startedAt: Date.now() }}
      />,
    );
    const steps = screen.getAllByRole('listitem');
    expect(steps.map((s) => s.textContent)).toEqual([
      'calendar.plan.steps.tasks',
      'calendar.plan.steps.slots',
      'calendar.plan.steps.thinking',
      'calendar.plan.steps.checking',
    ]);
    expect(steps[2]).toHaveAttribute('aria-current', 'step');
  });

  it('counts the seconds and can be cancelled', () => {
    const onCancel = vi.fn();
    render(
      <AIPlanPanel
        onCancel={onCancel}
        plan={{ phase: 'tasks', startedAt: Date.now() }}
      />,
    );
    expect(screen.getByText('calendar.plan.elapsed:0')).toBeInTheDocument();
    fireEvent.click(screen.getByText('calendar.cancelPlanning'));
    expect(onCancel).toHaveBeenCalled();
  });
});

describe('AIPlanReviewDialog: the proposal in the center', () => {
  it('a dialog with the summary: blocks and focus time', () => {
    dialog();
    const box = screen.getByRole('dialog', {
      name: 'calendar.plan.reviewTitle',
    });
    expect(
      within(box).getByText(/calendar\.plan\.reviewSummary:3/),
    ).toHaveTextContent('calendar.plan.focusTime');
    expect(
      within(box).getByText('calendar.plan.confirm:3'),
    ).toBeInTheDocument();
  });

  it('previews the blocks as on the calendar, with the events already there', () => {
    dialog();
    const preview = screen.getByRole('group', {
      name: 'calendar.plan.previewLabel',
    });
    // One column per day, today first.
    expect(
      within(preview).getByText('calendar.plan.today'),
    ).toBeInTheDocument();
    expect(
      within(preview).getByText('calendar.plan.tomorrow'),
    ).toBeInTheDocument();
    expect(within(preview).getByTestId('preview-draft-a')).toHaveTextContent(
      'Task a',
    );
    // The meeting at 14:00 is shown next to them.
    expect(within(preview).getByText('Event meet')).toBeInTheDocument();
  });

  it('hovering a block in the list highlights it in the preview', () => {
    dialog();
    const item = screen
      .getByRole('checkbox', { name: /Task b/ })
      .closest('label')!;
    fireEvent.mouseEnter(item);
    expect(screen.getByTestId('preview-draft-b')).toHaveAttribute(
      'data-highlighted',
      'true',
    );
    fireEvent.mouseLeave(item);
    expect(screen.getByTestId('preview-draft-b')).not.toHaveAttribute(
      'data-highlighted',
    );
  });

  it('a block can be left out from the list or from the preview', () => {
    const props = dialog({ excluded: ['draft-a'] });
    expect(screen.getByText('calendar.plan.confirm:2')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Task a/ })).not.toBeChecked();
    fireEvent.click(screen.getByRole('checkbox', { name: /Task a/ }));
    fireEvent.click(screen.getByTestId('preview-draft-c'));
    expect(props.onToggle.mock.calls).toEqual([['draft-a'], ['draft-c']]);
  });

  it('nothing checked: nothing to schedule', () => {
    dialog({ excluded: drafts.map((d) => d.id) });
    expect(
      screen.getByRole('button', { name: 'calendar.plan.confirm:0' }),
    ).toBeDisabled();
  });

  it('deadlines, priority, what was moved and why', () => {
    dialog();
    expect(
      screen.getByText('calendar.plan.beforeDeadline'),
    ).toBeInTheDocument();
    expect(screen.getByText('calendar.plan.afterDeadline')).toBeInTheDocument();
    expect(screen.getAllByText('calendar.plan.rescheduled')).toHaveLength(1);
    expect(screen.getByText('calendar.plan.priority.high')).toBeInTheDocument();
    expect(screen.getByText('Mañana con energía')).toBeInTheDocument();
  });

  it('lists what did not fit, on demand', () => {
    dialog({ unplaced: [{ id: 'x', title: 'Leer libro' }] });
    const toggle = screen.getByRole('button', {
      name: 'calendar.plan.unplaced:1',
    });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Leer libro')).toBeInTheDocument();
  });

  it('closing keeps the proposal; confirm and discard decide', () => {
    const props = dialog();
    fireEvent.click(
      screen.getByRole('button', { name: 'calendar.plan.closeReview' }),
    );
    fireEvent.click(screen.getByText('calendar.plan.confirm:3'));
    fireEvent.click(screen.getByText('calendar.discard'));
    expect(props.onClose).toHaveBeenCalled();
    expect(props.onConfirm).toHaveBeenCalled();
    expect(props.onDiscard).toHaveBeenCalled();
  });

  it('while scheduling, nothing can be changed nor closed', () => {
    const props = dialog({ confirming: true });
    expect(screen.getByText('calendar.scheduling')).toBeInTheDocument();
    expect(screen.getByText('calendar.discard')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'calendar.plan.closeReview' }),
    ).toBeDisabled();
    screen
      .getAllByRole('checkbox')
      .forEach((box) => expect(box).toBeDisabled());
    fireEvent.click(screen.getByTestId('preview-draft-a'));
    expect(props.onToggle).not.toHaveBeenCalled();
  });
});

describe('AIPlanPill: the proposal while looking at the calendar', () => {
  it('reopens the review or discards', () => {
    const onReview = vi.fn();
    const onDiscard = vi.fn();
    render(<AIPlanPill count={9} onReview={onReview} onDiscard={onDiscard} />);
    expect(screen.getByRole('region')).toHaveTextContent(
      'calendar.plan.reviewSummary:9',
    );
    fireEvent.click(screen.getByText('calendar.plan.review'));
    fireEvent.click(screen.getByText('calendar.discard'));
    expect(onReview).toHaveBeenCalled();
    expect(onDiscard).toHaveBeenCalled();
  });
});

describe('the preview layout', () => {
  const day = at(0, 0);

  it('shows the proposal hours with an hour around them', () => {
    expect(hourRange(drafts)).toEqual({ from: 8, to: 19 });
    expect(hourRange([])).toEqual({ from: 9, to: 18 });
  });

  it('a block ending at midnight belongs to the end of its day', () => {
    const late = draft('late', at(0, 22), at(1, 0));
    expect(hourRange([late])).toEqual({ from: 21, to: 24 });
  });

  it('places a block in its column, as a share of the hours shown', () => {
    const placed = placeInColumn(drafts[1], day, 14, 18)!;
    // 15:00–16:30 in a 14–18 window: a quarter down, 37.5% tall.
    expect(placed.top).toBeCloseTo(25);
    expect(placed.height).toBeCloseTo(37.5);
  });

  it('clips what starts before the window, drops what is outside', () => {
    const early = event('e', at(0, 6), at(0, 9));
    expect(placeInColumn(early, day, 8, 18)).toMatchObject({ top: 0 });
    expect(
      placeInColumn(event('x', at(0, 20), at(0, 21)), day, 8, 18),
    ).toBeNull();
  });

  it('busy time leaves out the drafts, all-day events and other days', () => {
    const list = [
      event('meet', at(0, 10), at(0, 11)),
      event('bday', at(0, 0), at(1, 0), { allDay: true }),
      event('tomorrow', at(1, 10), at(1, 11)),
      drafts[1],
    ];
    expect(busyOn(list, day).map((e) => e.id)).toEqual(['meet']);
  });

  it('groups by day in time order, and adds up the focus time', () => {
    expect(groupByDay(drafts).map((g) => g.items.map((d) => d.id))).toEqual([
      ['draft-a', 'draft-c'],
      ['draft-b'],
    ]);
    expect(focusTime(drafts)).toEqual({ total: 180, hours: 3, minutes: 0 });
  });
});
