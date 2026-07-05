import { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TOTAL_WORKSPACES } from '../Workspace.graphql';
import { GET_TASKS_TITLES, UPDATE_TASK } from '@/pages/Tasks/Tasks.graphql';
import type { TaskSearchItems } from '../types/workspace.types';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import { handleMutationError } from '@/utils';

interface UseWorkspaceTasksProps {
  userId?: string;
  onTaskSelect?: (taskId: string | undefined) => void;
}

const LIMIT = 24;

export const useWorkspaceTasks = ({
  userId,
  onTaskSelect,
}: UseWorkspaceTasksProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [offset] = useState(0);

  const {
    data: rawTasksData,
    loading: isLoading,
    error,
    fetchMore,
  } = useQuery(GET_TASKS_TITLES, {
    skip: !userId,
    fetchPolicy: 'cache-and-network',
    variables: {
      userId,
      limit: LIMIT,
      offset,
    },
  });

  useEffect(() => {
    if (error) {
      handleMutationError(error, 'Error al obtener las tareas');
    }
  }, [error]);

  const [updateTaskMutation] = useMutation(UPDATE_TASK);

  const tasksData = useMemo(() => {
    if (!rawTasksData?.tasks) return undefined;

    return {
      tasks: rawTasksData.tasks.map(
        (t: TaskResponse) => mapResponseToTask(t) as unknown as TaskSearchItems,
      ),
      total: rawTasksData.tasks.length,
    };
  }, [rawTasksData]);

  const loadMore = async () => {
    if (!tasksData || isLoading) return;

    await fetchMore({
      variables: {
        userId,
        limit: LIMIT,
        offset: tasksData.tasks.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          tasks: [...prev.tasks, ...fetchMoreResult.tasks],
        };
      },
    });
  };

  const selectTask = useMemo(() => {
    if (!tasksData?.tasks || !selectedTaskId) return null;

    return (
      tasksData.tasks.find((t: TaskSearchItems) => t.id === selectedTaskId) ??
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
          {
            query: GET_TASKS_TITLES,
            variables: {
              userId,
              limit: LIMIT,
              offset: 0,
            },
          },
          {
            query: GET_TOTAL_WORKSPACES,
          },
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
    loadMore,
  };
};
