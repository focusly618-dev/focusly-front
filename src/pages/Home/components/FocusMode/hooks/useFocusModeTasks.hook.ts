import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useAppSelector } from '@/redux/hooks';
import { GET_TASKS } from '@/pages/Tasks/Task.graphql';
import type { Task } from '@/redux/tasks/task.types';

interface UseFocusModeTasksProps {
  initialTask?: Task | null;
}

export const useFocusModeTasks = ({ initialTask }: UseFocusModeTasksProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTask, setActiveTask] = useState<Task | null>(
    initialTask ?? null,
  );

  const { data: tasksData, loading: tasksLoading } = useQuery(GET_TASKS, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-and-network',
  });

  const activeItem = useMemo(() => {
    return activeTask ? { ...activeTask } : null;
  }, [activeTask]);

  const todaysTasks = useMemo(() => {
    const all: Task[] = tasksData?.tasks || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return all
      .filter((t) => {
        if (t.status === 'Done' || t.status === 'Archived') return false;
        const deadline = new Date(t.deadline);
        return deadline >= today && deadline < tomorrow;
      })
      .map((t) => ({ ...t }));
  }, [tasksData?.tasks]);

  return {
    activeTask,
    setActiveTask,
    activeItem,
    todaysTasks,
    tasksData,
    tasksLoading,
  };
};
