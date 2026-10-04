import {
  DEFAULT_PROJECT_STATUSES,
  type ProjectStatusConfig,
  type ProjectTaskItemData,
  type ProjectTaskPriority,
} from './projectTasks.types';

// Filtering, ordering and totals for the project tasks view (pure, so the
// view and its tests share them).

export type ProjectTaskSort = 'dueDate' | 'priority' | 'title' | 'recent';

export interface ProjectTaskFilters {
  /** Only this project's tasks (the all-projects view). */
  projectId: string | null;
  overdue: boolean;
  noDate: boolean;
  highPriority: boolean;
}

export const NO_TASK_FILTERS: ProjectTaskFilters = {
  projectId: null,
  overdue: false,
  noDate: false,
  highPriority: false,
};

export const hasActiveFilters = (filters: ProjectTaskFilters) =>
  filters.overdue || filters.noDate || filters.highPriority;

const PRIORITY_RANK: Record<ProjectTaskPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
  None: 0,
};

export const priorityRank = (priority?: ProjectTaskPriority) =>
  PRIORITY_RANK[priority ?? 'None'] ?? 0;

export const isOverdue = (task: ProjectTaskItemData) =>
  task.dueDateHighlight === 'overdue';

/** Quick filters (the project one is applied by the query). */
export const filterProjectTasks = (
  tasks: ProjectTaskItemData[],
  filters: ProjectTaskFilters,
) =>
  tasks.filter(
    (task) =>
      (!filters.overdue || isOverdue(task)) &&
      (!filters.noDate || !task.rawDeadline) &&
      (!filters.highPriority || priorityRank(task.priority) >= 3),
  );

const time = (value?: string) => {
  const ms = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(ms) ? null : ms;
};

/** Undated tasks go last when ordering by date. */
export const sortProjectTasks = (
  tasks: ProjectTaskItemData[],
  sort: ProjectTaskSort,
  locale?: string,
) => {
  const byTitle = (a: ProjectTaskItemData, b: ProjectTaskItemData) =>
    a.title.localeCompare(b.title, locale, { sensitivity: 'base' });
  const sorted = [...tasks];
  sorted.sort((a, b) => {
    if (sort === 'title') return byTitle(a, b);
    if (sort === 'priority') {
      return (
        priorityRank(b.priority) - priorityRank(a.priority) || byTitle(a, b)
      );
    }
    if (sort === 'recent') {
      return (time(b.createdAt) ?? 0) - (time(a.createdAt) ?? 0);
    }
    const da = time(a.rawDeadline);
    const db = time(b.rawDeadline);
    if (da === null && db === null) return byTitle(a, b);
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db || priorityRank(b.priority) - priorityRank(a.priority);
  });
  return sorted;
};

export interface ProjectTasksSummary {
  total: number;
  completed: number;
  overdue: number;
  /** Estimated minutes still to do (open tasks). */
  remainingMinutes: number;
}

export const summarizeProjectTasks = (
  tasks: ProjectTaskItemData[],
): ProjectTasksSummary =>
  tasks.reduce<ProjectTasksSummary>(
    (summary, task) => {
      summary.total += 1;
      if (task.completed) summary.completed += 1;
      else summary.remainingMinutes += task.estimateMinutes ?? 0;
      if (isOverdue(task)) summary.overdue += 1;
      return summary;
    },
    { total: 0, completed: 0, overdue: 0, remainingMinutes: 0 },
  );

/** The main statuses always; the rest when they have tasks (or on request). */
export const visibleStatuses = (
  tasks: ProjectTaskItemData[],
  showEmpty: boolean,
  statuses: ProjectStatusConfig[] = DEFAULT_PROJECT_STATUSES,
) =>
  statuses.filter(
    (status) =>
      showEmpty ||
      status.alwaysVisible ||
      tasks.some((task) => task.status.toLowerCase() === status.id),
  );

export const tasksInStatus = (
  tasks: ProjectTaskItemData[],
  status: ProjectStatusConfig,
) => tasks.filter((task) => task.status.toLowerCase() === status.id);
