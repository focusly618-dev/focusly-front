import axiosInstance from '../axiosInstance';
import type { Task } from '@/redux/tasks/task.types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface AIPlanItem {
  taskId: string;
  recommendedPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedOrder: number;
  reason: string;
  suggestedDate?: string;
  estimatedTime?: string;
}

export interface AIOrganizeResponse {
  plan: AIPlanItem[];
}

export interface AITimeBlockItem {
  taskId?: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  reason: string;
}

export interface AICalendarPlannerResponse {
  events: AITimeBlockItem[];
}

export interface AIWeeklyPlanDayItem {
  day: string;
  tasks: string[];
}

export interface AIWeeklyPlanResponse {
  weeklyPlan: AIWeeklyPlanDayItem[];
  recommendationSummary: string;
}

export interface AIImproveTaskResponse {
  subtasks?: string[];
  estimatedTime?: string;
  suggestedPriority?: string;
}

// ─── Client Methods ───────────────────────────────────────────────────────────

/**
 * Sends current tasks to Lumina AI to obtain optimized order, priority and reasoning.
 */
export const organizeTasksAI = async (
  tasks: Task[],
): Promise<AIOrganizeResponse> => {
  const mappedTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.notes_encrypted || '',
    priority:
      t.priority_level === 3 ? 'High' : t.priority_level === 2 ? 'Med' : 'Low',
    deadline: t.deadline || '',
    status: t.status || 'Todo',
    estimatedTime: t.estimate_timer ? `${t.estimate_timer}m` : '',
  }));

  const response = await axiosInstance.post<AIOrganizeResponse>(
    '/ai/planner/organize',
    {
      tasks: mappedTasks,
    },
  );
  return response.data;
};

/**
 * Suggests calendar time-blocking slots for pending tasks.
 */
export const planCalendarAI = async (
  tasks: Task[],
  freeSlots: { start: string; end: string }[],
): Promise<AICalendarPlannerResponse> => {
  const mappedTasks = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    duration: t.estimate_timer ? `${t.estimate_timer}m` : '30m',
    priority:
      t.priority_level === 3 ? 'High' : t.priority_level === 2 ? 'Med' : 'Low',
  }));

  const response = await axiosInstance.post<AICalendarPlannerResponse>(
    '/ai/planner/calendar',
    {
      tasks: mappedTasks,
      free_slots: freeSlots,
    },
  );
  return response.data;
};

export interface AIAvailability {
  [day: string]: {
    available: boolean;
    start?: string;
    end?: string;
  };
}
/**
 * Distributes pending tasks over the week's days.
 */
export const planWeeklyAI = async (
  tasks: Task[],
  availability?: AIAvailability,
): Promise<AIWeeklyPlanResponse> => {
  const mappedTasks = tasks.map((t) => ({
    title: t.title,
    priority:
      t.priority_level === 3 ? 'High' : t.priority_level === 2 ? 'Med' : 'Low',
    deadline: t.deadline || '',
  }));

  const response = await axiosInstance.post<AIWeeklyPlanResponse>(
    '/ai/planner/weekly',
    {
      tasks: mappedTasks,
      availability,
    },
  );
  return response.data;
};

/**
 * Suggests improvements for a specific task form (subtasks list, estimate effort, priority).
 */
export const improveTaskAI = async (params: {
  title: string;
  description?: string;
  mode: 'subtasks' | 'estimate' | 'priority' | 'all';
}): Promise<AIImproveTaskResponse> => {
  const response = await axiosInstance.post<AIImproveTaskResponse>(
    '/ai/planner/improve',
    {
      title: params.title,
      description: params.description || '',
      mode: params.mode,
    },
  );
  return response.data;
};
