export type ProjectTaskPriority =
  | 'Critical'
  | 'High'
  | 'Medium'
  | 'Low'
  | 'None';

export type ProjectTaskStatusId =
  | 'in_progress'
  | 'todo'
  | 'completed'
  | 'in_review'
  | 'backlog'
  | string;

export interface ProjectSubtaskItem {
  id: string;
  title: string;
  completed: boolean;
  duration?: string;
  dueBadge?: string;
}

export interface ProjectTaskAssignee {
  id?: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  color?: string;
}

export interface ProjectTaskItemData {
  id: string;
  title: string;
  status: ProjectTaskStatusId;
  priority?: ProjectTaskPriority;
  tag?: string;
  duration?: string;
  dueDate?: string;
  dueDateHighlight?: 'today' | 'tomorrow' | 'normal';
  assignee?: ProjectTaskAssignee;
  subtasks?: ProjectSubtaskItem[];
  completed?: boolean;
}

export interface ProjectStatusConfig {
  id: ProjectTaskStatusId;
  label: string;
  color: string;
  dotColor: string;
  bgColor?: string;
  borderColor?: string;
  isCompleted?: boolean;
}

export const DEFAULT_PROJECT_STATUSES: ProjectStatusConfig[] = [
  {
    id: 'in_progress',
    label: 'In Progress',
    color: '#10b981',
    dotColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  {
    id: 'todo',
    label: 'To Do',
    color: '#94a3b8',
    dotColor: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.12)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  {
    id: 'completed',
    label: 'Completed',
    color: '#10b981',
    dotColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    isCompleted: true,
  },
  {
    id: 'in_review',
    label: 'In Review',
    color: '#06b6d4',
    dotColor: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  {
    id: 'backlog',
    label: 'Backlog',
    color: '#8b5cf6',
    dotColor: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
];
