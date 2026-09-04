import { useCallback, useState, useMemo, useRef } from 'react';
import type { UseTaskDetailModalProps } from '../types/TaskDetailModal.types';
import { useTaskFormState } from './useTaskFormState';
import { useTaskCollections } from './useTaskCollections';
import { useTaskMutations } from './useTaskMutations';
import { useSearchParams } from 'react-router-dom';
import { getTimerSuggestions, formatDuration } from '../TaskDetailModal.utils';
import { sileo, getFriendlyErrorMessage } from '@/utils';
import { useAppSelector } from '@/redux/hooks';

export const useTaskDetailModal = ({
  onSave,
  onClose,
  onDelete,
  initialStart,
  initialEnd,
  initialTask,
}: UseTaskDetailModalProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const isReadOnly = useMemo(() => {
    if (!initialTask) return false;
    if (!user) return true;

    if (initialTask.is_owner !== undefined) {
      return !initialTask.is_owner;
    }

    // Check Focusly task ownership
    if (initialTask.user_id && initialTask.user_id !== user.id) {
      return true;
    }

    return false;
  }, [initialTask, user]);

  const {
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
    validateForm,
    initialState,
    timeSlotDisplay,
  } = useTaskFormState({ initialStart, initialEnd, initialTask });
  const [shouldGenerateMeet, setShouldGenerateMeet] = useState(false);

  const resetFormRef = useRef<() => void>(() => {});

  const mutations = useTaskMutations({
    onSave,
    onClose,
    onDelete,
    initialTask,
    resetForm: () => resetFormRef.current(),
  });

  const {
    tags,
    setTags,
    links,
    setLinks,
    newTag,
    setNewTag,
    isAddingTag,
    setIsAddingTag,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    isAddingLink,
    setIsAddingLink,
    handleAddTag,
    handleAddLink,
    handleRemoveLink,
    handleUpdateLink,
    collaborators,
    setCollaborators,
    handleAddCollaborator,
    handleRemoveCollaborator,
    timeLogs,
    setTimeLogs,
    handleAddTimeLog,
    handleRemoveTimeLog,
    initialCollections,
  } = useTaskCollections({
    initialTask,
    onAddLink: (updatedLinks: { title: string; url: string }[]) => {
      if (initialTask?.id) {
        mutations.handleUpdate(
          {
            title,
            description,
            priority,
            status,
            category,
            deadline: currentDate,
            duration,
            realTime,
            tags,
            links: updatedLinks,
            color,
          },
          false,
        );
      }
    },
    onRemoveLink: (updatedLinks: { title: string; url: string }[]) => {
      if (initialTask?.id) {
        mutations.handleUpdate(
          {
            title,
            description,
            priority,
            status,
            category,
            deadline: currentDate,
            duration,
            realTime,
            tags,
            links: updatedLinks,
            color,
          },
          false,
        );
      }
    },
    onAddTimeLog: (updatedTimeLogs: { date: string; minutes: number }[]) => {
      const minutesSum = updatedTimeLogs.reduce((s, e) => s + e.minutes, 0);
      const nextRealTime = formatDuration(minutesSum);
      setRealTime(nextRealTime);
      if (initialTask?.id) {
        mutations.handleUpdate(
          {
            title,
            description,
            priority,
            status,
            category,
            deadline: currentDate,
            duration,
            realTime: nextRealTime,
            tags,
            time_logs: updatedTimeLogs,
            color,
          },
          false,
        );
      }
    },
    onRemoveTimeLog: (updatedTimeLogs: { date: string; minutes: number }[]) => {
      const minutesSum = updatedTimeLogs.reduce((s, e) => s + e.minutes, 0);
      const nextRealTime = formatDuration(minutesSum);
      setRealTime(nextRealTime);
      if (initialTask?.id) {
        mutations.handleUpdate(
          {
            title,
            description,
            priority,
            status,
            category,
            deadline: currentDate,
            duration,
            realTime: nextRealTime,
            tags,
            time_logs: updatedTimeLogs,
            color,
          },
          false,
        );
      }
    },
  });

  const resetForm = useCallback(() => {
    setTitle(initialState.title);
    setDescription(initialState.description);
    setPriority(initialState.priority);
    setCategory(initialState.category);
    setCurrentDate(initialState.currentDate);
    setDuration(initialState.duration);
    setColor(initialState.color);
    setRealTime(initialState.realTime);
    setStatus(initialState.status);

    setTags(initialCollections.tags);
    setLinks(initialCollections.links);
    setCollaborators(initialCollections.collaborators);
    setTimeLogs(initialCollections.timeLogs);
    setNewTag('');
    setIsAddingTag(false);
    setIsAddingLink(false);
    setErrors({});
  }, [
    initialState,
    initialCollections,
    setTitle,
    setDescription,
    setPriority,
    setCategory,
    setCurrentDate,
    setDuration,
    setColor,
    setRealTime,
    setStatus,
    setTags,
    setLinks,
    setCollaborators,
    setTimeLogs,
    setNewTag,
    setIsAddingTag,
    setIsAddingLink,
    setErrors,
  ]);

  resetFormRef.current = resetForm;

  const mutationsWithReset = { ...mutations, resetForm };

  const handleSaveWrapper = async (shouldClose = true) => {
    if (!validateForm()) return;
    await mutationsWithReset.handleSave({
      title,
      description,
      priority,
      status,
      category,
      deadline: currentDate,
      duration,
      realTime,
      tags,
      links,
      collaborators,
      time_logs: timeLogs,
      color,
      shouldGenerateMeet,
    });
    if (shouldClose) onClose();
  };

  const handleUpdateWrapper = async (shouldClose = true) => {
    if (!validateForm()) return;
    await mutationsWithReset.handleUpdate(
      {
        title,
        description,
        priority,
        status,
        category,
        deadline: currentDate,
        duration,
        realTime,
        tags,
        links,
        collaborators,
        time_logs: timeLogs,
        color,
        shouldGenerateMeet,
      },
      shouldClose,
    );
  };

  const createURLWorkSpace = (workspaceId: string): void => {
    if (workspaceId) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'Projects');
      newParams.set('workspaceId', workspaceId);
      newParams.delete('taskId');
      setSearchParams(newParams);
    }
  };

  const [isGeneratingMeet, setIsGeneratingMeet] = useState(false);

  const handleGenerateMeet = async () => {
    setIsGeneratingMeet(true);
    try {
      const meetUrl = await mutationsWithReset.generateMeetLinkNow(undefined, {
        title,
        description,
        deadline: currentDate ?? undefined,
        duration,
        collaborators,
      });
      if (meetUrl?.meetLink) {
        handleAddLink('Google Meet', meetUrl.meetLink);
        if (initialTask?.id && !initialTask.id.startsWith('temp-')) {
          setShouldGenerateMeet(true);
        }
        sileo.success({
          title: 'Google Meet link generated!',
          description: 'Link added to resources.',
          fill: 'var(--sileo-success-bg)',
        });
      } else {
        sileo.error({
          title: 'Could not generate Meet link',
          description: 'Make sure you are signed in with Google.',
          fill: 'var(--sileo-error-bg)',
        });
      }
    } catch (error) {
      console.error('Error generating Meet link:', error);
      sileo.error({
        title: getFriendlyErrorMessage(error, 'Error generating Meet link'),
        fill: 'var(--sileo-error-bg)',
      });
    } finally {
      setIsGeneratingMeet(false);
    }
  };

  const handleTimerChange = (
    value: string,
    setter: (v: string) => void,
    setSuggestions: (s: string[]) => void,
    setAnchor: (el: HTMLDivElement | null) => void,
    target: HTMLDivElement,
  ) => {
    setter(value);
    const suggestions = getTimerSuggestions(value);
    setSuggestions(suggestions);
    setAnchor(suggestions.length > 0 ? target : null);
  };

  const hasMeetLink =
    shouldGenerateMeet ||
    links.some(
      (l) =>
        l.url.includes('meet.google.com') ||
        l.title.toLowerCase().includes('google meet') ||
        l.url.includes('hangouts'),
    );

  const isDirty = useMemo(() => {
    if (!initialTask) return false;

    const simpleFields = [
      { current: title, initial: initialState.title },
      { current: description, initial: initialState.description },
      { current: priority, initial: initialState.priority },
      { current: status, initial: initialState.status },
      { current: category, initial: initialState.category },
      { current: duration, initial: initialState.duration },
      { current: realTime, initial: initialState.realTime },
      { current: color, initial: initialState.color },
    ];

    if (simpleFields.some(({ current, initial }) => current !== initial)) {
      return true;
    }

    const initialDateVal =
      initialState.currentDate instanceof Date
        ? initialState.currentDate.getTime()
        : initialState.currentDate
          ? new Date(initialState.currentDate).getTime()
          : 0;
    const currentDateVal =
      currentDate instanceof Date
        ? currentDate.getTime()
        : currentDate
          ? new Date(currentDate).getTime()
          : 0;
    if (initialDateVal !== currentDateVal) return true;

    if (tags.length !== initialCollections.tags.length) return true;
    const initialTagsSorted = [...initialCollections.tags].sort();
    const currentTagsSorted = [...tags].sort();
    if (JSON.stringify(initialTagsSorted) !== JSON.stringify(currentTagsSorted))
      return true;

    if (links.length !== initialCollections.links.length) return true;
    if (
      links.some(
        (l, i) =>
          l.title !== initialCollections.links[i]?.title ||
          l.url !== initialCollections.links[i]?.url,
      )
    )
      return true;

    if (collaborators.length !== initialCollections.collaborators.length)
      return true;
    if (
      collaborators.some(
        (c, i) =>
          c.email !== initialCollections.collaborators[i]?.email ||
          c.name !== initialCollections.collaborators[i]?.name,
      )
    )
      return true;

    if (timeLogs.length !== initialCollections.timeLogs.length) return true;
    if (
      timeLogs.some(
        (tl, i) =>
          tl.date !== initialCollections.timeLogs[i]?.date ||
          tl.minutes !== initialCollections.timeLogs[i]?.minutes,
      )
    )
      return true;

    return false;
  }, [
    initialTask,
    title,
    initialState,
    description,
    priority,
    status,
    category,
    currentDate,
    duration,
    realTime,
    color,
    tags,
    initialCollections,
    links,
    collaborators,
    timeLogs,
  ]);

  return {
    isReadOnly,
    isDirty,
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
    validateForm,
    timeSlotDisplay,
    tags,
    setTags,
    links,
    setLinks,
    newTag,
    setNewTag,
    isAddingTag,
    setIsAddingTag,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    isAddingLink,
    setIsAddingLink,
    handleAddTag,
    handleAddLink,
    handleRemoveLink,
    handleUpdateLink,
    collaborators,
    handleAddCollaborator,
    handleRemoveCollaborator,
    timeLogs,
    handleAddTimeLog,
    handleRemoveTimeLog,
    ...mutationsWithReset,
    handleSave: handleSaveWrapper,
    handleUpdate: handleUpdateWrapper,
    resetForm,
    createURLWorkSpace,
    shouldGenerateMeet,
    setShouldGenerateMeet,
    isGeneratingMeet,
    handleGenerateMeet,
    handleTimerChange,
    hasMeetLink,
  };
};
