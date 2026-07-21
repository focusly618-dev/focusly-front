import { useCallback, useState, useMemo } from 'react';
import type { UseTaskDetailModalProps } from '../types/TaskDetailModal.types';
import { useTaskFormState } from './useTaskFormState';
import { useTaskCollections } from './useTaskCollections';
import { useTaskMutations } from './useTaskMutations';
import { useSearchParams } from 'react-router-dom';
import { getTimerSuggestions } from '../TaskDetailModal.utils';
import { sileo } from '@/utils';
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

  const mutations = useTaskMutations({
    onSave,
    onClose,
    onDelete,
    initialTask,
    resetForm: () => {},
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
    setNewTag('');
    setIsAddingTag(false);
    setIsAddingLink(false);
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
    setNewTag,
    setIsAddingTag,
    setIsAddingLink,
  ]);

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
        color,
        shouldGenerateMeet,
      },
      shouldClose,
    );
  };

  const createURLWorkSpace = (workspaceId: string): void => {
    if (workspaceId) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'Workspace');
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
      });
      if (meetUrl) {
        handleAddLink('Google Meet', meetUrl);
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
    } catch {
      sileo.error({
        title: 'Error generating Meet link',
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

    const isTitleChanged = title !== initialState.title;
    const isDescChanged = description !== initialState.description;
    const isPriorityChanged = priority !== initialState.priority;
    const isStatusChanged = status !== initialState.status;
    const isCategoryChanged = category !== initialState.category;

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
    const isDateChanged = initialDateVal !== currentDateVal;

    const isDurationChanged = duration !== initialState.duration;
    const isRealTimeChanged = realTime !== initialState.realTime;
    const isColorChanged = color !== initialState.color;

    const initialTagsSorted = [...initialCollections.tags].sort();
    const currentTagsSorted = [...tags].sort();
    const isTagsChanged =
      JSON.stringify(initialTagsSorted) !== JSON.stringify(currentTagsSorted);

    const isLinksChanged =
      links.length !== initialCollections.links.length ||
      links.some(
        (l, i) =>
          l.title !== initialCollections.links[i]?.title ||
          l.url !== initialCollections.links[i]?.url,
      );

    const isCollaboratorsChanged =
      collaborators.length !== initialCollections.collaborators.length ||
      collaborators.some(
        (c, i) =>
          c.email !== initialCollections.collaborators[i]?.email ||
          c.name !== initialCollections.collaborators[i]?.name,
      );

    return (
      isTitleChanged ||
      isDescChanged ||
      isPriorityChanged ||
      isStatusChanged ||
      isCategoryChanged ||
      isDateChanged ||
      isDurationChanged ||
      isRealTimeChanged ||
      isColorChanged ||
      isTagsChanged ||
      isLinksChanged ||
      isCollaboratorsChanged
    );
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
