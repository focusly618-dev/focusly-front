// A focus session's timing, kept as timestamps rather than a counter ticked
// every second: throttled background tabs and extra renders can't make it
// drift, and a reload resumes it exactly where it was.

export const FOCUS_SESSION_STORAGE_KEY = 'focus_mode_timer';

export interface FocusSessionState {
  sessionId: string;
  taskId: string | null;
  /** Whether the task can store tracked time (Google events can't). */
  trackTime: boolean;
  /** Epoch ms the session was created. */
  createdAt: number;
  /** Countdown length the session started with, in seconds. */
  plannedSeconds: number;
  /** Seconds added on top of the planned length (+5m). */
  extraSeconds: number;
  /** Milliseconds run before the current stretch. */
  accumulatedMs: number;
  /** Epoch ms the current stretch started; null while paused. */
  runningSince: number | null;
  /** Session minutes already saved to the task. */
  savedMinutes: number;
}

const newSessionId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `focus-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const createFocusSession = ({
  taskId,
  trackTime,
  plannedSeconds,
  now = Date.now(),
}: {
  taskId: string | null;
  trackTime: boolean;
  plannedSeconds: number;
  now?: number;
}): FocusSessionState => ({
  sessionId: newSessionId(),
  taskId,
  trackTime,
  createdAt: now,
  plannedSeconds,
  extraSeconds: 0,
  accumulatedMs: 0,
  runningSince: null,
  savedMinutes: 0,
});

export const getTargetMs = (session: FocusSessionState) =>
  (session.plannedSeconds + session.extraSeconds) * 1000;

/**
 * Time run so far, capped at the countdown's length: a timer left running in
 * a closed tab stops counting where it would have rung.
 */
export const getElapsedMs = (session: FocusSessionState, now = Date.now()) =>
  Math.min(
    getTargetMs(session),
    session.accumulatedMs +
      (session.runningSince === null
        ? 0
        : Math.max(0, now - session.runningSince)),
  );

export const getElapsedMinutes = (
  session: FocusSessionState,
  now = Date.now(),
) => Math.round(getElapsedMs(session, now) / 60000);

/** Whole minutes worked this session that aren't saved to the task yet. */
export const getUnsavedMinutes = (
  session: FocusSessionState,
  now = Date.now(),
) =>
  session.trackTime && session.taskId
    ? Math.max(0, getElapsedMinutes(session, now) - session.savedMinutes)
    : 0;

export const getTimeLeftSeconds = (
  session: FocusSessionState,
  now = Date.now(),
) => Math.ceil((getTargetMs(session) - getElapsedMs(session, now)) / 1000);

export const startSession = (
  session: FocusSessionState,
  now = Date.now(),
): FocusSessionState =>
  session.runningSince !== null || getTimeLeftSeconds(session, now) <= 0
    ? session
    : { ...session, runningSince: now };

export const pauseSession = (
  session: FocusSessionState,
  now = Date.now(),
): FocusSessionState =>
  session.runningSince === null
    ? session
    : {
        ...session,
        accumulatedMs: getElapsedMs(session, now),
        runningSince: null,
      };

export const readStoredSession = (): FocusSessionState | null => {
  try {
    const raw = localStorage.getItem(FOCUS_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FocusSessionState> | null;
    return parsed && typeof parsed.sessionId === 'string'
      ? (parsed as FocusSessionState)
      : null;
  } catch {
    return null;
  }
};

export const storeSession = (session: FocusSessionState) => {
  try {
    localStorage.setItem(FOCUS_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage full or blocked: the session still runs, it just won't survive a reload.
  }
};
