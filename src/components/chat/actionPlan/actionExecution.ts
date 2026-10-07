import type {
  ApolloClient,
  MutationFunction,
  OperationVariables,
} from '@apollo/client';
import { format } from 'date-fns';
import { GET_TASK_DETAIL } from '@/pages/Tasks/Tasks.graphql';
import { applySubtaskOps, toSubtaskRecords } from './subtaskOps';
import {
  createGoogleEvent,
  deleteGoogleEvent,
  fetchGoogleEvent,
  updateGoogleEvent,
} from '@/api/GoogleCalendar/googleCalendarApi';
import {
  buildEventCreateBody,
  buildEventPatchBody,
  patchNeedsCurrent,
} from './eventBody';
import type { ParsedLuminaAction } from '@/utils';
import { normalizeEstimateTimer, parseDeadline } from './planFormat';

export { normalizeEstimateTimer, parseDeadline };

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MutateFunction = MutationFunction<any, OperationVariables>;

export interface ActionExecutionContext {
  userId: string;
  createTask: MutateFunction;
  updateTask: MutateFunction;
  createWorkspace: MutateFunction;
  createProjectGroup: MutateFunction;
  deleteTask?: MutateFunction;
  /** Reads a task fresh before editing its subtasks. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?: ApolloClient<any>;
  /** Drops a deleted task from local state right away. */
  onTaskDeleted?: (id: string) => void;
  /** Drops a deleted event from the calendar right away. */
  onEventDeleted?: (id: string) => void;
  /** Asks the calendar view to refetch after an event changed. */
  onCalendarChanged?: () => void;
}

export interface ActionResult {
  id?: string;
  projectGroupId?: string;
  /** Where to open what was created (a Google Calendar event page). */
  url?: string;
  /** The event's Google Meet link. */
  meetUrl?: string;
}

/**
 * Executes a single parsed action against the right GraphQL mutation.
 * Shared by the single-card flow and the multi-task plan modal so a fix
 * here (date handling, payload shape) never has to be made twice. It doesn't
 * refetch the lists: the caller does it once, after the whole plan.
 */
