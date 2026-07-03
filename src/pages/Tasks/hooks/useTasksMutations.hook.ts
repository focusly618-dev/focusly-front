import { useMutation } from '@apollo/client';
import {
  UPDATE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
  DELETE_TASKS,
} from '@/pages/Tasks/Tasks.graphql';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { useAppDispatch } from '@/redux/hooks';
import {
  upsertTask as upsertTaskRedux,
  removeTasks,
} from '@/redux/tasks/task.slice';
import type { Task } from '@/redux/tasks/task.types';
import { handleMutationError } from '@/utils';

interface UseTasksMutationsProps {
  userId?: string;
  tasks: TaskResponse[];
  onSuccess?: (message: string, subMessage: string) => void;
}

export const useTasksMutations = ({
  userId,
  onSuccess,
}: UseTasksMutationsProps) => {
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTasksMutation] = useMutation(DELETE_TASKS);
  const dispatch = useAppDispatch();

  const mapResponseToTask = (t: TaskResponse): Task => ({
    id: t.id,
    user_id: t.user_id || userId || '',
    title: t.title,
    notes_encrypted: t.notes_encrypted || '',
    estimate_timer: t.estimate_timer || 0,
    priority_level: t.priority_level || 2,
    deadline: t.deadline || new Date().toISOString(),
    status: t.status || 'Todo',
    category: t.category || 'General',
    created_at: t.created_at || new Date().toISOString(),
    updated_at: t.updated_at || new Date().toISOString(),
    completed_at: null,
    deleted_at: null,
    links: t.links || [],
    real_timer: t.real_timer,
    google_event_id: t.google_event_id,
    estimated_start_date: t.estimated_start_date,
    estimated_end_date: t.estimated_end_date,
    use_ai: t.use_ai,
    tags:
      t.tags?.map((tag: string | { name: string }) =>
        typeof tag === 'string' ? tag : tag.name,
      ) || [],
  });

  const updateTask = async (id: string, task: TaskResponse) => {
    try {
      const {
        title,
        notes_encrypted,
        status,
        estimate_minutes,
        deadline,
        priority_level,
        category,
        tags,
        google_event_id,
        estimated_start_date,
        estimated_end_date,
        real_timer,
        use_ai,
      } = task;

      const { data } = await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id,
            title,
            notes_encrypted,
            status,
            estimate_timer: estimate_minutes,
            real_timer,
            duration: null,
            priority_level,
            deadline,
            use_ai,
            category,
            google_event_id,
            estimated_start_date,
            estimated_end_date,
            tags:
              tags?.map((t: string | { name: string }) =>
                typeof t === 'string' ? t : t.name,
              ) || [],
          },
        },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId } },
          { query: GET_TASKS_TITLES, variables: { userId } },
        ],
      });

      if (data?.updateTask) {
        dispatch(upsertTaskRedux(mapResponseToTask(data.updateTask)));
      }

      onSuccess?.(
        'Task updated successfully!',
        'Your changes have been saved.',
      );
    } catch (error) {
      handleMutationError(error, 'Error al actualizar la tarea');
    }
  };

  const deleteTasks = async (ids: string[]) => {
    try {
      const { data } = await deleteTasksMutation({
        variables: { ids },
        update(cache) {
          ids.forEach((id) => {
            cache.evict({ id: cache.identify({ __typename: 'Task', id }) });
          });
          cache.gc();
        },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId } },
          { query: GET_TASKS_TITLES, variables: { userId } },
        ],
      });

      if (data?.deleteTasks) {
        dispatch(removeTasks({ ids }));
        onSuccess?.(
          'Tasks deleted successfully!',
          `${ids.length} task${ids.length > 1 ? 's have' : ' has'} been deleted.`,
        );
      }
    } catch (error) {
      handleMutationError(error, 'Error al eliminar las tareas');
    }
  };

  return {
    updateTask,
    deleteTasks,
  };
};
