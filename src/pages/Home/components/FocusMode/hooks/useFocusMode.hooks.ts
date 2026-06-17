import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import type { TaskStatus } from '@/redux/tasks/task.types';
import { useFocusModeTimer } from './useFocusModeTimer.hook';
import { useFocusModeTasks } from './useFocusModeTasks.hook';
import { useFocusModeActions } from './useFocusModeActions.hook';
import { useFocusModeUI } from './useFocusModeUI.hook';
import type { FocusModeProps } from '../FocusMode.types';

export const useFocusMode = ({
  open,
  task,
  onClose,
  onActiveChange,
}: FocusModeProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem('focus_mode_is_active') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('focus_mode_is_active', String(isActive));
  }, [isActive]);

  const tasks = useFocusModeTasks({
    initialTask: task,
  });

  const ui = useFocusModeUI();

  const actions = useFocusModeActions({
    userId: user?.id,
    onSessionComplete: () => {
      setIsActive(false);
      ui.setIsSessionCompleted(true);
    },
  });

  const initialMinutes = tasks.activeItem?.estimate_timer || 25;
  const timer = useFocusModeTimer({
    initialMinutes,
    isActive,
    setIsActive,
    onComplete: () => {
      setIsActive(false);
      ui.setIsSessionCompleted(true);
    },
    onTick: (secondsPassed) => {
      tasks.setActiveTask((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          real_timer: (prev.real_timer || 0) + secondsPassed / 60,
        };
      });
    },
  });

  useEffect(() => {
    if (open) {
      ui.setViewMode('full');
      ui.setIsSessionCompleted(false);
      const totalSeconds = initialMinutes * 60;
      timer.setTimeLeft(totalSeconds);
      localStorage.setItem('focus_mode_time_left', totalSeconds.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMinutes]);

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  const handleCloseRequest = () => {
    ui.setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    ui.setShowExitConfirmation(false);
    setIsActive(false);

    localStorage.removeItem('focus_mode_open');
    localStorage.removeItem('focus_mode_task');
    localStorage.removeItem('focus_mode_time_left');
    localStorage.removeItem('focus_mode_is_active');
    localStorage.removeItem('focus_mode_view');

    onClose();
  };

  const handleCompleteTask = async () => {
    if (!tasks.activeTask) return;
    await actions.handleCompleteTask(tasks.activeTask);
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
    },
    timer: {
      timeLeft: timer.timeLeft,
      setTimeLeft: timer.setTimeLeft,
      progress: timer.progress,
      formatTime: timer.formatTime,
      isActive,
      setIsActive,
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
