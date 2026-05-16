import {
  LibraryContainer,
  GridContainer,
  WorkspaceCard,
  CreateCard,
} from './WorkspaceLibrary.styles';
import {
  Box,
  Typography,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  PushPin as PushPinIcon,
  Add as AddIcon,
  Palette as PaletteIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  LayersClear as LayersClearIcon,
  FolderSpecial as FolderSpecialIcon,
  Folder as FolderIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import { EmptyState } from '@/utils/EmptyState';
import { useWorkspace } from '../../hooks/useWorkspace.hook';
import type { WorkspaceTypes } from '../../types/workspace.types';
import { CreateFolderModal } from './modals/CreateFolderModal';
import { UpdateFolderModal } from './modals/UpdateFolderModal';
import { AllFoldersModal } from './modals/AllFoldersModal';
import { colorPaletteMap } from './constants/library.constants';
import {
  LibrarySearchHeader,
  FolderSectionList,
  WorkspaceCardItem,
} from './components';
import { useWorkspaceLibrary } from './hooks/useWorkspaceLibrary.hook';

interface WorkspaceLibraryProps {
  onCreate: () => void;
  onSelect: (workspace: WorkspaceTypes) => void;
}

export const WorkspaceLibrary = ({
  onCreate,
  onSelect,
}: WorkspaceLibraryProps) => {
  const { state, actions, data } = useWorkspaceLibrary();
  const { handleOpen: handleDeleteConfirm } = useWorkspace();

  const {
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
  } = state;

  const {
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
  } = actions;

  const { workspaces, folders, allWorkspaces, loading, foldersLoading, error } =
    data;

  return (
    <LibraryContainer sx={{ position: 'relative' }}>
      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            zIndex: 1000,
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main',
            },
          }}
        />
      )}

      <LibrarySearchHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={handleClearSearch}
        searchMode={searchMode}
        onSearchModeChange={setSearchMode}
      />

      <FolderSectionList
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
        allWorkspacesCount={allWorkspaces.length}
        folders={folders}
        foldersLoading={foldersLoading}
        onFolderMenuOpen={handleFolderMenuOpen}
        onAllFoldersOpen={() => setIsAllFoldersModalOpen(true)}
        onAddFolderOpen={() => setIsFolderModalOpen(true)}
      />

      <Box sx={{ height: 4, mb: 1 }} />

      {error ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">
            Error loading workspaces. Please try again.
          </Typography>
        </Box>
      ) : (
        <GridContainer>
          {searchTerm && !workspaces.length && !loading && (
            <EmptyState
              title="No results found"
              description="No workspaces match your search term. Try a different keyword or create a new one."
              sx={{ gridColumn: '1 / -1', py: 8 }}
            />
          )}

          {!searchTerm && !workspaces.length && !loading && !error && (
            <EmptyState
              icon={<PushPinIcon />}
              title="No workspaces yet"
              description="Lightweight notes to organize your strategic planning. Create your first workspace to get started."
              actionText="Create Workspace"
              onAction={onCreate}
              sx={{ gridColumn: '1 / -1', py: 10 }}
            />
          )}

          {workspaces.length > 0 && (
            <CreateCard id="joyride-workspace-create-note" onClick={onCreate}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 1.5,
                }}
              >
                <AddIcon sx={{ color: 'primary.main' }} />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                Create New Note
              </Typography>
            </CreateCard>
          )}

          {loading && !workspaces.length
            ? [1, 2, 3, 4, 5].map((i) => (
                <WorkspaceCard
                  key={i}
                  sx={{ borderStyle: 'solid', cursor: 'default' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: '30%',
                        height: 20,
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: 'action.hover',
                        borderRadius: '50%',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '80%',
                      height: 24,
                      bgcolor: 'action.hover',
                      mb: 1.5,
                      borderRadius: 1,
                    }}
                  />
                  <Box
                    sx={{
                      width: '100%',
                      height: 16,
                      bgcolor: 'action.hover',
                      mb: 0.5,
                      borderRadius: 1,
                    }}
                  />
                  <Box
                    sx={{
                      width: '90%',
                      height: 16,
                      bgcolor: 'action.hover',
                      mb: 0.5,
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ mt: 'auto', width: '100%' }}>
                    <Box
                      sx={{
                        width: '40%',
                        height: 14,
                        bgcolor: 'action.hover',
                        mb: 1.5,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: '100%',
                        height: 40,
                        bgcolor: 'action.hover',
                        borderRadius: '24px',
                      }}
                    />
                  </Box>
                </WorkspaceCard>
              ))
            : workspaces.map((workspace: WorkspaceTypes) => (
                <WorkspaceCardItem
                  key={workspace.id}
                  workspace={workspace}
                  onSelect={onSelect}
                  onDelete={handleDeleteConfirm}
                  onMenuOpen={handleMenuOpen}
                  onUnlinkTask={handleUnlinkTask}
                />
              ))}
        </GridContainer>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            mt: 1,
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            minWidth: showPaletteInMenu ? 240 : 180,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            p: showPaletteInMenu ? 1.5 : 0,
          },
        }}
      >
        {showPaletteInMenu ? (
          <Box>
            <Typography
              variant="caption"
              sx={{
                px: 1,
                mb: 1.5,
                display: 'block',
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Select Background
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 1,
              }}
            >
              {Object.entries(colorPaletteMap).map(([name, entry]) => (
                <Tooltip key={name} title={name} arrow>
                  <Box
                    onClick={() => handleSetBackground(name)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: entry.gradient,
                      cursor: 'pointer',
                      border:
                        selectedWorkspace?.background_color === name
                          ? '2px solid #fff'
                          : '1px solid rgba(255,255,255,0.1)',
                      boxShadow:
                        selectedWorkspace?.background_color === name
                          ? '0 0 0 2px var(--mui-palette-primary-main)'
                          : 'none',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        ) : (
          <>
            {selectedWorkspace?.background_color &&
            selectedWorkspace.background_color !== 'none' ? (
              <MenuItem
                onClick={handleRemoveBackground}
                sx={{
                  fontSize: '13px',
                  py: 1,
                  fontWeight: 500,
                  color: 'error.main',
                }}
              >
                <LayersClearIcon
                  sx={{ fontSize: 18, mr: 1.5, color: 'error.main' }}
                />
                Remove background color
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => setShowPaletteInMenu(true)}
                sx={{ fontSize: '13px', py: 1, fontWeight: 500 }}
              >
                <PaletteIcon sx={{ fontSize: 18, mr: 1.5, opacity: 0.7 }} />
                Add background color
              </MenuItem>
            )}

            <Divider sx={{ my: 0.5, opacity: 0.1 }} />

            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                display: 'block',
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                opacity: 0.8,
              }}
            >
              Organize
            </Typography>

            <MenuItem
              onClick={() => {
                if (selectedWorkspace)
                  handleMoveToFolder(selectedWorkspace, null);
              }}
              sx={{
                fontSize: '13px',
                py: 1.2,
                fontWeight: !selectedWorkspace?.folderId ? 700 : 500,
                bgcolor: !selectedWorkspace?.folderId
                  ? 'action.selected'
                  : 'transparent',
              }}
            >
              <FolderSpecialIcon
                sx={{
                  fontSize: 18,
                  mr: 1.5,
                  opacity: !selectedWorkspace?.folderId ? 1 : 0.7,
                }}
              />
              <Box sx={{ flex: 1 }}>All Notes (Default)</Box>
              {!selectedWorkspace?.folderId && (
                <CheckBoxIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              )}
            </MenuItem>

            {folders.map((folder) => {
              const isCurrent = selectedWorkspace?.folderId === folder.id;
              return (
                <MenuItem
                  key={folder.id}
                  onClick={() => {
                    if (selectedWorkspace)
                      handleMoveToFolder(selectedWorkspace, folder.id);
                  }}
                  sx={{
                    fontSize: '13px',
                    py: 1.2,
                    fontWeight: isCurrent ? 700 : 500,
                    bgcolor: isCurrent ? 'action.selected' : 'transparent',
                  }}
                >
                  <FolderIcon
                    sx={{
                      fontSize: 18,
                      mr: 1.5,
                      color: folder.color || 'primary.main',
                      opacity: isCurrent ? 1 : 0.7,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>{folder.name}</Box>
                  {isCurrent && (
                    <CheckBoxIcon
                      sx={{
                        fontSize: 16,
                        color: folder.color || 'primary.main',
                      }}
                    />
                  )}
                </MenuItem>
              );
            })}

            <Divider sx={{ my: 0.5, opacity: 0.1 }} />

            <MenuItem
              onClick={() => {
                if (selectedWorkspace) {
                  console.log('Deleting workspace:', selectedWorkspace.id);
                  handleDeleteConfirm(selectedWorkspace.id);
                  handleMenuClose();
                } else {
                  console.warn('No selected workspace to delete');
                }
              }}
              sx={{
                fontSize: '13px',
                py: 1,
                fontWeight: 500,
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
              }}
            >
              <DeleteForeverIcon
                sx={{ fontSize: 18, mr: 1.5, color: 'error.main' }}
              />
              Delete Workspace
            </MenuItem>
          </>
        )}
      </Menu>

      <CreateFolderModal
        open={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <UpdateFolderModal
        key={selectedFolderToManage?.id || 'new'}
        open={isUpdateFolderModalOpen}
        onClose={() => {
          setIsUpdateFolderModalOpen(false);
          setSelectedFolderToManage(null);
        }}
        onUpdate={handleUpdateFolder}
        folder={selectedFolderToManage}
      />

      <AllFoldersModal
        open={isAllFoldersModalOpen}
        onClose={() => setIsAllFoldersModalOpen(false)}
        folders={folders}
        selectedId={selectedFolderId}
        onSelect={(id) => {
          setSelectedFolderId(id);
          setIsAllFoldersModalOpen(false);
        }}
      />

      <Menu
        anchorEl={folderAnchorEl}
        open={Boolean(folderAnchorEl)}
        onClose={handleFolderMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            mt: 1,
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            minWidth: 160,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setIsUpdateFolderModalOpen(true);
            handleFolderMenuClose();
          }}
          sx={{ fontSize: '13px', py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText>Edit Folder</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDeleteFolder}
          sx={{ fontSize: '13px', py: 1, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete Folder</ListItemText>
        </MenuItem>
      </Menu>
    </LibraryContainer>
  );
};
