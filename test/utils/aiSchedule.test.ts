import { describe, expect, it } from 'vitest';
import {
  findFreeRanges,
  MAX_TASKS_TO_PLAN,
  planningDays,
  roundUpToQuarter,
  selectTasksToPlan,
  toLocalISO,
  validateProposals,
  type TimeRange,
} from '@/pages/Home/components/CalendarView/utils/aiSchedule';
import type { Task } from '@/redux/tasks/task.types';

// Tuesday 7 October 2026, 10:07 local time.
const NOW = new Date(2026, 9, 7, 10, 7);
const at = (day: number, h: number, m = 0) => new Date(2026, 9, day, h, m);
const range = (day: number, h1: number, m1: number, h2: number, m2 = 0) => ({
  start: at(day, h1, m1),
  end: at(day, h2, m2),
});

const task = (over: Partial<Task> = {}): Task =>
  ({
    id: 't1',
    title: 'Informe',
    status: 'Todo',
    priority_level: 2,
    estimate_timer: 60,
    deadline: null,
    estimated_start_date: null,
    ...over,
  }) as Task;

const WORK = {
  startTime: '09:00',
  endTime: '18:00',
  selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};

describe('selectTasksToPlan', () => {
  it('leaves out done, archived, Google events and tasks already scheduled ahead', () => {
    const picked = selectTasksToPlan(
      [
        task({ id: 'open' }),
        task({ id: 'done', status: 'Done' }),
        task({ id: 'archived', status: 'Archived' }),
        task({ id: 'google', source: 'google' }),
        task({ id: 'gtask', task_type: 'GoogleTask' }),
        task({ id: 'ahead', estimated_start_date: at(8, 9).toISOString() }),
        task({ id: 'missed', estimated_start_date: at(6, 9).toISOString() }),
      ],
      NOW,
    );
    expect(picked.map((t) => t.id)).toEqual(['open', 'missed']);
  });

  it('most important first: priority, then the nearest deadline', () => {
    const picked = selectTasksToPlan(
      [
        task({ id: 'low', priority_level: 1 }),
        task({
          id: 'high-later',
          priority_level: 3,
          deadline: at(20, 9).toISOString(),
        }),
        task({
          id: 'high-soon',
          priority_level: 3,
          deadline: at(9, 9).toISOString(),
        }),
        task({ id: 'high-none', priority_level: 3 }),
      ],
      NOW,
    );
    expect(picked.map((t) => t.id)).toEqual([
      'high-soon',
      'high-later',
      'high-none',
      'low',
    ]);
  });

  it('sends at most MAX_TASKS_TO_PLAN', () => {
    const many = Array.from({ length: 80 }, (_, i) => task({ id: `t${i}` }));
    expect(selectTasksToPlan(many, NOW)).toHaveLength(MAX_TASKS_TO_PLAN);
  });
});

describe('planningDays', () => {
  it('skips days off (from Friday: Fri, Mon, Tue)', () => {
    const days = planningDays(at(9, 15), WORK.selectedDays, 3);
    expect(days.map((d) => d.getDate())).toEqual([9, 12, 13]);
  });

  it('every day when the profile has no work days', () => {
    expect(
      planningDays(at(10, 9), undefined, 3).map((d) => d.getDate()),
    ).toEqual([10, 11, 12]);
  });

  it('a profile with no matching day never loops forever', () => {
    expect(planningDays(NOW, ['Xyz'], 3)).toEqual([]);
  });
});

describe('findFreeRanges', () => {
  it('starts at the next quarter hour, never in the past', () => {
    const free = findFreeRanges({
      days: [at(7, 0)],
      workHours: WORK,
      busy: [],
      now: NOW,
    });
    expect(free).toEqual([range(7, 10, 15, 18)]);
    expect(roundUpToQuarter(at(7, 10, 0))).toEqual(at(7, 10, 0));
  });

  it('respects minutes in the work hours (09:30 to 17:45)', () => {
    const free = findFreeRanges({
      days: [at(8, 0)],
      workHours: { startTime: '09:30', endTime: '17:45' },
      busy: [],
      now: NOW,
    });
    expect(free).toEqual([range(8, 9, 30, 17, 45)]);
  });

  it('cuts around what is already on the calendar, overlapping or not', () => {
    const busy: TimeRange[] = [
      range(8, 11, 0, 12, 0),
      range(8, 11, 30, 13, 0), // overlaps the previous one
      range(8, 8, 0, 9, 30), // starts before work hours
      range(8, 17, 0, 20, 0), // ends after
    ];
    const free = findFreeRanges({
      days: [at(8, 0)],
      workHours: WORK,
      busy,
      now: NOW,
    });
    expect(free).toEqual([range(8, 9, 30, 11, 0), range(8, 13, 0, 17, 0)]);
  });

  it('drops gaps under 15 minutes', () => {
    const free = findFreeRanges({
      days: [at(8, 0)],
      workHours: WORK,
      busy: [range(8, 9, 0, 12, 0), range(8, 12, 10, 18, 0)],
      now: NOW,
    });
    expect(free).toEqual([]);
  });

  it('a day already over gives nothing', () => {
    const late = new Date(2026, 9, 7, 19, 0);
    expect(
      findFreeRanges({
        days: [at(7, 0)],
        workHours: WORK,
        busy: [],
        now: late,
      }),
    ).toEqual([]);
  });

  it('ignores broken busy blocks (end before start)', () => {
    const free = findFreeRanges({
      days: [at(8, 0)],
      workHours: WORK,
      busy: [{ start: at(8, 12), end: at(8, 10) }],
      now: NOW,
    });
    expect(free).toEqual([range(8, 9, 0, 18, 0)]);
  });
});

