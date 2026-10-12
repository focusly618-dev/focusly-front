import { addDays, formatISO, startOfDay } from 'date-fns';
import type { AITimeBlockItem } from '@/api/AI/apiAIPlanner';
import type { Task } from '@/redux/tasks/task.types';

// "Optimizar agenda": which tasks Lumina places, in which free time, and
// which of its proposals are kept. The model only suggests; everything it
// returns is checked here before it reaches the calendar.

/** Tasks sent per request (prompt size and cost grow with each one). */
export const MAX_TASKS_TO_PLAN = 25;
/** Working days ahead that are planned. */
export const PLAN_WORKDAYS = 3;
/** Shorter gaps aren't worth a focus block. */
export const MIN_FREE_MINUTES = 15;
/** Clock drift allowed when checking the model's times. */
const TOLERANCE_MS = 60_000;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CLOSED = new Set(['Done', 'Archived']);

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface PlannedBlock extends TimeRange {
  task: Task;
  reason?: string;
}

export interface WorkHours {
  startTime?: string;
  endTime?: string;
  selectedDays?: string[];
}

const isGoogleEvent = (task: Task) =>
  task.source === 'google' || task.task_type === 'GoogleTask';

/**
 * Open Focusly tasks that still need time: not done, not a Google Calendar
 * event, and not already scheduled ahead. Most important first (priority,
 * then the nearest deadline).
 */
export const selectTasksToPlan = (tasks: Task[], now: Date): Task[] => {
  const deadline = (t: Task) =>
    t.deadline ? new Date(t.deadline).getTime() : Number.POSITIVE_INFINITY;
  return tasks
    .filter((t) => !CLOSED.has(t.status) && !isGoogleEvent(t))
    .filter(
      (t) =>
        !t.estimated_start_date ||
        new Date(t.estimated_start_date).getTime() < now.getTime(),
    )
    .sort(
      (a, b) =>
        (b.priority_level ?? 0) - (a.priority_level ?? 0) ||
        deadline(a) - deadline(b) ||
        a.title.localeCompare(b.title),
    )
    .slice(0, MAX_TASKS_TO_PLAN);
};

/** The next `count` working days from `from` (today counts). */
export const planningDays = (
  from: Date,
  workDays: string[] | undefined,
  count = PLAN_WORKDAYS,
): Date[] => {
  const allowed = workDays?.length
    ? new Set(workDays.map((d) => d.slice(0, 3).toLowerCase()))
    : null;
  const days: Date[] = [];
  for (let i = 0; days.length < count && i < 14; i++) {
    const day = addDays(startOfDay(from), i);
    const name = DAY_NAMES[day.getDay()].toLowerCase();
    if (!allowed || allowed.has(name)) days.push(day);
  }
  return days;
};

const at = (day: Date, time: string | undefined, fallback: string) => {
  const [h, m] = (time || fallback).split(':').map(Number);
  const date = new Date(day);
  date.setHours(h || 0, m || 0, 0, 0);
  return date;
};

/** The next quarter hour: a block never starts "at 10:07". */
export const roundUpToQuarter = (date: Date) => {
  const quarter = 15 * 60_000;
  return new Date(Math.ceil(date.getTime() / quarter) * quarter);
};

/**
 * The free time in the user's work hours on `days`: from now on, minus
 * everything already on the calendar.
 */
export const findFreeRanges = ({
  days,
  workHours,
  busy,
  now,
}: {
  days: Date[];
  workHours?: WorkHours;
  busy: TimeRange[];
  now: Date;
}): TimeRange[] => {
  const earliest = roundUpToQuarter(now);
  const taken = [...busy]
    .filter((b) => b.end > b.start)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const free: TimeRange[] = [];
  for (const day of days) {
    let cursor = at(day, workHours?.startTime, '09:00');
    const dayEnd = at(day, workHours?.endTime, '18:00');
    if (cursor < earliest) cursor = earliest;

    for (const block of taken) {
      if (block.end <= cursor || block.start >= dayEnd) continue;
      if (block.start > cursor) free.push({ start: cursor, end: block.start });
      if (block.end > cursor) cursor = block.end;
    }
    if (cursor < dayEnd) free.push({ start: cursor, end: dayEnd });
  }
  return free.filter(
    (r) => r.end.getTime() - r.start.getTime() >= MIN_FREE_MINUTES * 60_000,
  );
};

/** With the user's UTC offset ("2026-10-07T09:00:00-06:00"): the model
 * answers in the same offset, so its times can't shift by hours. */
export const toLocalISO = (date: Date) => formatISO(date);

const overlaps = (a: TimeRange, b: TimeRange) =>
  a.start < b.end && b.start < a.end;

/**
 * The model's proposals that can really go on the calendar: for one of the
 * tasks sent (each once), with valid times in the future, inside the free
 * time and not on top of each other. Returns how many were dropped.
 */
export const validateProposals = (
  proposals: AITimeBlockItem[],
  tasks: Task[],
  free: TimeRange[],
  now: Date,
): { blocks: PlannedBlock[]; rejected: number } => {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const blocks: PlannedBlock[] = [];
  let rejected = 0;

  for (const proposal of proposals ?? []) {
    const task = proposal?.taskId ? byId.get(proposal.taskId) : undefined;
    const start = new Date(proposal?.startTime);
    const end = new Date(proposal?.endTime);
    const valid =
      task &&
      !blocks.some((b) => b.task.id === task.id) &&
      !Number.isNaN(start.getTime()) &&
      !Number.isNaN(end.getTime()) &&
      end.getTime() - start.getTime() >= MIN_FREE_MINUTES * 60_000 &&
      start.getTime() >= now.getTime() - TOLERANCE_MS &&
      free.some(
        (r) =>
          start.getTime() >= r.start.getTime() - TOLERANCE_MS &&
          end.getTime() <= r.end.getTime() + TOLERANCE_MS,
      ) &&
      !blocks.some((b) => overlaps(b, { start, end }));

    if (!valid || !task) {
      rejected++;
      continue;
    }
    blocks.push({ task, start, end, reason: proposal.reason || undefined });
  }
  return { blocks, rejected };
};
