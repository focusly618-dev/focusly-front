import { useState, useCallback, useMemo } from 'react';
import { deduplicateLinks, normalizeUrl } from '../CreateTaskModal.utils';
import type { UseTaskCollectionsProps } from '../types/CreateTaskModal.types';

export const useTaskCollections = ({
  initialTask,
  onAddLink,
  onRemoveLink,
}: UseTaskCollectionsProps) => {
  const getInitialCollectionState = useCallback(() => {
    const defaults = {
      tags: [] as string[],
      links: [] as { title: string; url: string }[],
      collaborators: [] as { name: string; email: string; avatar?: string }[],
    };

    if (!initialTask) return defaults;

    const { tags = [], links = [], collaborators = [] } = initialTask;

    const parsedTags = Array.isArray(tags)
      ? tags.map((t) => (typeof t === 'string' ? t : t.name))
      : [];

    const parsedLinks = Array.isArray(links)
      ? deduplicateLinks(links.map((l) => ({ ...l })))
      : [];

    const parsedCollaborators = Array.isArray(collaborators)
      ? collaborators.map((c) => ({ ...c }))
      : [];

    return {
      tags: parsedTags,
      links: parsedLinks,
      collaborators: parsedCollaborators,
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
      const normNew = normalizeUrl(url.trim());
      const isDuplicate = links.some((l) => normalizeUrl(l.url) === normNew);
      if (!isDuplicate) {
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
    initialCollections,
  };
};
