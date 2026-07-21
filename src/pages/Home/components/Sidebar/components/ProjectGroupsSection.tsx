import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PROJECT_GROUP } from '@/pages/Workspace/Workspace.graphql';
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
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
  Folder as FolderIcon,
  FolderOutlined as FolderOutlinedIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  FolderOff as FolderOffIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import {
  ProjectsList,
  ProjectItemRow,
  ActionButtonContainer,
} from '../Sidebar.styles';
import type { UseSidebarReturn } from '../hooks/useSidebar';
import type {
  ProjectGroupTypes,
  WorkspaceTypes,
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

const WorkspaceCountBadge = ({ count }: { count: number }) => (
  <Typography
    variant="caption"
    sx={{
      ml: 0.5,
      px: 0.7,
      py: 0.1,
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: 'text.secondary',
      bgcolor: (theme) =>
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.06)'
          : 'rgba(0, 0, 0, 0.05)',
    }}
  >
    {count}
  </Typography>
);

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
    isCreatingGroupInline,
    newGroupName,
    setNewGroupName,
    setCreatingWorkspaceInGroupId,
    handleSelectGroup,
    handleOpenMenu,
    handleCreateGroupInline,
    setIsCreatingGroupInline,
    selectedGroupId,
    editingGroupId,
    setEditingGroupId,
    editingGroupName,
    setEditingGroupName,
    handleRenameGroupSubmit,
  } = sidebar;

  const [isSectionExpanded, setIsSectionExpanded] = useState(true);
  const [customizingGroup, setCustomizingGroup] =
    useState<ProjectGroupTypes | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#7c3aed');
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

  const [folderQuery, setFolderQuery] = useState('');

  const filteredProjectGroups = projectGroups.filter((group) =>
    group.name.toLowerCase().includes(folderQuery.toLowerCase()),
  );

  const allWorkspaces = workspacesData?.workspaces || [];
  const totalGroupsCount = projectGroups.length;
  const totalWorkspacesCount = allWorkspaces.length;
  const isEmpty = totalGroupsCount === 0 && totalWorkspacesCount === 0;

  const getWorkspaceCountForGroup = (groupId: string) =>
    allWorkspaces.filter((w: WorkspaceTypes) => w.groupId === groupId).length;

  const projectsListContent = (
    <ProjectsList>
      {/* All Folders — pinned, cannot be renamed or deleted */}
      <Box sx={{ mb: 0.5 }}>
        <ProjectItemRow
          isActive={isWorkspaceTab && !selectedGroupId && !selectedWorkspaceId}
          onClick={() => handleSelectGroup(null)}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.2,
              mr: 0.5,
            }}
          >
            <FolderIcon
              sx={{
                fontSize: 16,
                color: theme.palette.mode === 'dark' ? '#a78bfa' : '#7c3aed',
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, fontSize: '0.85rem', flex: 1 }}
            noWrap
          >
            All folders
          </Typography>
          <WorkspaceCountBadge count={totalWorkspacesCount} />
        </ProjectItemRow>

        <Divider
          sx={{
            mt: 0.5,
            opacity: theme.palette.mode === 'dark' ? 0.05 : 0.08,
          }}
        />
      </Box>

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
                e.preventDefault();
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
            onBlur={(e) => {
              // Don't blur-submit if user clicked the confirm button
              const relatedTarget = e.relatedTarget as HTMLElement | null;
              if (relatedTarget?.closest('.create-group-confirm')) return;
              if (!newGroupName.trim()) {
                setIsCreatingGroupInline(false);
                setNewGroupName('');
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
          <Tooltip title="Create project" arrow>
            <IconButton
              className="create-group-confirm"
              size="small"
              onClick={() => {
                if (newGroupName.trim()) {
                  handleCreateGroupInline();
                }
              }}
              sx={{
                ml: 0.5,
                p: 0.4,
                color: newGroupName.trim()
                  ? theme.palette.primary.main
                  : theme.palette.text.disabled,
                bgcolor: newGroupName.trim()
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(99, 102, 241, 0.08)'
                  : 'transparent',
                borderRadius: '6px',
                '&:hover': {
                  bgcolor: newGroupName.trim()
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.25)'
                      : 'rgba(99, 102, 241, 0.15)'
                    : 'transparent',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <CheckIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
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

              <WorkspaceCountBadge
                count={getWorkspaceCountForGroup(group.id)}
              />

              <ActionButtonContainer className="hover-actions">
                <Tooltip title="New Note" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreatingWorkspaceInGroupId((prev) =>
                        prev === group.id ? null : group.id,
                      );
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

            <Divider
              sx={{
                opacity: theme.palette.mode === 'dark' ? 0.05 : 0.08,
              }}
            />
          </Box>
        );
      })}

      {/* Search Empty State */}
      {folderQuery && filteredProjectGroups.length === 0 && (
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
