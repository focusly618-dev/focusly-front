import { useApolloClient, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { useAppDispatch } from '@/redux/hooks';
import { upsertTask } from '@/redux/tasks/task.slice';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import { GET_TASK_DETAIL, UPDATE_TASK } from '@/pages/Tasks/Tasks.graphql';
import type { Task, TaskStatus } from '@/redux/tasks/task.types';
import { handleMutationError } from '@/utils';

type TimeLog = { date: string; minutes: number };

export const useFocusModeActions = () => {
  const client = useApolloClient();
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const dispatch = useAppDispatch();

  const saveTask = async (updateTaskInput: Record<string, unknown>) => {
    const { data } = await updateTaskMutation({
      variables: { updateTaskInput },
    });
    if (!data?.updateTask) return null;
    const updated = mapResponseToTask(data.updateTask);
    dispatch(upsertTask(updated));
    return updated;
  };

  /**
   * Update fields that add `minutes` to the task's tracked time. The task is
   * read fresh first: focus mode's copy can be stale and time_logs is written
   * whole, so building on it could drop entries. real_timer moves together
   * with time_logs because the task detail modal recomputes it as their sum.
   */
  const buildTimeFields = async (taskId: string, minutes: number) => {
    const { data } = await client.query({
      query: GET_TASK_DETAIL,
      variables: { id: taskId },
      fetchPolicy: 'network-only',
    });
    const fresh = data?.task;
    if (!fresh) throw new Error(`Task ${taskId} not found`);

    const today = format(new Date(), 'yyyy-MM-dd');
    // Rebuilt field by field so Apollo's __typename doesn't reach the input.
    const timeLogs: TimeLog[] = (fresh.time_logs ?? []).map((log: TimeLog) => ({
      date: log.date,
      minutes: log.minutes,
    }));
    const todayLog = timeLogs.find((log) => log.date === today);
    if (todayLog) {
      todayLog.minutes += minutes;
    } else {
      timeLogs.push({ date: today, minutes });
    }

    return {
      real_timer: Math.round((fresh.real_timer || 0) + minutes),
      time_logs: timeLogs,
    };
  };

  /** Adds focus minutes to a task without changing anything else. */
  const logFocusTime = async (taskId: string, minutes: number) => {
    try {
      return await saveTask({
        id: taskId,
        ...(await buildTimeFields(taskId, minutes)),
      });
    } catch (error) {
      handleMutationError(error, 'Error al guardar el tiempo de enfoque');
      return null;
    }
  };

  const handleCompleteTask = async (activeTask: Task, minutes: number) => {
    try {
      const timeFields =
        minutes > 0 ? await buildTimeFields(activeTask.id, minutes) : {};
      return await saveTask({
        id: activeTask.id,
        status: 'Done',
        duration: null,
        ...timeFields,
      });
    } catch (error) {
      handleMutationError(error, 'Error al completar la tarea');
      return null;
    }
  };

  const handleUpdateStatus = async (
    activeTask: Task,
    newStatus: TaskStatus,
  ) => {
    try {
      await saveTask({ id: activeTask.id, status: newStatus });
    } catch (error) {
      handleMutationError(error, 'Error al actualizar el estado de la tarea');
    }
  };

  const handleUpdatePriority = async (
    activeTask: Task,
    newPriority: number,
  ) => {
    try {
      await saveTask({ id: activeTask.id, priority_level: newPriority });
    } catch (error) {
      handleMutationError(
        error,
        'Error al actualizar la prioridad de la tarea',
      );
    }
  };

  return {
    logFocusTime,
    handleCompleteTask,
    handleUpdateStatus,
    handleUpdatePriority,
  };
};
