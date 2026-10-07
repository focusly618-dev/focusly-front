import axios from 'axios';
import axiosInstance from '../axiosInstance';
import { PlanLimitError } from '@/api/Billing/planLimit';
import { billingService } from '@/services/billingService';
import type { Task } from '@/redux/tasks/task.types';
import type { WorkHoursConfig } from '@/api/User/apiUser.types';
import type {
  AICalendarPlannerResponse,
  AIImproveTaskResponse,
  AIOrganizeResponse,
  AIWeeklyPlanResponse,
} from './apiAI.types';

export type {
  AIPlanItem,
  AIOrganizeResponse,
  AITimeBlockItem,
  AICalendarPlannerResponse,
  AIWeeklyPlanDayItem,
  AIWeeklyPlanResponse,
  AIImproveTaskResponse,
} from './apiAI.types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

// ─── Plan limits ──────────────────────────────────────────────────────────────

/**
 * Each planner call counts as an AI message on the free plan: the backend
 * answers 402 once they're used up, and the Pro plans open.
 */
const plannerPost = async <T>(url: string, body: unknown): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(url, body);
    const remaining = Number(response.headers['x-ai-messages-remaining']);
    if (
      response.headers['x-ai-messages-remaining'] !== undefined &&
      Number.isFinite(remaining)
    ) {
      billingService.setRemaining(remaining);
    }
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 402) {
      const detail = (err.response.data as { detail?: { limit?: number } })
        ?.detail;
      billingService.markLimitReached(detail?.limit);
      billingService.openUpgrade('limit');
      throw new PlanLimitError('free_limit_reached', detail?.limit);
    }
    throw err;
  }
};

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
    description: t.notes || '',
    priority:
      t.priority_level === 3 ? 'High' : t.priority_level === 2 ? 'Med' : 'Low',
    deadline: t.deadline || '',
    status: t.status || 'Todo',
    estimatedTime: t.estimate_timer ? `${t.estimate_timer}m` : '',
  }));

  const data = await plannerPost<AIOrganizeResponse>('/ai/planner/organize', {
    tasks: mappedTasks,
  });
  return data;
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

  const data = await plannerPost<AICalendarPlannerResponse>(
    '/ai/planner/calendar',
    {
      tasks: mappedTasks,
      free_slots: freeSlots,
    },
  );
  return data;
};

export interface AIAvailability {
  [day: string]: {
    available: boolean;
    start?: string;
    end?: string;
  };
}

const WEEKDAY_NAMES = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
} as const;

/**
 * The user's work hours (user.settings.workHoursConfig) as planner
 * availability. Undefined when they aren't set, so the server default applies.
 */
export const availabilityFromSettings = (
  settings: unknown,
): AIAvailability | undefined => {
  const config = (
    settings as { workHoursConfig?: Partial<WorkHoursConfig> } | null
  )?.workHoursConfig;
  const { selectedDays, startTime, endTime } = config ?? {};
  if (!selectedDays?.length || !startTime || !endTime) return undefined;

  return Object.fromEntries(
    Object.entries(WEEKDAY_NAMES).map(([code, name]) => [
      name,
      selectedDays.includes(code)
        ? { available: true, start: startTime, end: endTime }
        : { available: false },
    ]),
  );
};
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

  const data = await plannerPost<AIWeeklyPlanResponse>('/ai/planner/weekly', {
    tasks: mappedTasks,
    availability,
  });
  return data;
};

/**
 * Suggests improvements for a specific task form (subtasks list, estimate effort, priority).
 */
export const improveTaskAI = async (params: {
  title: string;
  description?: string;
  mode: 'subtasks' | 'estimate' | 'priority' | 'all';
}): Promise<AIImproveTaskResponse> => {
  const data = await plannerPost<AIImproveTaskResponse>('/ai/planner/improve', {
    title: params.title,
    description: params.description || '',
    mode: params.mode,
  });
  return data;
};
