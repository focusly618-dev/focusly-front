import { useState, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TOTAL_WORKSPACES } from '../workspaces.graphql';
import { GET_TASKS_TITLES, UPDATE_TASK } from '@/pages/Tasks/Task.graphql';
import type { TaskSearchItems } from '../types/workspace.types';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import { handleMutationError } from '@/utils/errorHandler';

interface UseWorkspaceTasksProps {
  userId?: string;
  onTaskSelect?: (taskId: string | undefined) => void;
}

export const useWorkspaceTasks = ({
  userId,
  onTaskSelect,
}: UseWorkspaceTasksProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: rawTasksData, loading: isLoading } = useQuery(
    GET_TASKS_TITLES,
    {
      skip: !userId,
      variables: { userId },
      fetchPolicy: 'cache-and-network',
    },
  );

  const [updateTaskMutation] = useMutation(UPDATE_TASK);

  const tasksData = useMemo(() => {
    if (!rawTasksData?.tasks) return undefined;
    return {
      tasks: rawTasksData.tasks.map(
        (t: TaskResponse) => mapResponseToTask(t) as unknown as TaskSearchItems,
      ),
    };
  }, [rawTasksData]);

  const selectTask = useMemo(() => {
    if (!tasksData?.tasks || !selectedTaskId) return null;
    return (
      tasksData.tasks.find((t: TaskSearchItems) => t.id === selectedTaskId) ||
      null
    );
  }, [tasksData, selectedTaskId]);

  const handleSelectTask = (selectedTask: TaskSearchItems | null) => {
    setSelectedTaskId(selectedTask?.id || null);
    onTaskSelect?.(selectedTask?.id);
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: Partial<TaskSearchItems>,
  ) => {
    try {
      await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id: taskId,
            ...updates,
          },
        },
        refetchQueries: [
          { query: GET_TASKS_TITLES, variables: { userId } },
          { query: GET_TOTAL_WORKSPACES },
        ],
      });
    } catch (error) {
      handleMutationError(error, 'Error al actualizar la tarea');
    }
  };

  return {
    tasksData,
    isLoading,
    selectTask,
    handleSelectTask,
    handleUpdateTask,
  };
};
