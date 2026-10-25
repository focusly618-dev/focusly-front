import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

// Tuesday 7 October 2026, 10:00 local time.
const NOW = new Date(2026, 9, 7, 10, 0);
const at = (day: number, h: number, m = 0) => new Date(2026, 9, day, h, m);

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  planCalendarAI: vi.fn(),
  fetchGoogleEvents: vi.fn(),
  notify: { info: vi.fn(), warning: vi.fn(), success: vi.fn(), error: vi.fn() },
  openUpgrade: vi.fn(),
  navigate: vi.fn(),
  billing: { isPro: false, known: true, remaining: 3 },
  user: {
    id: 'u1',
    authProvider: 'email',
    settings: {},
  } as Record<string, unknown>,
}));

vi.mock('@apollo/client', async (original) => ({
  ...(await original<typeof import('@apollo/client')>()),
  useApolloClient: () => ({ query: mocks.query }),
}));
vi.mock('@/api/AI/apiAIPlanner', () => ({
  planCalendarAI: mocks.planCalendarAI,
}));
vi.mock('@/api/GoogleCalendar/googleCalendarApi', () => ({
  fetchGoogleEvents: mocks.fetchGoogleEvents,
}));
vi.mock('@/hooks/useBilling', () => ({ useBilling: () => mocks.billing }));
vi.mock('@/services/billingService', () => ({
  billingService: { openUpgrade: mocks.openUpgrade },
}));
vi.mock('@/redux/hooks', () => ({
  useAppSelector: (select: (s: unknown) => unknown) =>
    select({ auth: { user: mocks.user } }),
}));
vi.mock('@/utils', () => ({
  notify: mocks.notify,
  getFriendlyErrorMessage: (_: unknown, fallback: string) => fallback,
}));
vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { PlanLimitError } from '@/api/Billing/planLimit';
import { calendarPlanService } from '@/services/calendarPlanService';
import { useAIScheduler } from '@/pages/Home/components/CalendarView/hooks/useAIScheduler.hook';
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';

const WORK = {
  startTime: '09:00',
  endTime: '18:00',
  selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};

const apiTask = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  title: `Task ${id}`,
  status: 'Todo',
  priority_level: 2,
  estimate_timer: 60,
  deadline: null,
  estimated_start_date: null,
  tags: [],
  ...over,
});

const givenTasks = (...tasks: ReturnType<typeof apiTask>[]) =>
  mocks.query.mockResolvedValue({
    data: { result: { tasks, totalCount: tasks.length } },
  });

const meeting = (day: number, h1: number, h2: number): ICalendarEvent => ({
  id: `m-${day}-${h1}`,
  title: 'Meeting',
  start: at(day, h1),
  end: at(day, h2),
  type: 'event',
});

/** The calendar on screen (the default) or not (another tab of the app). */
let detachCalendar: (() => void) | null = null;
const calendarOpen = (open: boolean) => {
  detachCalendar?.();
  detachCalendar = open ? calendarPlanService.attachCalendar() : null;
};

/** The proposals that reach the calendar (via calendarPlanService). */
const watchDrafts = () => {
  const onDrafts = vi.fn();
  let last = calendarPlanService.getSnapshot().drafts;
  calendarPlanService.subscribe(() => {
    const { drafts } = calendarPlanService.getSnapshot();
    if (drafts !== last && drafts.length) onDrafts(drafts);
    last = drafts;
  });
  return onDrafts;
};

const setup = (events: ICalendarEvent[] = []) => {
  const onDrafts = watchDrafts();
  const hook = renderHook(() =>
    useAIScheduler({
      events,
      currentDate: NOW,
      workHours: WORK,
    }),
  );
  return { ...hook, onDrafts };
};

const proposal = (
  taskId: string,
  start: Date,
  end: Date,
  reason = 'Por la mañana',
) => ({
  taskId,
  title: 'model title',
  startTime: start.toISOString(),
  endTime: end.toISOString(),
  reason,
});

