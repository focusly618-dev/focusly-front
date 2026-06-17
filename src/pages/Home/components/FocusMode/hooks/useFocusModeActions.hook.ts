import { useMutation } from '@apollo/client';
import { useAppDispatch } from '@/redux/hooks';
import { upsertTask } from '@/redux/tasks/task.slice';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import {
  GET_TOTAL_WORKSPACES,
  GET_WORKSPACES,
} from '@/pages/Workspace/workspaces.graphql';
import {
  UPDATE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
} from '@/pages/Tasks/Task.graphql';
import type { Task, TaskStatus } from '@/redux/tasks/task.types';
import { handleMutationError } from '@/utils/errorHandler';

interface UseFocusModeActionsProps {
  userId?: string;
  onSessionComplete: () => void;
}

export const useFocusModeActions = ({
  userId,
  onSessionComplete,
}: UseFocusModeActionsProps) => {
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const dispatch = useAppDispatch();

  const handleCompleteTask = async (activeTask: Task) => {
    try {
      const totalRealTimer = activeTask.real_timer || 0;
      const { data } = await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id: activeTask.id,
            status: 'Done',
            real_timer: totalRealTimer,
            duration: null,
          },
        },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId } },
          { query: GET_TASKS_TITLES, variables: { userId } },
          { query: GET_TOTAL_WORKSPACES },
          { query: GET_WORKSPACES, variables: { search: '' } },
        ],
      });

      if (data?.updateTask) {
        dispatch(upsertTask(mapResponseToTask(data.updateTask)));
      }
      onSessionComplete();
    } catch (error) {
      handleMutationError(error, 'Error al completar la tarea');
    }
  };

  const handleUpdateStatus = async (
    activeTask: Task,
    newStatus: TaskStatus,
  ) => {
    try {
      const { data } = await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id: activeTask.id,
            status: newStatus,
          },
        },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId } },
          { query: GET_TASKS_TITLES, variables: { userId } },
        ],
      });

      if (data?.updateTask) {
        dispatch(upsertTask(mapResponseToTask(data.updateTask)));
      }
    } catch (error) {
      handleMutationError(error, 'Error al actualizar el estado de la tarea');
    }
  };

  const handleUpdatePriority = async (
    activeTask: Task,
    newPriority: number,
  ) => {
    try {
      const { data } = await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id: activeTask.id,
            priority_level: newPriority,
          },
        },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId } },
          { query: GET_TASKS_TITLES, variables: { userId } },
        ],
      });

      if (data?.updateTask) {
        dispatch(upsertTask(mapResponseToTask(data.updateTask)));
      }
    } catch (error) {
      handleMutationError(
        error,
        'Error al actualizar la prioridad de la tarea',
      );
    }
  };

  return {
    handleCompleteTask,
    handleUpdateStatus,
    handleUpdatePriority,
  };
};
