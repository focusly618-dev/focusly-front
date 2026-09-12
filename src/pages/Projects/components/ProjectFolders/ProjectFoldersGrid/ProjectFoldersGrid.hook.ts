import { useState } from 'react';
import type { ProjectGroupTypes } from '../../../Workspace/types/workspace.types';

export const useProjectFoldersGrid = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroupTypes | null>(
    null,
  );

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

  const openDelete = (group: ProjectGroupTypes) => {
    setSelectedGroup(group);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => {
    setIsDeleteOpen(false);
    setSelectedGroup(null);
  };

  return {
    state: {
      isCreateOpen,
      isCustomizeOpen,
      isDeleteOpen,
      selectedGroup,
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
