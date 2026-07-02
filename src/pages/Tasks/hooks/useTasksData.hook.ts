import { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '@/pages/Tasks/Tasks.graphql';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import { useAppDispatch } from '@/redux/hooks';
import { setTasks } from '@/redux/tasks/task.slice';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import { handleMutationError } from '@/utils/errorHandler';

interface UseTasksDataProps {
  userId?: string;
  filters?: TaskFilterInput;
  sort?: TaskSortInput;
  offset?: number;
  limit?: number;
}

export const useTasksData = ({ userId, filters, sort }: UseTasksDataProps) => {
  const dispatch = useAppDispatch();

  const queryVariables = useMemo(
    () => ({
      userId,
      filters: filters || null,
      sort: sort || null,
    }),
    [userId, filters, sort],
  );

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(GET_TASKS, {
    skip: !userId,
    variables: queryVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (error) {
      handleMutationError(error, 'Error al cargar las tareas');
    }
  }, [error]);

  const tasks: TaskResponse[] = useMemo(() => {
    const rawTasks = data?.tasks || [];
    return rawTasks;
  }, [data]);
  const totalCount: number = useMemo(() => tasks.length, [tasks]);

  useEffect(() => {
    if (data?.tasks) {
      const mappedTasks = data.tasks.map((t: TaskResponse) =>
        mapResponseToTask(t),
      );
      dispatch(setTasks(mappedTasks));
    }
  }, [data, dispatch]);

  const completedTasksCount = useMemo((): number => {
    return tasks.filter((t) => t.status === 'Done').length;
  }, [tasks]);

  const pendingTasksCount = useMemo((): number => {
    return tasks.filter((t) => t.status !== 'Done').length;
  }, [tasks]);

  return {
    tasks,
    totalCount,
    isLoading,
    completedTasksCount,
    pendingTasksCount,
  };
};
