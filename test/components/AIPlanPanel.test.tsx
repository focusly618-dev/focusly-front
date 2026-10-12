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
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';
import type { CalendarPlanState } from '@/services/calendarPlanService';

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

const plan = (over: Partial<CalendarPlanState> = {}) => ({
  isPlanning: false,
  phase: null,
  startedAt: null,
  drafts: [],
  excluded: [],
  unplaced: [],
  ...over,
});

const handlers = () => ({
  onCancel: vi.fn(),
  onConfirm: vi.fn(),
  onDiscard: vi.fn(),
  onToggle: vi.fn(),
  onFocus: vi.fn(),
  onHover: vi.fn(),
});

describe('AIPlanPanel while Lumina works', () => {
  it('shows the steps: done, current and still to come', () => {
    render(
      <AIPlanPanel
        {...handlers()}
        confirming={false}
        plan={plan({
          isPlanning: true,
          phase: 'thinking',
          startedAt: Date.now(),
        })}
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
    expect(screen.getByRole('status')).toHaveTextContent(
      'calendar.plan.backgroundHint',
    );
  });

  it('counts the seconds and can be cancelled', () => {
    vi.useFakeTimers();
    const h = handlers();
    render(
      <AIPlanPanel
        {...h}
        confirming={false}
        plan={plan({ isPlanning: true, phase: 'tasks', startedAt: Date.now() })}
      />,
    );
    expect(screen.getByText('calendar.plan.elapsed:0')).toBeInTheDocument();
    vi.useRealTimers();
    fireEvent.click(screen.getByText('calendar.cancelPlanning'));
    expect(h.onCancel).toHaveBeenCalled();
  });
});

describe('AIPlanPanel with a proposal', () => {
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

  it('groups the blocks by day, in order, with the focus time', () => {
    render(
      <AIPlanPanel
        {...handlers()}
        confirming={false}
        plan={plan({ drafts })}
      />,
    );
    const headings = screen
      .getAllByText(/calendar\.plan\.(today|tomorrow)/)
      .map((e) => e.textContent);
    expect(headings).toEqual(['calendar.plan.today', 'calendar.plan.tomorrow']);
    const titles = screen
      .getAllByText(/^Task [abc]$/)
      .map((e) => e.textContent);
    expect(titles).toEqual(['Task a', 'Task c', 'Task b']);
    // 90 + 30 + 60 minutes.
    expect(
      screen.getByText(/calendar\.plan\.reviewSummary:3/),
    ).toHaveTextContent('calendar.plan.focusTime');
    expect(screen.getByText('calendar.plan.confirm:3')).toBeInTheDocument();
  });

  it('says whether each block lands before its deadline, and what was moved', () => {
    render(
      <AIPlanPanel
        {...handlers()}
        confirming={false}
        plan={plan({ drafts })}
      />,
    );
    expect(
      screen.getByText('calendar.plan.beforeDeadline'),
    ).toBeInTheDocument();
    expect(screen.getByText('calendar.plan.afterDeadline')).toBeInTheDocument();
    expect(screen.getAllByText('calendar.plan.rescheduled')).toHaveLength(1);
    expect(screen.getByText('calendar.plan.priority.high')).toBeInTheDocument();
    expect(screen.getByText('Mañana con energía')).toBeInTheDocument();
  });

  it('unchecking a block leaves it out of the count', () => {
    const h = handlers();
    render(
      <AIPlanPanel
        {...h}
        confirming={false}
        plan={plan({ drafts, excluded: ['draft-a'] })}
      />,
    );
    expect(screen.getByText('calendar.plan.confirm:2')).toBeInTheDocument();
    const box = screen.getByRole('checkbox', { name: /Task a/ });
    expect(box).not.toBeChecked();
    fireEvent.click(box);
    expect(h.onToggle).toHaveBeenCalledWith('draft-a');
  });

  it('nothing checked: nothing to schedule', () => {
    render(
      <AIPlanPanel
        {...handlers()}
        confirming={false}
        plan={plan({ drafts, excluded: drafts.map((d) => d.id) })}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'calendar.plan.confirm:0' }),
    ).toBeDisabled();
  });

  it('a block can be shown on the calendar (click or keyboard) and highlighted on hover', () => {
    const h = handlers();
    render(<AIPlanPanel {...h} confirming={false} plan={plan({ drafts })} />);
    const item = screen.getByText('Task b').closest('[role="button"]')!;
    fireEvent.click(item);
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(h.onFocus).toHaveBeenCalledTimes(2);
    expect(h.onFocus.mock.calls[0][0].id).toBe('draft-b');
    fireEvent.mouseEnter(item.parentElement!);
    expect(h.onHover).toHaveBeenCalledWith('draft-b');
    fireEvent.mouseLeave(item.parentElement!);
    expect(h.onHover).toHaveBeenLastCalledWith(null);
  });

  it('lists what did not fit, on demand', () => {
    render(
      <AIPlanPanel
        {...handlers()}
        confirming={false}
        plan={plan({ drafts, unplaced: [{ id: 'x', title: 'Leer libro' }] })}
      />,
    );
    const toggle = screen.getByRole('button', {
      name: 'calendar.plan.unplaced:1',
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(
      within(toggle.parentElement!).getByText('Leer libro'),
    ).toBeInTheDocument();
  });

  it('while scheduling, nothing can be changed', () => {
    const h = handlers();
    render(<AIPlanPanel {...h} confirming plan={plan({ drafts })} />);
    expect(screen.getByText('calendar.scheduling')).toBeInTheDocument();
    expect(screen.getByText('calendar.discard')).toBeDisabled();
    screen
      .getAllByRole('checkbox')
      .forEach((box) => expect(box).toBeDisabled());
  });

  it('confirm and discard', () => {
    const h = handlers();
    render(<AIPlanPanel {...h} confirming={false} plan={plan({ drafts })} />);
    fireEvent.click(screen.getByText('calendar.plan.confirm:3'));
    fireEvent.click(screen.getByText('calendar.discard'));
    expect(h.onConfirm).toHaveBeenCalled();
    expect(h.onDiscard).toHaveBeenCalled();
  });
});
