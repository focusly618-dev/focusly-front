import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';
import axios from 'axios';
import { addDays, endOfDay, max, startOfDay } from 'date-fns';
import { planCalendarAI } from '@/api/AI/apiAIPlanner';
import { isPlanLimitError } from '@/api/Billing/planLimit';
import { fetchGoogleEvents } from '@/api/GoogleCalendar/googleCalendarApi';
import { mapResponseToTask } from '@/api/Tasks/taskMapper';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { UserSettings } from '@/api/User/apiUser.types';
import { useBilling } from '@/hooks/useBilling';
import {
  GET_TASKS_CALENDAR,
  GET_TASKS_PAGINATED,
} from '@/pages/Tasks/Tasks.graphql';
import { useAppSelector } from '@/redux/hooks';
import { billingService } from '@/services/billingService';
import {
  calendarPlanService,
  type PlanPhase,
  type PlanResult,
} from '@/services/calendarPlanService';
import { TaskBar } from '../../Sidebar/types/Sidebar.types';
import { getFriendlyErrorMessage, notify } from '@/utils';
import type { ICalendarEvent } from '../../CalendarEvent';
import {
  findFreeRanges,
  planningDays,
  selectTasksToPlan,
  toLocalISO,
  validateProposals,
  type TimeRange,
  type WorkHours,
} from '../utils/aiSchedule';

/** The statuses a task can still be planned from. */
const OPEN_STATUSES = [
  'Todo',
  'Planning',
  'Pending',
  'On Hold',
  'Review',
  'Backlog',
  'Scheduled',
];
/** Open tasks read to choose from (the most important are sent). */
const CANDIDATES_LIMIT = 150;

/** What the calendar has loaded (useCalendarView): a month, ±7 days. */
export const loadedRange = (date: Date): TimeRange => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start: addDays(start, -7), end: endOfDay(addDays(end, 7)) };
};

interface UseAISchedulerOptions {
  events: ICalendarEvent[];
  currentDate: Date;
  workHours?: WorkHours;
}

