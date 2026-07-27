import { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import { useAppDispatch } from '@/redux/hooks';
import { setTasks } from '@/redux/tasks/task.slice';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import { handleMutationError } from '@/utils';
import { GET_TASKS_PAGINATED } from '@/pages/Tasks/Tasks.graphql';

interface UseTasksDataProps {
  userId?: string;
  filters?: TaskFilterInput;
  sort?: TaskSortInput;
  offset?: number;
  limit?: number;
}

export const useTasksData = ({
  userId,
  filters,
  sort,
  offset = 0,
  limit = 24,
}: UseTasksDataProps) => {
  const dispatch = useAppDispatch();

  const queryVariables = useMemo(
    () => ({
      userId,
      filters: filters || null,
      sort: sort || null,
      offset,
      limit,
    }),
    [userId, filters, sort, offset, limit],
  );

  const {
    data,
    loading: isLoading,
    error,
  } = useQuery(GET_TASKS_PAGINATED, {
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
    return data?.result?.tasks || data?.tasks || [];
  }, [data]);

  const totalCount: number = useMemo(() => {
    return data?.result?.totalCount ?? tasks.length;
  }, [data, tasks]);

  useEffect(() => {
    const fetchedTasks = data?.result?.tasks || data?.tasks;
    if (fetchedTasks) {
      const mappedTasks = fetchedTasks.map((t: TaskResponse) =>
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
