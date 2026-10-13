import { isSameDay } from 'date-fns';
import type { ParsedLuminaAction } from '@/utils';
import type { PlanItemStatus } from './useActionPlan.hook';

// Where to go once a plan ran: the project it made, its tasks, the document,
// the calendar on the day things were scheduled. Only what was really done
// (and has the id it got) counts.

export interface PlanDestinations {
  projectId: string | null;
  /** A lone document (with a project, the project shows it). */
  documentId: string | null;
  tasks: { count: number; singleId: string | null };
  /** The first day something was scheduled, and the view to show it. */
  calendar: { date: Date; view: 'day' | 'week' } | null;
}

const TASK_TYPES = new Set(['CREATE_TASK', 'UPDATE_TASK', 'UPDATE_SUBTASKS']);
const EVENT_TYPES = new Set(['CREATE_EVENT', 'UPDATE_EVENT']);

const parse = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** When an action happens on the calendar: an event's start, a task's
 * scheduled start or deadline. */
export const actionDate = (action: ParsedLuminaAction): Date | null => {
  const p = action.payload as Record<string, unknown>;
  if (EVENT_TYPES.has(action.type)) return parse(p.start);
  if (TASK_TYPES.has(action.type)) {
    return parse(p.estimated_start_date) ?? parse(p.deadline);
  }
  return null;
};

export const planDestinations = (
  actions: ParsedLuminaAction[],
  statuses: PlanItemStatus[],
  createdIds: (string | null)[],
): PlanDestinations => {
  const done = actions
    .map((action, i) => ({ action, id: createdIds[i] ?? null }))
    .filter((_, i) => statuses[i] === 'done');

  const projectId =
    done.find((d) => d.action.type === 'CREATE_PROJECT_GROUP' && d.id)?.id ??
    null;

  const documents = done.filter(
    (d) => d.action.type === 'CREATE_WORKSPACE' && d.id,
  );
  const tasks = done.filter((d) => TASK_TYPES.has(d.action.type));

  const dates = done
    .map((d) => actionDate(d.action))
    .filter((date): date is Date => date !== null)
    .sort((a, b) => a.getTime() - b.getTime());

  return {
    projectId,
    documentId: !projectId && documents.length === 1 ? documents[0].id : null,
    tasks: {
      count: tasks.length,
      singleId: tasks.length === 1 ? tasks[0].id : null,
    },
    calendar: dates.length
      ? {
          date: dates[0],
          view: dates.every((d) => isSameDay(d, dates[0])) ? 'day' : 'week',
        }
      : null,
  };
};
