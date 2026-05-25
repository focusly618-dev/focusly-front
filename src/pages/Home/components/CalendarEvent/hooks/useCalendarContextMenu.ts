import { useMutation } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { GET_WORKSPACES } from '@/pages/Workspace/workspaces.graphql';
import {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_TASKS,
} from '@/pages/Tasks/Task.graphql';
import { removeEvent } from '@/redux/calendar/calendar.slice';
import { removeTask, upsertTask } from '@/redux/tasks/task.slice';
import { sileo } from 'sileo';
import type { Task } from '@/redux/tasks/task.types';
import moment from 'moment';

import { mapResponseToTask } from '@/api/Tasks/taskMapper';

import { deleteGoogleEvent } from '@/api/GoogleCalendar/googleCalendarApi';

import { useState } from 'react';
import type { ICalendarEvent } from '../CalendarEvent.types';
import type { UseCalendarContextMenuReturn } from '../CalendarEvent.types';
import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';

export const useCalendarContextMenu = (
  event: ICalendarEvent,
  onStartFocus?: (task: Task) => void,
): UseCalendarContextMenuReturn => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const formatTime = (date: Date) => {
    const m = moment(date);
    return m.format('h:mm A');
  };

  const handleDuplicateTask = async (task: Task) => {
    if (!user) return;

    // Check if it's a Google event mirrored task - we probably shouldn't duplicate these directly via Focusly API or they lose sync
    if (task.task_type === 'GoogleTask') {
      sileo.error({ title: 'Cannot duplicate Google events via context menu' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...duplicateInput } = {
      ...task,
      title: `${task.title} (Copy)`,
      real_timer: 0,
      user_id: user.id || '',
      links: task.links?.map((l) => ({ title: l.title, url: l.url })) || [],
      tags: task.tags || [],
    };

    try {
      const { data } = await createTask({
        variables: {
          createTaskInput: {
            title: duplicateInput.title,
            notes_encrypted: duplicateInput.notes_encrypted,
            estimate_timer: duplicateInput.estimate_timer,
            real_timer: 0,
            status: duplicateInput.status,
            priority_level: duplicateInput.priority_level,
            category: duplicateInput.category,
            deadline: duplicateInput.deadline,
            user_id: duplicateInput.user_id,
            links: duplicateInput.links,
            tags: duplicateInput.tags,
          },
        },
        // We'll skip refetchQueries here and rely on upsertTask to avoid duplication flickers
        // Apollo's internal cache will handle the rest if configured correctly
      });

      if (data?.createTask) {
        const newTask = mapResponseToTask(data.createTask);
        dispatch(upsertTask(newTask));
        sileo.success({
          title: 'Task duplicated',
          fill: 'var(--sileo-success-bg)',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to duplicate task:', error);
      sileo.error({
        title: 'Failed to duplicate task',
        fill: 'var(--sileo-error-bg)',
      });
    }
  };

  const handleChangePriority = async (
    taskId: string,
    priorityLevel: number,
  ) => {
    if (!user) return;

    try {
      const { data } = await updateTask({
        variables: {
          updateTaskInput: {
            id: taskId,
            priority_level: priorityLevel,
          },
        },
      });

      if (data?.updateTask) {
        const updatedTask = mapResponseToTask(data.updateTask);
        dispatch(upsertTask(updatedTask));
        sileo.success({
          title: `Priority updated to ${priorityLevel}`,
          fill: 'var(--sileo-update-bg)',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Failed to update priority:', error);
      sileo.error({
        title: 'Failed to update priority',
        fill: 'var(--sileo-error-bg)',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      await deleteTask({
        variables: { id: taskId },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId: user.id } },
          { query: GET_WORKSPACES, variables: { search: '' } },
        ],
      });
      dispatch(removeTask({ id: taskId }));
      sileo.success({
        title: 'Task deleted',
        fill: 'var(--sileo-delete-bg)',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      sileo.error({
        title: 'Failed to delete task',
        fill: 'var(--sileo-error-bg)',
      });
    }
  };

  const handleDeleteGoogleEvent = async (eventId: string) => {
    try {
      await deleteGoogleEvent(eventId);
      dispatch(removeEvent({ id: eventId }));
      sileo.success({
        title: 'Event deleted',
        fill: 'var(--sileo-delete-bg)',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to delete Google event:', error);
      sileo.error({
        title: 'Failed to delete event',
        fill: 'var(--sileo-error-bg)',
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: e.clientX + 2, mouseY: e.clientY - 4 }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.type === 'task' && event.resource) {
      handleDuplicateTask(event.resource as Task);
    }
    handleClose();
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.id) {
      if (event.type === 'task') {
        handleDeleteTask(event.id);
      } else {
        handleDeleteGoogleEvent(event.id);
      }
    }
    handleClose();
  };

  const onPriorityChange = (e: React.MouseEvent, level: number) => {
    e.stopPropagation();
    if (event.id) {
      handleChangePriority(event.id, level);
    }
    handleClose();
  };

  const handleOnStartFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartFocus && event.type === 'task' && event.resource) {
      onStartFocus(event.resource as Task);
    }
    handleClose();
  };

  const VIDEO_CALL_DOMAINS =
    /meet\.google\.com|zoom\.us|teams\.microsoft\.com|webex\.com|skype\.com|slack\.com|discord\.com|jit\.si|whereby\.com/i;

  const hasVideoLinkInTask =
    event.type === 'task' &&
    ((event.resource as Task)?.links?.some((link) =>
      VIDEO_CALL_DOMAINS.test(link.url),
    ) ||
      VIDEO_CALL_DOMAINS.test(event.title));

  const isMeeting =
    (event.type === 'event' &&
      !!(
        (event.resource as GoogleCalendarEvent)?.links?.some((link) =>
          VIDEO_CALL_DOMAINS.test(link.url),
        ) ||
        ((event.resource as GoogleCalendarEvent)?.collaborators?.length ?? 0) >
          1
      )) ||
    hasVideoLinkInTask;

  const durationMinutes = (event.end.getTime() - event.start.getTime()) / 60000;
  const isShortEvent = durationMinutes <= 30;
  const startTime = formatTime(event.start);

  const currentPriority =
    event.type === 'task'
      ? (event.resource as Task)?.priority_level
      : undefined;

  return {
    handleDuplicateTask,
    handleChangePriority,
    handleDeleteTask,
    handleDeleteGoogleEvent,
    handleContextMenu,
    handleClose,
    onDuplicate,
    onDelete,
    onPriorityChange,
    handleOnStartFocus,
    isMeeting,
    isShortEvent,
    startTime,
    currentPriority,
    contextMenu,
    setContextMenu,
  };
};
