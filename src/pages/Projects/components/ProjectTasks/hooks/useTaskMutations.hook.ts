import { useMutation } from '@apollo/client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
} from '@/pages/Tasks/Tasks.graphql';
import { upsertTask, removeTask } from '@/redux/tasks/task.slice';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import { sileo } from '@/utils';
import { parseDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type {
  ProjectTaskItemData,
  ProjectSubtaskItem,
  ProjectTaskPriority,
  ProjectTaskStatusId,
} from '../projectTasks.types';

export interface CreateProjectTaskInput {
  title: string;
  projectId?: string;
  status?: string;
  priority?: string;
  duration?: string | number;
  dueDate?: string;
  tag?: string;
  modules?: string[];
  description?: string;
  subtasks?: Array<{
    id?: string;
    title: string;
    completed?: boolean;
    time?: string;
    duration?: string;
  }>;
}

export interface UpdateProjectTaskInput {
  id: string;
  title?: string;
  status?: string;
  priority?: string;
  duration?: string | number;
  dueDate?: string;
  completed?: boolean;
  subtasks?: Array<{
    id?: string;
    title: string;
    completed?: boolean;
    estimate_timer?: number;
  }>;
}

export const mapStatusToBackend = (status?: string): string => {
  if (!status) return 'Todo';
  const s = status.toLowerCase();
  if (s === 'in_progress' || s === 'pending') return 'Pending';
  if (s === 'todo') return 'Todo';
  if (s === 'completed' || s === 'done') return 'Done';
  if (s === 'in_review' || s === 'review') return 'Review';
  if (s === 'backlog') return 'Backlog';
  return 'Todo';
};

export const mapStatusFromBackend = (status?: string): ProjectTaskStatusId => {
  if (!status) return 'todo';
  const s = status.toLowerCase();
  if (s === 'done' || s === 'completed') return 'completed';
  if (s === 'pending' || s === 'in_progress' || s === 'in progress')
    return 'in_progress';
  if (s === 'review' || s === 'in_review' || s === 'in review')
    return 'in_review';
  if (s === 'backlog' || s === 'on hold') return 'backlog';
  return 'todo';
};

export const mapPriorityFromBackend = (
  priority?: string | number,
): ProjectTaskPriority => {
  if (!priority && priority !== 0) return 'None';
  if (typeof priority === 'number') {
    if (priority >= 4) return 'Critical';
    if (priority === 3) return 'High';
    if (priority === 2) return 'Medium';
    if (priority === 1) return 'Low';
    return 'None';
  }
  const p = String(priority).toLowerCase();
  if (p.includes('crit')) return 'Critical';
  if (p.includes('high')) return 'High';
  if (p.includes('med')) return 'Medium';
  if (p.includes('low')) return 'Low';
  return 'None';
};

export const mapPriorityToBackend = (priority?: string): number => {
  if (!priority) return 0;
  const p = priority.toLowerCase();
  if (p === 'critical') return 4;
  if (p === 'high') return 3;
  if (p === 'medium' || p === 'med') return 2;
  if (p === 'low') return 1;
  return 0;
};

export const useTaskMutations = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [createTaskMutation, { loading: creating }] = useMutation(CREATE_TASK);
  const [updateTaskMutation, { loading: updating }] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation, { loading: deleting }] = useMutation(DELETE_TASK);

  const getRefetchQueries = () => {
    if (!user?.id) return [];
    return [
      'GetTasksByUserPaginated',
      {
        query: GET_TASKS,
        variables: { userId: user.id, limit: 100, offset: 0 },
      },
      {
        query: GET_TASKS_TITLES,
        variables: { userId: user.id, limit: 24, offset: 0 },
      },
    ];
  };

  const createProjectTask = async (input: CreateProjectTaskInput) => {
    if (!user?.id) {
      sileo.error({
        title: 'Auth Error',
        description: 'User not authenticated',
      });
      return null;
    }

    try {
      const estimateMinutes =
        typeof input.duration === 'number'
          ? input.duration
          : parseDuration(input.duration) || 0;

      const generateSubtaskId = () =>
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const formattedSubtasks = (input.subtasks || [])
        .filter((s) => s.title && s.title.trim().length > 0)
        .map((s) => ({
          id:
            s.id && s.id.length > 10 && !s.id.startsWith('st-')
              ? s.id
              : generateSubtaskId(),
          title: s.title.trim(),
          completed: Boolean(s.completed),
          estimate_timer: parseDuration(s.duration || s.time) || 15,
        }));

      const tags: string[] = [
        ...(input.tag ? [input.tag] : []),
        ...(input.modules || []),
      ];

      let deadline: string | undefined = undefined;
      if (input.dueDate && input.dueDate.trim()) {
        const parsed = new Date(input.dueDate);
        if (!isNaN(parsed.getTime())) {
          deadline = parsed.toISOString();
        }
      }

      const createTaskInput: Record<string, unknown> = {
        title: input.title.trim(),
        user_id: user.id,
        project_id: input.projectId || undefined,
        status: mapStatusToBackend(input.status),
        priority_level: mapPriorityToBackend(input.priority),
        estimate_timer: estimateMinutes,
        real_timer: 0,
        category: 'General',
        tags,
        notes_encrypted: input.description || '',
      };

      if (deadline) createTaskInput.deadline = deadline;
      if (formattedSubtasks.length > 0)
        createTaskInput.subtasks = formattedSubtasks;

      const res = await createTaskMutation({
        variables: { createTaskInput },
        refetchQueries: getRefetchQueries(),
        awaitRefetchQueries: true,
      });

      if (res.data?.createTask) {
        const mapped = mapResponseToTask(res.data.createTask);
        dispatch(upsertTask(mapped));
        sileo.success({
          title: 'Task Created',
          description: `Task "${input.title}" was created successfully.`,
          duration: 3000,
        });
        return res.data.createTask;
      }
      return null;
    } catch (err) {
      console.error('Error creating project task:', err);
      sileo.error({
        title: 'Error',
        description: 'Failed to create task.',
        duration: 3000,
      });
      throw err;
    }
  };

  const updateProjectTask = async (input: UpdateProjectTaskInput) => {
    if (!user?.id) return null;

    try {
      const updateTaskInput: Record<string, unknown> = {
        id: input.id,
      };

      if (input.title !== undefined) updateTaskInput.title = input.title;
      if (input.status !== undefined)
        updateTaskInput.status = mapStatusToBackend(input.status);
      if (input.priority !== undefined)
        updateTaskInput.priority_level = mapPriorityToBackend(input.priority);
      if (input.duration !== undefined) {
        updateTaskInput.estimate_timer =
          typeof input.duration === 'number'
            ? input.duration
            : parseDuration(input.duration);
      }
      if (input.dueDate !== undefined) {
        updateTaskInput.deadline = input.dueDate
          ? new Date(input.dueDate).toISOString()
          : undefined;
      }
      if (input.subtasks !== undefined) {
        updateTaskInput.subtasks = input.subtasks;
      }

      const res = await updateTaskMutation({
        variables: { updateTaskInput },
        refetchQueries: getRefetchQueries(),
        awaitRefetchQueries: true,
      });

      if (res.data?.updateTask) {
        const mapped = mapResponseToTask(res.data.updateTask);
        dispatch(upsertTask(mapped));
        return res.data.updateTask;
      }
      return null;
    } catch (err) {
      console.error('Error updating project task:', err);
      sileo.error({
        title: 'Error',
        description: 'Failed to update task.',
        duration: 3000,
      });
      throw err;
    }
  };

  const toggleProjectTaskComplete = async (task: ProjectTaskItemData) => {
    const isCurrentlyDone =
      task.completed || task.status.toLowerCase() === 'completed';
    const nextStatus = isCurrentlyDone ? 'in_progress' : 'completed';

    return updateProjectTask({
      id: task.id,
      status: nextStatus,
    });
  };

  const toggleProjectSubtask = async (
    taskId: string,
    subtaskId: string,
    currentSubtasks?: ProjectSubtaskItem[],
  ) => {
    if (!currentSubtasks) return;

    const updatedSubtasks = currentSubtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s,
    );

    return updateProjectTask({
      id: taskId,
      subtasks: updatedSubtasks.map((s) => ({
        id: s.id,
        title: s.title,
        completed: s.completed,
      })),
    });
  };

  const deleteProjectTask = async (taskId: string) => {
    try {
      await deleteTaskMutation({
        variables: { id: taskId },
        refetchQueries: getRefetchQueries(),
        awaitRefetchQueries: true,
      });
      dispatch(removeTask({ id: taskId }));
      sileo.success({
        title: 'Task deleted',
        description: 'Task removed successfully.',
        duration: 2500,
      });
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      sileo.error({
        title: 'Error',
        description: 'Failed to delete task.',
        duration: 3000,
      });
      throw err;
    }
  };

  return {
    createProjectTask,
    updateProjectTask,
    toggleProjectTaskComplete,
    toggleProjectSubtask,
    deleteProjectTask,
    isMutating: creating || updating || deleting,
  };
};

export const useTasksMutation = useTaskMutations;
