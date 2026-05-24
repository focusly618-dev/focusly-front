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
} from '@/pages/Tasks/components/TaskDetailModal/tasks.graphql';
import type { Task, TaskStatus } from '@/redux/tasks/task.types';

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

  const handleCompleteTask = async (
    activeTask: Task,
    timeSpentMinutes: number,
  ) => {
    try {
      const totalRealTimer = Math.round(
        (activeTask.real_timer || 0) + timeSpentMinutes,
      );
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
      console.error('Failed to complete task:', error);
    }
  };

  const handleUpdateStatus = async (activeTask: Task, newStatus: TaskStatus) => {
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
      console.error('Failed to update status:', error);
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
      console.error('Failed to update priority:', error);
    }
  };

  return {
    handleCompleteTask,
    handleUpdateStatus,
    handleUpdatePriority,
  };
};
