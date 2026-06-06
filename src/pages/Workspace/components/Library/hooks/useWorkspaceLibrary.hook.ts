import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_WORKSPACES,
  GET_FOLDERS,
  CREATE_FOLDER,
  UPDATE_WORKSPACE,
  UPDATE_FOLDER,
  DELETE_FOLDER,
} from '../../../workspaces.graphql';
import type {
  WorkspaceTypes,
  FolderTypes,
} from '../../../types/workspace.types';
import { sileo } from '@/utils/sileo';

export const useWorkspaceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<'workspace' | 'folder'>(
    'workspace',
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [folderAnchorEl, setFolderAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceTypes | null>(null);
  const [selectedFolderToManage, setSelectedFolderToManage] =
    useState<FolderTypes | null>(null);
  const [isUpdateFolderModalOpen, setIsUpdateFolderModalOpen] = useState(false);
  const [isAllFoldersModalOpen, setIsAllFoldersModalOpen] = useState(false);
  const [showPaletteInMenu, setShowPaletteInMenu] = useState(false);

  // Queries
  const { data, loading, error } = useQuery(GET_WORKSPACES, {
    variables: { search: searchMode === 'workspace' ? searchTerm : '' },
  });

  const {
    data: foldersData,
    loading: foldersLoading,
    error: foldersError,
  } = useQuery(GET_FOLDERS);

  // Mutations
  const [createFolder] = useMutation(CREATE_FOLDER, {
    refetchQueries: [{ query: GET_FOLDERS }],
  });

  const [updateFolder] = useMutation(UPDATE_FOLDER, {
    refetchQueries: [{ query: GET_FOLDERS }, { query: GET_WORKSPACES }],
  });

  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    refetchQueries: [{ query: GET_FOLDERS }, { query: GET_WORKSPACES }],
  });

  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE, {
    refetchQueries: [{ query: GET_WORKSPACES }, { query: GET_FOLDERS }],
  });

  // Handlers
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
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: selectedWorkspace.id,
            background_color: color,
            card_show_background: true,
          },
        },
      });
      sileo.success({
        title: 'Background updated',
        description: `Workspace background updated successfully.`,
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error setting background:', err);
    }
    handleMenuClose();
  };

  const handleRemoveBackground = async () => {
    if (!selectedWorkspace) return;
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: selectedWorkspace.id,
            background_color: 'none',
            card_show_background: false,
          },
        },
      });
      sileo.success({
        title: 'Background removed',
        description: 'Workspace background has been reset.',
        fill: 'var(--sileo-delete-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error removing background:', err);
    }
    handleMenuClose();
  };

  const handleFolderMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    folder: FolderTypes,
  ) => {
    event.stopPropagation();
    setFolderAnchorEl(event.currentTarget);
    setSelectedFolderToManage(folder);
  };

  const handleFolderMenuClose = () => {
    setFolderAnchorEl(null);
  };

  const handleMoveToFolder = async (
    workspace: WorkspaceTypes,
    folderId: string | null,
  ) => {
    if (!workspace) return;
    sileo.info({
      title: 'Moving...',
      description: 'Updating workspace folder',
    });
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: workspace.id,
            folderId: folderId,
          },
        },
      });
      sileo.success({
        title: 'Workspace moved',
        description: folderId
          ? 'Workspace moved to folder'
          : 'Workspace moved to All Notes',
        fill: 'var(--sileo-success-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error moving workspace:', err);
      sileo.error({
        title: 'Move failed',
        description: 'There was an error moving the workspace.',
        fill: 'var(--sileo-delete-bg)',
      });
    }
    handleMenuClose();
  };

  const handleCreateFolder = async (name: string, color: string) => {
    try {
      await createFolder({
        variables: {
          createFolderInput: { name, color },
        },
      });
      setIsFolderModalOpen(false);
      sileo.success({
        title: 'Folder created',
        description: `Folder "${name}" has been created.`,
        fill: 'var(--sileo-success-bg)',
        duration: 4000,
      });
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  const handleUpdateFolder = async (
    id: string,
    name: string,
    color: string,
  ) => {
    try {
      await updateFolder({
        variables: {
          updateFolderInput: { id, name, color },
        },
      });
      sileo.success({
        title: 'Workspace updated',
        description: 'Changes saved successfully',
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error updating folder:', err);
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolderToManage) return;
    try {
      await deleteFolder({
        variables: { id: selectedFolderToManage.id },
      });
      if (selectedFolderId === selectedFolderToManage.id) {
        setSelectedFolderId(null);
      }
      sileo.success({
        title: 'Folder deleted',
        description:
          'Folder has been removed. All workspaces were moved to All Notes.',
        fill: 'var(--sileo-delete-bg)',
        duration: 4000,
      });
    } catch (err) {
      console.error('Error deleting folder:', err);
    }
    handleFolderMenuClose();
  };

  const handleUnlinkTask = async (workspace: WorkspaceTypes) => {
    try {
      await updateWorkspace({
        variables: {
          updateWorkspaceInput: {
            id: workspace.id,
            taskId: null,
          },
        },
      });
      sileo.success({
        title: 'Task unlinked',
        description: 'The task association has been removed.',
        fill: 'var(--sileo-update-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error unlinking task:', err);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Derived data
  const folders = (foldersData?.folders || []).filter((f: FolderTypes) =>
    searchMode === 'folder'
      ? f.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true,
  );

  const allWorkspaces = data?.workspaces || [];
  const workspaces = allWorkspaces.filter(
    (w: WorkspaceTypes) => !selectedFolderId || w.folderId === selectedFolderId,
  );

  if (foldersError) {
    console.error('Error fetching folders:', foldersError);
  }

  return {
    state: {
      searchTerm,
      selectedFolderId,
      isFolderModalOpen,
      searchMode,
      anchorEl,
      folderAnchorEl,
      selectedWorkspace,
      selectedFolderToManage,
      isUpdateFolderModalOpen,
      isAllFoldersModalOpen,
      showPaletteInMenu,
    },
    actions: {
      setSearchTerm,
      setSelectedFolderId,
      setIsFolderModalOpen,
      setSearchMode,
      setIsUpdateFolderModalOpen,
      setIsAllFoldersModalOpen,
      handleMenuOpen,
      handleMenuClose,
      handleSetBackground,
      handleRemoveBackground,
      handleFolderMenuOpen,
      handleFolderMenuClose,
      handleMoveToFolder,
      handleCreateFolder,
      handleUpdateFolder,
      handleDeleteFolder,
      handleUnlinkTask,
      handleClearSearch,
      setSelectedFolderToManage,
      setShowPaletteInMenu,
    },
    data: {
      workspaces,
      folders,
      allWorkspaces,
      loading,
      foldersLoading,
      error,
    },
  };
};
