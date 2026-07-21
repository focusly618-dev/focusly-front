import { useState, useRef } from 'react';
import {
  LibraryContainer,
  GridContainer,
  WorkspaceCard,
  LibraryHeader,
  HeaderTitle,
  FolderIconCircle,
  StyledTextField,
} from './WorkspaceLibrary.styles';
import { useMutation } from '@apollo/client';
import {
  UPDATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
  CREATE_PROJECT_GROUP,
} from '../../Workspace.graphql';
import { useSearchParams } from 'react-router-dom';
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
  alpha,
  IconButton,
} from '@mui/material';
import {
  PushPin as PushPinIcon,
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
  Folder as FolderFilledIcon,
  FolderOutlined as FolderOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
  Search as SearchIcon,
  Close as CloseIcon,
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
import { AllProjectsModal } from './modals/AllProjectsModal';
import { sileo } from '@/utils';

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

  const { searchTerm, anchorEl, selectedWorkspace, hasMore } = state;

  const {
    setSearchTerm,
    handleMenuOpen,
    handleMenuClose,
    handleUnlinkTask,
    handleClearSearch,
    loadMore,
  } = actions;

  const { workspaces, projectGroups, loading, error } = data;

  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'gallery' | 'list' | 'grid'>(() => {
    return (
      (localStorage.getItem('workspace_view_mode') as
        | 'gallery'
        | 'list'
        | 'grid') || 'gallery'
    );
  });

  const [isAllFoldersModalOpen, setIsAllFoldersModalOpen] = useState(false);

  const handleViewModeChange = (mode: 'gallery' | 'list' | 'grid') => {
    setViewMode(mode);
    localStorage.setItem('workspace_view_mode', mode);
  };

  const handleSelectFolder = (groupId: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'Projects');
    if (groupId) {
      newParams.set('groupId', groupId);
    } else {
      newParams.delete('groupId');
    }
    newParams.delete('workspaceId');
    setSearchParams(newParams);
  };

  const loadingMore = useRef(false);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (loadingMore.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Trigger when scrolled to within 50px of the bottom
    const reachedBottom = scrollHeight - scrollTop <= clientHeight + 50;

    if (!reachedBottom) return;

    loadingMore.current = true;
    try {
      await loadMore();
    } finally {
      loadingMore.current = false;
    }
  };
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#7c3aed');
  const [selectedStyle, setSelectedStyle] = useState<'filled' | 'outlined'>(
    'filled',
  );
  const [updateProjectGroup] = useMutation(UPDATE_PROJECT_GROUP);
  const [deleteProjectGroup] = useMutation(DELETE_PROJECT_GROUP, {
    refetchQueries: ['GetProjectGroups'],
  });

  // Folder creation states
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3b82f6');
  const [newFolderStyle, setNewFolderStyle] = useState<'filled' | 'outlined'>(
    'filled',
  );
  const [createProjectGroup] = useMutation(CREATE_PROJECT_GROUP, {
    refetchQueries: ['GetProjectGroups'],
  });

  // Customization group target state
  const [groupToCustomize, setGroupToCustomize] =
    useState<ProjectGroupTypes | null>(null);

  // Group three-dots menu states
  const [groupMenuAnchorEl, setGroupMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [groupForMenu, setGroupForMenu] = useState<ProjectGroupTypes | null>(
    null,
  );

  // Search filter for project folders
  const [folderSearchTerm, setFolderSearchTerm] = useState('');

  const handleDeleteProjects = async (ids: string[]) => {
    const folderNames = projectGroups
      .filter((g: ProjectGroupTypes) => ids.includes(g.id))
      .map((g: ProjectGroupTypes) => g.name)
      .join(', ');

    sileo.warning({
      title: 'Remove Projects',
      description: `Are you sure you want to delete the following projects: ${folderNames}? Workspaces inside will be unlinked but not deleted.`,
      fill: 'var(--sileo-warning-bg)',
      button: {
        title: 'Delete',
        onClick: async () => {
          try {
            await Promise.all(
              ids.map((id) => deleteProjectGroup({ variables: { id } })),
            );
            sileo.success({
              title: 'Projects deleted',
              fill: 'var(--sileo-delete-bg)',
              duration: 4000,
            });
          } catch (err) {
            console.error('Error deleting projects:', err);
          }
        },
      },
    });
  };

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

  const targetGroup = groupToCustomize || activeGroup;

  const isInsideFolder = Boolean(selectedGroupId);

  const sortedGroups = [...projectGroups].sort(
    (a: ProjectGroupTypes, b: ProjectGroupTypes) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    },
  );

  const filteredGroups = sortedGroups.filter((g: ProjectGroupTypes) =>
    g.name.toLowerCase().includes(folderSearchTerm.toLowerCase()),
  );

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

      {/* Breadcrumbs Row */}
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            '&:hover': { color: 'primary.main' },
          }}
          onClick={() => handleSelectFolder('')}
        >
          Home
        </Typography>
        <Typography
          variant="body2"
          color="text.disabled"
          sx={{ fontSize: '13px' }}
        >
          &gt;
        </Typography>
        {isInsideFolder ? (
          <>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' },
              }}
              onClick={() => handleSelectFolder('')}
            >
              Projects
            </Typography>
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ fontSize: '13px' }}
            >
              &gt;
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              {activeGroup?.emoji === 'outlined' ? (
                <FolderOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: activeGroup.color || 'primary.main',
                  }}
                />
              ) : (
                <FolderFilledIcon
                  sx={{
                    fontSize: 16,
                    color: activeGroup?.color || 'primary.main',
                  }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: '13px',
                }}
              >
                {activeGroup?.name || 'Folder'}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: 'primary.main', fontSize: '13px' }}
          >
            Projects
          </Typography>
        )}
      </Box>

      {/* Top Page Header: Title & Action Buttons */}
      <LibraryHeader>
        <Box>
          <HeaderTitle variant="h4">
            {isInsideFolder ? activeGroup?.name : 'Projects'}
          </HeaderTitle>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {isInsideFolder ? (
            <>
              <LibrarySearchHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClearSearch={handleClearSearch}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={onCreate}
                sx={{
                  height: '34px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  boxShadow: 'none',
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: 'center',
                  bgcolor:
                    theme.palette.mode === 'dark' ? '#ffffff' : '#1c1c1a',
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
            </>
          ) : (
            <>
              <StyledTextField
                placeholder="Search projects..."
                value={folderSearchTerm}
                onChange={(e) => setFolderSearchTerm(e.target.value)}
                size="small"
                sx={{
                  width: '260px',
                  flex: { xs: 1, sm: 'none' },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }}
                    />
                  ),
                  endAdornment: folderSearchTerm ? (
                    <IconButton
                      size="small"
                      sx={{ color: 'text.secondary', p: 0.5 }}
                      onClick={() => setFolderSearchTerm('')}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : null,
                }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setIsCreateFolderOpen(true)}
                sx={{
                  height: '34px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  boxShadow: 'none',
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: 'center',
                  bgcolor:
                    theme.palette.mode === 'dark' ? '#ffffff' : '#1c1c1a',
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
                New Folder
              </Button>
            </>
          )}
        </Box>
      </LibraryHeader>

      {!isInsideFolder ? (
        /* Root Projects Cards Grid View */
        <Box sx={{ mt: 3, pb: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {/* Dashed Create Folder Card */}
            <Box
              onClick={() => setIsCreateFolderOpen(true)}
              sx={{
                border: (theme) => `1.5px dashed ${theme.palette.divider}`,
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                height: '190px',
                transition: 'all 0.2s ease-in-out',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.01)'
                    : 'rgba(0, 0, 0, 0.01)',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <FolderIconCircle
                color={theme.palette.primary.main}
                sx={{
                  width: '48px',
                  height: '48px',
                  mb: 1.5,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(96, 165, 250, 0.12)'
                      : 'rgba(59, 130, 246, 0.08)',
                  color: 'primary.main',
                  boxShadow: 'none',
                }}
              >
                <AddIcon sx={{ fontSize: 24 }} />
              </FolderIconCircle>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: 'text.secondary' }}
              >
                New Folder
              </Typography>
            </Box>

            {/* Folder Cards */}
            {filteredGroups.map((group: ProjectGroupTypes, index) => {
              const baseColor = group.color || '#7c3aed';
              const noteCount = group.workspaces?.length ?? 0;
              const statusLabel =
                noteCount > 0
                  ? index % 3 === 0
                    ? 'RECENT'
                    : 'ACTIVE'
                  : 'DRAFT';

              return (
                <Box
                  key={group.id}
                  onClick={() => handleSelectFolder(group.id)}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    height: '190px',
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 8px 24px rgba(0,0,0,0.3)'
                          : '0 8px 24px rgba(0, 0, 0, 0.04)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Top Accents */}
                  <Box
                    sx={{
                      p: 2,
                      pb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <FolderIconCircle
                      color={baseColor}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGroupToCustomize(group);
                        setSelectedColor(baseColor);
                        setSelectedStyle(
                          group.emoji === 'outlined' ? 'outlined' : 'filled',
                        );
                        setIsCustomizeOpen(true);
                      }}
                      sx={{
                        width: '40px',
                        height: '40px',
                        bgcolor: alpha(baseColor, 0.12),
                        color: baseColor,
                        boxShadow: 'none',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {group.emoji === 'outlined' ? (
                        <FolderOutlinedIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <FolderFilledIcon sx={{ fontSize: 20 }} />
                      )}
                    </FolderIconCircle>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGroupMenuAnchorEl(e.currentTarget);
                        setGroupForMenu(group);
                      }}
                      sx={{ color: 'text.secondary' }}
                    >
                      <MoreHorizIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>

                  {/* Body Text */}
                  <Box sx={{ px: 2, flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        mb: 0.5,
                        lineHeight: 1.2,
                      }}
                    >
                      {group.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        display: 'block',
                      }}
                    >
                      {`${noteCount} ${noteCount === 1 ? 'note' : 'notes'} inside`}
                    </Typography>
                    {group.updatedAt && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          opacity: 0.8,
                          fontSize: '0.72rem',
                          display: 'block',
                          mt: 0.25,
                        }}
                      >
                        Last updated:{' '}
                        {new Date(group.updatedAt).toLocaleDateString(
                          undefined,
                          { day: 'numeric', month: 'short', year: 'numeric' },
                        )}
                      </Typography>
                    )}
                  </Box>

                  {/* Status Bar bottom */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderTop: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottomLeftRadius: '16px',
                      borderBottomRightRadius: '16px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.01)'
                          : 'rgba(0,0,0,0.01)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        letterSpacing: '0.05em',
                        color:
                          statusLabel === 'ACTIVE'
                            ? 'success.main'
                            : statusLabel === 'RECENT'
                              ? 'primary.main'
                              : 'text.secondary',
                      }}
                    >
                      {statusLabel}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', fontWeight: 700 }}
                    >
                      &rarr;
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        /* Inside Folder: GridContainer showing note cards inside active folder */
        <>
          {error ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error">
                Error loading workspaces. Please try again.
              </Typography>
            </Box>
          ) : (
            <GridContainer layout={viewMode} onScroll={handleScroll}>
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
                              width: '30%',
                              height: 16,
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

              {loading && workspaces.length > 0 && (
                <Box
                  sx={{
                    gridColumn: '1 / -1',
                    display: 'flex',
                    justifyContent: 'center',
                    py: 2,
                    width: '100%',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Loading more workspaces...
                  </Typography>
                </Box>
              )}
            </GridContainer>
          )}
        </>
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

      {/* Folder Actions Card Menu */}
      <Menu
        anchorEl={groupMenuAnchorEl}
        open={Boolean(groupMenuAnchorEl)}
        onClose={() => {
          setGroupMenuAnchorEl(null);
          setGroupForMenu(null);
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            mt: 0.5,
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
            minWidth: 160,
            bgcolor: 'background.paper',
            p: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (groupForMenu) {
              setGroupToCustomize(groupForMenu);
              setNewFolderName(groupForMenu.name);
              setSelectedColor(groupForMenu.color || '#7c3aed');
              setSelectedStyle(
                groupForMenu.emoji === 'outlined' ? 'outlined' : 'filled',
              );
              setIsCustomizeOpen(true);
            }
            setGroupMenuAnchorEl(null);
            setGroupForMenu(null);
          }}
          sx={{ fontSize: '13px', py: 1, borderRadius: '6px' }}
        >
          Rename Folder
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (groupForMenu) {
              setGroupToCustomize(groupForMenu);
              setNewFolderName(groupForMenu.name);
              setSelectedColor(groupForMenu.color || '#7c3aed');
              setSelectedStyle(
                groupForMenu.emoji === 'outlined' ? 'outlined' : 'filled',
              );
              setIsCustomizeOpen(true);
            }
            setGroupMenuAnchorEl(null);
            setGroupForMenu(null);
          }}
          sx={{ fontSize: '13px', py: 1, borderRadius: '6px' }}
        >
          Customize Style
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (groupForMenu) {
              handleDeleteProjects([groupForMenu.id]);
            }
            setGroupMenuAnchorEl(null);
            setGroupForMenu(null);
          }}
          sx={{
            fontSize: '13px',
            py: 1,
            borderRadius: '6px',
            color: 'error.main',
          }}
        >
          Delete Folder
        </MenuItem>
      </Menu>

      {/* Customize Folder Style & Name Dialog */}
      <Dialog
        open={isCustomizeOpen}
        onClose={() => {
          setIsCustomizeOpen(false);
          setGroupToCustomize(null);
        }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1.5,
            width: '520px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          Customize Folder
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
            Folder Name
          </Typography>
          <StyledTextField
            fullWidth
            placeholder="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            size="small"
            sx={{ mb: 3, maxWidth: 'none' }}
          />

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
            onClick={() => {
              setIsCustomizeOpen(false);
              setGroupToCustomize(null);
            }}
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
            disabled={!newFolderName.trim()}
            onClick={async () => {
              const group = targetGroup;
              if (group) {
                try {
                  await updateProjectGroup({
                    variables: {
                      input: {
                        id: group.id,
                        name: newFolderName.trim(),
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
              setGroupToCustomize(null);
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

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1.5,
            width: '520px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          Create New Folder
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
            Folder Name
          </Typography>
          <StyledTextField
            fullWidth
            placeholder="e.g. Sprint Plan, Personal, Marketing"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            size="small"
            sx={{ mb: 3, maxWidth: 'none' }}
          />

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
              variant={newFolderStyle === 'filled' ? 'contained' : 'outlined'}
              onClick={() => setNewFolderStyle('filled')}
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
              variant={newFolderStyle === 'outlined' ? 'contained' : 'outlined'}
              onClick={() => setNewFolderStyle('outlined')}
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
              const isSelected = newFolderColor === c.value;
              return (
                <Tooltip title={c.name} key={c.value} arrow>
                  <Box
                    onClick={() => setNewFolderColor(c.value)}
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
            onClick={() => {
              setIsCreateFolderOpen(false);
              setNewFolderName('');
            }}
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
            disabled={!newFolderName.trim()}
            onClick={async () => {
              if (newFolderName.trim()) {
                try {
                  await createProjectGroup({
                    variables: {
                      input: {
                        name: newFolderName.trim(),
                        color: newFolderColor,
                        emoji: newFolderStyle,
                      },
                    },
                  });
                  setNewFolderName('');
                  setIsCreateFolderOpen(false);
                } catch (err) {
                  console.error('Failed to create project folder:', err);
                }
              }
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            Create Folder
          </Button>
        </DialogActions>
      </Dialog>

      {/* All Projects Modal */}
      <AllProjectsModal
        open={isAllFoldersModalOpen}
        onClose={() => setIsAllFoldersModalOpen(false)}
        projects={projectGroups.map((g: ProjectGroupTypes) => ({
          id: g.id,
          name: g.name,
          userId: g.userId,
          color: g.color,
          workspaceCount: g.workspaces?.length ?? 0,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        }))}
        onSelect={(groupId) => {
          handleSelectFolder(groupId);
          setIsAllFoldersModalOpen(false);
        }}
        selectedId={selectedGroupId}
        onDeleteProjects={handleDeleteProjects}
      />
    </LibraryContainer>
  );
};