export const executeSingleAction = async (
  action: ParsedLuminaAction,
  ctx: ActionExecutionContext,
): Promise<ActionResult> => {
  if (action.type === 'CREATE_TASK') {
    const priorityLevel = action.payload.priority_level ?? 2;
    const estimateTimer = normalizeEstimateTimer(
      Number(action.payload.estimate_timer) || 1800,
    );
    const deadline = parseDeadline(action.payload.deadline) ?? new Date();

    const rawSubtasks = action.payload.subtasks || [];
    const formattedSubtasks = rawSubtasks.map((s, idx) => {
      const title = typeof s === 'string' ? s : s.title;
      const timer =
        typeof s === 'object' && s.estimate_timer
          ? normalizeEstimateTimer(s.estimate_timer)
          : undefined;
      return {
        id:
          typeof s === 'object' && s.id
            ? s.id
            : `subtask-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        completed:
          typeof s === 'object' && typeof s.completed === 'boolean'
            ? s.completed
            : false,
        completed_at: null,
        estimate_timer: timer || null,
      };
    });

    const res = await ctx.createTask({
      variables: {
        createTaskInput: {
          title: action.payload.title || 'AI Task',
          notes: `${action.payload.notes || ''} [COLOR:#3b82f6]`,
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
          subtasks: formattedSubtasks,
          workspace_id: action.payload.workspace_id || undefined,
          project_id: action.payload.project_group_id || undefined,
          // The user picked this exact day on purpose (a day-by-day plan,
          // including deliberate weekend days) — never let the
          // auto-scheduler move it. skip_scheduling only protects THIS
          // create call; it does not stick. Any later Google Calendar sync
          // (sync_calendar → run_scheduling_pipeline) reschedules every
          // "freely assignable" task for the user with no skip_scheduling
          // awareness at all, and migration_service.py only excludes a task
          // from that sweep once BOTH estimated_start_date AND
          // estimated_end_date are set — so we set both explicitly here,
          // matching the deadline/duration we just asked for. That's what
          // makes the protection durable, not just true at creation time.
          estimated_start_date: deadline.toISOString(),
          estimated_end_date: new Date(
            deadline.getTime() + estimateTimer * 60000,
          ).toISOString(),
          skip_scheduling: true,
        },
      },
    });
    return { id: res.data?.createTask?.id };
  }

  if (action.type === 'UPDATE_TASK') {
    if (!action.payload.id) {
      throw new Error('UPDATE_TASK is missing the id of the task to move');
    }

    const updateTaskInput: Record<string, unknown> = { id: action.payload.id };

    if (action.payload.status) {
      updateTaskInput.status = action.payload.status;
    }
    if (action.payload.workspace_id) {
      updateTaskInput.workspace_id = action.payload.workspace_id;
    }
    if (action.payload.project_group_id) {
      updateTaskInput.project_id = action.payload.project_group_id;
    }
    if (action.payload.title !== undefined) {
      updateTaskInput.title = action.payload.title;
    }
    if (action.payload.notes !== undefined) {
      updateTaskInput.notes = action.payload.notes;
    }
    if (action.payload.priority_level !== undefined) {
      updateTaskInput.priority_level = action.payload.priority_level;
    }
    if (action.payload.estimate_timer !== undefined) {
      updateTaskInput.estimate_timer = normalizeEstimateTimer(
        Number(action.payload.estimate_timer),
      );
    }
    if (action.payload.deadline) {
      const deadline = parseDeadline(action.payload.deadline);
      if (deadline) updateTaskInput.deadline = deadline.toISOString();
    }
    if (action.payload.estimated_start_date) {
      const rawStart = action.payload.estimated_start_date;
      const rawEnd = action.payload.estimated_end_date;
      const rawDeadline = action.payload.deadline;

      const startDate = parseDeadline(rawStart);
      const deadlineDate = parseDeadline(rawDeadline || rawStart);
      let endDate = parseDeadline(rawEnd);

      if (startDate && !endDate && action.payload.estimate_timer) {
        endDate = new Date(
          startDate.getTime() +
            normalizeEstimateTimer(action.payload.estimate_timer) * 60000,
        );
      }

      if (startDate) {
        updateTaskInput.estimated_start_date = format(
          startDate,
          "yyyy-MM-dd'T'HH:mm:ss",
        );
      }
      if (endDate) {
        updateTaskInput.estimated_end_date = format(
          endDate,
          "yyyy-MM-dd'T'HH:mm:ss",
        );
      }
      if (deadlineDate) {
        updateTaskInput.deadline = format(
          deadlineDate,
          "yyyy-MM-dd'T'HH:mm:ss",
        );
      }
    }

    const res = await ctx.updateTask({
      variables: {
        updateTaskInput,
      },
    });
    return { id: res.data?.updateTask?.id };
  }

  if (action.type === 'UPDATE_SUBTASKS') {
    if (!action.payload.id) {
      throw new Error('UPDATE_SUBTASKS is missing the id of the task');
    }
    if (!ctx.client) throw new Error('UPDATE_SUBTASKS needs an Apollo client');
    // The checklist is written whole: build on the task's current subtasks,
    // read fresh, so none are lost.
    const { data } = await ctx.client.query({
      query: GET_TASK_DETAIL,
      variables: { id: action.payload.id },
      fetchPolicy: 'network-only',
    });
    if (!data?.task) throw new Error('Task not found');
    const subtasks = applySubtaskOps(
      toSubtaskRecords(data.task.subtasks),
      action.payload,
    );
    const res = await ctx.updateTask({
      variables: { updateTaskInput: { id: action.payload.id, subtasks } },
    });
    return { id: res.data?.updateTask?.id };
  }

  if (action.type === 'DELETE_TASK') {
    if (!action.payload.id) {
      throw new Error('DELETE_TASK is missing the id of the task');
    }
    if (!ctx.deleteTask)
      throw new Error('DELETE_TASK needs the delete mutation');
    // The backend also removes the task's Google Calendar event, if synced.
    await ctx.deleteTask({
      variables: { id: action.payload.id },
    });
    ctx.onTaskDeleted?.(action.payload.id);
    return { id: action.payload.id };
  }

  if (action.type === 'CREATE_EVENT') {
    const created = await createGoogleEvent(
      buildEventCreateBody(action.payload),
    );
    ctx.onCalendarChanged?.();
    return {
      id: created.id,
      url: created.htmlLink,
      meetUrl: created.hangoutLink,
    };
  }

  if (action.type === 'UPDATE_EVENT') {
    const { id } = action.payload;
    if (!id) throw new Error('UPDATE_EVENT is missing the event id');
    // Guests, length and Meet are read from Google right before the edit:
    // the guest list is written whole, so a stale copy would drop people.
    const current = patchNeedsCurrent(action.payload)
      ? await fetchGoogleEvent(id)
      : null;
    const updated = await updateGoogleEvent(
      id,
      buildEventPatchBody(action.payload, current),
    );
    ctx.onCalendarChanged?.();
    return { id, url: updated.htmlLink, meetUrl: updated.hangoutLink };
  }

  if (action.type === 'DELETE_EVENT') {
    const { id } = action.payload;
    if (!id) throw new Error('DELETE_EVENT is missing the event id');
    // Guests are notified: the backend deletes with sendUpdates=all.
    await deleteGoogleEvent(id);
    ctx.onEventDeleted?.(id);
    ctx.onCalendarChanged?.();
    return { id };
  }

  if (action.type === 'CREATE_WORKSPACE' || action.type === 'CREATE_NOTE') {
    const isNote = action.type === 'CREATE_NOTE';
    const title = action.payload.title || (isNote ? 'AI Note' : 'AI Workspace');
    let rawContent =
      action.payload.content ||
      action.payload.content_encrypted ||
      action.payload.markdown ||
      '';

    if (!rawContent || rawContent === '[]') {
      rawContent = isNote
        ? `# ${title}\n\nNota creada por Lumina.\n`
        : `# ${title}\n\n## Resumen / Objetivos\nDocumento de trabajo generado por Lumina.\n\n## Secciones de Investigación\n- [ ] Recopilar fuentes y antecedentes\n- [ ] Desarrollo de conceptos clave\n- [ ] Conclusiones y referencias\n`;
    }

    let targetGroupId =
      action.payload.project_group_id || action.payload.groupId || null;

    if (!targetGroupId) {
      const projectName =
        action.payload.project_name ||
        action.payload.new_project_name ||
        title
          .replace(/^(?:Reporte|Investigación|Proyecto|Documento):\s*/i, '')
          .trim() ||
        title;

      try {
        const projectRes = await ctx.createProjectGroup({
          variables: {
            input: {
              name: projectName,
              color: action.payload.color || '#6366f1',
              emoji: action.payload.emoji || '📁',
            },
          },
        });
        targetGroupId = projectRes.data?.createProjectGroup?.id || null;
      } catch (err) {
        console.error('Error auto-creating project group for workspace:', err);
      }
    }

    const res = await ctx.createWorkspace({
      variables: {
        createWorkspaceInput: {
          title,
          content: rawContent,
          groupId: targetGroupId,
          saveStatus: true,
        },
      },
    });
    return {
      id: res.data?.createWorkspace?.id,
      projectGroupId: targetGroupId ?? undefined,
    };
  }

  if (action.type === 'CREATE_PROJECT_GROUP') {
    const res = await ctx.createProjectGroup({
      variables: {
        input: {
          name:
            action.payload.name ||
            action.payload.project_name ||
            'AI Project Group',
          color: action.payload.color || '#6366f1',
          emoji: action.payload.emoji || '📁',
        },
      },
    });
    return { id: res.data?.createProjectGroup?.id };
  }

  if (action.type === 'INSERT_TO_WORKSPACE') {
    const text = action.payload.markdown || '';
    // Check if a workspace editor is currently mounted and listening for this event.
    // The editor registers/unregisters itself via a global flag so we can give
    // the user meaningful feedback instead of silently losing content.
    const editorIsOpen =
      typeof window !== 'undefined' &&
      (window as unknown as Record<string, unknown>).__luminaEditorMounted ===
        true;
    if (!editorIsOpen) {
      throw new Error(
        'Abre un Workspace en la pestaña de Proyectos para poder insertar contenido.',
      );
    }
    window.dispatchEvent(
      new CustomEvent('lumina-insert-content', { detail: { text } }),
    );
    return {};
  }

  return {};
};
