import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PROJECT_GROUP } from '@/pages/Workspace/workspaces.graphql';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import type { Theme } from '@mui/material';
import {
  ChevronRight,
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  FolderOff as FolderOffIcon,
} from '@mui/icons-material';
import { DefaultNoteIcon } from '@/components/ui';
import {
  ProjectsList,
  ProjectItemRow,
  WorkspaceItemRow,
  ActionButtonContainer,
} from '../Sidebar.styles';
import type { UseSidebarReturn } from '../hooks/useSidebar';
import type {
  WorkspaceTypes,
  ProjectGroupTypes,
} from '@/pages/Workspace/types/workspace.types';

interface InlineRenameInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  theme: Theme;
}

const InlineRenameInput = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  theme,
}: InlineRenameInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    mountTimeRef.current = Date.now();
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 80); // 80ms delay gives enough time for the menu transition to complete
    return () => clearTimeout(timer);
  }, []);

  const handleBlur = () => {
    if (Date.now() - mountTimeRef.current < 250) {
      inputRef.current?.focus();
      return;
    }
    onSubmit();
  };

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSubmit();
        } else if (e.key === 'Escape') {
          onCancel();
        }
      }}
      onBlur={handleBlur}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: theme.palette.text.primary,
        fontSize: '0.85rem',
        fontFamily: 'inherit',
        fontWeight: 700,
        width: '100%',
      }}
    />
  );
};

interface ProjectGroupsSectionProps {
  sidebar: UseSidebarReturn;
  hideHeader?: boolean;
}