/** "Optimizar agenda": Lumina proposes focus blocks for the open tasks. */
export const useAIScheduler = ({
  events,
  currentDate,
  workHours,
}: UseAISchedulerOptions) => {
  const { t } = useTranslation();
  const apollo = useApolloClient();
  const billing = useBilling();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;
  // Same rule as the calendar's own Google fetch.
  const calendarConnected =
    user?.authProvider === 'google' &&
    Boolean((user?.settings as UserSettings | undefined)?.calendarConnected);
  const navigate = useNavigate();
  // The run lives in calendarPlanService: it goes on (and its proposal
  // waits) while the user is on another tab of the app.
  const planState = useSyncExternalStore(
    calendarPlanService.subscribe,
    calendarPlanService.getSnapshot,
  );
  const isPlanning = planState.isPlanning;

  const freeMessagesLeft = billing.isPro ? null : billing.remaining;

  /** Busy time in the window: the calendar's events when it has the window
   * loaded, else read fresh (e.g. a past month is on screen). */
  const busyTime = async (
    window: TimeRange,
    skipTaskIds: Set<string>,
  ): Promise<TimeRange[]> => {
    const loaded = loadedRange(currentDate);
    const fromEvents = (list: ICalendarEvent[]) =>
      list
        .filter((e) => !e.isDraft && !e.allDay && e.type !== 'skeleton')
        .filter(
          (e) =>
            !(
              e.resource &&
              'id' in e.resource &&
              skipTaskIds.has(e.resource.id)
            ),
        )
        .map((e) => ({ start: e.start, end: e.end }));

    if (window.start >= loaded.start && window.end <= loaded.end) {
      return fromEvents(events);
    }

    const busy: TimeRange[] = [];
    const { data } = await apollo.query({
      query: GET_TASKS_CALENDAR,
      variables: {
        userId,
        filters: {
          startDate: window.start.toISOString(),
          endDate: window.end.toISOString(),
        },
      },
      fetchPolicy: 'network-only',
    });
    for (const raw of (data?.result?.tasks ?? []) as TaskResponse[]) {
      const task = mapResponseToTask(raw);
      if (skipTaskIds.has(task.id) || !task.estimated_start_date) continue;
      const start = new Date(task.estimated_start_date);
      const end = task.estimated_end_date
        ? new Date(task.estimated_end_date)
        : new Date(start.getTime() + (task.estimate_timer ?? 30) * 60_000);
      busy.push({ start, end });
    }
    if (calendarConnected) {
      const google = await fetchGoogleEvents(
        window.start.toISOString(),
        window.end.toISOString(),
      );
      for (const event of google) {
        if (event.is_all_day) continue;
        busy.push({
          start: new Date(event.estimated_start_date),
          end: new Date(event.deadline),
        });
      }
    }
    return busy;
  };

  /** Lumina's proposal, or null when there's nothing to show. */
  const buildProposal = async (
    signal: AbortSignal,
    setPhase: (phase: PlanPhase) => void,
  ): Promise<PlanResult | null> => {
    const now = new Date();

    // 1. The open tasks, read fresh (the calendar only has this month's).
    const { data } = await apollo.query({
      query: GET_TASKS_PAGINATED,
      variables: {
        userId,
        filters: { status: OPEN_STATUSES },
        sort: { sort: 'priority_level', order: 'desc' },
        limit: CANDIDATES_LIMIT,
        offset: 0,
      },
      fetchPolicy: 'network-only',
    });
    const candidates = selectTasksToPlan(
      ((data?.result?.tasks ?? []) as TaskResponse[]).map(mapResponseToTask),
      now,
    );
    if (candidates.length === 0) {
      notify.info({
        title: t('calendar.noPendingTasksTitle'),
        description: t('calendar.noPendingTasksDesc'),
      });
      return null;
    }

    // 2. Free time in the work hours of the next working days.
    setPhase('slots');
    const days = planningDays(
      max([startOfDay(currentDate), startOfDay(now)]),
      workHours?.selectedDays,
    );
    const busy = days.length
      ? await busyTime(
          { start: days[0], end: endOfDay(days[days.length - 1]) },
          new Set(candidates.map((task) => task.id)),
        )
      : [];
    const free = findFreeRanges({ days, workHours, busy, now });
    if (free.length === 0) {
      notify.warning({
        title: t('calendar.noAvailabilityTitle'),
        description: t('calendar.noAvailabilityDesc'),
      });
      return null;
    }

    // 3. Lumina proposes; only what fits is kept.
    setPhase('thinking');
    const response = await planCalendarAI(
      candidates,
      free.map((r) => ({ start: toLocalISO(r.start), end: toLocalISO(r.end) })),
      { signal },
    );
    setPhase('checking');
    const { blocks } = validateProposals(
      response.events,
      candidates,
      free,
      new Date(),
    );
    if (blocks.length === 0) {
      notify.info({
        title: t('calendar.noSuggestionsTitle'),
        description: t('calendar.noSuggestionsDesc'),
      });
      return null;
    }

    const left = candidates.length - blocks.length;
    const description =
      left > 0
        ? t('calendar.draftGeneratedPartial', { count: blocks.length, left })
        : t('calendar.draftGeneratedDesc');
    if (calendarPlanService.isCalendarOpen() && !document.hidden) {
      notify.success({ title: t('calendar.draftGeneratedTitle'), description });
    } else {
      // Done while the user was elsewhere: it waits for them, with a way back.
      notify.success({
        title: t('calendar.draftReadyTitle'),
        description,
        duration: Infinity,
        button: {
          title: t('calendar.viewProposal'),
          onClick: () => navigate(`/tasks?tab=${TaskBar.DailyPlan}`),
        },
      });
    }

    const placed = new Set(blocks.map((b) => b.task.id));
    return {
      drafts: blocks.map((block) => ({
        id: `draft-${block.task.id}`,
        title: block.task.title,
        start: block.start,
        end: block.end,
        allDay: false,
        resource: block.task,
        type: 'task' as const,
        isDraft: true,
        draftReason: block.reason,
      })),
      unplaced: candidates
        .filter((task) => !placed.has(task.id))
        .map((task) => ({ id: task.id, title: task.title })),
    };
  };

  const plan = async () => {
    if (!userId || calendarPlanService.getSnapshot().isPlanning) return;
    // Out of free messages: the Pro plans, without asking Lumina.
    if (freeMessagesLeft !== null && billing.known && freeMessagesLeft <= 0) {
      billingService.openUpgrade('limit');
      return;
    }
    await calendarPlanService.run(userId, async (signal, setPhase) => {
      try {
        return await buildProposal(signal, setPhase);
      } catch (e) {
        // Cancelled, or the Pro plans are already on screen.
        if (axios.isCancel(e) || isPlanLimitError(e)) return null;
        console.error('Error generating AI schedule:', e);
        notify.error({
          title: t('calendar.planningErrorTitle'),
          description: getFriendlyErrorMessage(
            e,
            t('calendar.planningErrorDesc'),
          ),
        });
        return null;
      }
    });
  };

  const cancel = () => calendarPlanService.cancel();

  return { plan, cancel, isPlanning, freeMessagesLeft, isPro: billing.isPro };
};
