import { useState } from 'react';
import {
  LibraryContainer,
  GridContainer,
  WorkspaceCard,
  LibraryHeader,
  HeaderTitle,
  HeaderSubtitle,
} from './WorkspaceLibrary.styles';
import { useMutation } from '@apollo/client';
import { UPDATE_PROJECT_GROUP } from '../../workspaces.graphql';
import {
  Box,
  Typography,
  LinearProgress,
  Menu,
  MenuItem,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  PushPin as PushPinIcon,
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
  Folder as FolderFilledIcon,
  FolderOutlined as FolderOutlinedIcon,
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
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#7c3aed');
  const [selectedStyle, setSelectedStyle] = useState<'filled' | 'outlined'>(
    'filled',
  );
  const [updateProjectGroup] = useMutation(UPDATE_PROJECT_GROUP);

  const AVAILABLE_COLORS = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Lime', value: '#84cc16' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Sky Blue', value: '#0ea5e9' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Violet', value: '#7c3aed' },
    { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Light Slate', value: '#94a3b8' },
    { name: 'Medium Slate', value: '#64748b' },
    { name: 'Dark Slate', value: '#475569' },
  ];

  const activeGroup = selectedGroupId
    ? projectGroups.find((g: ProjectGroupTypes) => g.id === selectedGroupId)
    : null;

  const isUngrouped = selectedGroupId === 'ungrouped';
  const displayGroupName = isUngrouped
    ? localStorage.getItem('ungrouped_group_name') || 'Sin grupo'
    : activeGroup
      ? activeGroup.name
      : 'All Notes';

  const handleOpenCustomize = () => {
    if (isUngrouped) {
      setSelectedColor(
        localStorage.getItem('ungrouped_group_color') || '#64748b',
      );
      setSelectedStyle(
        (localStorage.getItem('ungrouped_group_emoji') as
          | 'filled'
          | 'outlined') || 'filled',
      );
    } else if (activeGroup) {
      setSelectedColor(activeGroup.color || '#7c3aed');
      setSelectedStyle(
        activeGroup.emoji === 'outlined' ? 'outlined' : 'filled',
      );
    }
    setIsCustomizeOpen(true);
  };

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
            {isUngrouped || activeGroup
              ? displayGroupName
              : 'Workspace Library'}
          </HeaderTitle>
          <HeaderSubtitle variant="body2">
            {isUngrouped || activeGroup
              ? `View and manage workspaces inside the "${displayGroupName}" project`
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'text.primary',
              letterSpacing: '-0.3px',
            }}
          >
            {displayGroupName}
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
          {(activeGroup || isUngrouped) && (
            <Button
              size="small"
              onClick={handleOpenCustomize}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                py: 0.25,
                px: 1.25,
                borderRadius: '6px',
                ml: 1.5,
                color: 'primary.main',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(59, 130, 246, 0.12)'
                    : 'rgba(59, 130, 246, 0.06)',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              Change Folder Color
            </Button>
          )}
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

      <Dialog
        open={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1.5,
            width: '320px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          Customize Folder Style
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            sx={{
              display: 'block',
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Icon Shape
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant={selectedStyle === 'filled' ? 'contained' : 'outlined'}
              onClick={() => setSelectedStyle('filled')}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                textTransform: 'none',
              }}
            >
              <FolderFilledIcon sx={{ fontSize: 24 }} />
              <Typography variant="caption" fontWeight={600}>
                Solid
              </Typography>
            </Button>
            <Button
              variant={selectedStyle === 'outlined' ? 'contained' : 'outlined'}
              onClick={() => setSelectedStyle('outlined')}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                textTransform: 'none',
              }}
            >
              <FolderOutlinedIcon sx={{ fontSize: 24 }} />
              <Typography variant="caption" fontWeight={600}>
                Outlined
              </Typography>
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            sx={{
              display: 'block',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Color Accent
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 1.5,
            }}
          >
            {AVAILABLE_COLORS.map((c) => {
              const isSelected = selectedColor === c.value;
              return (
                <Tooltip title={c.name} key={c.value} arrow>
                  <Box
                    onClick={() => setSelectedColor(c.value)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: c.value,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isSelected
                        ? '2px solid'
                        : '2px solid transparent',
                      borderColor: (theme) => theme.palette.text.primary,
                      boxShadow: isSelected
                        ? '0 0 8px rgba(0,0,0,0.2)'
                        : 'none',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        transform: 'scale(1.15)',
                      },
                    }}
                  >
                    {isSelected && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#ffffff',
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsCustomizeOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              color: 'text.secondary',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (isUngrouped) {
                localStorage.setItem('ungrouped_group_color', selectedColor);
                localStorage.setItem('ungrouped_group_emoji', selectedStyle);
                window.location.reload();
              } else if (activeGroup) {
                try {
                  await updateProjectGroup({
                    variables: {
                      input: {
                        id: activeGroup.id,
                        color: selectedColor,
                        emoji: selectedStyle,
                      },
                    },
                  });
                } catch (err) {
                  console.error('Failed to update group styling:', err);
                }
              }
              setIsCustomizeOpen(false);
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </LibraryContainer>
  );
};
