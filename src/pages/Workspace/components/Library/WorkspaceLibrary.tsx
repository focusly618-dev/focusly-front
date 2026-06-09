import {
  LibraryContainer,
  GridContainer,
  WorkspaceCard,
  LibraryHeader,
  HeaderTitle,
  HeaderSubtitle,
} from './WorkspaceLibrary.styles';
import {
  Box,
  Typography,
  LinearProgress,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PushPin as PushPinIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  FolderSpecial as FolderSpecialIcon,
  Folder as FolderIcon,
  CheckBox as CheckBoxIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';
import { EmptyState } from '@/components/ui';
import { useWorkspace } from '../../hooks/useWorkspace.hook';
import type { WorkspaceTypes, ProjectTypes } from '../../types/workspace.types';
import { CreateProjectModal } from './modals/CreateProjectModal';
import { UpdateProjectModal } from './modals/UpdateProjectModal';
import { AllProjectsModal } from './modals/AllProjectsModal';
import {
  LibrarySearchHeader,
  FolderSectionList,
  WorkspaceCardItem,
} from './components';
import { useWorkspaceLibrary } from './hooks/useWorkspaceLibrary.hook';

interface WorkspaceLibraryProps {
  onCreate: () => void;
  onSelect: (workspace: WorkspaceTypes) => void;
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export const WorkspaceLibrary = ({
  onCreate,
  onSelect,
  selectedProjectId,
  onSelectProject,
}: WorkspaceLibraryProps) => {
  const { state, actions, data } = useWorkspaceLibrary(
    selectedProjectId,
    onSelectProject,
  );
  const { handleOpen: handleDeleteConfirm } = useWorkspace();

  const {
    searchTerm,
    isProjectModalOpen,
    searchMode,
    anchorEl,
    projectAnchorEl,
    selectedWorkspace,
    selectedProjectToManage,
    isUpdateProjectModalOpen,
    isAllProjectsModalOpen,
  } = state;

  const {
    setSearchTerm,
    setIsProjectModalOpen,
    setSearchMode,
    setIsUpdateProjectModalOpen,
    setIsAllProjectsModalOpen,
    handleMenuOpen,
    handleMenuClose,
    handleProjectMenuOpen,
    handleProjectMenuClose,
    handleMoveToProject,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleUnlinkTask,
    handleClearSearch,
    setSelectedProjectToManage,
  } = actions;

  const {
    workspaces,
    projects,
    allWorkspaces,
    loading,
    projectsLoading,
    error,
  } = data;

  const theme = useTheme();

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

      {/* Top Page Header: Title & Action Buttons */}
      <LibraryHeader>
        <Box>
          <HeaderTitle variant="h4">Workspace Library</HeaderTitle>
          <HeaderSubtitle variant="body2">
            Organize your notes, ideas, and strategic plan docs
          </HeaderSubtitle>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setIsProjectModalOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 0.8,
              borderColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(0,0,0,0.12)',
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            New Folder
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FolderOpenIcon />}
            onClick={() => setIsAllProjectsModalOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 0.8,
              borderColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(0,0,0,0.12)',
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            All Folders
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 0.8,
              boxShadow: 'none',
              bgcolor: theme.palette.mode === 'dark' ? '#ffffff' : '#1c1c1a',
              color: theme.palette.mode === 'dark' ? '#0b0f14' : '#ffffff',
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(28, 28, 26, 0.9)',
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 4px 12px rgba(255, 255, 255, 0.15)'
                    : '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            New Note
          </Button>
        </Box>
      </LibraryHeader>

      {/* Second Row: Horizontal project tabs spanning full width */}
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 2.5,
          width: '100%',
        }}
      >
        <FolderSectionList
          selectedFolderId={selectedProjectId}
          onFolderSelect={onSelectProject}
          allWorkspacesCount={allWorkspaces.length}
          folders={projects}
          foldersLoading={projectsLoading}
          onFolderMenuOpen={handleProjectMenuOpen}
          onAllFoldersOpen={() => setIsAllProjectsModalOpen(true)}
          onAddFolderOpen={() => setIsProjectModalOpen(true)}
        />
      </Box>

      {/* Third Row: Toolbar Row with Project Title & Search/Filter Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Active Project Name & Notes Count */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'text.primary',
              letterSpacing: '-0.3px',
            }}
          >
            {selectedProjectId
              ? projects.find((p: ProjectTypes) => p.id === selectedProjectId)
                  ?.name || 'Folder'
              : 'All Notes'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {selectedProjectId
              ? `${projects.find((p: ProjectTypes) => p.id === selectedProjectId)?.workspaceCount || 0} notes`
              : `${allWorkspaces.length} notes`}
          </Typography>
        </Box>

        {/* Right: Compounded search, filter, and layout toggles */}
        <LibrarySearchHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={handleClearSearch}
          searchMode={searchMode === 'project' ? 'folder' : 'workspace'}
          onSearchModeChange={(mode) =>
            setSearchMode(mode === 'folder' ? 'project' : 'workspace')
          }
        />
      </Box>

      <Box sx={{ height: 4 }} />

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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: '40%',
                          height: 14,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>
                </WorkspaceCard>
              ))
            : workspaces.map((workspace: WorkspaceTypes) => (
                <WorkspaceCardItem
                  key={workspace.id}
                  workspace={workspace}
                  onSelect={onSelect}
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
            minWidth: 180,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            p: 0,
          },
        }}
      >
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
            if (selectedWorkspace) handleMoveToProject(selectedWorkspace, null);
          }}
          sx={{
            fontSize: '13px',
            py: 1.2,
            fontWeight: !selectedWorkspace?.projectId ? 700 : 500,
            bgcolor: !selectedWorkspace?.projectId
              ? 'action.selected'
              : 'transparent',
          }}
        >
          <FolderSpecialIcon
            sx={{
              fontSize: 18,
              mr: 1.5,
              opacity: !selectedWorkspace?.projectId ? 1 : 0.7,
            }}
          />
          <Box sx={{ flex: 1 }}>All Notes (Default)</Box>
          {!selectedWorkspace?.projectId && (
            <CheckBoxIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          )}
        </MenuItem>

        {projects.map((project: ProjectTypes) => {
          const isCurrent = selectedWorkspace?.projectId === project.id;
          return (
            <MenuItem
              key={project.id}
              onClick={() => {
                if (selectedWorkspace)
                  handleMoveToProject(selectedWorkspace, project.id);
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
                  color: project.color || 'primary.main',
                  opacity: isCurrent ? 1 : 0.7,
                }}
              />
              <Box sx={{ flex: 1 }}>{project.name}</Box>
              {isCurrent && (
                <CheckBoxIcon
                  sx={{
                    fontSize: 16,
                    color: project.color || 'primary.main',
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
              handleDeleteConfirm(selectedWorkspace.id);
              handleMenuClose();
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
      </Menu>

      <CreateProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      <UpdateProjectModal
        key={selectedProjectToManage?.id || 'new'}
        open={isUpdateProjectModalOpen}
        onClose={() => {
          setIsUpdateProjectModalOpen(false);
          setSelectedProjectToManage(null);
        }}
        onUpdate={handleUpdateProject}
        project={selectedProjectToManage}
      />

      <AllProjectsModal
        open={isAllProjectsModalOpen}
        onClose={() => setIsAllProjectsModalOpen(false)}
        projects={projects}
        selectedId={selectedProjectId}
        onSelect={(id) => {
          onSelectProject(id);
          setIsAllProjectsModalOpen(false);
        }}
      />

      <Menu
        anchorEl={projectAnchorEl}
        open={Boolean(projectAnchorEl)}
        onClose={handleProjectMenuClose}
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
            setIsUpdateProjectModalOpen(true);
            handleProjectMenuClose();
          }}
          sx={{ fontSize: '13px', py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText>Edit Folder</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDeleteProject}
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
