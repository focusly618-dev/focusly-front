import { useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '@/pages/Tasks/components/TaskDetailModal/tasks.graphql';
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
}

export const useTasksData = ({ userId, filters, sort }: UseTasksDataProps) => {
  const dispatch = useAppDispatch();

  const { data, loading: isLoading } = useQuery(GET_TASKS, {
    skip: !userId,
    variables: {
      userId,
      filters,
      sort,
    },
    fetchPolicy: 'cache-and-network',
  });

  const tasks: TaskResponse[] = useMemo(() => data?.tasks || [], [data]);

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
    isLoading,
    completedTasksCount,
    pendingTasksCount,
  };
};
