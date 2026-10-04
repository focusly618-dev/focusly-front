import type { DueDateHighlight } from './projectTaskDates';

export type ProjectTaskPriority =
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low'
  | 'None';

/** One per backend status (Archived tasks aren't shown in this view). */
export type ProjectTaskStatusId =
  | 'in_progress'
  | 'todo'
  | 'planning'
  | 'scheduled'
  | 'in_review'
  | 'on_hold'
  | 'backlog'
  | 'completed'
  | string;

export interface ProjectSubtaskItem {
  id: string;
  title: string;
  completed: boolean;
  duration?: string;
  dueBadge?: string;
  // Raw backend values, sent back untouched so saving the subtask list
  // never wipes them (the backend replaces the whole list on update).
  estimateTimer?: number | null;
  completedAt?: string | null;
}

export interface ProjectTaskAssignee {
  id?: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  color?: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  color?: string;
  emoji?: string;
}

export interface ProjectTaskItemData {
  id: string;
  title: string;
  status: ProjectTaskStatusId;
  priority?: ProjectTaskPriority;
  tag?: string;
  duration?: string;
  dueDate?: string;
  dueDateHighlight?: DueDateHighlight;
  assignee?: ProjectTaskAssignee;
  subtasks?: ProjectSubtaskItem[];
  completed?: boolean;
  project?: ProjectInfo;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  projectEmoji?: string;
  workspaceId?: string;
  workspaceTitle?: string;
  description?: string;
  rawDeadline?: string;
  modules?: string[];
  /** Estimate in minutes (for totals). */
  estimateMinutes?: number;
  createdAt?: string;
}

export interface ProjectStatusConfig {
  id: ProjectTaskStatusId;
  /** The status as the backend stores it. */
  backend: string;
  /** Same names as the rest of the app (tasks.status.*). */
  labelKey: string;
  label: string;
  color: string;
  dotColor: string;
  isCompleted?: boolean;
  /** Shown even with no tasks (the others appear when they have some). */
  alwaysVisible?: boolean;
}

// Every status keeps its own group: a task shows here under the same name it
// has everywhere else (it used to merge Planning/Scheduled into To Do and On
// Hold into Backlog, and call Pending "In Progress").
export const DEFAULT_PROJECT_STATUSES: ProjectStatusConfig[] = [
  {
    id: 'in_progress',
    backend: 'Pending',
    labelKey: 'tasks.status.pending',
    label: 'Pending',
    color: '#f59e0b',
    dotColor: '#f59e0b',
    alwaysVisible: true,
  },
  {
    id: 'todo',
    backend: 'Todo',
    labelKey: 'tasks.status.todo',
    label: 'To Do',
    color: '#3b82f6',
    dotColor: '#3b82f6',
    alwaysVisible: true,
  },
  {
    id: 'planning',
    backend: 'Planning',
    labelKey: 'tasks.status.planning',
    label: 'Planning',
    color: '#0284c7',
    dotColor: '#0284c7',
  },
  {
    id: 'scheduled',
    backend: 'Scheduled',
    labelKey: 'tasks.status.scheduled',
    label: 'Scheduled',
    color: '#8b5cf6',
    dotColor: '#8b5cf6',
  },
  {
    id: 'in_review',
    backend: 'Review',
    labelKey: 'tasks.status.review',
    label: 'Review',
    color: '#06b6d4',
    dotColor: '#06b6d4',
  },
  {
    id: 'on_hold',
    backend: 'On Hold',
    labelKey: 'tasks.status.onHold',
    label: 'On Hold',
    color: '#ec4899',
    dotColor: '#ec4899',
  },
  {
    id: 'backlog',
    backend: 'Backlog',
    labelKey: 'tasks.status.backlog',
    label: 'Backlog',
    color: '#64748b',
    dotColor: '#64748b',
  },
  {
    id: 'completed',
    backend: 'Done',
    labelKey: 'tasks.status.done',
    label: 'Done',
    color: '#10b981',
    dotColor: '#10b981',
    isCompleted: true,
    alwaysVisible: true,
  },
];

export const findProjectStatus = (id?: string) =>
  DEFAULT_PROJECT_STATUSES.find((status) => status.id === id?.toLowerCase());
