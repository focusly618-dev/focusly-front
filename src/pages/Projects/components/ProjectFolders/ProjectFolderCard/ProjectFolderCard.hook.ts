import { useState } from 'react';
import type { ProjectGroupTypes } from '../../../Workspace/types/workspace.types';

export interface UseProjectFolderCardParams {
  group: ProjectGroupTypes;
  onCustomize?: (group: ProjectGroupTypes) => void;
  onDelete?: (group: ProjectGroupTypes) => void;
}

export const useProjectFolderCard = ({
  group,
  onCustomize,
  onDelete,
}: UseProjectFolderCardParams) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleCustomizeClick = () => {
    handleCloseMenu();
    onCustomize?.(group);
  };

  const handleDeleteClick = () => {
    handleCloseMenu();
    onDelete?.(group);
  };

  return {
    menuAnchorEl,
    isMenuOpen: Boolean(menuAnchorEl),
    handleOpenMenu,
    handleCloseMenu,
    handleCustomizeClick,
    handleDeleteClick,
  };
};
