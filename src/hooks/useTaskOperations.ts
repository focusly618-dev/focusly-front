import {
  createGoogleEvent,
  deleteGoogleEvent,
  updateGoogleEvent,
} from '@/api/GoogleCalendar/googleCalendarApi';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import {
  CREATE_TASK,
  DELETE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
  UPDATE_TASK,
} from '@/pages/Tasks/Tasks.graphql';
import { GET_WORKSPACES } from '@/pages/Workspace/Workspace.graphql';
import { removeEvent } from '@/redux/calendar/calendar.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeTask, upsertTask } from '@/redux/tasks/task.slice';
import {
  useMutation,
  type InternalRefetchQueriesInclude,
} from '@apollo/client';

export interface MeetState {
  title?: string;
  description?: string;
  deadline?: Date | null;
  duration?: string;
  collaborators?: { email: string }[];
}

export const useTaskOperations = () => {
  const { user } = useAppSelector((state) => state.auth);
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

  const executeCreateTask = async (
    createTaskInput: Record<string, unknown>,
    extraRefetchQueries?: InternalRefetchQueriesInclude,
  ) => {
    if (!user?.id) throw new Error('User not authenticated');

    const defaultRefetchQueries: InternalRefetchQueriesInclude = [
      { query: GET_TASKS, variables: { userId: user.id } },
      {
        query: GET_TASKS_TITLES,
        variables: { userId: user.id, limit: 24, offset: 0 },
      },
    ];

    const refetchQueries = extraRefetchQueries || defaultRefetchQueries;

    const { data } = await createTaskMutation({
      variables: { createTaskInput },
      refetchQueries,
      awaitRefetchQueries: true,
    });

    if (data?.createTask) {
      const mappedTask = mapResponseToTask(data.createTask);
      dispatch(upsertTask(mappedTask));
    }

    return data;
  };

  const executeUpdateTask = async (
    updateTaskInput: Record<string, unknown>,
    extraRefetchQueries?: InternalRefetchQueriesInclude,
  ) => {
    if (!user?.id) throw new Error('User not authenticated');

    const defaultRefetchQueries: InternalRefetchQueriesInclude = [
      { query: GET_TASKS, variables: { userId: user.id } },
    ];

    const refetchQueries = extraRefetchQueries || defaultRefetchQueries;

    const { data } = await updateTaskMutation({
      variables: { updateTaskInput },
      refetchQueries,
    });

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
      extraRefetchQueries?: InternalRefetchQueriesInclude;
    },
  ) => {
    if (!user?.id) throw new Error('User not authenticated');

    // 1. Optimistic delete in Redux
    dispatch(removeTask({ id: taskId }));
    dispatch(removeEvent({ id: taskId }));
    if (options?.googleEventId) {
      dispatch(removeEvent({ id: options.googleEventId }));
    }

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

      const defaultRefetchQueries: InternalRefetchQueriesInclude = [
        { query: GET_TASKS, variables: { userId: user.id } },
        { query: GET_WORKSPACES, variables: { search: '' } },
      ];

      await deleteTaskMutation({
        variables: { id: taskId },
        refetchQueries: options?.extraRefetchQueries || defaultRefetchQueries,
      });
    } else {
      const eventId = options.googleEventId || taskId;
      await deleteGoogleEvent(eventId);
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
