import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/redux/hooks';
import type { Task, TaskStatus } from '@/redux/tasks/task.types';
import type { UserSettings } from '@/api/User/apiUser.types';
import { useFocusModeTimer } from './useFocusModeTimer.hook';
import { useFocusModeTasks } from './useFocusModeTasks.hook';
import { useFocusModeActions } from './useFocusModeActions.hook';
import { useFocusModeUI } from './useFocusModeUI.hook';
import {
  getElapsedMinutes,
  getUnsavedMinutes,
  type FocusSessionState,
} from '../focusSession';
import type { FocusModeProps } from '../FocusMode.types';

const isGoogleTask = (task: Task) =>
  task.source === 'google' || task.task_type === 'GoogleTask';

export const useFocusMode = ({
  open,
  task,
  onClose,
  onActiveChange,
}: FocusModeProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const tasks = useFocusModeTasks({
    initialTask: task,
  });

  const ui = useFocusModeUI();

  const actions = useFocusModeActions();

  const initialMinutes =
    tasks.activeItem?.estimate_timer ||
    (user?.settings as UserSettings | undefined)?.focusDurationPref ||
    25;

  // Minutes of a session already sent to the server, ahead of the session
  // state catching up, so two saves in a row can't log the same time twice.
  const claimedRef = useRef<{ sessionId: string; minutes: number } | null>(
    null,
  );

  /** Claims the session's unsaved minutes; null when there are none. */
  const claimMinutes = (session: FocusSessionState) => {
    const previous = claimedRef.current;
    const claimed =
      previous?.sessionId === session.sessionId ? previous.minutes : 0;
    const total = getElapsedMinutes(session);
    const minutes =
      getUnsavedMinutes(session) - Math.max(0, claimed - session.savedMinutes);
    if (minutes <= 0) return null;
    claimedRef.current = { sessionId: session.sessionId, minutes: total };
    return {
      minutes,
      total,
      release: () => {
        claimedRef.current = previous;
      },
    };
  };

  const applySavedTime = (saved: Task) => {
    tasks.setActiveTask((prev) =>
      prev
        ? { ...prev, real_timer: saved.real_timer, time_logs: saved.time_logs }
        : null,
    );
  };

  const saveProgress = async (session: FocusSessionState) => {
    const claim = claimMinutes(session);
    if (!claim || !session.taskId) return;
    const saved = await actions.logFocusTime(session.taskId, claim.minutes);
    if (!saved) {
      claim.release();
      return;
    }
    timer.markSaved(session.sessionId, claim.total);
    applySavedTime(saved);
  };

  const timer = useFocusModeTimer({
    taskId: task?.id ?? null,
    trackTime: !!task && !isGoogleTask(task),
    initialMinutes,
    onTimeUp: (ended) => {
      void saveProgress(ended);
    },
  });

  // A session of another task left with unsaved time (switched tasks, closed
  // the tab): log it now. The ref keeps StrictMode's second run from
  // logging it twice.
  const orphanHandledRef = useRef(false);
  useEffect(() => {
    if (orphanHandledRef.current) return;
    orphanHandledRef.current = true;
    const { orphan } = timer;
    if (!orphan?.taskId) return;
    const minutes = getUnsavedMinutes(orphan);
    if (minutes > 0) void actions.logFocusTime(orphan.taskId, minutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open) {
      ui.setViewMode('full');
      ui.setIsSessionCompleted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    onActiveChange?.(timer.isActive);
  }, [timer.isActive, onActiveChange]);

  const handleCloseRequest = () => {
    ui.setShowExitConfirmation(true);
  };

  const endSession = () => {
    timer.reset();

    localStorage.removeItem('focus_mode_open');
    localStorage.removeItem('focus_mode_task');
    localStorage.removeItem('focus_mode_view');

    onClose();
  };

  const confirmExit = () => {
    ui.setShowExitConfirmation(false);
    void saveProgress(timer.session);
    endSession();
  };

  const handleCompleteTask = async () => {
    const current = tasks.activeTask;
    if (!current) return;
    const { session } = timer;
    timer.pause();

    const claim = claimMinutes(session);
    const updated = await actions.handleCompleteTask(
      current,
      claim?.minutes ?? 0,
    );
    if (!updated) {
      claim?.release();
      return;
    }
    if (claim) timer.markSaved(session.sessionId, claim.total);
    applySavedTime(updated);
    tasks.setActiveTask((prev) => (prev ? { ...prev, status: 'Done' } : null));
    ui.setIsSessionCompleted(true);
  };

  const handleUpdateStatus = (newStatus: TaskStatus) => {
    if (!tasks.activeTask) return;
    actions.handleUpdateStatus(tasks.activeTask, newStatus);
    tasks.setActiveTask((prev) =>
      prev ? { ...prev, status: newStatus } : null,
    );
  };

  const handleUpdatePriority = (newPriority: number) => {
    if (!tasks.activeTask) return;
    actions.handleUpdatePriority(tasks.activeTask, newPriority);
    tasks.setActiveTask((prev) =>
      prev ? { ...prev, priority_level: newPriority } : null,
    );
  };

  return {
    ui: {
      viewMode: ui.viewMode,
      setViewMode: ui.setViewMode,
      isSidebarOpen: ui.isSidebarOpen,
      setIsSidebarOpen: ui.setIsSidebarOpen,
      showExitConfirmation: ui.showExitConfirmation,
      setShowExitConfirmation: ui.setShowExitConfirmation,
      isSessionCompleted: ui.isSessionCompleted,
      setIsSessionCompleted: ui.setIsSessionCompleted,
      position: ui.position,
      handleMouseDown: ui.handleMouseDown,
      isDragging: ui.isDragging,
      handleCloseRequest,
      confirmExit,
      endSession,
    },
    timer: {
      timeLeft: timer.timeLeft,
      addTime: timer.addTime,
      progress: timer.progress,
      formatTime: timer.formatTime,
      isActive: timer.isActive,
      setIsActive: timer.setIsActive,
    },
    tasks: {
      activeTask: tasks.activeTask,
      setActiveTask: tasks.setActiveTask,
      activeItem: tasks.activeItem,
      todaysTasks: tasks.todaysTasks,
      tasksData: tasks.tasksData,
      handleCompleteTask,
      handleUpdateStatus,
      handleUpdatePriority,
    },
  };
};
