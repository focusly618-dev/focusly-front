import type {
  WorkspaceTypes,
  ProjectTypes,
} from '../../../types/workspace.types';

export interface LibraryState {
  searchTerm: string;
  selectedFolderId: string | null;
  isFolderModalOpen: boolean;
  searchMode: 'workspace' | 'folder';
  anchorEl: HTMLElement | null;
  folderAnchorEl: HTMLElement | null;
  selectedWorkspace: WorkspaceTypes | null;
  selectedFolderToManage: ProjectTypes | null;
  isUpdateFolderModalOpen: boolean;
  isAllFoldersModalOpen: boolean;
  showPaletteInMenu: boolean;
}

export interface LibraryActions {
  setSearchTerm: (term: string) => void;
  setSelectedFolderId: (id: string | null) => void;
  setIsFolderModalOpen: (open: boolean) => void;
  setSearchMode: (mode: 'workspace' | 'folder') => void;
  setIsUpdateFolderModalOpen: (open: boolean) => void;
  setIsAllFoldersModalOpen: (open: boolean) => void;
  handleMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    workspace: WorkspaceTypes,
  ) => void;
  handleMenuClose: () => void;
  handleSetBackground: (color: string) => void;
  handleRemoveBackground: () => void;
  handleFolderMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    folder: ProjectTypes,
  ) => void;
  handleFolderMenuClose: () => void;
  handleMoveToFolder: (
    workspace: WorkspaceTypes,
    folderId: string | null,
  ) => Promise<void>;
  handleCreateFolder: (name: string, color: string) => Promise<void>;
  handleUpdateFolder: (
    id: string,
    name: string,
    color: string,
  ) => Promise<void>;
  handleDeleteFolder: () => Promise<void>;
  handleUnlinkTask: (workspace: WorkspaceTypes) => Promise<void>;
  handleClearSearch: () => void;
  setSelectedFolderToManage: (folder: ProjectTypes | null) => void;
  setShowPaletteInMenu: (show: boolean) => void;
}

export interface LibraryData {
  workspaces: WorkspaceTypes[];
  folders: ProjectTypes[];
  allWorkspaces: WorkspaceTypes[];
  loading: boolean;
  foldersLoading: boolean;
  error: Error | null;
}
