import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Views, type View } from 'react-big-calendar';
import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from 'date-fns';
import { sileo } from 'sileo';
import type { RootState } from '@/redux/store';
import type { Task } from '@/redux/tasks/task.types';
import { setTasks, removeTask, updateTask } from '@/redux/tasks/task.slice';
import { removeEvent, setEvents } from '@/redux/calendar/calendar.slice';
import {
  fetchGoogleEvents,
  deleteGoogleEvent,
} from '@/api/GoogleCalendar/googleCalendarApi';
import { GET_WORKSPACES } from '@/pages/Workspace/workspaces.graphql';
import type { ICalendarEvent } from '../../CalendarEvent';
import {
  GET_TASKS,
  DELETE_TASK,
  UPDATE_TASK,
} from '@/pages/Tasks/Task.graphql';
import { useQuery, useMutation } from '@apollo/client';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { CalendarNavigateAction } from '../calendarView.types';
import {
  mapResponseToTask,
  normalizeGoogleId,
  getBaseGoogleId,
} from '@/api/Tasks/taskMapper';

export const useCalendarView = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reduxEvents =
    useSelector((state: RootState) => state.calendar?.reduxEvents) || [];
  const syncVersion =
    useSelector((state: RootState) => state.calendar?.syncVersion) || 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tasks = useSelector((state: RootState) => state.task?.tasks) || [];
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive active view and date directly from URL parameters
  const currentView = useMemo<View>(() => {
    const v = searchParams.get('v');
    const validViews: View[] = [Views.MONTH, Views.WEEK, Views.DAY];
    return validViews.includes(v as View) ? (v as View) : Views.DAY;
  }, [searchParams]);

  const currentDate = useMemo<Date>(() => {
    const d = searchParams.get('d');
    if (d) {
      // Split YYYY-MM-DD and create a local Date at midnight
      const [year, month, day] = d.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }
    return new Date();
  }, [searchParams]);

  const [scrollToTime, setScrollToTime] = useState<Date | undefined>(undefined);
  const [flashingDate, setFlashingDate] = useState<Date | null>(null);

  // Trigger temporary column highlight (flash) when the selected date (d URL param) changes
  useEffect(() => {
    const dStr = searchParams.get('d');
    if (dStr) {
      const [year, month, day] = dStr.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const dateObj = new Date(year, month - 1, day);
        setFlashingDate(dateObj);
        const timer = setTimeout(() => {
          setFlashingDate(null);
        }, 1500); // 1.5 seconds flash highlight
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams]);

  // Helper to update the view and/or date URL search parameters
  const updateUrlParams = (newView: View, newDate: Date) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('v', newView as string);
    newParams.set('d', format(newDate, 'yyyy-MM-dd'));
    setSearchParams(newParams, { replace: true });
  };

  // Initialize missing URL params so other components (e.g. Sidebar) can read them
  useEffect(() => {
    const hasV = searchParams.has('v');
    const hasD = searchParams.has('d');
    if (!hasV || !hasD) {
      const newParams = new URLSearchParams(searchParams.toString());
      if (!hasV) {
        newParams.set('v', currentView as string);
      }
      if (!hasD) {
        newParams.set('d', format(currentDate, 'yyyy-MM-dd'));
      }
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, currentView, currentDate, setSearchParams]);

  const [slotContextMenu, setSlotContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    date: Date;
  } | null>(null);
  const [resolvedGoogleCalendarUserId, setResolvedGoogleCalendarUserId] =
    useState<string | null>(null);

  // New Task Modal State moved to URL parameters
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const user = useSelector((state: RootState) => state.auth.user);

  const dateRange = useMemo(() => {
    let start: Date;
    let end: Date;

    if (currentView === Views.MONTH) {
      // Fetch some days before and after to cover the calendar grid overflow
      start = subDays(startOfMonth(currentDate), 7);
      end = addDays(endOfMonth(currentDate), 7);
    } else if (currentView === Views.WEEK) {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      start = startOfDay(currentDate);
      end = endOfDay(currentDate);
    }

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }, [currentDate, currentView]);

  const { data: tasksData, loading: isTasksQueryLoading } = useQuery(
    GET_TASKS,
    {
      skip: !user?.id,
      variables: {
        userId: user?.id,
        filters: {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  useEffect(() => {
    if (tasksData?.tasks) {
      const validTasks: Task[] = tasksData.tasks.map((t: TaskResponse) =>
        mapResponseToTask(t),
      );
      dispatch(setTasks(validTasks));
    }
  }, [tasksData, dispatch]);

  const shouldRestoreGoogleCalendar =
    user?.authProvider === 'google' &&
    Boolean(user?.id) &&
    reduxEvents.length === 0 &&
    resolvedGoogleCalendarUserId !== user.id;

  const isGoogleEventsLoading = shouldRestoreGoogleCalendar;

  // Fetch Google Calendar Events when the range or user changes
  useEffect(() => {
    if (user?.authProvider !== 'google' || !user?.id) {
      return;
    }

    let isMounted = true;
    setResolvedGoogleCalendarUserId(null); // Mark as loading for this range

    fetchGoogleEvents(dateRange.start, dateRange.end)
      .then((events) => {
        if (isMounted && events) {
          dispatch(setEvents(events));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch Google Calendar events', err);
      })
      .finally(() => {
        if (isMounted) {
          setResolvedGoogleCalendarUserId(user.id);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, user?.id, user?.authProvider, dateRange, syncVersion]);

  const hasRenderableCalendarData =
    reduxEvents.length > 0 ||
    tasks.length > 0 ||
    (tasksData?.tasks?.length ?? 0) > 0;

  const isCalendarLoading =
    !hasRenderableCalendarData &&
    (isTasksQueryLoading || isGoogleEventsLoading);
  const events = useMemo(() => {
    // 1. Prepare a set of all synced Google Event IDs for efficient deduplication
    // We store both exact normalized IDs and base IDs to catch series imports.
    const syncedGoogleIds = new Set<string>();
    tasks.forEach((t) => {
      if (t.google_event_id) {
        const norm = normalizeGoogleId(t.google_event_id);
        const base = getBaseGoogleId(t.google_event_id);
        if (norm) syncedGoogleIds.add(norm);
        if (base) syncedGoogleIds.add(base);
      }
    });

    // 2. Map Google Calendar Events (Virtual) with robust Deduplication
    const calendarEvents = reduxEvents
      .map((ge) => {
        try {
          return {
            id: ge.id,
            title: ge.title,
            start: new Date(ge.estimated_start_date),
            end: new Date(ge.deadline),
            allDay: ge.is_all_day,
            resource: ge,
            type: 'event' as const,
            provider: 'google',
          };
        } catch (err) {
          console.error('Error parsing event', err);
          return null;
        }
      })
      .filter((e): e is NonNullable<typeof e> => {
        if (!e) return false;
        const googleEventId = e.resource.google_event_id || e.id;
        const norm = normalizeGoogleId(googleEventId);
        const base = getBaseGoogleId(googleEventId);
        const isAlreadySynced =
          (norm && syncedGoogleIds.has(norm)) ||
          (base && syncedGoogleIds.has(base));
        return !isAlreadySynced;
      });

    // 2. Map Focusly Tasks (Native)
    const taskEvents = tasks.map((task: Task) => {
      const desc = task.notes_encrypted || '';
      const startDateMatch = desc.match(/\[START_DATE:(.*?)\]/);

      const deadlineDate = task.deadline ? new Date(task.deadline) : new Date();
      const hasEstimatedStart =
        task.estimated_start_date &&
        !isNaN(new Date(task.estimated_start_date).getTime());

      let start = hasEstimatedStart
        ? new Date(task.estimated_start_date!)
        : isNaN(deadlineDate.getTime())
          ? new Date()
          : deadlineDate;
      let end =
        hasEstimatedStart && task.estimated_end_date
          ? new Date(task.estimated_end_date)
          : new Date(start.getTime() + (task.estimate_timer || 30) * 60000);

      if (startDateMatch && startDateMatch[1]) {
        const parsedStart = new Date(startDateMatch[1]);
        if (!isNaN(parsedStart.getTime())) {
          start = parsedStart;
          const deadlineDate = new Date(task.deadline || new Date());
          end = deadlineDate;
        }
      }

      return {
        id: task.id,
        title: task.title,
        start,
        end,
        allDay: false,
        resource: task,
        type: 'task' as const,
      };
    });

    // Final Content-Based Deduplication (The "Double-Check" Layer)
    // Even if IDs don't match, we merge events with the same title, start, and end times.
    const mergedEventsMap = new Map<string, ICalendarEvent>();

    [...calendarEvents, ...taskEvents].forEach((event) => {
      // Create a unique composite key for the event content
      const key = `${event.title}_${event.start?.getTime()}_${event.end?.getTime()}`;
      const existing = mergedEventsMap.get(key);

      // Rule: Always prefer native 'task' type over virtual 'event' type if they overlap
      // This ensures that if a Google event was converted to a Task, we show the Task
      if (!existing || (event.type === 'task' && existing.type === 'event')) {
        mergedEventsMap.set(key, event as ICalendarEvent);
      }
    });

    const allEvents = Array.from(mergedEventsMap.values());
    const sortedEvents = allEvents.sort((a, b) => {
      const aStart = a.start?.getTime() || 0;
      const bStart = b.start?.getTime() || 0;

      if (aStart !== bStart) {
        return aStart - bStart;
      }

      // If same start time, longer events go first (at the bottom of the stack)
      const aDuration = (a.end?.getTime() || 0) - aStart;
      const bDuration = (b.end?.getTime() || 0) - bStart;
      return bDuration - aDuration;
    });

    const result: ICalendarEvent[] = [];
    const activeWindows: { end: number; index: number }[] = [];

    sortedEvents.forEach((event) => {
      const start = event.start?.getTime() || 0;

      for (let i = activeWindows.length - 1; i >= 0; i--) {
        if (activeWindows[i].end <= start) {
          activeWindows.splice(i, 1);
        }
      }

      const usedIndices = new Set(activeWindows.map((w) => w.index));
      let overlapIndex = 0;
      while (usedIndices.has(overlapIndex)) {
        overlapIndex++;
      }

      activeWindows.push({ end: event.end.getTime(), index: overlapIndex });
      result.push({ ...event, overlapIndex });
    });

    return result;
  }, [reduxEvents, tasks]);

  const handleOnChangeView = (selectedView: View) => {
    updateUrlParams(selectedView, currentDate);
  };

  const handleOnNavigate = (newDate: Date) => {
    updateUrlParams(currentView, newDate);
  };

  const handleNavigateAction = (action: CalendarNavigateAction) => {
    if (action === 'TODAY') {
      const today = new Date();
      updateUrlParams(currentView, today);
      // Find the first task of the day to scroll to
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const todayTasks = events.filter((event) => {
        const eventStart = event.start?.getTime() || 0;
        return (
          eventStart >= todayStart.getTime() && eventStart <= todayEnd.getTime()
        );
      });

      if (todayTasks.length > 0) {
        const firstTask = todayTasks.sort(
          (a, b) => (a.start?.getTime() || 0) - (b.start?.getTime() || 0),
        )[0];

        if (firstTask.start) {
          setScrollToTime(firstTask.start);
        }
      }
      return;
    }

    if (currentView === Views.MONTH) {
      updateUrlParams(
        currentView,
        action === 'NEXT'
          ? addMonths(currentDate, 1)
          : subMonths(currentDate, 1),
      );
      return;
    }

    if (currentView === Views.WEEK) {
      updateUrlParams(
        currentView,
        action === 'NEXT' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1),
      );
      return;
    }

    if (currentView === Views.DAY) {
      updateUrlParams(
        currentView,
        action === 'NEXT' ? addDays(currentDate, 1) : subDays(currentDate, 1),
      );
      return;
    }

    updateUrlParams(
      currentView,
      action === 'NEXT' ? addDays(currentDate, 1) : subDays(currentDate, 1),
    );
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('action', 'create');
    newParams.set('start', start.toISOString());
    newParams.set('end', end.toISOString());
    newParams.set('d', format(start, 'yyyy-MM-dd'));
    setSearchParams(newParams);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectEvent = (event: ICalendarEvent | any) => {
    const activeTab = searchParams.get('tab') || 'DailyPlan';
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tab', activeTab);
    newParams.set('taskId', event.id);
    if (event.start) {
      newParams.set('d', format(event.start, 'yyyy-MM-dd'));
    }
    setSearchParams(newParams);
  };

  // When clicking "+N más", navigate to day view for that date
  const handleShowMore = (_events: ICalendarEvent[], date: Date) => {
    updateUrlParams(Views.DAY, date);
  };

  const handleModalClose = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('taskId');
    newParams.delete('action');
    newParams.delete('start');
    newParams.delete('end');
    setSearchParams(newParams);
  };

  const handleDeleteTask = async (taskId: string) => {
    // 1. Optimistic Delete in Redux
    dispatch(removeTask({ id: taskId }));
    dispatch(removeEvent({ id: taskId })); // Also remove from virtual state

    try {
      const persistentTask = tasks.find((t) => t.id === taskId);
      const virtualEvent = reduxEvents.find((e) => e.id === taskId);

      const isPlatformTask = !!persistentTask;

      if (isPlatformTask) {
        await deleteTaskMutation({
          variables: { id: taskId },
          refetchQueries: [
            {
              query: GET_TASKS,
              variables: {
                userId: user?.id,
                filters: { startDate: dateRange.start, endDate: dateRange.end },
              },
            },
            { query: GET_WORKSPACES, variables: { search: '' } },
          ],
        });
      } else {
        const googleEventId =
          virtualEvent?.google_event_id || virtualEvent?.id || taskId;
        await deleteGoogleEvent(googleEventId);
        dispatch(removeEvent({ id: googleEventId }));
      }

      handleModalClose();

      sileo.success({
        title: 'Task deleted successfully!',
        fill: 'var(--sileo-delete-bg)',
        duration: 4000,
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      // We don't easily revert delete without refetching,
      // but refetch will happen anyway on focus or next range change.
      sileo.error({
        title: 'Error deleting task',
        fill: 'var(--sileo-error-bg)',
        duration: 4000,
      });
    }
  };

  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);

  const handleSlotContextMenu = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    setSlotContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      date,
    });
  };

  const closeSlotContextMenu = () => {
    setSlotContextMenu(null);
  };

  const [updateTaskMutation] = useMutation(UPDATE_TASK);

  interface CalendarDragEvent {
    event: ICalendarEvent;
    start: string | Date;
    end: string | Date;
  }

  const handleEventDrop = async ({ event, start, end }: CalendarDragEvent) => {
    if (event.type !== 'task') return;

    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    // 1. Optimistic Update in Redux
    const originalTask = tasks.find((t) => t.id === event.id);
    if (originalTask) {
      dispatch(
        updateTask({
          ...originalTask,
          estimated_start_date: startDate.toISOString(),
          estimated_end_date: endDate.toISOString(),
          deadline: endDate.toISOString(),
        }),
      );
    }

    try {
      await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id: event.id,
            deadline: endDate.toISOString(),
            estimated_start_date: startDate.toISOString(),
            estimated_end_date: endDate.toISOString(),
          },
        },
        // We still refetch to ensure server sync, but optimistic update removes the "jump"
        refetchQueries: [
          {
            query: GET_TASKS,
            variables: {
              userId: user?.id,
              filters: { startDate: dateRange.start, endDate: dateRange.end },
            },
          },
        ],
      });

      sileo.success({
        title: 'Task rescheduled!',
        description: `New time: ${format(startDate, 'hh:mm a')}`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Error dropping event:', err);
      // Revert if error
      if (originalTask) {
        dispatch(updateTask(originalTask));
      }
      sileo.error({ title: 'Error rescheduling task' });
    }
  };

  const handleEventResize = async ({
    event,
    start,
    end,
  }: CalendarDragEvent) => {
    if (event.type !== 'task') return;

    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    // 1. Optimistic Update in Redux
    const originalTask = tasks.find((t) => t.id === event.id);
    if (originalTask) {
      dispatch(
        updateTask({
          ...originalTask,
          estimated_start_date: startDate.toISOString(),
          estimated_end_date: endDate.toISOString(),
          deadline: endDate.toISOString(),
        }),
      );
    }

    try {
      await updateTaskMutation({
        variables: {
          updateTaskInput: {
            id: event.id,
            deadline: endDate.toISOString(),
            estimated_start_date: startDate.toISOString(),
            estimated_end_date: endDate.toISOString(),
          },
        },
        refetchQueries: [
          {
            query: GET_TASKS,
            variables: {
              userId: user?.id,
              filters: { startDate: dateRange.start, endDate: dateRange.end },
            },
          },
        ],
      });
    } catch (err) {
      console.error('Error resizing event:', err);
      // Revert if error
      if (originalTask) {
        dispatch(updateTask(originalTask));
      }
    }
  };

  const dayPropGetter = (date: Date) => {
    const classes = [];
    if (isSameDay(date, currentDate)) {
      classes.push('selected-day-column');
    }
    if (flashingDate && isSameDay(date, flashingDate)) {
      classes.push('flash-highlight-column');
    }
    return {
      className: classes.join(' '),
    };
  };

  return {
    events,
    currentView,
    currentDate,
    isCalendarLoading,
    handleOnChangeView,
    handleOnNavigate,
    handleNavigateAction,
    handleSelectSlot,
    handleSelectEvent,
    handleEventDrop,
    handleEventResize,
    handleDeleteTask,
    handleModalClose,
    isFocusModeOpen,
    setIsFocusModeOpen,
    isFocusSessionActive,
    setIsFocusSessionActive,
    handleShowMore,
    tasks,
    slotContextMenu,
    handleSlotContextMenu,
    closeSlotContextMenu,
    scrollToTime,
    dayPropGetter,
  };
};
