import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useMutation } from '@apollo/client';
import { GET_WORKSPACES } from '@/pages/Workspace/Workspace.graphql';
import { GET_TASKS, DELETE_TASK } from '@/pages/Tasks/Tasks.graphql';
import {
  removeTask,
  upsertTask as upsertTaskRedux,
} from '@/redux/tasks/task.slice';
import { removeEvent } from '@/redux/calendar/calendar.slice';
import { TaskBar } from '../components/Sidebar/types/Sidebar.types';
import type { Task } from '@/redux/tasks/task.types';
import type { TaskSearchItems } from '../../Workspace/types/workspace.types';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import {
  mapGoogleEventToTask,
  normalizeGoogleId,
  mapResponseToTask,
  getBaseGoogleId,
} from '@/api/Tasks/taskMapper';
import { deleteGoogleEvent } from '@/api/GoogleCalendar/googleCalendarApi';
import { handleMutationError } from '@/utils';

export const useHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.task);
  const { reduxEvents } = useAppSelector((state) => state.calendar);
  const { user } = useAppSelector((state) => state.auth);

  const activeTab = (searchParams.get('tab') as TaskBar) || TaskBar.DailyPlan;

  // Workspace & UI State
  const [isWorkspaceEditorOpen, setIsWorkspaceEditorOpen] = useState(false);
  const [isWorkspaceSidebarOpen, setIsWorkspaceSidebarOpen] = useState(true);

  // Focus Mode State
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(() => {
    return localStorage.getItem('focus_mode_open') === 'true';
  });
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [isAIScheduleEnabled, setIsAIScheduleEnabled] = useState(() => {
    return localStorage.getItem('ai_schedule_enabled') === 'true';
  });
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(() => {
    const saved = localStorage.getItem('focus_mode_task');
    return saved ? JSON.parse(saved) : null;
  });
  useEffect(() => {
    localStorage.setItem('focus_mode_open', String(isFocusModeOpen));
    if (activeFocusTask) {
      localStorage.setItem('focus_mode_task', JSON.stringify(activeFocusTask));
    } else {
      localStorage.removeItem('focus_mode_task');
    }
    localStorage.removeItem('focus_mode_subtask_index');
    localStorage.setItem('ai_schedule_enabled', String(isAIScheduleEnabled));
  }, [isFocusModeOpen, activeFocusTask, isAIScheduleEnabled]);

  // Task Details Management via URL
  const taskIdParam = searchParams.get('taskId');
  const [tempTask, setTempTask] = useState<Task | TaskSearchItems | null>(null);

  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const taskDetailsTask = useMemo(() => {
    if (!taskIdParam) return null;
    if (tempTask && tempTask.id === taskIdParam) return tempTask;

    // Check in native Focusly tasks
    const nativeTask = tasks.find((t) => t.id === taskIdParam);
    if (nativeTask) return nativeTask;

    // Check in Google Calendar events (virtual tasks)
    const googleEvent = reduxEvents.find((e) => e.id === taskIdParam);
    if (googleEvent) return mapGoogleEventToTask(googleEvent);

    return null;
  }, [tasks, reduxEvents, taskIdParam, tempTask]);

  const isTaskDetailsOpen = !!taskIdParam && !!taskDetailsTask;

  // New Case: "New Task" via URL (e.g. from calendar slot)
  const isCreatingNewTask = searchParams.get('action') === 'create';

  const isEditModalOpen = isTaskDetailsOpen || isCreatingNewTask;

  const initialStart = useMemo(() => {
    const startParam = searchParams.get('start');
    if (!startParam) return null;
    const date = new Date(startParam);
    return isNaN(date.getTime()) ? null : date;
  }, [searchParams]);

  const initialEnd = useMemo(() => {
    const endParam = searchParams.get('end');
    if (!endParam) return null;
    const date = new Date(endParam);
    return isNaN(date.getTime()) ? null : date;
  }, [searchParams]);

  const handleStartFocus = (task?: Task | TaskSearchItems | null) => {
    if (task?.id !== activeFocusTask?.id) {
      localStorage.removeItem('focus_mode_time_left');
      localStorage.removeItem('focus_mode_is_active');
    }
    if (task) {
      setActiveFocusTask(task as Task);
    }
    setIsFocusModeOpen(true);
    setIsFocusModeActive(true);
  };

  const handleOpenTaskDetails = (
    task: Task | TaskSearchItems,
    mode: 'view' | 'edit' = 'edit',
  ) => {
    setTempTask(task);
    const params: Record<string, string> = { tab: activeTab, taskId: task.id };
    if (mode === 'view') params.view = 'full';
    setSearchParams(params);
  };

  const closeTaskDetails = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('taskId');
    newParams.delete('view');
    newParams.delete('action');
    newParams.delete('start');
    newParams.delete('end');
    setSearchParams(newParams);
    setTempTask(null);
  };

  const changeStatusTab = (active: TaskBar, extraParams?: URLSearchParams) => {
    const params = extraParams || new URLSearchParams();
    params.set('tab', active);
    setSearchParams(params);
    if (active !== TaskBar.Workspace) {
      setIsWorkspaceEditorOpen(false);
    }
  };

  const handleSaveTask = (updatedTask: Task | TaskResponse) => {
    const mappedTask = mapResponseToTask(updatedTask as TaskResponse);
    const prevTaskId = taskIdParam;

    // 1. Immediately update tempTask to lock the UI state to the new Task data
    // This prevents the modal from closing when taskIdParam changes in the URL
    setTempTask(mappedTask);

    // 2. Update Redux store
    dispatch(upsertTaskRedux(mappedTask));

    // 3. Cleanup virtual Google state to prevent duplication
    if (
      mappedTask.google_event_id ||
      ('task_type' in updatedTask && updatedTask.task_type === 'GoogleTask')
    ) {
      // Remove the specific ID we just converted
      if (prevTaskId) {
        dispatch(removeEvent({ id: prevTaskId }));
      }

      // Secondary cleanup for any other virtual instances of the same event
      const normalizedId = normalizeGoogleId(mappedTask.google_event_id);
      const baseId = getBaseGoogleId(mappedTask.google_event_id);

      const matchingEvents = reduxEvents.filter((e) => {
        const eventId = normalizeGoogleId(e.id);
        const eventBaseId = getBaseGoogleId(e.id);
        return (
          eventId === normalizedId ||
          eventBaseId === baseId ||
          eventId === baseId ||
          eventBaseId === normalizedId
        );
      });

      matchingEvents.forEach((e) => {
        if (e.id !== prevTaskId) {
          dispatch(removeEvent({ id: e.id }));
        }
      });
    }

    // 4. Update the URL: Transition taskId from the Google ID to the Native ID
    const newParams = new URLSearchParams(searchParams);
    newParams.set('taskId', mappedTask.id);
    setSearchParams(newParams);
  };

  const deleteTask = async () => {
    if (taskDetailsTask?.id) {
      // 1. Optimistic Delete in Redux
      dispatch(removeTask({ id: taskDetailsTask.id }));
      dispatch(removeEvent({ id: taskDetailsTask.id }));
      if (taskDetailsTask.google_event_id) {
        dispatch(removeEvent({ id: taskDetailsTask.google_event_id }));
      }

      try {
        const isGoogleTask = (taskDetailsTask as Task).source === 'google';

        if (!isGoogleTask) {
          // Point 2: Platform Task — Delete from BOTH Google (if synced) and Platform
          if (taskDetailsTask.google_event_id) {
            try {
              await deleteGoogleEvent(taskDetailsTask.google_event_id);
            } catch (err) {
              console.warn(
                'Failed to delete synced Google event, proceeding with platform delete',
                err,
              );
            }
          }

          await deleteTaskMutation({
            variables: { id: taskDetailsTask.id },
            refetchQueries: [
              { query: GET_TASKS, variables: { userId: user?.id || '' } },
              { query: GET_WORKSPACES, variables: { search: '' } },
            ],
          });
        } else {
          // Point 1: Pure Google Event — Delete only in Google Calendar
          const eventId = taskDetailsTask.google_event_id || taskDetailsTask.id;
          await deleteGoogleEvent(eventId);
        }
      } catch (e) {
        handleMutationError(e, 'Error al eliminar la tarea');
      }
    }
    closeTaskDetails();
  };

  return {
    activeTab,
    changeStatusTab,
    isWorkspaceEditorOpen,
    setIsWorkspaceEditorOpen,
    isWorkspaceSidebarOpen,
    setIsWorkspaceSidebarOpen,
    isFocusModeOpen,
    setIsFocusModeOpen,
    isFocusModeActive,
    setIsFocusModeActive,
    activeFocusTask,
    handleStartFocus,
    handleOpenTaskDetails,
    taskDetailsTask,
    isEditModalOpen,
    closeTaskDetails,
    handleSaveTask,
    deleteTask,
    initialStart,
    initialEnd,
    isCreatingNewTask,
    isAIScheduleEnabled,
    setIsAIScheduleEnabled,
  };
};