describe('toLocalISO', () => {
  it('keeps the local offset, so the model answers in the user’s time', () => {
    const iso = toLocalISO(at(8, 9));
    expect(iso).toMatch(/^2026-10-08T09:00:00([+-]\d{2}:\d{2}|Z)$/);
    expect(new Date(iso).getTime()).toBe(at(8, 9).getTime());
  });
});

describe('validateProposals: the model never writes straight to the calendar', () => {
  const tasks = [task({ id: 'a', title: 'A' }), task({ id: 'b', title: 'B' })];
  const free = [range(8, 9, 0, 12, 0), range(8, 14, 0, 18, 0)];
  const block = (taskId: string | null, s: Date, e: Date, reason = 'ok') => ({
    taskId,
    title: 'whatever the model says',
    startTime: s.toISOString(),
    endTime: e.toISOString(),
    reason,
  });

  it('keeps a good proposal, with the real task and its reason', () => {
    const { blocks, rejected } = validateProposals(
      [block('a', at(8, 9), at(8, 10), 'Mañana tranquila')],
      tasks,
      free,
      NOW,
    );
    expect(rejected).toBe(0);
    expect(blocks[0].task.title).toBe('A');
    expect(blocks[0].reason).toBe('Mañana tranquila');
  });

  it('accepts the time in any offset (local, UTC, none)', () => {
    const local = { ...block('a', at(8, 9), at(8, 10)) };
    local.startTime = toLocalISO(at(8, 9));
    local.endTime = toLocalISO(at(8, 10));
    expect(validateProposals([local], tasks, free, NOW).blocks).toHaveLength(1);
  });

  it.each([
    ['an invented task id', block('ghost', at(8, 9), at(8, 10))],
    ['no task id', block(null, at(8, 9), at(8, 10))],
    ['in the past', block('a', at(6, 9), at(6, 10))],
    ['end before start', block('a', at(8, 10), at(8, 9))],
    ['zero length', block('a', at(8, 9), at(8, 9))],
    ['shorter than 15 minutes', block('a', at(8, 9), at(8, 9, 10))],
    [
      'outside the free time (lunch meeting)',
      block('a', at(8, 12, 30), at(8, 13, 30)),
    ],
    ['spanning two free ranges', block('a', at(8, 11), at(8, 15))],
    ['on a day not offered', block('a', at(10, 9), at(10, 10))],
  ])('drops %s', (_, proposal) => {
    const { blocks, rejected } = validateProposals(
      [proposal],
      tasks,
      free,
      NOW,
    );
    expect(blocks).toEqual([]);
    expect(rejected).toBe(1);
  });

  it('drops garbage dates without crashing', () => {
    const bad = [
      {
        taskId: 'a',
        title: '',
        startTime: 'mañana',
        endTime: '??',
        reason: '',
      },
      { taskId: 'a', title: '', startTime: '', endTime: '', reason: '' },
    ];
    expect(validateProposals(bad, tasks, free, NOW).rejected).toBe(2);
  });

  it('tolerates a missing or malformed answer', () => {
    expect(
      validateProposals(
        undefined as unknown as Parameters<typeof validateProposals>[0],
        tasks,
        free,
        NOW,
      ),
    ).toEqual({ blocks: [], rejected: 0 });
  });

  it('one block per task, never two blocks on top of each other', () => {
    const { blocks, rejected } = validateProposals(
      [
        block('a', at(8, 9), at(8, 10)),
        block('a', at(8, 14), at(8, 15)), // same task again
        block('b', at(8, 9, 30), at(8, 10, 30)), // overlaps A
        block('b', at(8, 10), at(8, 11)), // right after A: fine
      ],
      tasks,
      free,
      NOW,
    );
    expect(blocks.map((b) => [b.task.id, b.start.getHours()])).toEqual([
      ['a', 9],
      ['b', 10],
    ]);
    expect(rejected).toBe(2);
  });
});
