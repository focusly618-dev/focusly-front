import { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS_PAGINATED } from '@/pages/Tasks/Task.graphql';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import { useAppDispatch } from '@/redux/hooks';
import { setTasks } from '@/redux/tasks/task.slice';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';

interface UseTasksDataProps {
  userId?: string;
  filters?: TaskFilterInput;
  sort?: TaskSortInput;
  offset: number;
  limit: number;
}

export const useTasksData = ({ userId, filters, sort, offset, limit }: UseTasksDataProps) => {
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

  const { data, loading: isLoading } = useQuery(GET_TASKS_PAGINATED, {
    skip: !userId,
    variables: queryVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const tasks: TaskResponse[] = useMemo(() => data?.result?.tasks || [], [data]);
  const totalCount: number = useMemo(() => data?.result?.totalCount || 0, [data]);

  useEffect(() => {
    if (data?.result?.tasks) {
      const mappedTasks = data.result.tasks.map((t: TaskResponse) =>
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
