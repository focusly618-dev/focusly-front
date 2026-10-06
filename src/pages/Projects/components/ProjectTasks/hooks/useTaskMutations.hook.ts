import { useApolloClient, useMutation, type ApolloCache } from '@apollo/client';
import { useTranslation } from 'react-i18next';
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
import { notify } from '@/utils';
import { parseDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import { dateInputToISO } from '../projectTaskDates';
import {
  DEFAULT_PROJECT_STATUSES,
  type ProjectTaskItemData,
  type ProjectSubtaskItem,
  type ProjectTaskPriority,
  type ProjectTaskStatusId,
} from '../projectTasks.types';

export interface CreateProjectTaskInput {
  title: string;
  projectId?: string;
  workspaceId?: string;
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
  description?: string;
  projectId?: string;
  /** null unlinks the workspace. */
  workspaceId?: string | null;
  completed?: boolean;
  tags?: string[];
  subtasks?: Array<{
    id?: string;
    title: string;
    completed?: boolean;
    completed_at?: string | null;
    estimate_timer?: number | null;
  }>;
}

const generateSubtaskId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const mapStatusToBackend = (status?: string): string => {
  if (!status) return 'Todo';
  const s = status.toLowerCase();
  const known = DEFAULT_PROJECT_STATUSES.find(
    (config) => config.id === s || config.backend.toLowerCase() === s,
  );
  if (known) return known.backend;
  if (s === 'review') return 'Review';
  if (s === 'done') return 'Done';
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
  if (s === 'on hold' || s === 'on_hold') return 'on_hold';
  if (s === 'planning' || s === 'scheduled' || s === 'backlog') return s;
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

/** How long the "Undo" button stays after completing a task. */
const UNDO_MS = 6000;

// What a task was before it was completed, so reopening it puts it back
// there (it used to always land in "Pending").
const statusBeforeDone = new Map<string, ProjectTaskStatusId>();

export const useTaskMutations = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [createTaskMutation, { loading: creating }] = useMutation(CREATE_TASK);
  const [updateTaskMutation, { loading: updating }] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation, { loading: deleting }] = useMutation(DELETE_TASK);
  const client = useApolloClient();

  // Shows a change on screen before the server answers. The optimistic layer
  // is dropped once the request settles: the server's data takes over, or the
  // change disappears if the request failed.
  const withOptimisticChange = async <T>(
    apply: (cache: ApolloCache<unknown>) => void,
    run: () => Promise<T>,
  ) => {
    const layerId = `project-task-${generateSubtaskId()}`;
    client.cache.recordOptimisticTransaction(apply, layerId);
    try {
      return await run();
    } finally {
      client.cache.removeOptimistic(layerId);
    }
  };

  const getRefetchQueries = () => {
    if (!user?.id) return [];
    return [
      'GetTasksByUserPaginated',
      // The project tasks view's own query; without it new tasks didn't show
      // up and deleted ones stayed until the view remounted.
      'GetProjectTasks',
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
      notify.error({ title: t('projectTasks.toast.authError') });
      return null;
    }

    try {
      const estimateMinutes =
        typeof input.duration === 'number'
          ? input.duration
          : parseDuration(input.duration) || 0;

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

      const deadline = dateInputToISO(input.dueDate);

      const createTaskInput: Record<string, unknown> = {
        title: input.title.trim(),
        user_id: user.id,
        project_id: input.projectId || undefined,
        workspace_id: input.workspaceId || undefined,
        status: mapStatusToBackend(input.status),
        priority_level: mapPriorityToBackend(input.priority),
        estimate_timer: estimateMinutes,
        real_timer: 0,
        category: 'General',
        tags,
        notes: input.description || '',
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
        notify.success({
          title: t('projectTasks.toast.created'),
          description: input.title,
          duration: 3000,
        });
        return res.data.createTask;
      }
      return null;
    } catch (err) {
      console.error('Error creating project task:', err);
      notify.error({
        title: t('projectTasks.toast.createFailed'),
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
        // An empty estimate removes it (null); the backend keeps it otherwise.
        updateTaskInput.estimate_timer =
          typeof input.duration === 'number'
            ? input.duration
            : input.duration
              ? parseDuration(input.duration)
              : null;
      }
      if (input.dueDate !== undefined) {
        // An empty date removes it: the backend treats null as "no date".
        updateTaskInput.deadline = input.dueDate
          ? dateInputToISO(input.dueDate)
          : null;
      }
      if (input.subtasks !== undefined) {
        updateTaskInput.subtasks = input.subtasks;
      }
      if (input.tags !== undefined) {
        updateTaskInput.tags = input.tags;
      }
      if (input.description !== undefined) {
        updateTaskInput.notes = input.description;
      }
      if (input.projectId !== undefined) {
        updateTaskInput.project_id = input.projectId || undefined;
      }
      if (input.workspaceId !== undefined) {
        // An explicit null tells the backend to remove the link.
        updateTaskInput.workspace_id = input.workspaceId || null;
      }

      const res = await updateTaskMutation({
        variables: { updateTaskInput },
        // updateTask doesn't return the nested project/workspace, so a moved
        // or unlinked task would keep showing its old chips until the list is
        // fetched again.
        refetchQueries:
          input.projectId !== undefined || input.workspaceId !== undefined
            ? ['GetProjectTasks']
            : undefined,
      });

      if (res.data?.updateTask) {
        const mapped = mapResponseToTask(res.data.updateTask);
        dispatch(upsertTask(mapped));
        return res.data.updateTask;
      }
      return null;
    } catch (err) {
      console.error('Error updating project task:', err);
      notify.error({
        title: t('projectTasks.toast.updateFailed'),
        duration: 3000,
      });
      throw err;
    }
  };

  const setProjectTaskStatus = (
    task: ProjectTaskItemData,
    status: ProjectTaskStatusId,
  ) =>
    withOptimisticChange(
      (cache) =>
        cache.modify({
          id: cache.identify({ __typename: 'Task', id: task.id }),
          fields: { status: () => mapStatusToBackend(status) },
        }),
      () => updateProjectTask({ id: task.id, status }),
    );

  const toggleProjectTaskComplete = async (task: ProjectTaskItemData) => {
    const isCurrentlyDone =
      task.completed || task.status.toLowerCase() === 'completed';
    if (isCurrentlyDone) {
      const previous = statusBeforeDone.get(task.id) ?? 'todo';
      statusBeforeDone.delete(task.id);
      return setProjectTaskStatus(task, previous);
    }

    statusBeforeDone.set(task.id, task.status);
    const result = await setProjectTaskStatus(task, 'completed');
    const toastId = notify.success({
      title: t('projectTasks.toast.completed'),
      description: task.title,
      button: {
        title: t('projectTasks.toast.undo'),
        onClick: () => {
          statusBeforeDone.delete(task.id);
          void setProjectTaskStatus(task, task.status);
        },
      },
    });
    // Toasts with a button stay until closed; this one is only useful briefly.
    setTimeout(() => notify.dismiss(toastId), UNDO_MS);
    return result;
  };

  /** Moves several tasks to one status; returns how many failed. */
  const setProjectTasksStatus = async (
    tasks: ProjectTaskItemData[],
    status: ProjectTaskStatusId,
  ) => {
    const results = await Promise.allSettled(
      tasks.map((task) => setProjectTaskStatus(task, status)),
    );
    return results.filter((r) => r.status === 'rejected').length;
  };

  const toggleProjectSubtask = async (
    taskId: string,
    subtaskId: string,
    currentSubtasks?: ProjectSubtaskItem[],
  ) => {
    if (!currentSubtasks) return;

    // The backend replaces the whole list, so every subtask has to go back
    // with its estimate and completion date or they get erased.
    const run = () =>
      updateProjectTask({
        id: taskId,
        subtasks: currentSubtasks.map((s) => {
          if (s.id !== subtaskId) {
            return {
              id: s.id,
              title: s.title,
              completed: s.completed,
              completed_at: s.completedAt ?? null,
              estimate_timer: s.estimateTimer ?? null,
            };
          }
          const completed = !s.completed;
          return {
            id: s.id,
            title: s.title,
            completed,
            completed_at: completed ? new Date().toISOString() : null,
            estimate_timer: s.estimateTimer ?? null,
          };
        }),
      });

    return withOptimisticChange(
      (cache) =>
        cache.modify({
          id: cache.identify({ __typename: 'Subtask', id: subtaskId }),
          fields: { completed: (value: boolean) => !value },
        }),
      run,
    );
  };

  const addProjectSubtask = async (
    taskId: string,
    title: string,
    currentSubtasks: ProjectSubtaskItem[] = [],
  ) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    return updateProjectTask({
      id: taskId,
      subtasks: [
        ...currentSubtasks.map((s) => ({
          id: s.id,
          title: s.title,
          completed: s.completed,
          completed_at: s.completedAt ?? null,
          estimate_timer: s.estimateTimer ?? null,
        })),
        {
          id: generateSubtaskId(),
          title: trimmed,
          completed: false,
          completed_at: null,
          estimate_timer: null,
        },
      ],
    });
  };

  const removeTaskById = async (taskId: string) => {
    await deleteTaskMutation({ variables: { id: taskId } });
    dispatch(removeTask({ id: taskId }));
    // Gone from every cached list at once, mounted or not.
    client.cache.evict({
      id: client.cache.identify({ __typename: 'Task', id: taskId }),
    });
  };

  // One refetch of the lists on screen, however many tasks were deleted.
  const refetchAfterDelete = async () => {
    client.cache.gc();
    await client.refetchQueries({
      include: [
        'GetTasksByUserPaginated',
        'GetProjectTasks',
        GET_TASKS,
        GET_TASKS_TITLES,
      ],
    });
  };

  const deleteProjectTask = async (taskId: string) => {
    try {
      await removeTaskById(taskId);
      await refetchAfterDelete();
      notify.success({
        title: t('projectTasks.toast.deleted', { count: 1 }),
        duration: 2500,
      });
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      notify.error({
        title: t('projectTasks.toast.deleteFailed'),
        duration: 3000,
      });
      throw err;
    }
  };

  /** Deletes several tasks with one refetch and one toast. */
  const deleteProjectTasks = async (taskIds: string[]) => {
    const results = await Promise.allSettled(taskIds.map(removeTaskById));
    await refetchAfterDelete();
    const failed = results.filter((r) => r.status === 'rejected').length;
    const deleted = taskIds.length - failed;
    if (deleted > 0) {
      notify.success({
        title: t('projectTasks.toast.deleted', { count: deleted }),
        duration: 2500,
      });
    }
    if (failed > 0) {
      notify.error({
        title: t('projectTasks.toast.deleteFailed'),
        duration: 3000,
      });
      throw new Error(`${failed} tasks could not be deleted`);
    }
  };

  return {
    createProjectTask,
    updateProjectTask,
    setProjectTaskStatus,
    setProjectTasksStatus,
    toggleProjectTaskComplete,
    toggleProjectSubtask,
    addProjectSubtask,
    deleteProjectTask,
    deleteProjectTasks,
    isMutating: creating || updating || deleting,
  };
};

export const useTasksMutation = useTaskMutations;
