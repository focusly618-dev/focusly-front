import type { ReactNode } from 'react';
import type { MutationFunction, OperationVariables } from '@apollo/client';
import {
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { GET_TASKS, GET_TASKS_TITLES } from '@/pages/Tasks/Tasks.graphql';
import {
  GET_PROJECT_GROUPS,
  GET_WORKSPACES,
} from '@/pages/Workspace/Workspace.graphql';
import type { ParsedLuminaAction } from '@/utils';
import type { ActionPreviewData } from './suggestedActionCard.types';

// Kept in sync with PRIORITY_COLORS in
// src/pages/Home/components/CalendarEvent/CalendarEvent.styles.ts so the
// preview chip matches the color the task will actually get once created.
export const PRIORITY_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
  4: 'Urgent',
};

export const PRIORITY_COLORS: Record<number, string> = {
  1: '#34D399',
  2: '#60A5FA',
  3: '#FBBF24',
  4: '#F87171',
};

export const normalizeEstimateTimer = (value?: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1800;
  if (value > 1000 && value % 60 === 0) return Math.round(value / 60);
  return value;
};

export const formatDuration = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
};

export const stripMarkdown = (text: string): string =>
  text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s*\n\s*/g, ' ')
    .trim();

export const truncate = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max).trim()}…` : text;

/** Parses the LLM-supplied "deadline" (ISO date, e.g. "2026-09-07"); null if missing/invalid. */
export const parseDeadline = (value?: string): Date | null => {
  if (!value) return null;
  // A bare YYYY-MM-DD date must be read as a *local* calendar date, not UTC
  // midnight — `new Date('2026-09-07')` parses as UTC, which lands on the
  // previous day in any timezone behind UTC (e.g. Sep 6 in Mexico/Central
  // Time instead of the intended Sep 7).
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const local = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(local.getTime()) ? null : local;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDateLabel = (date: Date): string =>
  format(date, 'EEE, MMM d', { locale: enUS });

export const getActionTitle = (action: ParsedLuminaAction): string => {
  if (action.type === 'CREATE_TASK') return 'Create Task';
  if (action.type === 'CREATE_WORKSPACE') return 'Create Workspace';
  if (action.type === 'CREATE_NOTE') return 'Create Note';
  if (action.type === 'INSERT_TO_WORKSPACE') return 'Insert into Workspace';
  return 'Create Project Group';
};

export const getActionPreviewData = (
  action: ParsedLuminaAction,
): ActionPreviewData => {
  if (action.type === 'CREATE_TASK') {
    const priorityLevel = action.payload.priority_level ?? 2;
    const estimateTimer = normalizeEstimateTimer(
      Number(action.payload.estimate_timer) || 1800,
    );
    const deadline = parseDeadline(action.payload.deadline);
    return {
      title: action.payload.title || 'AI Task',
      description: action.payload.notes_encrypted || undefined,
      dateLabel: deadline ? formatDateLabel(deadline) : undefined,
      durationLabel: formatDuration(estimateTimer),
      priorityLabel: PRIORITY_LABELS[priorityLevel] || 'Medium',
      priorityColor: PRIORITY_COLORS[priorityLevel] || PRIORITY_COLORS[2],
    };
  }
  if (action.type === 'CREATE_WORKSPACE' || action.type === 'CREATE_NOTE') {
    const raw =
      action.payload.content_encrypted || action.payload.content || '';
    return {
      title:
        action.payload.title ||
        (action.type === 'CREATE_NOTE' ? 'AI Note' : 'AI Workspace'),
      contentPreview: raw ? truncate(stripMarkdown(raw), 180) : undefined,
    };
  }
  if (action.type === 'INSERT_TO_WORKSPACE') {
    const raw = action.payload.markdown || '';
    return {
      contentPreview: raw ? truncate(stripMarkdown(raw), 220) : undefined,
    };
  }
  return { title: action.payload.name || 'AI Project Group' };
};

export const getActionIcon = (
  action: ParsedLuminaAction,
  color: string,
): ReactNode => {
  const sx = { fontSize: 20, color };
  if (action.type === 'CREATE_TASK') return <AssignmentIcon sx={sx} />;
  if (action.type === 'CREATE_WORKSPACE' || action.type === 'CREATE_NOTE')
    return <DescriptionIcon sx={sx} />;
  if (action.type === 'INSERT_TO_WORKSPACE')
    return <AssignmentIcon sx={sx} />;
  return <FolderIcon sx={sx} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MutateFunction = MutationFunction<any, OperationVariables>;

export interface ActionExecutionContext {
  userId: string;
  createTask: MutateFunction;
  createWorkspace: MutateFunction;
  createProjectGroup: MutateFunction;
}

/**
 * Executes a single parsed action against the right GraphQL mutation.
 * Shared by the single-card flow and the multi-task plan modal so a fix
 * here (date handling, payload shape) never has to be made twice.
 */
export const executeSingleAction = async (
  action: ParsedLuminaAction,
  ctx: ActionExecutionContext,
): Promise<{ id?: string }> => {
  if (action.type === 'CREATE_TASK') {
    const priorityLevel = action.payload.priority_level ?? 2;
    const estimateTimer = normalizeEstimateTimer(
      Number(action.payload.estimate_timer) || 1800,
    );
    const deadline = parseDeadline(action.payload.deadline) ?? new Date();

    const res = await ctx.createTask({
      variables: {
        createTaskInput: {
          title: action.payload.title || 'AI Task',
          notes_encrypted: `${action.payload.notes_encrypted || ''} [COLOR:#3b82f6]`,
          estimate_timer: estimateTimer,
          real_timer: 0,
          tags: [],
          deadline: deadline.toISOString(),
          priority_level: priorityLevel,
          category: 'General',
          color: '#3b82f6',
          links: [],
          user_id: ctx.userId,
          status: 'Backlog',
          use_ai: true,
          // The user picked this exact day on purpose (a day-by-day plan,
          // including deliberate weekend days) — never let the
          // auto-scheduler move it to a different "working day".
          skip_scheduling: true,
        },
      },
      refetchQueries: [
        { query: GET_TASKS, variables: { userId: ctx.userId } },
        {
          query: GET_TASKS_TITLES,
          variables: { userId: ctx.userId, limit: 24, offset: 0 },
        },
      ],
    });
    return { id: res.data?.createTask?.id };
  }

  if (action.type === 'CREATE_WORKSPACE') {
    const res = await ctx.createWorkspace({
      variables: {
        createWorkspaceInput: {
          title: action.payload.title || 'AI Workspace',
          content: action.payload.content || '[]',
          groupId: action.payload.groupId || null,
          saveStatus: true,
        },
      },
      refetchQueries: [{ query: GET_WORKSPACES, variables: { search: '' } }],
    });
    return { id: res.data?.createWorkspace?.id };
  }

  if (action.type === 'CREATE_NOTE') {
    const res = await ctx.createWorkspace({
      variables: {
        createWorkspaceInput: {
          title: action.payload.title || 'AI Note',
          content:
            action.payload.content_encrypted ||
            action.payload.content ||
            '[]',
          groupId:
            action.payload.project_group_id ||
            action.payload.groupId ||
            null,
          saveStatus: true,
        },
      },
      refetchQueries: [{ query: GET_WORKSPACES, variables: { search: '' } }],
    });
    return { id: res.data?.createWorkspace?.id };
  }

  if (action.type === 'CREATE_PROJECT_GROUP') {
    const res = await ctx.createProjectGroup({
      variables: {
        input: {
          name: action.payload.name || 'AI Project Group',
          color: '#3b82f6',
          emoji: '📁',
        },
      },
      refetchQueries: [{ query: GET_PROJECT_GROUPS }],
    });
    return { id: res.data?.createProjectGroup?.id };
  }

  if (action.type === 'INSERT_TO_WORKSPACE') {
    const text = action.payload.markdown || '';
    window.dispatchEvent(
      new CustomEvent('lumina-insert-content', { detail: { text } }),
    );
    return {};
  }

  return {};
};
