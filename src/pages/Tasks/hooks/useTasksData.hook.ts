import { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import { useAppDispatch } from '@/redux/hooks';
import { setTasks } from '@/redux/tasks/task.slice';
import {
  mapResponseToTask,
  withoutPlaceholderDeadline,
} from '@/api/Tasks/taskMapper';
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
      filters: { ...(filters || {}), has_project: false },
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
    refetch,
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
    const raw: TaskResponse[] = data?.result?.tasks || data?.tasks || [];
    return raw
      .filter(
        (t) =>
          !(t.project_id && String(t.project_id).trim() !== '') &&
          !(
            (t as { projectId?: string }).projectId &&
            String((t as { projectId?: string }).projectId).trim() !== ''
          ),
      )
      .map(withoutPlaceholderDeadline);
  }, [data]);

  const totalCount: number = useMemo(() => {
    const raw: TaskResponse[] = data?.result?.tasks || data?.tasks || [];
    const excluded = raw.length - tasks.length;
    const rawTotal = data?.result?.totalCount ?? tasks.length;
    return Math.max(0, rawTotal - excluded);
  }, [data, tasks]);

  useEffect(() => {
    const fetchedTasks: TaskResponse[] | undefined =
      data?.result?.tasks || data?.tasks;
    if (fetchedTasks) {
      const mappedTasks = fetchedTasks
        .filter(
          (t) =>
            !(t.project_id && String(t.project_id).trim() !== '') &&
            !(
              (t as { projectId?: string }).projectId &&
              String((t as { projectId?: string }).projectId).trim() !== ''
            ),
        )
        .map((t: TaskResponse) => mapResponseToTask(t));
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
    refetch,
  };
};
