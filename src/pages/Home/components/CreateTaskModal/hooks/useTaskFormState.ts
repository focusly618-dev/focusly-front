import { useState, useCallback, useMemo } from 'react';
import type { Task } from '@/redux/tasks/task.types';
import {
  getPriorityFromLevel,
  formatDuration,
  parseDuration,
} from '../CreateTaskModal.utils';
import type { PriorityType } from '../CreateTaskModal.utils';
import { addMinutes, format, isSameDay } from 'date-fns';
import type { UseTaskFormStateProps } from '../types/CreateTaskModal.types';

export const useTaskFormState = ({
  initialTask,
  initialStart,
}: UseTaskFormStateProps) => {
  const getInitialState = useCallback(() => {
    const defaults = {
      title: '',
      description: '',
      color: '#1e293b',
      priority: getPriorityFromLevel(2),
      status: 'Backlog' as Task['status'],
      category: 'General',
      currentDate: initialStart || new Date(),
      duration: '',
      realTime: '00:00',
    };

    if (!initialTask) return defaults;

    const {
      title,
      notes_encrypted = '',
      priority_level,
      status,
      category,
      deadline,
      estimate_timer,
      real_timer,
    } = initialTask;

    // Use color field directly if available, otherwise fall back to parsing from notes_encrypted
    let color = (initialTask as { color?: string }).color || '#1e293b';
    if (!color) {
      const colorMatch = notes_encrypted.match(/\[COLOR:(.*?)\]/);
      if (colorMatch && colorMatch[1]) {
        color = colorMatch[1];
      }
    }

    const cleanDesc = notes_encrypted
      .replace(/\[START_DATE:(.*?)\]/g, '')
      .replace(/\[COLOR:(.*?)\]/g, '')
      .replace(
        /https?:\/\/(www\.)?(calendar\.google\.com|google\.com\/calendar|meet\.google\.com)[^\s]*/g,
        '',
      )
      .trim();

    return {
      title,
      description: cleanDesc,
      color,
      priority: getPriorityFromLevel(priority_level),
      status,
      category,
      currentDate: new Date(deadline),
      duration: estimate_timer ? formatDuration(estimate_timer) : '',
      realTime: real_timer ? formatDuration(real_timer) : '',
    };
  }, [initialTask, initialStart]);

  const initialState = useMemo(() => getInitialState(), [getInitialState]);

  const [title, setTitle] = useState(initialState.title);
  const [description, setDescription] = useState(initialState.description);
  const [priority, setPriority] = useState<PriorityType>(initialState.priority);
  const [status, setStatus] = useState<Task['status']>(initialState.status);
  const [category, setCategory] = useState(initialState.category);
  const [currentDate, setCurrentDate] = useState<Date | null>(
    initialState.currentDate,
  );
  const [duration, setDuration] = useState(initialState.duration);
  const [realTime, setRealTime] = useState(initialState.realTime);
  const [color, setColor] = useState(initialState.color);
  const [errors, setErrors] = useState<{ title?: string; duration?: string }>(
    {},
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const isValidDurationInput = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return true;
    return /^(?:\d{1,3}(?:h|m)?|\d{1,3}h\s*\d{1,3}m)$/i.test(trimmed);
  };

  const handleDurationChange = (value: string) => {
    const trimmedValue = value.replace(/\s+/g, '').trim();

    setDuration(trimmedValue);
    const newErrors: { title?: string; duration?: string } = { ...errors };

    if (!trimmedValue) {
      delete newErrors.duration;
      setErrors(newErrors);
      return;
    }

    if (!isValidDurationInput(trimmedValue)) {
      newErrors.duration = 'Use formats like 30m, 2h, or 2h30m';
      setErrors(newErrors);
      return;
    }

    const durationMinutes = parseDuration(trimmedValue);
    if (durationMinutes > 0 && durationMinutes < 15) {
      newErrors.duration = 'Duration must be at least 15 minutes';
    } else {
      delete newErrors.duration;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: { title?: string; duration?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!duration.trim()) {
      newErrors.duration = 'Duration is required';
      isValid = false;
    } else {
      const durationMinutes = parseDuration(duration);
      if (!isValidDurationInput(duration) || durationMinutes < 15) {
        newErrors.duration = 'Duration must be at least 15 minutes';
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const timeSlotDisplay = useMemo(() => {
    if (!currentDate || Number.isNaN(currentDate.getTime())) return '';

    const mins = parseDuration(duration) || 25;
    const endDate = addMinutes(currentDate, mins);

    if (Number.isNaN(endDate.getTime())) return '';

    const sameDay = isSameDay(currentDate, endDate);
    const startLabel = format(currentDate, 'hh:mm a');
    const endLabel = format(endDate, 'hh:mm a');

    if (sameDay) {
      return `${startLabel} - ${endLabel}`;
    }

    return `${startLabel} - ${endLabel} • ${format(endDate, 'MMM d')}`;
  }, [currentDate, duration]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status,
    setStatus,
    category,
    setCategory,
    currentDate,
    setCurrentDate,
    duration,
    setDuration,
    realTime,
    setRealTime,
    color,
    setColor,
    errors,
    setErrors,
    handleTitleChange,
    handleDurationChange,
    validateForm,
    initialState,
    timeSlotDisplay,
  };
};
