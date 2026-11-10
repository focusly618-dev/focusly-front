import { addDays, startOfWeek } from 'date-fns';
import type { Task } from '@/redux/tasks/task.types';

/** Turns the days Lumina proposes into real slots: Lumina picks the day, the
 * hours are worked out here so they can't overlap or land in the past. */

export interface WorkSchedule {
  /** "Mon".."Sun"; empty means Monday to Friday. */
  days: string[];
  startMinutes: number;
  endMinutes: number;
}

export interface PlanSlot {
  task: Task;
  start: Date;
  end: Date;
}

export interface PlanDay {
  name: string;
  date: Date;
  slots: PlanSlot[];
}

interface Busy {
  start: Date;
  end: Date;
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const WORK_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// Less than this left of a workday and the day is over
const MIN_MINUTES_LEFT = 60;
const DEFAULT_MINUTES = 30;
const BREAK_MINUTES = 10;

const toMinutes = (time: string | undefined, fallback: number) => {
  const match = /^(\d{1,2}):(\d{2})/.exec(time ?? '');
  return match ? Number(match[1]) * 60 + Number(match[2]) : fallback;
};

export const workSchedule = (config?: {
  selectedDays?: string[];
  startTime?: string;
  endTime?: string;
}): WorkSchedule => ({
  days: config?.selectedDays ?? [],
  startMinutes: toMinutes(config?.startTime, 9 * 60),
  endMinutes: toMinutes(config?.endTime, 18 * 60),
});

const isWorkDay = (date: Date, schedule: WorkSchedule) => {
  const name = WEEKDAYS[date.getDay()];
  return schedule.days.length
    ? schedule.days.some((code) => name.startsWith(code))
    : WORK_WEEK.includes(name);
};

const atMinutes = (date: Date, minutes: number) => {
  const result = new Date(date);
  result.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return result;
};

/** The minute of `day` planning can start from. */
const firstFreeMinute = (day: Date, now: Date, schedule: WorkSchedule) => {
  if (day.toDateString() !== now.toDateString()) return schedule.startMinutes;
  const current = now.getHours() * 60 + now.getMinutes();
  return Math.max(schedule.startMinutes, (Math.floor(current / 30) + 1) * 30);
};

/** The days of the week of `reference` still open for planning; the next week
 * when this one has none left. */
export const planningDays = (
  reference: Date,
  now: Date,
  schedule: WorkSchedule,
): Date[] => {
  const base = reference > now ? reference : now;
  for (const weekOffset of [0, 1]) {
    const monday = addDays(
      startOfWeek(base, { weekStartsOn: 1 }),
      weekOffset * 7,
    );
    const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i)).filter(
      (day) => {
        if (!isWorkDay(day, schedule)) return false;
        if (day.toDateString() === now.toDateString()) {
          return (
            schedule.endMinutes - firstFreeMinute(day, now, schedule) >=
            MIN_MINUTES_LEFT
          );
        }
        return day > now;
      },
    );
    if (days.length) return days;
  }
  return [];
};

/** What can be planned: open tasks without a time. One with a time was placed
 * there on purpose and stays. */
export const plannableTasks = (tasks: Task[]) =>
  tasks.filter((task) => task.status !== 'Done' && !task.estimated_start_date);

export const dayName = (date: Date) => WEEKDAYS[date.getDay()];

const overlapEnd = (start: Date, end: Date, busy: Busy[]) =>
  busy.find((b) => b.start < end && b.end > start)?.end ?? null;

/** The first slot of `minutes` in the day, or null when it doesn't fit. */
const findSlot = (
  day: Date,
  minutes: number,
  firstMinute: number,
  schedule: WorkSchedule,
  busy: Busy[],
): Busy | null => {
  let start = atMinutes(day, firstMinute);
  const limit = atMinutes(day, schedule.endMinutes);
  for (;;) {
    const end = new Date(start.getTime() + minutes * 60000);
    if (end > limit) return null;
    const blockedUntil = overlapEnd(start, end, busy);
    if (!blockedUntil) return { start, end };
    start = new Date(blockedUntil.getTime() + BREAK_MINUTES * 60000);
  }
};

export const schedulePlan = ({
  plan,
  tasks,
  days,
  now,
  schedule,
  busy,
}: {
  plan: { day: string; tasks: string[] }[];
  tasks: Task[];
  days: Date[];
  now: Date;
  schedule: WorkSchedule;
  busy: Busy[];
}): { days: PlanDay[]; unplaced: Task[] } => {
  const result: PlanDay[] = days.map((date) => ({
    name: dayName(date),
    date,
    slots: [],
  }));
  const taken = [...busy];
  const open = new Map(
    plannableTasks(tasks).map((t) => [t.title.trim().toLowerCase(), t]),
  );
  const unplaced: Task[] = [];

  const place = (task: Task, from: number) => {
    const minutes = task.estimate_timer || DEFAULT_MINUTES;
    // Its day first; if it's full, or not open, the next ones
    for (let i = 0; i < result.length; i++) {
      const target = result[(from + i) % result.length];
      const slot = findSlot(
        target.date,
        minutes,
        firstFreeMinute(target.date, now, schedule),
        schedule,
        taken,
      );
      if (slot) {
        target.slots.push({ task, ...slot });
        taken.push(slot);
        return;
      }
    }
    unplaced.push(task);
  };

  for (const item of plan) {
    const asked = result.findIndex(
      (d) => d.name.toLowerCase() === item.day.trim().toLowerCase(),
    );
    for (const title of item.tasks) {
      const key = title.trim().toLowerCase();
      const task = open.get(key);
      if (!task) continue;
      open.delete(key);
      place(task, Math.max(asked, 0));
    }
  }
  // Whatever Lumina forgot still needs a day
  [...open.values()].forEach((task) => place(task, 0));

  return { days: result, unplaced };
};
