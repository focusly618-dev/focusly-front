import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';

// "Optimizar agenda" outside the calendar's lifetime: Lumina keeps working
// when the user opens another tab of the app, and the proposed blocks wait
// for them. The calendar only shows this state (useSyncExternalStore).

/** What a run is doing, shown as steps while the user waits. */
export type PlanPhase = 'tasks' | 'slots' | 'thinking' | 'checking';

export interface UnplacedTask {
  id: string;
  title: string;
}

export interface CalendarPlanState {
  /** Whose proposal this is (another login never sees it). */
  userId: string | null;
  isPlanning: boolean;
  phase: PlanPhase | null;
  /** When the run started (ms), for the elapsed time. */
  startedAt: number | null;
  /** Lumina's proposed blocks, until confirmed or discarded. */
  drafts: ICalendarEvent[];
  /** Drafts the user unchecked: shown in the review, not scheduled. */
  excluded: string[];
  /** Tasks Lumina had no room for. */
  unplaced: UnplacedTask[];
  /** The review dialog is open (closed: the proposal waits on the calendar). */
  reviewOpen: boolean;
}

const INITIAL: CalendarPlanState = {
  userId: null,
  isPlanning: false,
  phase: null,
  startedAt: null,
  drafts: [],
  excluded: [],
  unplaced: [],
  reviewOpen: false,
};

export interface PlanResult {
  drafts: ICalendarEvent[];
  unplaced: UnplacedTask[];
}

/** The work a run does: the proposal, or null when there's none. */
export type PlanJob = (
  signal: AbortSignal,
  setPhase: (phase: PlanPhase) => void,
) => Promise<PlanResult | null>;

class CalendarPlanService {
  private state: CalendarPlanState = INITIAL;
  private listeners = new Set<() => void>();
  private abort: AbortController | null = null;
  private calendarsOpen = 0;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  private set(patch: Partial<CalendarPlanState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  /** The calendar is on screen (see isCalendarOpen). */
  attachCalendar() {
    this.calendarsOpen++;
    return () => {
      this.calendarsOpen--;
    };
  }

  /** False when the user is on another tab of the app. */
  isCalendarOpen() {
    return this.calendarsOpen > 0;
  }

  /**
   * Runs Lumina's planning, once at a time (a second click, or a click from
   * a calendar opened again meanwhile, waits for the same run).
   */
  async run(userId: string, job: PlanJob): Promise<void> {
    if (this.state.isPlanning) return;
    const abort = new AbortController();
    this.abort = abort;
    this.set({
      isPlanning: true,
      userId,
      phase: 'tasks',
      startedAt: Date.now(),
    });
    const setPhase = (phase: PlanPhase) => {
      if (this.abort === abort) this.set({ phase });
    };
    try {
      const result = await job(abort.signal, setPhase);
      if (result && !abort.signal.aborted && this.state.userId === userId) {
        this.set({
          drafts: result.drafts,
          unplaced: result.unplaced,
          excluded: [],
          reviewOpen: result.drafts.length > 0,
        });
      }
    } finally {
      if (this.abort === abort) this.abort = null;
      this.set({ isPlanning: false, phase: null, startedAt: null });
    }
  }

  cancel() {
    this.abort?.abort();
  }

  setDrafts(update: (drafts: ICalendarEvent[]) => ICalendarEvent[]) {
    const drafts = update(this.state.drafts);
    const ids = new Set(drafts.map((d) => d.id));
    this.set({
      drafts,
      excluded: this.state.excluded.filter((id) => ids.has(id)),
    });
  }

  /** Checks or unchecks a proposed block. */
  toggleExcluded(id: string) {
    const excluded = this.state.excluded.includes(id)
      ? this.state.excluded.filter((x) => x !== id)
      : [...this.state.excluded, id];
    this.set({ excluded });
  }

  clearDrafts() {
    this.set({ drafts: [], excluded: [], unplaced: [], reviewOpen: false });
  }

  /** Back to the review (from the bar over the calendar, or the toast). */
  openReview() {
    if (this.state.drafts.length > 0) this.set({ reviewOpen: true });
  }

  /** Looks at the calendar for a while: the blocks stay proposed. */
  closeReview() {
    this.set({ reviewOpen: false });
  }

  /** Logout or another user: nothing of the previous one stays. */
  reset() {
    this.abort?.abort();
    this.abort = null;
    this.set(INITIAL);
  }
}

export const calendarPlanService = new CalendarPlanService();
