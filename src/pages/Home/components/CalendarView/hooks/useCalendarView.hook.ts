import {
  deleteGoogleEvent,
  fetchGoogleEvents,
  updateGoogleEvent,
} from '@/api/GoogleCalendar/googleCalendarApi';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import {
  getBaseGoogleId,
  mapResponseToTask,
  normalizeGoogleId,
  safeISO,
} from '@/api/Tasks/taskMapper';
import {
  DELETE_TASK,
  GET_TASKS,
  UPDATE_TASK,
} from '@/pages/Tasks/Tasks.graphql';
import { GET_WORKSPACES } from '@/pages/Workspace/Workspace.graphql';
import {
  incrementSyncVersion,
  removeEvent,
  setEvents,
  updateEvent,
} from '@/redux/calendar/calendar.slice';
import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';
import type { RootState } from '@/redux/store';
import type { UserSettings } from '@/api/User/apiUser.types';
import { removeTask, setTasks, updateTask } from '@/redux/tasks/task.slice';
import type { Task } from '@/redux/tasks/task.types';
import { sileo, getFriendlyErrorMessage } from '@/utils';
import { useMutation, useQuery } from '@apollo/client';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Views, type View } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import type { ICalendarEvent } from '../../CalendarEvent';
import type { CalendarNavigateAction } from '../calendarView.types';

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
  const [draftEvents, setDraftEvents] = useState<ICalendarEvent[]>([]);
  const [isCalendarInDraftMode, setIsCalendarInDraftMode] = useState(false);

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
  const [isFetchingGoogleEvents, setIsFetchingGoogleEvents] = useState(false);

  // New Task Modal State moved to URL parameters
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const user = useSelector((state: RootState) => state.auth.user);

  const dateRange = useMemo(() => {
    // Always fetch a full month range (with safety margins) around the current date
    // to avoid refetching on every day/week navigation.
    const start = subDays(startOfMonth(currentDate), 7);
    const end = addDays(endOfMonth(currentDate), 7);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }, [currentDate]);

  const {
    data: tasksData,
    loading: isTasksQueryLoading,
    refetch: refetchTasks,
  } = useQuery(GET_TASKS, {
    skip: !user?.id,
    variables: {
      userId: user?.id,
      filters: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const fetchedTasks = tasksData?.result?.tasks;
    if (fetchedTasks) {
      const validTasks: Task[] = fetchedTasks.map((t: TaskResponse) =>
        mapResponseToTask(t),
      );
      dispatch(setTasks(validTasks));
    }
  }, [tasksData, dispatch]);

  const isCalendarConnected = Boolean(
    (user?.settings as UserSettings | undefined)?.calendarConnected,
  );

  // True for the whole lifetime of any /google-calendar/events fetch —
  // including re-fetches triggered by date-range navigation or the polling
  // fallback below, not just the very first load — so the calendar can show
  // a loading state whenever that request is slow, not only when there's no
  // Google data at all yet.
  const isGoogleEventsLoading = isFetchingGoogleEvents;

  // Fetch Google Calendar Events when the range or user changes
  useEffect(() => {
    if (user?.authProvider !== 'google' || !user?.id || !isCalendarConnected) {
      return;
    }

    let isMounted = true;
    setIsFetchingGoogleEvents(true);

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
          setIsFetchingGoogleEvents(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    dispatch,
    user?.id,
    user?.authProvider,
    isCalendarConnected,
    dateRange.start,
    dateRange.end,
    syncVersion,
  ]);

  // Fallback polling: the WebSocket/webhook push from Google can silently fail to
  // arrive (e.g. an unreachable webhook URL), so this re-triggers the fetch above
  // on a timer as a safety net while the calendar is open, independent of it.
  useEffect(() => {
    if (user?.authProvider !== 'google' || !user?.id || !isCalendarConnected) {
      return;
    }

    const GOOGLE_CALENDAR_POLL_INTERVAL_MS = 60_000;
    const intervalId = setInterval(() => {
      dispatch(incrementSyncVersion());
    }, GOOGLE_CALENDAR_POLL_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, user?.id, user?.authProvider, isCalendarConnected]);

  const isDeletingRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const prevTasksCount = useRef(tasks.length);
  const hasInitialTasksLoaded = useRef(false);

  useEffect(() => {
    if (tasksData !== undefined) {
      hasInitialTasksLoaded.current = true;
    }
  }, [tasksData]);

  useEffect(() => {
    // Si la cantidad de tareas disminuyó, se eliminó una tarea en el calendario
    if (tasks.length < prevTasksCount.current) {
      isDeletingRef.current = true;
      setIsDeleting(true);
      const timer = setTimeout(() => {
        isDeletingRef.current = false;
        setIsDeleting(false);
      }, 2500);
      prevTasksCount.current = tasks.length;
      return () => clearTimeout(timer);
    }
    prevTasksCount.current = tasks.length;
  }, [tasks.length]);

  // Loading must be tracked per-source: tasks and Google events can resolve at
  // different times (e.g. tasks served instantly from the Apollo cache while
  // the Google events fetch is still in flight), so a single combined flag
  // would go permanently false the moment either source has any data, hiding
  // the still-pending loading state of the other source.
  const hasRenderableTasks =
    tasks.length > 0 || (tasksData?.result?.tasks?.length ?? 0) > 0;
  const hasRenderableGoogleEvents = reduxEvents.length > 0;

  const isCalendarLoading =
    !isDeleting &&
    !isDeletingRef.current &&
    ((!hasInitialTasksLoaded.current && !hasRenderableTasks && isTasksQueryLoading) ||
      (!hasRenderableGoogleEvents && isGoogleEventsLoading));
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
          const startISO = safeISO(ge.estimated_start_date);
          const endISO = safeISO(ge.deadline);
          return {
            id: ge.id,
            title: ge.title,
            start: startISO ? new Date(startISO) : new Date(),
            end: endISO ? new Date(endISO) : new Date(),
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
    // Tracks tasks whose start/end had to fall back to a synthetic default
    // because the real date data was missing/unparseable — the dedup step
    // below never lets two such tasks merge just because they share the
    // same fallback, even though the fallback itself is now always valid.
    const unreliableDateTaskIds = new Set<string>();

    const taskEvents = tasks
      .filter((task: Task) => {
        const hasEstimatedStart =
          task.estimated_start_date &&
          !isNaN(new Date(task.estimated_start_date).getTime());
        const hasValidDeadline =
          task.deadline && !isNaN(new Date(task.deadline).getTime());

        if (!hasEstimatedStart && !hasValidDeadline) return false;
        if (task.status === 'Backlog' && !hasEstimatedStart) return false;

        return true;
      })
      .map((task: Task) => {
        const desc = task.notes_encrypted || '';
        const startDateMatch = desc.match(/\[START_DATE:(.*?)\]/);

      const deadlineDate = task.deadline ? new Date(task.deadline) : new Date();
      const hasEstimatedStart =
        task.estimated_start_date &&
        !isNaN(new Date(task.estimated_start_date).getTime());
      // 0 is a legitimate explicit duration; only null/undefined should
      // fall back to the 30-minute default. Negative values are clamped
      // so an event's end can never land before its start.
      const durationMinutes = Math.max(task.estimate_timer ?? 30, 0);

      if (!hasEstimatedStart && isNaN(deadlineDate.getTime())) {
        unreliableDateTaskIds.add(task.id);
      }

      let start = hasEstimatedStart
        ? new Date(task.estimated_start_date!)
        : isNaN(deadlineDate.getTime())
          ? new Date()
          : deadlineDate;
      let end =
        hasEstimatedStart && task.estimated_end_date
          ? new Date(task.estimated_end_date)
          : new Date(start.getTime() + durationMinutes * 60000);

      if (startDateMatch && startDateMatch[1]) {
        const parsedStart = new Date(startDateMatch[1]);
        if (!isNaN(parsedStart.getTime())) {
          start = parsedStart;
          const parsedDeadline = task.deadline ? new Date(task.deadline) : null;
          if (parsedDeadline && !isNaN(parsedDeadline.getTime())) {
            end = parsedDeadline;
          } else {
            end = new Date(start.getTime() + durationMinutes * 60000);
            unreliableDateTaskIds.add(task.id);
          }
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
      // Create a unique composite key for the event content. Two unrelated
      // events should never merge just because their dates are both
      // unreliable (either still NaN, or a synthetic fallback substituted
      // for missing/corrupt source data) — falling back to the event's own
      // id keeps them distinct in either case.
      const startTime = event.start?.getTime();
      const endTime = event.end?.getTime();
      const hasUnreliableDate =
        Number.isNaN(startTime) ||
        Number.isNaN(endTime) ||
        unreliableDateTaskIds.has(event.id);
      const key = hasUnreliableDate
        ? `${event.title}_${event.id}`
        : `${event.title}_${startTime}_${endTime}`;
      const existing = mergedEventsMap.get(key);

      // Rule: Always prefer native 'task' type over virtual 'event' type if they overlap
      // This ensures that if a Google event was converted to a Task, we show the Task
      if (!existing || (event.type === 'task' && existing.type === 'event')) {
        mergedEventsMap.set(key, event as ICalendarEvent);
      }
    });

    const draftEventsMapped = isCalendarInDraftMode ? draftEvents : [];
    const allEvents = [
      ...Array.from(mergedEventsMap.values()),
      ...draftEventsMapped,
    ];
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
  }, [reduxEvents, tasks, isCalendarInDraftMode, draftEvents]);

  // Synthetic placeholder events shown instead of `events` while the
  // calendar's real data is still loading (see `isCalendarLoading`). These
  // are never persisted anywhere and are excluded from selection/drag/resize
  // via their `type: 'skeleton'` discriminator.
  const skeletonEvents = useMemo<ICalendarEvent[]>(() => {
    const makeSlot = (base: Date, startHour: number, startMinute: number, endHour: number, endMinute: number) => {
      const start = new Date(base);
      start.setHours(startHour, startMinute, 0, 0);
      const end = new Date(base);
      end.setHours(endHour, endMinute, 0, 0);
      return { start, end };
    };

    let slots: { start: Date; end: Date }[];

    if (currentView === Views.DAY) {
      slots = [
        makeSlot(currentDate, 9, 0, 10, 0),
        makeSlot(currentDate, 11, 30, 12, 30),
        makeSlot(currentDate, 14, 0, 15, 30),
      ];
    } else if (currentView === Views.WEEK) {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      slots = [
        makeSlot(addDays(weekStart, 0), 9, 0, 10, 0),
        makeSlot(addDays(weekStart, 2), 11, 0, 12, 30),
        makeSlot(addDays(weekStart, 4), 14, 0, 15, 0),
      ];
    } else {
      const monthStart = startOfMonth(currentDate);
      slots = [
        makeSlot(addDays(monthStart, 4), 10, 0, 11, 0),
        makeSlot(addDays(monthStart, 13), 10, 0, 11, 0),
        makeSlot(addDays(monthStart, 21), 10, 0, 11, 0),
      ];
    }

    return slots.map((slot, index) => ({
      id: `skeleton-${index}`,
      title: '',
      start: slot.start,
      end: slot.end,
      allDay: false,
      type: 'skeleton' as const,
    }));
  }, [currentView, currentDate]);

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

  const handleAddTaskClick = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('action', 'create');
    setSearchParams(newParams);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectEvent = (event: ICalendarEvent | any) => {
    if (event?.type === 'skeleton') return;

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
    isDeletingRef.current = true;
    setIsDeleting(true);
    const taskObj = tasks.find((t) => t.id === taskId);
    const virtualEvent = reduxEvents.find((e) => e.id === taskId);
    const initialTask = taskObj || virtualEvent;

    if (initialTask) {
      const isReadOnly = initialTask.is_owner === false;

      if (isReadOnly) {
        sileo.error({
          title: 'Action not allowed',
          description:
            "You can't delete the task because you are not the owner",
          duration: 3000,
        });
        isDeletingRef.current = false;
        setIsDeleting(false);
        return;
      }
    }

    // 1. Optimistic Delete in Redux
    dispatch(removeTask({ id: taskId }));
    dispatch(removeEvent({ id: taskId })); // Also remove from virtual state
    if (taskObj?.google_event_id) {
      dispatch(removeEvent({ id: taskObj.google_event_id }));
    }

    try {
      const isPlatformTask = !!taskObj;

      if (isPlatformTask) {
        if (taskObj.google_event_id) {
          try {
            await deleteGoogleEvent(taskObj.google_event_id);
          } catch (err) {
            console.warn(
              'Failed to delete synced Google event, proceeding with platform delete',
              err,
            );
          }
        }

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
      }

      handleModalClose();

      sileo.success({
        title: 'Task deleted successfully!',
        fill: 'var(--sileo-delete-bg)',
        duration: 4000,
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      sileo.error({
        title: getFriendlyErrorMessage(err, 'Error deleting task'),
        fill: 'var(--sileo-error-bg)',
        duration: 4000,
      });
    } finally {
      setTimeout(() => {
        isDeletingRef.current = false;
        setIsDeleting(false);
      }, 2500);
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
  const [confirmingDraft, setConfirmingDraft] = useState(false);

  const confirmDraftEvents = async () => {
    if (!user?.id || draftEvents.length === 0) return;
    setConfirmingDraft(true);
    try {
      const { createTimeBlock } =
        await import('@/api/TimeBlocks/timeBlocksApi');
      for (const item of draftEvents) {
        // 1. Create TimeBlock in DB
        await createTimeBlock({
          userId: user.id,
          taskId:
            item.resource && 'id' in item.resource
              ? item.resource.id
              : undefined,
          startTime: item.start.toISOString(),
          endTime: item.end.toISOString(),
          blockType: 'Focus_Block',
          source: 'App',
          title: item.title,
        });

        // 2. Reschedule corresponding task
        if (item.resource && 'id' in item.resource) {
          await updateTaskMutation({
            variables: {
              updateTaskInput: {
                id: item.resource.id,
                estimated_start_date: item.start.toISOString(),
                estimated_end_date: item.end.toISOString(),
              },
            },
          });
        }
      }

      sileo.success({
        title: 'Calendario Organizado',
        description: 'Tus sugerencias han sido agendadas con éxito.',
        duration: 4000,
      });

      setDraftEvents([]);
      setIsCalendarInDraftMode(false);
      refetchTasks();
    } catch (e) {
      console.error('Error confirming draft events:', e);
      sileo.error({
        title: getFriendlyErrorMessage(
          e,
          'No se pudieron guardar todas las sugerencias.',
        ),
        duration: 4000,
      });
    } finally {
      setConfirmingDraft(false);
    }
  };

  const clearDraftEvents = () => {
    setDraftEvents([]);
    setIsCalendarInDraftMode(false);
  };

  const handleDeleteDraft = (id: string) => {
    setDraftEvents((prev) => prev.filter((e) => e.id !== id));
  };

  interface CalendarDragEvent {
    event: ICalendarEvent;
    start: string | Date;
    end: string | Date;
  }

  const handleEventDrop = async ({ event, start, end }: CalendarDragEvent) => {
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    if (event.isDraft) {
      setDraftEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, start: startDate, end: endDate } : e,
        ),
      );
      return;
    }

    if (event.type === 'event') {
      // Virtual Google Calendar event: not yet a Focusly task, so there's no
      // row to PATCH via updateTaskMutation. Reschedule it directly against
      // Google, the same way handleDeleteTask already does for delete.
      const originalEvent = event.resource as GoogleCalendarEvent;
      if (originalEvent?.is_owner === false) {
        sileo.error({
          title: 'Action not allowed',
          description: "You can't move the task because you are not the owner",
          duration: 3000,
        });
        return;
      }

      const googleEventId = originalEvent?.google_event_id || event.id;

      dispatch(
        updateEvent({
          ...originalEvent,
          estimated_start_date: startDate.toISOString(),
          deadline: endDate.toISOString(),
        }),
      );

      try {
        await updateGoogleEvent(googleEventId, {
          start: { dateTime: startDate.toISOString() },
          end: { dateTime: endDate.toISOString() },
        });

        sileo.success({
          title: 'Task rescheduled!',
          description: `New time: ${format(startDate, 'hh:mm a')}`,
          duration: 3000,
        });
      } catch (err) {
        console.error('Error dropping google event:', err);
        if (originalEvent) {
          dispatch(updateEvent(originalEvent));
        }
        sileo.error({
          title: getFriendlyErrorMessage(err, 'Error rescheduling task'),
        });
      }
      return;
    }

    if (event.type !== 'task') return;

    const originalTask = tasks.find((t) => t.id === event.id);
    if (originalTask) {
      const isReadOnly = originalTask.is_owner === false;

      if (isReadOnly) {
        sileo.error({
          title: 'Action not allowed',
          description: "You can't move the task because you are not the owner",
          duration: 3000,
        });
        return;
      }
    }

    // 1. Optimistic Update in Redux
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
      sileo.error({
        title: getFriendlyErrorMessage(err, 'Error rescheduling task'),
      });
    }
  };

  const handleEventResize = async ({
    event,
    start,
    end,
  }: CalendarDragEvent) => {
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    if (event.isDraft) {
      setDraftEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, start: startDate, end: endDate } : e,
        ),
      );
      return;
    }

    if (event.type === 'event') {
      // Virtual Google Calendar event: not yet a Focusly task, so there's no
      // row to PATCH via updateTaskMutation. Reschedule it directly against
      // Google, the same way handleDeleteTask already does for delete.
      const originalEvent = event.resource as GoogleCalendarEvent;
      if (originalEvent?.is_owner === false) {
        sileo.error({
          title: 'Action not allowed',
          description: "You can't move the task because you are not the owner",
          duration: 3000,
        });
        return;
      }

      const googleEventId = originalEvent?.google_event_id || event.id;

      dispatch(
        updateEvent({
          ...originalEvent,
          estimated_start_date: startDate.toISOString(),
          deadline: endDate.toISOString(),
        }),
      );

      try {
        await updateGoogleEvent(googleEventId, {
          start: { dateTime: startDate.toISOString() },
          end: { dateTime: endDate.toISOString() },
        });
      } catch (err) {
        console.error('Error resizing google event:', err);
        if (originalEvent) {
          dispatch(updateEvent(originalEvent));
        }
        sileo.error({
          title: getFriendlyErrorMessage(err, 'Error rescheduling task'),
        });
      }
      return;
    }

    if (event.type !== 'task') return;

    const originalTask = tasks.find((t) => t.id === event.id);
    if (originalTask) {
      const isReadOnly = originalTask.is_owner === false;

      if (isReadOnly) {
        sileo.error({
          title: 'Action not allowed',
          description: "You can't move the task because you are not the owner",
          duration: 3000,
        });
        return;
      }
    }

    // 1. Optimistic Update in Redux
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
      sileo.error({
        title: getFriendlyErrorMessage(err, 'Error rescheduling task'),
      });
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

  const workHoursConfig = (user?.settings as UserSettings | undefined)
    ?.workHoursConfig;

  const slotPropGetter = (date: Date) => {
    if (
      !workHoursConfig?.startTime ||
      !workHoursConfig?.endTime ||
      !workHoursConfig?.selectedDays?.length
    ) {
      return {};
    }

    const dayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [startHour, startMinute] = workHoursConfig.startTime
      .split(':')
      .map(Number);
    const [endHour, endMinute] = workHoursConfig.endTime
      .split(':')
      .map(Number);
    const slotMinutes = date.getHours() * 60 + date.getMinutes();
    const isWorkingDay = workHoursConfig.selectedDays.includes(
      dayShortNames[date.getDay()],
    );
    const isWithinHours =
      slotMinutes >= startHour * 60 + startMinute &&
      slotMinutes < endHour * 60 + endMinute;

    if (!isWorkingDay || !isWithinHours) {
      return { className: 'non-working-hour-slot' };
    }
    return {};
  };

  return {
    events,
    skeletonEvents,
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
    refetchTasks,
    slotContextMenu,
    handleSlotContextMenu,
    closeSlotContextMenu,
    scrollToTime,
    dayPropGetter,
    slotPropGetter,
    workHoursConfig,
    handleAddTaskClick,
    draftEvents,
    setDraftEvents,
    isCalendarInDraftMode,
    setIsCalendarInDraftMode,
    handleDeleteDraft,
    confirmDraftEvents,
    clearDraftEvents,
    confirmingDraft,
  };
};
