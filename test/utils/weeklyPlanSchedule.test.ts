import { describe, expect, it } from 'vitest';
import {
  plannableTasks,
  planningDays,
  schedulePlan,
  workSchedule,
} from '@/pages/Home/components/CalendarView/components/CalendarWeeklyPlannerModal/weeklyPlanSchedule';
import type { Task } from '@/redux/tasks/task.types';

const task = (title: string, over: Partial<Task> = {}) =>
  ({ id: title, title, status: 'Todo', estimate_timer: 30, ...over }) as Task;

const schedule = workSchedule({ startTime: '09:00', endTime: '18:00' });
// Tuesday, Nov 10, 2026
const at = (h: number, m = 0, d = 10) => new Date(2026, 10, d, h, m);

describe('planningDays', () => {
  it('skips past days', () => {
    const days = planningDays(at(9), at(9), schedule);
    expect(days.map((d) => d.getDate())).toEqual([10, 11, 12, 13]);
  });

  it('skips today when almost nothing is left of it', () => {
    const days = planningDays(at(22, 40), at(22, 40), schedule);
    expect(days[0].getDate()).toBe(11);
  });

  it('moves to next week when this one is over', () => {
    const friday = at(23, 0, 13);
    expect(planningDays(friday, friday, schedule)[0].getDate()).toBe(16);
  });

  it('respects the chosen work days', () => {
    const own = workSchedule({
      selectedDays: ['Sat'],
      startTime: '09:00',
      endTime: '12:00',
    });
    expect(planningDays(at(9), at(9), own).map((d) => d.getDate())).toEqual([
      14,
    ]);
  });
});

describe('plannableTasks', () => {
  it('leaves out finished tasks and those with a time', () => {
    const list = [
      task('open'),
      task('done', { status: 'Done' }),
      task('fixed', { estimated_start_date: '2026-11-11T11:05:00.000Z' }),
    ];
    expect(plannableTasks(list).map((t) => t.title)).toEqual(['open']);
  });
});

describe('schedulePlan', () => {
  const days = [at(0, 0, 11), at(0, 0, 12)];
  const run = (
    tasks: Task[],
    plan: { day: string; tasks: string[] }[],
    busy = [],
  ) => schedulePlan({ plan, tasks, days, now: at(9), schedule, busy });

  it('gives each task its own time, one after another', () => {
    const { days: out } = run(
      [task('a'), task('b', { estimate_timer: 60 })],
      [{ day: 'Wednesday', tasks: ['a', 'b'] }],
    );
    const [a, b] = out[0].slots;
    expect(a.start).toEqual(at(9, 0, 11));
    expect(a.end).toEqual(at(9, 30, 11));
    expect(b.start).toEqual(at(9, 40, 11));
  });

  it('never plans over what is already there', () => {
    const { days: out } = run(
      [task('a')],
      [{ day: 'Wednesday', tasks: ['a'] }],
      [{ start: at(9, 0, 11), end: at(10, 0, 11) }] as never,
    );
    expect(out[0].slots[0].start).toEqual(at(10, 10, 11));
  });

  it('never moves a task with a time, even if Lumina names it', () => {
    const fixed = task('fixed', {
      estimated_start_date: at(11, 0, 11).toISOString(),
    });
    const { days: out } = run(
      [fixed],
      [{ day: 'Wednesday', tasks: ['fixed'] }],
    );
    expect(out.flatMap((d) => d.slots)).toEqual([]);
  });

  it('a day that is not open sends its tasks to one that is', () => {
    const { days: out } = run([task('a')], [{ day: 'Sunday', tasks: ['a'] }]);
    expect(out[0].slots[0].task.title).toBe('a');
  });

  it('spills to the next day when one is full', () => {
    const { days: out } = run(
      [
        task('big', { estimate_timer: 480 }),
        task('more', { estimate_timer: 240 }),
      ],
      [{ day: 'Wednesday', tasks: ['big', 'more'] }],
    );
    expect(out[0].slots.map((s) => s.task.title)).toEqual(['big']);
    expect(out[1].slots.map((s) => s.task.title)).toEqual(['more']);
  });

  it('does not lose a task Lumina forgot', () => {
    const { days: out } = run([task('olvidada')], []);
    expect(out[0].slots[0].task.title).toBe('olvidada');
  });
});
