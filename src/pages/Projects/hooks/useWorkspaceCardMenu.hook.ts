import { useState } from 'react';
import type { WorkspaceTypes } from '../../Workspace/types/workspace.types';
import { useProjectDocActions } from './useProjectDocActions.hook';

export const useWorkspaceCardMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceTypes | null>(null);
  const [showPaletteInMenu, setShowPaletteInMenu] = useState(false);

  const docActions = useProjectDocActions();

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    workspace: WorkspaceTypes,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedWorkspace(workspace);
    setShowPaletteInMenu(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWorkspace(null);
    setShowPaletteInMenu(false);
  };

  const handleSetBackground = async (color: string) => {
    if (!selectedWorkspace) return;
    await docActions.setBackgroundColor(selectedWorkspace.id, color);
    handleMenuClose();
  };

  const handleRemoveBackground = async () => {
    if (!selectedWorkspace) return;
    await docActions.removeBackgroundColor(selectedWorkspace.id);
    handleMenuClose();
  };

  const handleUnlinkTask = async (workspace: WorkspaceTypes) => {
    await docActions.unlinkTask(workspace);
  };

  return {
    state: {
      anchorEl,
      selectedWorkspace,
      showPaletteInMenu,
      isMenuOpen: Boolean(anchorEl),
    },
    actions: {
      handleMenuOpen,
      handleMenuClose,
      handleSetBackground,
      handleRemoveBackground,
      handleUnlinkTask,
      setShowPaletteInMenu,
    },
  };
};
