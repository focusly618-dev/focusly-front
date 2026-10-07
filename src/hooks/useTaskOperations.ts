import {
  createGoogleEvent,
  deleteGoogleEvent,
  updateGoogleEvent,
} from '@/api/GoogleCalendar/googleCalendarApi';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import {
  refreshQueries,
  TASK_QUERIES,
  WORKSPACE_QUERIES,
} from '@/api/refreshQueries';
import {
  CREATE_TASK,
  DELETE_TASK,
  UPDATE_TASK,
} from '@/pages/Tasks/Tasks.graphql';
import { addEvent, removeEvent } from '@/redux/calendar/calendar.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeTask, upsertTask } from '@/redux/tasks/task.slice';
import { useMutation } from '@apollo/client';

export interface MeetState {
  title?: string;
  description?: string;
  deadline?: Date | null;
  duration?: string;
  collaborators?: { email: string }[];
}

export const useTaskOperations = () => {
  const { user } = useAppSelector((state) => state.auth);
  const tasks = useAppSelector((state) => state.task.tasks);
  const reduxEvents = useAppSelector((state) => state.calendar.reduxEvents);
  const dispatch = useAppDispatch();

  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const generateMeetLinkNow = async (
    googleEventId?: string,
    state?: MeetState,
  ) => {
    try {
      const attendees = state?.collaborators?.map((c) => ({ email: c.email }));
      const durationMinutes = state?.duration
        ? parseInt(state.duration, 10) || 30
        : 30;

      if (googleEventId) {
        const updated = await updateGoogleEvent(googleEventId, {
          summary: state?.title || 'Focusly Meeting',
          description: state?.description || '',
          start: {
            dateTime:
              state?.deadline?.toISOString() || new Date().toISOString(),
          },
          end: {
            dateTime: new Date(
              (state?.deadline?.getTime() || Date.now()) +
                durationMinutes * 60000,
            ).toISOString(),
          },
          attendees,
          conferenceData: {
            createRequest: {
              requestId: `focusly-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        });
        return { meetLink: updated.hangoutLink || null, googleEventId };
      } else {
        const tempEvent = await createGoogleEvent({
          summary: state?.title || 'Focusly Meeting',
          description: state?.description || '',
          start: {
            dateTime:
              state?.deadline?.toISOString() || new Date().toISOString(),
          },
          end: {
            dateTime: new Date(
              (state?.deadline?.getTime() || Date.now()) +
                durationMinutes * 60000,
            ).toISOString(),
          },
          attendees,
          conferenceData: {
            createRequest: {
              requestId: `focusly-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        });

        const meetLink = tempEvent.hangoutLink || null;
        return { meetLink, googleEventId: tempEvent.id };
      }
    } catch (error) {
      console.error('Error generating meet link:', error);
      return null;
    }
  };

  // After a change, the task lists on screen are fetched again once (see
  // refreshQueries): `refresh` names them, by default every task list.
  const executeCreateTask = async (
    createTaskInput: Record<string, unknown>,
    refresh: string[] = TASK_QUERIES,
  ) => {
    if (!user?.id) throw new Error('User not authenticated');

    const { data } = await createTaskMutation({
      variables: { createTaskInput },
    });
    await refreshQueries(refresh);

    if (data?.createTask) {
      const mappedTask = mapResponseToTask(data.createTask);
      dispatch(upsertTask(mappedTask));
    }

    return data;
  };

  // The updated task changes in every cached list by itself (same id);
  // `refresh` is for changes that move it between lists.
  const executeUpdateTask = async (
    updateTaskInput: Record<string, unknown>,
    refresh: string[] = [],
  ) => {
    if (!user?.id) throw new Error('User not authenticated');

    const { data } = await updateTaskMutation({
      variables: { updateTaskInput },
    });
    if (refresh.length) await refreshQueries(refresh);

    if (data?.updateTask) {
      const mappedTask = mapResponseToTask(data.updateTask);
      dispatch(upsertTask(mappedTask));
    }

    return data;
  };

  const executeDeleteTask = async (
    taskId: string,
    options?: {
      googleEventId?: string;
      isGoogleTask?: boolean;
      refresh?: string[];
    },
  ) => {
    if (!user?.id) throw new Error('User not authenticated');

    // Snapshot whatever is about to be optimistically removed, so a failed
    // mutation below can be rolled back instead of leaving the task gone
    // from Redux while the user also sees an error toast.
    const removedTask = tasks.find((t) => t.id === taskId);
    const removedEvent = reduxEvents.find((e) => e.id === taskId);
    const removedGoogleEvent = options?.googleEventId
      ? reduxEvents.find((e) => e.id === options.googleEventId)
      : undefined;

    // 1. Optimistic delete in Redux
    dispatch(removeTask({ id: taskId }));
    dispatch(removeEvent({ id: taskId }));
    if (options?.googleEventId) {
      dispatch(removeEvent({ id: options.googleEventId }));
    }

    const rollback = () => {
      if (removedTask) dispatch(upsertTask(removedTask));
      if (removedEvent) dispatch(addEvent(removedEvent));
      if (removedGoogleEvent) dispatch(addEvent(removedGoogleEvent));
    };

    try {
      if (!options?.isGoogleTask) {
        if (options?.googleEventId) {
          try {
            await deleteGoogleEvent(options.googleEventId);
          } catch (err) {
            console.warn(
              'Failed to delete synced Google event, proceeding with platform delete',
              err,
            );
          }
        }

        await deleteTaskMutation({ variables: { id: taskId } });
        await refreshQueries(
          options?.refresh ?? [...TASK_QUERIES, ...WORKSPACE_QUERIES],
        );
      } else {
        const eventId = options.googleEventId || taskId;
        await deleteGoogleEvent(eventId);
      }
    } catch (error) {
      rollback();
      throw error;
    }
  };

  return {
    user,
    dispatch,
    generateMeetLinkNow,
    executeCreateTask,
    executeUpdateTask,
    executeDeleteTask,
  };
};
