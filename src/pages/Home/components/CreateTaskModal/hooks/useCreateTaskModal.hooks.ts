import { useCallback, useState } from 'react';
import type { UseCreateTaskModalProps } from '../types/CreateTaskModal.types';
import { useTaskFormState } from './useTaskFormState';
import { useTaskCollections } from './useTaskCollections';
import { useTaskMutations } from './useTaskMutations';
import { getTimerSuggestions } from '../CreateTaskModal.utils';
import { useToast } from '@/components/ui/Toast/useToast';

export const useCreateTaskModal = ({
  initialTask,
  parentTask,
  onSave,
  onClose,
  onDelete,
  initialStart,
  subtaskIndex,
}: UseCreateTaskModalProps) => {
  const toast = useToast();

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
    useAI,
    setUseAI,
    errors,
    handleTitleChange,
    validateForm,
    initialState,
    timeSlotDisplay,
  } = useTaskFormState({ initialStart, initialTask });
  const [shouldGenerateMeet, setShouldGenerateMeet] = useState(false);

  // Use a dummy resetForm for mutations initialization to avoid circular dependency
  const mutations = useTaskMutations({
    onSave,
    onClose,
    onDelete,
    initialTask,
    parentTask,
    subtaskIndex,
    resetForm: () => {}, // Will be overwritten or handled below
  });

  const {
    tags,
    setTags,
    subtasks,
    setSubtasks,
    links,
    setLinks,
    newTag,
    setNewTag,
    isAddingTag,
    setIsAddingTag,
    newSubtask,
    setNewSubtask,
    newSubtaskDuration,
    setNewSubtaskDuration,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    isAddingLink,
    setIsAddingLink,
    handleAddTag,
    handleAddSubtask,
    handleToggleSubtask,
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
            subtasks,
            links: updatedLinks,
            color,
            use_ai: useAI,
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
            subtasks,
            links: updatedLinks,
            color,
            use_ai: useAI,
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
    setUseAI(initialTask?.use_ai || false);

    setTags(initialCollections.tags);
    setSubtasks(initialCollections.subtasks);
    setLinks(initialCollections.links);
    setNewSubtask('');
    setNewSubtaskDuration('');
    setNewTag('');
    setIsAddingTag(false);
    setIsAddingLink(false);
  }, [
    initialState,
    initialCollections,
    initialTask,
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
    setSubtasks,
    setLinks,
    setNewSubtask,
    setNewSubtaskDuration,
    setNewTag,
    setIsAddingTag,
    setIsAddingLink,
    setUseAI,
  ]);

  const mutationsWithReset = useTaskMutations({
    onSave,
    onClose,
    onDelete,
    initialTask,
    parentTask,
    subtaskIndex,
    resetForm,
  });

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
      subtasks,
      links,
      color,
      shouldGenerateMeet,
      use_ai: useAI,
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
        subtasks,
        links,
        color,
        shouldGenerateMeet,
        use_ai: useAI,
      },
      shouldClose,
    );
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
        toast.success('Google Meet link generated!', 'Link added to resources.');
      } else {
        toast.error('Could not generate Meet link', 'Make sure you are signed in with Google.');
      }
    } catch {
      toast.error('Error generating Meet link');
    } finally {
      setIsGeneratingMeet(false);
    }
  };

  const handleTimerChange = useCallback(
    (
      value: string,
      setter: (v: string) => void,
      setSuggestions: (s: string[]) => void,
      setAnchor: (el: HTMLDivElement | null) => void,
      target: HTMLDivElement,
    ) => {
      setter(value);
      const suggestions = getTimerSuggestions(value);
      setSuggestions(suggestions);
      if (suggestions.length > 0) {
        setAnchor(target);
      } else {
        setAnchor(null);
      }
    },
    [],
  );

  const hasMeetLink =
    shouldGenerateMeet ||
    links.some(
      (l) =>
        l.url.includes('meet.google.com') ||
        l.title.toLowerCase().includes('google meet') ||
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
    useAI,
    setUseAI,
    errors,
    tags,
    setTags,
    subtasks,
    setSubtasks,
    links,
    setLinks,
    newTag,
    setNewTag,
    isAddingTag,
    setIsAddingTag,
    newSubtask,
    setNewSubtask,
    newSubtaskDuration,
    setNewSubtaskDuration,
    newLinkTitle,
    setNewLinkTitle,
    newLinkUrl,
    setNewLinkUrl,
    isAddingLink,
    setIsAddingLink,
    handleAddTag,
    handleAddSubtask,
    handleToggleSubtask,
    handleAddLink,
    handleRemoveLink,
    handleUpdateLink,
    handleSave: handleSaveWrapper,
    handleUpdate: handleUpdateWrapper,
    handleDelete: mutationsWithReset.handleDelete,
    validateForm,
    handleTitleChange,
    timeSlotDisplay,
    isGeneratingMeet,
    handleGenerateMeet,
    hasMeetLink,
    setShouldGenerateMeet,
    shouldGenerateMeet,
    loadingSave: mutationsWithReset.loadingSave,
    handleTimerChange,
  };
};
