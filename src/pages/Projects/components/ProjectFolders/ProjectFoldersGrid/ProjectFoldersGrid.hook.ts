import { useState } from 'react';
import type { ProjectGroupTypes } from '@/pages/Workspace/workspace.types';

export const useProjectFoldersGrid = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroupTypes | null>(
    null,
  );
  const [groupsToDelete, setGroupsToDelete] = useState<ProjectGroupTypes[]>([]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const openCustomize = (group: ProjectGroupTypes) => {
    setSelectedGroup(group);
    setIsCustomizeOpen(true);
  };
  const closeCustomize = () => {
    setIsCustomizeOpen(false);
    setSelectedGroup(null);
  };

  const openDelete = (groups: ProjectGroupTypes | ProjectGroupTypes[]) => {
    setGroupsToDelete(Array.isArray(groups) ? groups : [groups]);
  };
  const closeDelete = () => setGroupsToDelete([]);

  return {
    state: {
      isCreateOpen,
      isCustomizeOpen,
      isDeleteOpen: groupsToDelete.length > 0,
      selectedGroup,
      groupsToDelete,
    },
    actions: {
      openCreate,
      closeCreate,
      openCustomize,
      closeCustomize,
      openDelete,
      closeDelete,
    },
  };
};
