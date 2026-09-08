import { useState, useCallback, useMemo } from 'react';
import type { Subtask } from '@/redux/tasks/task.types';
import {
  deduplicateLinks,
  normalizeUrl,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { UseTaskCollectionsProps } from '../types/TaskDetailModal.types';

export const useTaskCollections = ({
  initialTask,
  onAddLink,
  onRemoveLink,
  onAddTimeLog,
  onRemoveTimeLog,
  onSubtasksChange,
}: UseTaskCollectionsProps) => {
  const getInitialCollectionState = useCallback(() => {
    const defaults = {
      tags: [] as string[],
      links: [] as { title: string; url: string }[],
      collaborators: [] as { name: string; email: string; avatar?: string }[],
      timeLogs: [] as { date: string; minutes: number }[],
      subtasks: [] as Subtask[],
    };

    if (!initialTask) return defaults;

    const {
      tags = [],
      links = [],
      collaborators = [],
      time_logs = [],
      subtasks = [],
    } = initialTask;

    const parsedTags = Array.isArray(tags)
      ? tags.map((t) => (typeof t === 'string' ? t : t.name))
      : [];

    const parsedLinks = Array.isArray(links)
      ? deduplicateLinks(links.map((l) => ({ ...l })))
      : [];

    const parsedCollaborators = Array.isArray(collaborators)
      ? collaborators.map((c) => ({ ...c }))
      : [];

    const parsedTimeLogs = Array.isArray(time_logs)
      ? time_logs.map((tl) => ({ ...tl }))
      : [];

    const parsedSubtasks = Array.isArray(subtasks)
      ? subtasks.map((s) => ({ ...s }))
      : [];

    return {
      tags: parsedTags,
      links: parsedLinks,
      collaborators: parsedCollaborators,
      timeLogs: parsedTimeLogs,
      subtasks: parsedSubtasks,
    };
  }, [initialTask]);

  const initialCollections = useMemo(
    () => getInitialCollectionState(),
    [getInitialCollectionState],
  );

  const [tags, setTags] = useState<string[]>(initialCollections.tags);
  const [links, setLinks] = useState<{ title: string; url: string }[]>(
    initialCollections.links,
  );
  const [collaborators, setCollaborators] = useState<
    { name: string; email: string; avatar?: string }[]
  >(initialCollections.collaborators);
  const [timeLogs, setTimeLogs] = useState<{ date: string; minutes: number }[]>(
    initialCollections.timeLogs,
  );
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    initialCollections.subtasks,
  );
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  const handleAddTag = (keepOpen = false) => {
    if (newTag.trim()) {
      setTags((prev) => [...new Set([...prev, newTag.trim()])]);
      setNewTag('');
    }
    if (!keepOpen) setIsAddingTag(false);
  };

  const handleAddLink = (title: string, url: string) => {
    if (url.trim()) {
      const updatedLinks = [
        ...links,
        {
          title:
            title.trim() ||
            (url.includes('meet.google.com') ? 'Google Meet' : 'Link'),
          url: url.trim().startsWith('http')
            ? url.trim()
            : `https://${url.trim()}`,
        },
      ];
      const normNew = normalizeUrl(url.trim());
      const isDuplicate = links.some((l) => normalizeUrl(l.url) === normNew);
      if (!isDuplicate) {
        setLinks(updatedLinks);
        if (onAddLink) onAddLink(updatedLinks);
      }
      setNewLinkTitle('');
      setNewLinkUrl('');
      setIsAddingLink(false);
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    if (onRemoveLink) onRemoveLink(updatedLinks);
  };

  const handleUpdateLink = (index: number, title: string, url: string) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { title, url } : l)));
  };

  const handleAddCollaborator = (name: string, email: string) => {
    if (email.trim()) {
      setCollaborators((prev) => {
        const exists = prev.some(
          (c) => c.email.toLowerCase() === email.toLowerCase(),
        );
        if (exists) return prev;
        return [...prev, { name: name.trim(), email: email.trim() }];
      });
    }
  };

  const handleRemoveCollaborator = (index: number) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTimeLog = (date: string, minutes: number) => {
    if (minutes > 0) {
      const updatedTimeLogs = [...timeLogs, { date, minutes }];
      setTimeLogs(updatedTimeLogs);
      if (onAddTimeLog) onAddTimeLog(updatedTimeLogs);
    }
  };

  const handleRemoveTimeLog = (index: number) => {
    const updatedTimeLogs = timeLogs.filter((_, i) => i !== index);
    setTimeLogs(updatedTimeLogs);
    if (onRemoveTimeLog) onRemoveTimeLog(updatedTimeLogs);
  };

  const handleAddSubtask = (title: string, estimateTimer?: number) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newSubtask: Subtask = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: trimmed,
      completed: false,
      completed_at: null,
      estimate_timer: estimateTimer || null,
    };
    const updated = [...subtasks, newSubtask];
    setSubtasks(updated);
    if (onSubtasksChange) onSubtasksChange(updated);
    return newSubtask;
  };

  const handleToggleSubtask = (id: string) => {
    const updated = subtasks.map((s) => {
      if (s.id !== id) return s;
      const nextCompleted = !s.completed;
      return {
        ...s,
        completed: nextCompleted,
        completed_at: nextCompleted ? new Date().toISOString() : null,
      };
    });
    setSubtasks(updated);
    if (onSubtasksChange) onSubtasksChange(updated);
  };

  const handleRemoveSubtask = (id: string) => {
    const updated = subtasks.filter((s) => s.id !== id);
    setSubtasks(updated);
    if (onSubtasksChange) onSubtasksChange(updated);
  };

  const handleUpdateSubtask = (id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const updated = subtasks.map((s) =>
      s.id === id ? { ...s, title: trimmed } : s,
    );
    setSubtasks(updated);
    if (onSubtasksChange) onSubtasksChange(updated);
  };

  const handleReorderSubtasks = (reordered: Subtask[]) => {
    setSubtasks(reordered);
    if (onSubtasksChange) onSubtasksChange(reordered);
  };

  return {
    tags,
    setTags,
    links,
    setLinks,
    collaborators,
    setCollaborators,
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
    handleRemoveCollaborator,
    handleAddCollaborator,
    timeLogs,
    setTimeLogs,
    handleAddTimeLog,
    handleRemoveTimeLog,
    subtasks,
    setSubtasks,
    handleAddSubtask,
    handleToggleSubtask,
    handleRemoveSubtask,
    handleUpdateSubtask,
    handleReorderSubtasks,
    initialCollections,
  };
};
