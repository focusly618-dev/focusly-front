import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_TASKS,
} from '@/pages/Tasks/Task.graphql';
import {
  REMOVE_WORKSPACE,
  GET_WORKSPACES,
} from '@/pages/Workspace/workspaces.graphql';
import { sileo } from 'sileo';
import {
  createGoogleEvent,
  updateGoogleEvent,
  deleteGoogleEvent,
} from '@/api/GoogleCalendar/googleCalendarApi';
import { removeTask } from '@/redux/tasks/task.slice';
import {
  deduplicateLinks,
  parseDuration,
  parseRealTime,
  getPriorityLevel,
} from '../CreateTaskModal.utils';
import type { PriorityType } from '../CreateTaskModal.utils';
import type {
  TaskData,
  TaskInput,
  UseTaskMutationsProps,
} from '../types/CreateTaskModal.types';
import { handleMutationError } from '@/utils/errorHandler';

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
  const [removeWorkspaceMutation] = useMutation(REMOVE_WORKSPACE);

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
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

    let meetLink: string | null = null;
    if (state.shouldGenerateMeet) {
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

    const links = deduplicateLinks(state.links || []).map((l) => ({
      title: l.title,
      url: l.url,
    }));
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
    };

    const createInput: TaskInput = {
      ...commonInput,
      user_id: user.id || '',
      status: state.status || 'Backlog',
      google_event_id: (initialTask as { google_event_id?: string })
        ?.google_event_id,
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
    const taskCategory =
      state.category ||
      (initialTask as { category?: string | undefined }).category ||
      'General';

    const cleanDesc = (state.description || '')
      .replace(/\[COLOR:(.*?)\]/g, '')
      .replace(/\[START_DATE:(.*?)\]/g, '')
      .trim();

    const updateInput: TaskInput = {
      title: state.title || initialTask.title,
      notes_encrypted: `${cleanDesc} [COLOR:${taskColor}]`,
      status: state.status || initialTask.status,
      category: taskCategory,
      color: taskColor,
      estimate_timer: estimateTimer,
      real_timer: realTimer,
      deadline:
        state.deadline instanceof Date
          ? state.deadline.toISOString()
          : state.deadline || initialTask.deadline || '',
      priority_level: priorityLevel,
      tags: state.tags || initialTask.tags,
      links: deduplicateLinks(state.links || initialTask.links || []).map(
        (l) => ({
          title: l.title,
          url: l.url,
        }),
      ),
      google_event_id:
        (state as { google_event_id?: string }).google_event_id ||
        initialTask.google_event_id,
    };

    try {
      const { data } = await updateTaskMutation({
        variables: { updateTaskInput: { ...updateInput, id: initialTask.id } },
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

    try {
      await deleteTaskMutation({
        variables: { id: initialTask.id },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId: user?.id } },
          { query: GET_WORKSPACES, variables: { search: '' } },
        ],
      });
      dispatch(removeTask({ id: initialTask.id }));
      resetForm();
    } catch (e) {
      handleMutationError(e, 'Error al eliminar la tarea');
    }
  };

  const handleRemoveWorkspace = async (workspaceId: string) => {
    try {
      await removeWorkspaceMutation({
        variables: { id: workspaceId },
        refetchQueries: [{ query: GET_TASKS, variables: { userId: user?.id } }],
      });
    } catch (error) {
      handleMutationError(
        error,
        'Error al remover la tarea del espacio de trabajo',
      );
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
