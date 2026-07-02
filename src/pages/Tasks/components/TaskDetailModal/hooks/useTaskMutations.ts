import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  GET_WORKSPACES,
  UPDATE_WORKSPACE,
} from '@/pages/Workspace/Workspace.graphql';
import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_TASKS,
} from '../../../Tasks.graphql';
import { sileo, handleMutationError } from '@/utils';
import {
  createGoogleEvent,
  updateGoogleEvent,
  deleteGoogleEvent,
} from '@/api/GoogleCalendar/googleCalendarApi';
import { removeTask } from '@/redux/tasks/task.slice';
import { removeEvent } from '@/redux/calendar/calendar.slice';
import {
  deduplicateLinks,
  parseDuration,
  parseRealTime,
  getPriorityLevel,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type {
  TaskData,
  TaskInput,
  UseTaskMutationsProps,
} from '../types/TaskDetailModal.types';
import type { PriorityType } from '../TaskDetailModal.utils';

export const useTaskMutations = ({
  onSave,
  onClose,
  onDelete,
  initialTask,
  resetForm,
}: UseTaskMutationsProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loadingSave, setLoadingSave] = useState(false);

  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const generateMeetLinkNow = async (
    googleEventId?: string,
    state?: Partial<TaskData & { color: string }>,
  ) => {
    try {
      if (googleEventId) {
        const updated = await updateGoogleEvent(googleEventId, {
          conferenceData: {
            createRequest: {
              requestId: `focusly-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        });
        return updated.hangoutLink;
      } else {
        const tempEvent = await createGoogleEvent({
          summary: state?.title || 'Focusly Meeting',
          description: state?.description || '',
          start: {
            dateTime:
              state?.deadline?.toISOString() || new Date().toISOString(),
          },
          end: {
            dateTime: new Date(
              (state?.deadline?.getTime() || Date.now()) +
                (parseDuration(state?.duration || '30m') || 30) * 60000,
            ).toISOString(),
          },
          conferenceData: {
            createRequest: {
              requestId: `focusly-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        });

        const meetLink = tempEvent.hangoutLink || null;
        if (tempEvent.id) {
          try {
            // Delete the dummy event so it doesn't show up in the user's Calendar
            await deleteGoogleEvent(tempEvent.id);
          } catch (e) {
            console.warn('Failed to delete dummy meet event immediately', e);
          }
        }

        return meetLink;
      }
    } catch (error) {
      console.error('Error generating meet link:', error);
      return null;
    }
  };

  const handleSave = async (
    state: TaskData & { color: string; shouldGenerateMeet?: boolean },
  ) => {
    if (!user) return;
    setLoadingSave(true);

    // Check if there's already a Google Meet link in the state
    const hasExistingMeetLink = state.links?.some(
      (l) =>
        l.url.includes('meet.google.com') ||
        l.title.toLowerCase().includes('meet'),
    );

    let meetLink: string | null = null;
    // Only generate new meet link if shouldGenerateMeet is true AND no meet link exists
    if (state.shouldGenerateMeet && !hasExistingMeetLink) {
      const generated = await generateMeetLinkNow(undefined, state);
      meetLink = generated || null;
    }

    const estimateTimer = parseDuration(state.duration);
    const realTimer = parseRealTime(state.realTime || '');
    const priorityLevel = getPriorityLevel(state.priority as PriorityType);

    const cleanDesc = (state.description || '')
      .replace(/\[COLOR:(.*?)\]/g, '')
      .replace(/\[START_DATE:(.*?)\]/g, '')
      .trim();

    const links = deduplicateLinks(state.links || []).map(
      (l: { title: string; url: string }) => ({ title: l.title, url: l.url }),
    );
    // Only add meet link if we generated a new one (not if it already exists)
    if (meetLink) {
      links.push({ title: 'Google Meet', url: meetLink });
    }

    const commonInput = {
      title: state.title,
      notes_encrypted: `${cleanDesc} [COLOR:${state.color}]`,
      estimate_timer: estimateTimer,
      real_timer: realTimer,
      tags: state.tags,
      deadline: state.deadline
        ? state.deadline.toISOString()
        : new Date().toISOString(),
      priority_level: priorityLevel,
      category: state.category,
      color: state.color,
      links,
      collaborators: state.collaborators,
    };

    const deadlineISO = state.deadline
      ? state.deadline.toISOString()
      : new Date().toISOString();
    const endDateISO = new Date(
      (state.deadline?.getTime() || Date.now()) + (estimateTimer || 25) * 60000,
    ).toISOString();

    const createInput: TaskInput = {
      ...commonInput,
      user_id: user.id || '',
      status: state.status || 'Backlog',
      google_event_id: (initialTask as { google_event_id?: string })
        ?.google_event_id,
      estimated_start_date: deadlineISO,
      estimated_end_date: endDateISO,
    };

    try {
      const { data } = await createTaskMutation({
        variables: { createTaskInput: createInput },
        refetchQueries: [{ query: GET_TASKS, variables: { userId: user.id } }],
      });
      if (data?.createTask) {
        sileo.success({
          title: 'Task created',
          fill: 'var(--sileo-success-bg)',
        });
        onSave(data.createTask);
        resetForm();
        onClose();
      }
    } catch (e) {
      handleMutationError(e, 'Error al crear la tarea');
    }
    setLoadingSave(false);
  };

  const handleUpdate = async (
    state: TaskData & { color: string; shouldGenerateMeet?: boolean },
    shouldClose = true,
  ) => {
    if (!user || !initialTask?.id) return;
    setLoadingSave(true);
    const estimateTimer = state.duration
      ? parseDuration(state.duration)
      : initialTask.estimate_timer || 0;
    const priorityLevel = state.priority
      ? getPriorityLevel(state.priority as PriorityType)
      : initialTask.priority_level || 2;
    const realTimer =
      state.realTime !== undefined && state.realTime !== null
        ? parseRealTime(state.realTime)
        : initialTask.real_timer || 0;

    const taskColor =
      state.color ||
      (initialTask as { color?: string | undefined }).color ||
      '#3b82f6';

    const cleanDesc = (state.description || '')
      .replace(/\[COLOR:(.*?)\]/g, '')
      .replace(/\[START_DATE:(.*?)\]/g, '')
      .trim();

    const currentNotes = `${cleanDesc} [COLOR:${taskColor}]`;

    const currentDeadline =
      state.deadline instanceof Date
        ? state.deadline.toISOString()
        : state.deadline || initialTask.deadline || '';

    const startDate = new Date(currentDeadline);
    const estimatedStartISO = !isNaN(startDate.getTime())
      ? startDate.toISOString()
      : undefined;
    const estimatedEndISO = !isNaN(startDate.getTime())
      ? new Date(
          startDate.getTime() + (estimateTimer || 30) * 60000,
        ).toISOString()
      : undefined;

    // Define which fields to compare and how
    const configs: Record<
      string,
      {
        key: string;
        val: unknown;
        initial: unknown;
        isEqual?: (a: unknown, b: unknown) => boolean;
      }
    > = {
      title: { key: 'title', val: state.title, initial: initialTask.title },
      notes: {
        key: 'notes_encrypted',
        val: currentNotes,
        initial: initialTask.notes_encrypted,
      },
      status: { key: 'status', val: state.status, initial: initialTask.status },
      category: {
        key: 'category',
        val: state.category,
        initial: initialTask.category,
      },
      color: {
        key: 'color',
        val: taskColor,
        initial: (initialTask as { color?: string }).color,
      },
      estimate: {
        key: 'estimate_timer',
        val: estimateTimer,
        initial: initialTask.estimate_timer,
      },
      realTime: {
        key: 'real_timer',
        val: realTimer,
        initial: initialTask.real_timer,
      },
      deadline: {
        key: 'deadline',
        val: currentDeadline,
        initial: initialTask.deadline,
      },
      priority: {
        key: 'priority_level',
        val: priorityLevel,
        initial: initialTask.priority_level,
      },
      googleId: {
        key: 'google_event_id',
        val: (state as TaskData).google_event_id || initialTask.google_event_id,
        initial: initialTask.google_event_id,
      },
      tags: {
        key: 'tags',
        val: state.tags || [],
        initial: initialTask.tags || [],
        isEqual: (a, b) =>
          JSON.stringify([...(a as unknown[])].sort()) ===
          JSON.stringify([...(b as unknown[])].sort()),
      },
      links: {
        key: 'links',
        val: deduplicateLinks(state.links || []).map((l) => ({
          title: l.title,
          url: l.url,
        })),
        initial: (initialTask.links || []).map((l) => ({
          title: l.title,
          url: l.url,
        })),
        isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      },
      collaborators: {
        key: 'collaborators',
        val: state.collaborators || [],
        initial: initialTask.collaborators || [],
        isEqual: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      },
      estimatedStartDate: {
        key: 'estimated_start_date',
        val: estimatedStartISO,
        initial: initialTask.estimated_start_date,
      },
      estimatedEndDate: {
        key: 'estimated_end_date',
        val: estimatedEndISO,
        initial: initialTask.estimated_end_date,
      },
    };

    const updateInput: Record<string, unknown> = { id: initialTask.id };
    let hasChanges = false;

    Object.values(configs).forEach(({ key, val, initial, isEqual }) => {
      const areEqual = isEqual ? isEqual(initial, val) : initial === val;
      if (!areEqual && val !== undefined) {
        updateInput[key] = val;
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      if (shouldClose) onClose();
      setLoadingSave(false);
      return;
    }

    try {
      const { data } = await updateTaskMutation({
        variables: { updateTaskInput: updateInput },
        refetchQueries: [{ query: GET_TASKS, variables: { userId: user.id } }],
      });
      if (data?.updateTask) {
        sileo.success({
          title: 'Task updated',
          fill: 'var(--sileo-update-bg)',
        });
        onSave(data.updateTask);
        if (shouldClose) onClose();
      }
    } catch (e) {
      handleMutationError(e, 'Error al actualizar la tarea');
    }
    setLoadingSave(false);
  };

  const handleDelete = async () => {
    if (!initialTask?.id) return;

    if (onDelete) {
      onDelete(initialTask.id);
      return;
    }

    // 1. Optimistic Delete in Redux
    dispatch(removeTask({ id: initialTask.id }));
    dispatch(removeEvent({ id: initialTask.id }));
    if (initialTask.google_event_id) {
      dispatch(removeEvent({ id: initialTask.google_event_id }));
    }

    try {
      const isGoogleTask = initialTask.source === 'google';

      if (!isGoogleTask) {
        // Platform Task — Delete from BOTH Google Calendar (if synced) and Platform DB
        if (initialTask.google_event_id) {
          try {
            await deleteGoogleEvent(initialTask.google_event_id);
          } catch (err) {
            console.warn(
              'Failed to delete synced Google event, proceeding with platform delete',
              err,
            );
          }
        }

        await deleteTaskMutation({
          variables: { id: initialTask.id },
          refetchQueries: [
            { query: GET_TASKS, variables: { userId: user?.id } },
            { query: GET_WORKSPACES, variables: { search: '' } },
          ],
        });
      } else {
        // Pure Google Task
        const eventId = initialTask.google_event_id || initialTask.id;
        await deleteGoogleEvent(eventId);
      }

      resetForm();
      onClose();
    } catch (e) {
      handleMutationError(e, 'Error al eliminar la tarea');
    }
  };

  const [updateWorkspaceMutation] = useMutation(UPDATE_WORKSPACE);

  const handleRemoveWorkspace = async (workspaceId: string) => {
    try {
      await updateWorkspaceMutation({
        variables: {
          updateWorkspaceInput: {
            id: workspaceId,
            taskId: null,
          },
        },
        refetchQueries: [{ query: GET_TASKS, variables: { userId: user?.id } }],
      });
      sileo.success({
        title: 'Workspace unlinked',
        fill: 'var(--sileo-update-bg)',
      });
    } catch (error) {
      handleMutationError(error, 'Error al desvincular el espacio de trabajo');
    }
  };

  return {
    handleSave,
    handleUpdate,
    handleDelete,
    handleRemoveWorkspace,
    generateMeetLinkNow,
    loadingSave,
  };
};