export const ProjectGroupsSection = ({
  sidebar,
  hideHeader = false,
}: ProjectGroupsSectionProps) => {
  const {
    theme,
    projectGroups,
    workspacesData,
    isWorkspaceTab,
    selectedWorkspaceId,
    expandedGroups,
    isCreatingGroupInline,
    newGroupName,
    setNewGroupName,
    creatingWorkspaceInGroupId,
    setCreatingWorkspaceInGroupId,
    newWorkspaceTitle,
    setNewWorkspaceTitle,
    toggleGroupExpand,
    handleSelectGroup,
    handleSelectWorkspace,
    handleOpenMenu,
    handleCreateWorkspaceInline,
    handleCreateGroupInline,
    setIsCreatingGroupInline,
    setExpandedGroups,
    selectedGroupId,
    ungroupedName,
    editingGroupId,
    setEditingGroupId,
    editingGroupName,
    setEditingGroupName,
    handleRenameGroupSubmit,
  } = sidebar;

  const [isSectionExpanded, setIsSectionExpanded] = useState(true);
  const [customizingGroup, setCustomizingGroup] = useState<
    | ProjectGroupTypes
    | { id: string; name: string; color?: string; emoji?: string }
    | null
  >(null);
  const [selectedColor, setSelectedColor] = useState<string>('#7c3aed');
  const [selectedStyle, setSelectedStyle] = useState<'filled' | 'outlined'>(
    'filled',
  );
  const [ungroupedColor, setUngroupedColor] = useState<string>(
    () => localStorage.getItem('ungrouped_group_color') || '#64748b',
  );
  const [ungroupedEmoji, setUngroupedEmoji] = useState<string>(
    () => localStorage.getItem('ungrouped_group_emoji') || 'filled',
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

  const [folderQuery, setFolderQuery] = useState('');

  const filteredProjectGroups = projectGroups.filter((group) =>
    group.name.toLowerCase().includes(folderQuery.toLowerCase()),
  );

  const ungroupedWorkspaces = (workspacesData?.workspaces || []).filter(
    (w: WorkspaceTypes) => !w.groupId,
  );
  const matchesUngroupedQuery =
    !folderQuery ||
    ungroupedName.toLowerCase().includes(folderQuery.toLowerCase());
  const hasUngroupedActive =
    (ungroupedWorkspaces.length > 0 ||
      creatingWorkspaceInGroupId === 'ungrouped') &&
    matchesUngroupedQuery;

  const totalGroupsCount = projectGroups.length;
  const totalWorkspacesCount = (workspacesData?.workspaces || []).length;
  const isEmpty = totalGroupsCount === 0 && totalWorkspacesCount === 0;

  const projectsListContent = (
    <ProjectsList>
      {/* Folder Search Bar */}
      {projectGroups.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1.5,
            px: 1,
            py: 0.5,
            borderRadius: '8px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(0, 0, 0, 0.02)',
            border: (theme) =>
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.05)'
                : '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <SearchIcon
            sx={{ fontSize: 16, color: 'text.secondary', mr: 0.75 }}
          />
          <input
            placeholder="Search folders..."
            value={folderQuery}
            onChange={(e) => setFolderQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.palette.text.primary,
              fontSize: '0.8rem',
              fontFamily: 'inherit',
              width: '100%',
            }}
          />
          {folderQuery && (
            <IconButton
              size="small"
              onClick={() => setFolderQuery('')}
              sx={{ p: 0, color: 'text.disabled' }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>
      )}
      {/* Inline Group Creation */}
      {isCreatingGroupInline && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 8px',
            borderRadius: '6px',
            mb: 1,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.02)',
          }}
        >
          <FolderIcon
            sx={{ fontSize: 16, mr: 1, color: theme.palette.primary.main }}
          />
          <input
            autoFocus
            placeholder="New project name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (newGroupName.trim()) {
                  handleCreateGroupInline();
                } else {
                  setIsCreatingGroupInline(false);
                  setNewGroupName('');
                }
              } else if (e.key === 'Escape') {
                setIsCreatingGroupInline(false);
                setNewGroupName('');
              }
            }}
            onBlur={() => {
              if (!newGroupName.trim()) {
                setIsCreatingGroupInline(false);
                setNewGroupName('');
              } else {
                handleCreateGroupInline();
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.palette.text.primary,
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              width: '100%',
            }}
          />
        </Box>
      )}

      {/* Dynamic Project Groups Empty State */}
      {isEmpty && !isCreatingGroupInline && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontStyle: 'italic' }}
          >
            No projects yet. Click + to create one.
          </Typography>
        </Box>
      )}

      {/* Group Mapping */}
      {filteredProjectGroups.map((group: ProjectGroupTypes) => {
        const isGroupExpanded = expandedGroups[group.id] !== false;

        // Workspaces in this group
        const groupWorkspaces = (workspacesData?.workspaces || []).filter(
          (w: WorkspaceTypes) => w.groupId === group.id,
        );

        return (
          <Box key={group.id} sx={{ mb: 0.5 }}>
            {/* Group Header */}
            <ProjectItemRow
              isActive={
                isWorkspaceTab &&
                selectedGroupId === group.id &&
                !selectedWorkspaceId
              }
              onClick={() => handleSelectGroup(group.id)}
              sx={{ '&:hover .hover-actions': { opacity: 1 } }}
            >
              <IconButton
                size="small"
                onClick={(e) => toggleGroupExpand(group.id, e)}
                sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
              >
                {isGroupExpanded ? (
                  <ExpandMore fontSize="inherit" />
                ) : (
                  <ChevronRight fontSize="inherit" />
                )}
              </IconButton>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomizingGroup(group);
                  setSelectedColor(group.color || '#7c3aed');
                  setSelectedStyle(
                    group.emoji === 'outlined' ? 'outlined' : 'filled',
                  );
                }}
                sx={{
                  p: 0.2,
                  mr: 0.5,
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                {group.emoji === 'outlined' ? (
                  <FolderOutlinedIcon
                    sx={{
                      fontSize: 16,
                      color:
                        group.color ||
                        (theme.palette.mode === 'dark' ? '#a78bfa' : '#7c3aed'),
                    }}
                  />
                ) : (
                  <FolderIcon
                    sx={{
                      fontSize: 16,
                      color:
                        group.color ||
                        (theme.palette.mode === 'dark' ? '#a78bfa' : '#7c3aed'),
                    }}
                  />
                )}
              </IconButton>
              {editingGroupId === group.id ? (
                <InlineRenameInput
                  value={editingGroupName}
                  onChange={setEditingGroupName}
                  onSubmit={handleRenameGroupSubmit}
                  onCancel={() => {
                    setEditingGroupId(null);
                    setEditingGroupName('');
                  }}
                  theme={theme}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, fontSize: '0.85rem', flex: 1 }}
                  noWrap
                >
                  {group.name}
                </Typography>
              )}

              <ActionButtonContainer className="hover-actions">
                <Tooltip title="New Workspace" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreatingWorkspaceInGroupId((prev) =>
                        prev === group.id ? null : group.id,
                      );
                      setExpandedGroups((prev) => ({
                        ...prev,
                        [group.id]: true,
                      }));
                    }}
                    sx={{
                      p: 0.2,
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={(e) => handleOpenMenu(e, 'group', group)}
                  sx={{ p: 0.2, color: 'text.secondary' }}
                >
                  <MoreHorizIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </ActionButtonContainer>
            </ProjectItemRow>

            {/* Expanded Group Content */}
            <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  ml: 4.5, // Aligns guide line under folder icon
                  pl: 0,
                  borderLeft: `1px solid ${
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.08)'
                  }`,
                  mt: 0.5,
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                }}
              >
                {groupWorkspaces.length === 0 &&
                  creatingWorkspaceInGroupId !== group.id && (
                    <Typography
                      variant="caption"
                      sx={{
                        pl: 2.25,
                        py: 0.5,
                        display: 'block',
                        color: 'text.disabled',
                        fontStyle: 'italic',
                      }}
                    >
                      No notes
                    </Typography>
                  )}

                {groupWorkspaces.map((w: WorkspaceTypes) => (
                  <WorkspaceItemRow
                    key={w.id}
                    isActive={isWorkspaceTab && selectedWorkspaceId === w.id}
                    onClick={() => handleSelectWorkspace(w)}
                  >
                    {w.emoji ? (
                      <Typography
                        sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}
                      >
                        {w.emoji}
                      </Typography>
                    ) : (
                      <DefaultNoteIcon
                        sx={{
                          fontSize: 16,
                          mr: 1,
                          color: 'text.secondary',
                          opacity: 0.85,
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ flex: 1, textOverflow: 'ellipsis' }}
                    >
                      {w.title || 'Untitled note'}
                    </Typography>
                    <ActionButtonContainer className="hover-actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, 'workspace', w)}
                        sx={{ p: 0.2, color: 'text.secondary' }}
                      >
                        <MoreHorizIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </ActionButtonContainer>
                  </WorkspaceItemRow>
                ))}

                {creatingWorkspaceInGroupId === group.id && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '7px 8px 7px 18px',
                      borderRadius: '6px',
                      mb: 0.5,
                      position: 'relative',
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(0,0,0,0.02)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        width: 12,
                        height: 1,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <DefaultNoteIcon
                      sx={{
                        fontSize: 16,
                        mr: 1,
                        color: 'text.secondary',
                        opacity: 0.85,
                      }}
                    />
                    <input
                      autoFocus
                      placeholder="New workspace name..."
                      value={newWorkspaceTitle}
                      onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (newWorkspaceTitle.trim()) {
                            handleCreateWorkspaceInline();
                          } else {
                            setCreatingWorkspaceInGroupId(null);
                            setNewWorkspaceTitle('');
                          }
                        } else if (e.key === 'Escape') {
                          setCreatingWorkspaceInGroupId(null);
                          setNewWorkspaceTitle('');
                        }
                      }}
                      onBlur={() => {
                        if (!newWorkspaceTitle.trim()) {
                          setCreatingWorkspaceInGroupId(null);
                          setNewWorkspaceTitle('');
                        } else handleCreateWorkspaceInline();
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: theme.palette.text.primary,
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        width: '100%',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Collapse>

            <Divider
              sx={{
                opacity: theme.palette.mode === 'dark' ? 0.05 : 0.08,
              }}
            />
          </Box>
        );
      })}

      {/* General / Ungrouped Section */}
      {(() => {
        if (!hasUngroupedActive) return null;

        const isUngroupedExpanded = expandedGroups['ungrouped'] !== false;

        return (
          <Box sx={{ mb: 0.5 }}>
            {/* Ungrouped Header */}
            <ProjectItemRow
              isActive={false}
              onClick={() => {}}
              sx={{ '&:hover .hover-actions': { opacity: 1 } }}
            >
              <IconButton
                size="small"
                onClick={(e) => toggleGroupExpand('ungrouped', e)}
                sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
              >
                {isUngroupedExpanded ? (
                  <ExpandMore fontSize="inherit" />
                ) : (
                  <ChevronRight fontSize="inherit" />
                )}
              </IconButton>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setCustomizingGroup({ id: 'ungrouped', name: ungroupedName });
                  setSelectedColor(ungroupedColor);
                  setSelectedStyle(ungroupedEmoji as 'filled' | 'outlined');
                }}
                sx={{
                  p: 0.2,
                  mr: 0.5,
                  '&:hover': {
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                {ungroupedEmoji === 'outlined' ? (
                  <FolderOutlinedIcon
                    sx={{
                      fontSize: 16,
                      color: ungroupedColor,
                    }}
                  />
                ) : (
                  <FolderIcon
                    sx={{
                      fontSize: 16,
                      color: ungroupedColor,
                    }}
                  />
                )}
              </IconButton>
              {editingGroupId === 'ungrouped' ? (
                <InlineRenameInput
                  value={editingGroupName}
                  onChange={setEditingGroupName}
                  onSubmit={handleRenameGroupSubmit}
                  onCancel={() => {
                    setEditingGroupId(null);
                    setEditingGroupName('');
                  }}
                  theme={theme}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, fontSize: '0.85rem', flex: 1 }}
                  noWrap
                >
                  {ungroupedName}
                </Typography>
              )}

              <ActionButtonContainer className="hover-actions">
                <Tooltip title="New Workspace" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreatingWorkspaceInGroupId((prev) =>
                        prev === 'ungrouped' ? null : 'ungrouped',
                      );
                      setExpandedGroups((prev) => ({
                        ...prev,
                        ungrouped: true,
                      }));
                    }}
                    sx={{
                      p: 0.2,
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={(e) =>
                    handleOpenMenu(e, 'group', {
                      id: 'ungrouped',
                      name: ungroupedName,
                    } as unknown as ProjectGroupTypes)
                  }
                  sx={{ p: 0.2, color: 'text.secondary' }}
                >
                  <MoreHorizIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </ActionButtonContainer>
            </ProjectItemRow>

            {/* Expanded Ungrouped Content */}
            <Collapse in={isUngroupedExpanded} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  ml: 4.5,
                  pl: 0,
                  borderLeft: `1px solid ${
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.08)'
                  }`,
                  mt: 0.5,
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                }}
              >
                {ungroupedWorkspaces.length === 0 &&
                  creatingWorkspaceInGroupId !== 'ungrouped' && (
                    <Typography
                      variant="caption"
                      sx={{
                        pl: 2.25,
                        py: 0.5,
                        display: 'block',
                        color: 'text.disabled',
                        fontStyle: 'italic',
                      }}
                    >
                      No notes
                    </Typography>
                  )}

                {ungroupedWorkspaces.map((w: WorkspaceTypes) => (
                  <WorkspaceItemRow
                    key={w.id}
                    isActive={isWorkspaceTab && selectedWorkspaceId === w.id}
                    onClick={() => handleSelectWorkspace(w)}
                  >
                    {w.emoji ? (
                      <Typography
                        sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}
                      >
                        {w.emoji}
                      </Typography>
                    ) : (
                      <DefaultNoteIcon
                        sx={{
                          fontSize: 16,
                          mr: 1,
                          color: 'text.secondary',
                          opacity: 0.85,
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ flex: 1, textOverflow: 'ellipsis' }}
                    >
                      {w.title || 'Untitled note'}
                    </Typography>
                    <ActionButtonContainer className="hover-actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, 'workspace', w)}
                        sx={{ p: 0.2, color: 'text.secondary' }}
                      >
                        <MoreHorizIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </ActionButtonContainer>
                  </WorkspaceItemRow>
                ))}

                {creatingWorkspaceInGroupId === 'ungrouped' && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '7px 8px 7px 18px',
                      borderRadius: '6px',
                      mb: 0.5,
                      position: 'relative',
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(0,0,0,0.02)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        width: 12,
                        height: 1,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <DefaultNoteIcon
                      sx={{
                        fontSize: 16,
                        mr: 1,
                        color: 'text.secondary',
                        opacity: 0.85,
                      }}
                    />
                    <input
                      autoFocus
                      placeholder="New workspace name..."
                      value={newWorkspaceTitle}
                      onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (newWorkspaceTitle.trim()) {
                            handleCreateWorkspaceInline();
                          } else {
                            setCreatingWorkspaceInGroupId(null);
                            setNewWorkspaceTitle('');
                          }
                        } else if (e.key === 'Escape') {
                          setCreatingWorkspaceInGroupId(null);
                          setNewWorkspaceTitle('');
                        }
                      }}
                      onBlur={() => {
                        if (!newWorkspaceTitle.trim()) {
                          setCreatingWorkspaceInGroupId(null);
                          setNewWorkspaceTitle('');
                        } else handleCreateWorkspaceInline();
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: theme.palette.text.primary,
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        width: '100%',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Collapse>

            <Divider
              sx={{
                mt: 0.5,
                mb: 0.5,
                opacity: theme.palette.mode === 'dark' ? 0.05 : 0.08,
              }}
            />
          </Box>
        );
      })()}

      {/* Search Empty State */}
      {folderQuery &&
        filteredProjectGroups.length === 0 &&
        !hasUngroupedActive && (
          <Box
            sx={{
              py: 4,
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              textAlign: 'center',
            }}
          >
            <FolderOffIcon
              sx={{
                fontSize: 32,
                color: 'text.disabled',
                opacity: 0.6,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.8rem',
              }}
            >
              No folders match "{folderQuery}"
            </Typography>
          </Box>
        )}

      <Dialog
        open={Boolean(customizingGroup)}
        onClose={() => setCustomizingGroup(null)}
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
            Icon Style
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
              <FolderIcon sx={{ fontSize: 24 }} />
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
            onClick={() => setCustomizingGroup(null)}
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
              if (customizingGroup) {
                if (customizingGroup.id === 'ungrouped') {
                  localStorage.setItem('ungrouped_group_color', selectedColor);
                  localStorage.setItem('ungrouped_group_emoji', selectedStyle);
                  setUngroupedColor(selectedColor);
                  setUngroupedEmoji(selectedStyle);
                  window.location.reload();
                } else {
                  try {
                    await updateProjectGroup({
                      variables: {
                        input: {
                          id: customizingGroup.id,
                          color: selectedColor,
                          emoji: selectedStyle,
                        },
                      },
                    });
                  } catch (err) {
                    console.error('Failed to update group styling:', err);
                  }
                }
              }
              setCustomizingGroup(null);
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
    </ProjectsList>
  );

  if (hideHeader) {
    return projectsListContent;
  }

  return (
    <>
      <Box
        sx={{
          px: 3,
          pt: 1,
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Box
          onClick={() => setIsSectionExpanded((prev) => !prev)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            gap: 0.5,
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
            }}
          >
            Projects & Docs
          </Typography>
          <IconButton size="small" sx={{ p: 0.2, color: 'text.secondary' }}>
            {isSectionExpanded ? (
              <ExpandLess sx={{ fontSize: 16 }} />
            ) : (
              <ExpandMore sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Box>
        <Tooltip title="New Project" arrow>
          <IconButton
            size="small"
            onClick={() => setIsCreatingGroupInline((prev) => !prev)}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={isSectionExpanded}>{projectsListContent}</Collapse>
    </>
  );
};