describe('useAIScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    vi.clearAllMocks();
    mocks.billing = { isPro: false, known: true, remaining: 3 };
    mocks.user = { id: 'u1', authProvider: 'email', settings: {} };
    calendarPlanService.reset();
    calendarOpen(true);
  });

  describe('the free plan', () => {
    it('with no free messages left opens Pro without asking Lumina', async () => {
      mocks.billing = { isPro: false, known: true, remaining: 0 };
      const { result } = setup();
      await act(() => result.current.plan());
      expect(mocks.openUpgrade).toHaveBeenCalledWith('limit');
      expect(mocks.query).not.toHaveBeenCalled();
      expect(mocks.planCalendarAI).not.toHaveBeenCalled();
    });

    it('reports how many free messages are left (none for Pro)', () => {
      expect(setup().result.current.freeMessagesLeft).toBe(3);
      mocks.billing = { isPro: true, known: true, remaining: Infinity };
      expect(setup().result.current.freeMessagesLeft).toBeNull();
    });

    it('a 402 from the server (limit reached meanwhile) shows no error', async () => {
      givenTasks(apiTask('a'));
      mocks.planCalendarAI.mockRejectedValue(
        new PlanLimitError('free_limit_reached', 5),
      );
      const { result, onDrafts } = setup();
      await act(() => result.current.plan());
      expect(mocks.notify.error).not.toHaveBeenCalled();
      expect(onDrafts).not.toHaveBeenCalled();
      expect(result.current.isPlanning).toBe(false);
    });

    it('a double click asks Lumina (and spends a message) once', async () => {
      givenTasks(apiTask('a'));
      let answer!: (value: unknown) => void;
      mocks.planCalendarAI.mockImplementation(
        () => new Promise((resolve) => (answer = resolve)),
      );
      const { result } = setup();
      await act(async () => {
        void result.current.plan();
        void result.current.plan();
        void result.current.plan();
      });
      await act(async () => {
        answer({ events: [] });
      });
      expect(mocks.planCalendarAI).toHaveBeenCalledTimes(1);
    });
  });

  describe('nothing is spent when there is nothing to plan', () => {
    it('no open tasks', async () => {
      givenTasks(
        apiTask('done', { status: 'Done' }),
        apiTask('ahead', { estimated_start_date: at(9, 9).toISOString() }),
      );
      const { result } = setup();
      await act(() => result.current.plan());
      expect(mocks.planCalendarAI).not.toHaveBeenCalled();
      expect(mocks.notify.info).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'calendar.noPendingTasksTitle' }),
      );
    });

    it('no free time in the next working days', async () => {
      givenTasks(apiTask('a'));
      const { result } = setup([
        meeting(7, 9, 18),
        meeting(8, 8, 19),
        meeting(9, 9, 18),
      ]);
      await act(() => result.current.plan());
      expect(mocks.planCalendarAI).not.toHaveBeenCalled();
      expect(mocks.notify.warning).toHaveBeenCalled();
    });
  });

  describe('what is sent to Lumina', () => {
    it('only open tasks, and free time from now on in local time', async () => {
      givenTasks(
        apiTask('a', { priority_level: 1 }),
        apiTask('b', { priority_level: 3 }),
        apiTask('g', { source: 'google', task_type: 'GoogleTask' }),
      );
      mocks.planCalendarAI.mockResolvedValue({ events: [] });
      const { result } = setup([meeting(7, 11, 12)]);
      await act(() => result.current.plan());

      const [tasks, slots, options] = mocks.planCalendarAI.mock.calls[0];
      expect(tasks.map((t: { id: string }) => t.id)).toEqual(['b', 'a']);
      // Today: 10:00 to the meeting, then after it. Never before now.
      expect(new Date(slots[0].start)).toEqual(at(7, 10));
      expect(new Date(slots[0].end)).toEqual(at(7, 11));
      expect(new Date(slots[1].start)).toEqual(at(7, 12));
      // Sent as local wall-clock time with its offset (in UTC that offset is "Z")
      expect(slots[0].start).toMatch(
        /^2026-10-07T10:00:00(Z|[+-]\d{2}:\d{2})$/,
      );
      expect(options.signal).toBeInstanceOf(AbortSignal);
    });

    it("a task's own old block doesn't count as busy", async () => {
      givenTasks(
        apiTask('a', { estimated_start_date: at(6, 9).toISOString() }),
      );
      mocks.planCalendarAI.mockResolvedValue({ events: [] });
      const ownBlock: ICalendarEvent = {
        id: 'a',
        title: 'Task a',
        start: at(7, 10),
        end: at(7, 18),
        type: 'task',
        resource: { id: 'a' } as ICalendarEvent['resource'],
      };
      const { result } = setup([ownBlock]);
      await act(() => result.current.plan());
      const [, slots] = mocks.planCalendarAI.mock.calls[0];
      expect(new Date(slots[0].end)).toEqual(at(7, 18));
    });
  });

  describe("Lumina's answer", () => {
    it('becomes drafts with the real task, title and reason', async () => {
      givenTasks(apiTask('a'), apiTask('b'));
      mocks.planCalendarAI.mockResolvedValue({
        events: [
          proposal('a', at(7, 10), at(7, 11), 'Energía alta'),
          proposal('b', at(7, 14), at(7, 15)),
        ],
      });
      const { result, onDrafts } = setup();
      await act(() => result.current.plan());

      const drafts = onDrafts.mock.calls[0][0];
      expect(drafts).toHaveLength(2);
      expect(drafts[0]).toMatchObject({
        id: 'draft-a',
        title: 'Task a',
        isDraft: true,
        draftReason: 'Energía alta',
      });
      expect(drafts[0].resource.id).toBe('a');
    });

    it('drops invented tasks, overlaps and times outside the free time', async () => {
      givenTasks(apiTask('a'), apiTask('b'));
      mocks.planCalendarAI.mockResolvedValue({
        events: [
          proposal('ghost', at(7, 10), at(7, 11)),
          proposal('a', at(7, 11), at(7, 12, 0)), // the meeting
          proposal('a', at(7, 13), at(7, 14)),
          proposal('b', at(7, 13, 30), at(7, 14, 30)), // overlaps a
          proposal('b', at(6, 9), at(6, 10)), // yesterday
        ],
      });
      const { result, onDrafts } = setup([meeting(7, 11, 12)]);
      await act(() => result.current.plan());

      const drafts = onDrafts.mock.calls[0][0];
      expect(drafts.map((d: { id: string }) => d.id)).toEqual(['draft-a']);
      expect(calendarPlanService.getSnapshot().unplaced).toEqual([
        { id: 'b', title: 'Task b' },
      ]);
      // On the calendar the review opens by itself (it lists what didn't fit).
      expect(calendarPlanService.getSnapshot().reviewOpen).toBe(true);
      expect(mocks.notify.success).not.toHaveBeenCalled();
    });

    it('nothing usable: no drafts, a clear message', async () => {
      givenTasks(apiTask('a'));
      mocks.planCalendarAI.mockResolvedValue({
        events: [proposal('x', at(7, 10), at(7, 11))],
      });
      const { result, onDrafts } = setup();
      await act(() => result.current.plan());
      expect(onDrafts).not.toHaveBeenCalled();
      expect(mocks.notify.info).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'calendar.noSuggestionsTitle' }),
      );
    });
  });

  describe('while Lumina works', () => {
    it('can be cancelled, without an error', async () => {
      givenTasks(apiTask('a'));
      mocks.planCalendarAI.mockImplementation(
        (_t: unknown, _s: unknown, { signal }: { signal: AbortSignal }) =>
          new Promise((_, reject) =>
            signal.addEventListener('abort', () => {
              const error = new Error('canceled') as Error & {
                __CANCEL__: boolean;
              };
              error.__CANCEL__ = true;
              reject(error);
            }),
          ),
      );
      const { result, onDrafts } = setup();
      let running!: Promise<void>;
      await act(async () => {
        running = result.current.plan();
      });
      expect(result.current.isPlanning).toBe(true);
      await act(async () => {
        result.current.cancel();
        await running;
      });
      expect(result.current.isPlanning).toBe(false);
      expect(mocks.notify.error).not.toHaveBeenCalled();
      expect(onDrafts).not.toHaveBeenCalled();
    });

    it('a failure shows an error and frees the button', async () => {
      givenTasks(apiTask('a'));
      mocks.planCalendarAI.mockRejectedValue(new Error('500'));
      const { result } = setup();
      await act(() => result.current.plan());
      expect(mocks.notify.error).toHaveBeenCalled();
      expect(result.current.isPlanning).toBe(false);
      mocks.planCalendarAI.mockResolvedValue({ events: [] });
      await act(() => result.current.plan());
      expect(mocks.planCalendarAI).toHaveBeenCalledTimes(2);
    });
  });

  describe('busy time outside what the calendar loaded', () => {
    it('is read fresh, Google events included', async () => {
      mocks.user = {
        id: 'u1',
        authProvider: 'google',
        settings: { calendarConnected: true },
      };
      // Planning starts today, but a past month is on screen.
      mocks.query
        .mockResolvedValueOnce({
          data: { result: { tasks: [apiTask('a')], totalCount: 1 } },
        })
        .mockResolvedValueOnce({
          data: {
            result: {
              tasks: [
                apiTask('busy', {
                  estimated_start_date: at(7, 10).toISOString(),
                  estimated_end_date: at(7, 12).toISOString(),
                }),
              ],
            },
          },
        });
      mocks.fetchGoogleEvents.mockResolvedValue([
        {
          estimated_start_date: at(7, 14).toISOString(),
          deadline: at(7, 15).toISOString(),
          is_all_day: false,
        },
        {
          estimated_start_date: at(7, 0).toISOString(),
          deadline: at(8, 0).toISOString(),
          is_all_day: true, // a birthday doesn't block the day
        },
      ]);
      mocks.planCalendarAI.mockResolvedValue({ events: [] });
      const { result } = renderHook(() =>
        useAIScheduler({
          events: [],
          currentDate: new Date(2026, 7, 10),
          workHours: WORK,
        }),
      );
      await act(() => result.current.plan());

      expect(mocks.fetchGoogleEvents).toHaveBeenCalled();
      const [, slots] = mocks.planCalendarAI.mock.calls[0];
      const today = slots
        .map((s: { start: string; end: string }) => [
          new Date(s.start).getHours(),
          new Date(s.end).getHours(),
        ])
        .slice(0, 2);
      expect(today).toEqual([
        [12, 14],
        [15, 18],
      ]);
    });
  });

  describe('in the background (another tab of the app)', () => {
    const slowLumina = () => {
      let answer!: (value: unknown) => void;
      mocks.planCalendarAI.mockImplementation(
        () => new Promise((resolve) => (answer = resolve)),
      );
      return (value: unknown) => act(async () => answer(value));
    };

    it('keeps working after the calendar closes, and the proposal waits', async () => {
      givenTasks(apiTask('a'));
      const finish = slowLumina();
      const { result, unmount, onDrafts } = setup();
      await act(async () => {
        void result.current.plan();
      });
      expect(calendarPlanService.getSnapshot().isPlanning).toBe(true);

      // The user opens another tab: the calendar goes away.
      unmount();
      calendarOpen(false);
      await finish({ events: [proposal('a', at(7, 10), at(7, 11))] });

      expect(calendarPlanService.getSnapshot().isPlanning).toBe(false);
      expect(onDrafts).toHaveBeenCalledTimes(1);
      expect(calendarPlanService.getSnapshot().drafts[0].id).toBe('draft-a');

      // The calendar opened again shows it.
      const back = setup();
      expect(back.result.current.isPlanning).toBe(false);
      expect(calendarPlanService.getSnapshot().drafts).toHaveLength(1);
    });

    it('tells the user it is ready, with a way back to the calendar', async () => {
      givenTasks(apiTask('a'));
      const finish = slowLumina();
      const { result } = setup();
      await act(async () => {
        void result.current.plan();
      });
      calendarOpen(false);
      await finish({ events: [proposal('a', at(7, 10), at(7, 11))] });

      const toast = mocks.notify.success.mock.calls[0][0];
      expect(toast.title).toBe('calendar.draftReadyTitle');
      expect(toast.duration).toBe(Infinity);
      toast.button.onClick();
      expect(mocks.navigate).toHaveBeenCalledWith('/tasks?tab=DailyPlan');
    });

    it('on the calendar, the review opens by itself (no toast)', async () => {
      givenTasks(apiTask('a'));
      mocks.planCalendarAI.mockResolvedValue({
        events: [proposal('a', at(7, 10), at(7, 11))],
      });
      const { result } = setup();
      await act(() => result.current.plan());
      expect(calendarPlanService.getSnapshot().reviewOpen).toBe(true);
      expect(mocks.notify.success).not.toHaveBeenCalled();
    });

    it("the toast's button brings the user back to the review", async () => {
      givenTasks(apiTask('a'));
      mocks.planCalendarAI.mockResolvedValue({
        events: [proposal('a', at(7, 10), at(7, 11))],
      });
      calendarOpen(false);
      const { result } = setup();
      await act(() => result.current.plan());
      calendarPlanService.closeReview();
      mocks.notify.success.mock.calls[0][0].button.onClick();
      expect(mocks.navigate).toHaveBeenCalledWith('/tasks?tab=DailyPlan');
      expect(calendarPlanService.getSnapshot().reviewOpen).toBe(true);
    });

    it('a calendar opened again while Lumina works shows it, and cannot start a second run', async () => {
      givenTasks(apiTask('a'));
      const finish = slowLumina();
      const first = setup();
      await act(async () => {
        void first.result.current.plan();
      });
      first.unmount();

      const again = setup();
      expect(again.result.current.isPlanning).toBe(true);
      await act(() => again.result.current.plan());
      expect(mocks.planCalendarAI).toHaveBeenCalledTimes(1);

      // And it can be cancelled from there.
      again.result.current.cancel();
      await finish({ events: [] });
      expect(again.result.current.isPlanning).toBe(false);
    });

    it('logging out drops the run and the proposal; another user never sees it', async () => {
      givenTasks(apiTask('a'));
      mocks.planCalendarAI.mockResolvedValue({
        events: [proposal('a', at(7, 10), at(7, 11))],
      });
      const { result } = setup();
      await act(() => result.current.plan());
      expect(calendarPlanService.getSnapshot().drafts).toHaveLength(1);

      calendarPlanService.reset();
      expect(calendarPlanService.getSnapshot()).toMatchObject({
        userId: null,
        isPlanning: false,
        drafts: [],
        unplaced: [],
      });
    });
  });
});
