import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_TASKS } from '@/pages/Tasks/Tasks.graphql';
import { REMOVE_WORKSPACE } from '@/pages/Workspace/Workspace.graphql';
import { sileo, handleMutationError } from '@/utils';
import { useTaskOperations } from '@/hooks/useTaskOperations';
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

export const useTaskMutations = ({
  onSave,
  onClose,
  onDelete,
  initialTask,
  resetForm,
}: UseTaskMutationsProps) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const {
    user,
    generateMeetLinkNow,
    executeCreateTask,
    executeUpdateTask,
    executeDeleteTask,
  } = useTaskOperations();

  const [removeWorkspaceMutation] = useMutation(REMOVE_WORKSPACE);

  const handleSave = async (
    state: TaskData & { color: string; shouldGenerateMeet?: boolean },
  ) => {
    if (!user) return;
    setLoadingSave(true);

    let meetLink: string | null = null;
    let createdGoogleEventId: string | undefined = undefined;

    if (
      state.shouldGenerateMeet ||
      (state.collaborators && state.collaborators.length > 0)
    ) {
      const res = await generateMeetLinkNow(undefined, state);
      if (res) {
        meetLink = res.meetLink;
        createdGoogleEventId = res.googleEventId;
      }
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
    if (meetLink && !links.some((l) => l.url === meetLink)) {
      links.push({ title: 'Google Meet', url: meetLink });
    }

    const commonInput = {
      title: state.title,
      notes_encrypted: `${cleanDesc} [COLOR:${state.color}]`,
      estimate_timer: estimateTimer,
      real_timer: realTimer,
      tags: state.tags,
      deadline:
        state.deadline && !isNaN(state.deadline.getTime())
          ? state.deadline.toISOString()
          : new Date().toISOString(),
      priority_level: priorityLevel,
      category: state.category,
      color: state.color,
      links,
      collaborators: state.collaborators,
    };

    const createInput: TaskInput = {
      ...commonInput,
      user_id: user.id || '',
      status: state.status || 'Backlog',
      google_event_id:
        createdGoogleEventId ||
        (initialTask as { google_event_id?: string })?.google_event_id,
    };

    try {
      const data = await executeCreateTask(
        createInput as unknown as Record<string, unknown>,
      );
      if (data?.createTask) {
        sileo.success({
          title: 'Task created',
          description: 'The task has been created successfully',
          fill: 'var(--sileo-success-bg)',
          duration: 2000,
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

    const deadlineISO: string = state.deadline
      ? !isNaN(state.deadline.getTime())
        ? state.deadline.toISOString()
        : initialTask.deadline || ''
      : initialTask.deadline || '';

    const startDate = new Date(deadlineISO);
    const estimatedStartISO = !isNaN(startDate.getTime())
      ? startDate.toISOString()
      : undefined;
    const estimatedEndISO = !isNaN(startDate.getTime())
      ? new Date(
          startDate.getTime() + (estimateTimer || 30) * 60000,
        ).toISOString()
      : undefined;

    const updateInput: TaskInput = {
      title: state.title || initialTask.title,
      notes_encrypted: `${cleanDesc} [COLOR:${taskColor}]`,
      status: state.status || initialTask.status,
      category: taskCategory,
      color: taskColor,
      estimate_timer: estimateTimer,
      real_timer: realTimer,
      deadline: deadlineISO,
      priority_level: priorityLevel,
      tags: state.tags || initialTask.tags,
      links: deduplicateLinks(state.links || initialTask.links || []).map(
        (l) => ({
          title: l.title,
          url: l.url,
        }),
      ),
      collaborators: state.collaborators || initialTask.collaborators,
      google_event_id:
        (state as { google_event_id?: string }).google_event_id ||
        initialTask.google_event_id,
      estimated_start_date: estimatedStartISO,
      estimated_end_date: estimatedEndISO,
    };

    try {
      const data = await executeUpdateTask({
        ...updateInput,
        id: initialTask.id,
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
      await executeDeleteTask(initialTask.id, {
        googleEventId: initialTask.google_event_id,
      });
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
