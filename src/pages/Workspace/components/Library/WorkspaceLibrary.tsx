import { useState } from 'react';
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
  Button,
  useTheme,
} from '@mui/material';
import {
  PushPin as PushPinIcon,
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { EmptyState } from '@/components/ui';
import { useWorkspace } from '../../hooks/useWorkspace.hook';
import type {
  WorkspaceTypes,
  ProjectGroupTypes,
} from '../../types/workspace.types';
import {
  LibrarySearchHeader,
  WorkspaceCardItem,
  WorkspaceListItem,
} from './components';
import { useWorkspaceLibrary } from './hooks/useWorkspaceLibrary.hook';

interface WorkspaceLibraryProps {
  onCreate: () => void;
  onSelect: (workspace: WorkspaceTypes) => void;
  selectedGroupId: string | null;
}

export const WorkspaceLibrary = ({
  onCreate,
  onSelect,
  selectedGroupId,
}: WorkspaceLibraryProps) => {
  const { state, actions, data } = useWorkspaceLibrary(selectedGroupId);
  const { handleOpen: handleDeleteConfirm } = useWorkspace();

  const { searchTerm, anchorEl, selectedWorkspace } = state;

  const {
    setSearchTerm,
    handleMenuOpen,
    handleMenuClose,
    handleUnlinkTask,
    handleClearSearch,
  } = actions;

  const { workspaces, projectGroups, loading, error } = data;

  const theme = useTheme();

  const [viewMode, setViewMode] = useState<'gallery' | 'list' | 'grid'>(() => {
    return (
      (localStorage.getItem('workspace_view_mode') as
        | 'gallery'
        | 'list'
        | 'grid') || 'gallery'
    );
  });

  const handleViewModeChange = (mode: 'gallery' | 'list' | 'grid') => {
    setViewMode(mode);
    localStorage.setItem('workspace_view_mode', mode);
  };
  const activeGroup = selectedGroupId
    ? projectGroups.find((g: ProjectGroupTypes) => g.id === selectedGroupId)
    : null;

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
          <HeaderTitle variant="h4">
            {activeGroup ? activeGroup.name : 'Workspace Library'}
          </HeaderTitle>
          <HeaderSubtitle variant="body2">
            {activeGroup
              ? `View and manage workspaces inside the "${activeGroup.name}" project`
              : 'Organize your notes, ideas, and strategic plan docs'}
          </HeaderSubtitle>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
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

      {/* Toolbar Row with Group Title & Search/Filter Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
          mt: 2,
        }}
      >
        {/* Left: Active Group Name & Notes Count */}
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
            {activeGroup ? activeGroup.name : 'All Notes'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {`${workspaces.length} notes`}
          </Typography>
        </Box>

        {/* Right: Search control */}
        <LibrarySearchHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={handleClearSearch}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
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
        <GridContainer layout={viewMode}>
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
            ? [1, 2, 3, 4, 5].map((i) => {
                if (viewMode === 'list') {
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: '14px 16px',
                        borderRadius: '8px',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(26, 31, 43, 0.4)'
                            : '#ffffff',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: 'action.hover',
                          borderRadius: '50%',
                        }}
                      />
                      <Box
                        sx={{
                          width: '20%',
                          height: 16,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                        }}
                      />
                      <Box
                        sx={{
                          width: '40%',
                          height: 14,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          display: { xs: 'none', md: 'block' },
                        }}
                      />
                      <Box
                        sx={{
                          width: '10%',
                          height: 16,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          display: { xs: 'none', sm: 'block' },
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
                  );
                }
                return (
                  <WorkspaceCard
                    key={i}
                    sx={{ borderStyle: 'solid', cursor: 'default' }}
                    compact={viewMode === 'grid'}
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
                    {!(viewMode === 'grid') && (
                      <>
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
                      </>
                    )}
                  </WorkspaceCard>
                );
              })
            : workspaces.map((workspace: WorkspaceTypes) => {
                const group = projectGroups.find(
                  (g: ProjectGroupTypes) => g.id === workspace.groupId,
                );

                if (viewMode === 'list') {
                  return (
                    <WorkspaceListItem
                      key={workspace.id}
                      workspace={workspace}
                      onSelect={onSelect}
                      onMenuOpen={handleMenuOpen}
                      onUnlinkTask={handleUnlinkTask}
                      groupName={group?.name}
                      groupColor={group?.color}
                    />
                  );
                }

                return (
                  <WorkspaceCardItem
                    key={workspace.id}
                    workspace={workspace}
                    onSelect={onSelect}
                    onMenuOpen={handleMenuOpen}
                    onUnlinkTask={handleUnlinkTask}
                    groupName={group?.name}
                    groupColor={group?.color}
                    compact={viewMode === 'grid'}
                  />
                );
              })}
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
        <MenuItem
          onClick={() => {
            if (selectedWorkspace) {
              handleDeleteConfirm(selectedWorkspace.id);
              handleMenuClose();
            }
          }}
          sx={{
            fontSize: '13px',
            py: 1.5,
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
    </LibraryContainer>
  );
};
