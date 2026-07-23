import { useCallback, useState } from 'react';
import type { UseCreateTaskModalProps } from '../types/CreateTaskModal.types';
import { useTaskFormState } from './useTaskFormState';
import { useTaskCollections } from './useTaskCollections';
import { useTaskMutations } from './useTaskMutations';
import { useSearchParams } from 'react-router-dom';
import { getTimerSuggestions } from '../CreateTaskModal.utils';
import { sileo } from '@/utils';

export const useCreateTaskModal = ({
  onSave,
  onClose,
  onDelete,
  initialStart,
  initialEnd,
  initialTask,
}: UseCreateTaskModalProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
    collaborators,
    setCollaborators,
    handleAddCollaborator,
    handleRemoveCollaborator,
    handleTitleChange,
    handleDurationChange,
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
    setNewTag,
    setIsAddingTag,
    setIsAddingLink,
  ]);

  const mutationsWithReset = { ...mutations, resetForm };

  const handleSaveWrapper = async () => {
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
  };

  const handleUpdateWrapper = async () => {
    if (!validateForm()) return;
    await mutationsWithReset.handleUpdate({
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
        deadline: currentDate ?? null,
        duration,
        priority,
        category,
        tags,
        collaborators,
        color,
      });
      if (meetUrl?.meetLink) {
        handleAddLink('Google Meet', meetUrl.meetLink);
        setShouldGenerateMeet(true);
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

    if (setter === setDuration) {
      handleDurationChange(value);
    }
  };

  const hasMeetLink =
    shouldGenerateMeet ||
    links.some(
      (l) =>
        l.url.includes('meet.google.com') ||
        l.title.includes('Google Meet') ||
        l.url.includes('hangouts'),
    );

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
    ...mutationsWithReset,
    handleSave: handleSaveWrapper,
    handleUpdate: handleUpdateWrapper,
    resetForm,
    createURLWorkSpace,
    shouldGenerateMeet,
    setShouldGenerateMeet,
    isGeneratingMeet,
    handleGenerateMeet,
    collaborators,
    setCollaborators,
    handleAddCollaborator,
    handleRemoveCollaborator,
    handleTimerChange,
    hasMeetLink,
  };
};
