import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createFocusSession,
  getElapsedMs,
  getTargetMs,
  getTimeLeftSeconds,
  pauseSession,
  readStoredSession,
  startSession,
  storeSession,
  type FocusSessionState,
} from '../focusSession';

interface UseFocusModeTimerProps {
  taskId: string | null;
  trackTime: boolean;
  initialMinutes: number;
  /** Called once when the countdown reaches zero, with the stopped session. */
  onTimeUp: (session: FocusSessionState) => void;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const useFocusModeTimer = ({
  taskId,
  trackTime,
  initialMinutes,
  onTimeUp,
}: UseFocusModeTimerProps) => {
  const [session, setSession] = useState<FocusSessionState>(() => {
    const stored = readStoredSession();
    return stored && stored.taskId === taskId
      ? stored
      : createFocusSession({
          taskId,
          trackTime,
          plannedSeconds: initialMinutes * 60,
        });
  });
  // A stored session of another task, cut short by switching tasks or by
  // closing the tab. The caller saves its time.
  const [orphan] = useState<FocusSessionState | null>(() => {
    const stored = readStoredSession();
    return stored && stored.taskId !== taskId ? stored : null;
  });
  const [now, setNow] = useState(() => Date.now());

  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  });

  useEffect(() => {
    storeSession(session);
  }, [session]);

  const isActive = session.runningSince !== null;

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (getTimeLeftSeconds(session, t) > 0) return;
      clearInterval(interval);
      const ended = pauseSession(session, t);
      setSession(ended);
      onTimeUpRef.current(ended);
    }, 250);
    return () => clearInterval(interval);
  }, [isActive, session]);

  const start = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setSession((s) => startSession(s, t));
  }, []);

  const pause = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setSession((s) => pauseSession(s, t));
  }, []);

  const setIsActive = useCallback(
    (active: boolean) => (active ? start() : pause()),
    [start, pause],
  );

  const addTime = useCallback((seconds: number) => {
    setSession((s) => ({ ...s, extraSeconds: s.extraSeconds + seconds }));
  }, []);

  /** Records that the session's first `minutes` are saved to the task. */
  const markSaved = useCallback((sessionId: string, minutes: number) => {
    setSession((s) =>
      s.sessionId === sessionId
        ? { ...s, savedMinutes: Math.max(s.savedMinutes, minutes) }
        : s,
    );
  }, []);

  const reset = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setSession(
      createFocusSession({
        taskId,
        trackTime,
        plannedSeconds: initialMinutes * 60,
        now: t,
      }),
    );
  }, [taskId, trackTime, initialMinutes]);

  const targetMs = getTargetMs(session);
  const timeLeft = getTimeLeftSeconds(session, now);
  const progress =
    targetMs === 0
      ? 0
      : Math.min((getElapsedMs(session, now) / targetMs) * 100, 100);

  return {
    session,
    orphan,
    timeLeft,
    progress,
    formatTime,
    isActive,
    setIsActive,
    pause,
    addTime,
    markSaved,
    reset,
  };
};
