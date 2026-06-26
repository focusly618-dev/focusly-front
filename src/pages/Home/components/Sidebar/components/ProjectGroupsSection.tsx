import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Collapse,
} from '@mui/material';
import {
  ChevronRight,
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
  NotesOutlined as NotesIcon,
} from '@mui/icons-material';
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
  } = sidebar;

  const [isSectionExpanded, setIsSectionExpanded] = useState(true);

  const totalGroupsCount = projectGroups.length;
  const totalWorkspacesCount = (workspacesData?.workspaces || []).length;
  const isEmpty = totalGroupsCount === 0 && totalWorkspacesCount === 0;

  const projectsListContent = (
    <ProjectsList>
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
          <NotesIcon
            sx={{ fontSize: 16, mr: 1, color: theme.palette.primary.main }}
          />
          <input
            autoFocus
            placeholder="Project name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateGroupInline();
              } else if (e.key === 'Escape') {
                setIsCreatingGroupInline(false);
                setNewGroupName('');
              }
            }}
            onBlur={() => {
              if (!newGroupName.trim()) {
                setIsCreatingGroupInline(false);
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
      {projectGroups.map((group: ProjectGroupTypes) => {
        const isGroupExpanded = expandedGroups[group.id] !== false;
        
        // Workspaces in this group
        const groupWorkspaces = (workspacesData?.workspaces || []).filter(
          (w: WorkspaceTypes) => w.groupId === group.id,
        );

        return (
          <Box key={group.id} sx={{ mb: 1.5 }}>
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

              <NotesIcon
                sx={{
                  fontSize: 16,
                  mr: 1,
                  color:
                    group.color ||
                    (theme.palette.mode === 'dark' ? '#a78bfa' : '#7c3aed'),
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, fontSize: '0.85rem', flex: 1 }}
                noWrap
              >
                {group.name}
              </Typography>

              <ActionButtonContainer className="hover-actions">
                <Tooltip title="New Note" arrow>
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
                  ml: 2, // Aligns guide line under group icon
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
                    <Typography sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}>
                      {w.emoji || '📄'}
                    </Typography>
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
                    <Typography sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}>
                      📄
                    </Typography>
                    <input
                      autoFocus
                      placeholder="Note name..."
                      value={newWorkspaceTitle}
                      onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateWorkspaceInline();
                        else if (e.key === 'Escape') {
                          setCreatingWorkspaceInGroupId(null);
                          setNewWorkspaceTitle('');
                        }
                      }}
                      onBlur={() => {
                        if (!newWorkspaceTitle.trim()) {
                          setCreatingWorkspaceInGroupId(null);
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
                mt: 1,
                mb: 1.5,
                opacity: theme.palette.mode === 'dark' ? 0.05 : 0.08,
              }}
            />
          </Box>
        );
      })}

      {/* General / Ungrouped Section */}
      {(() => {
        const ungroupedWorkspaces = (workspacesData?.workspaces || []).filter(
          (w: WorkspaceTypes) => !w.groupId,
        );
        const hasUngrouped =
          ungroupedWorkspaces.length > 0 ||
          creatingWorkspaceInGroupId === 'ungrouped';

        if (!hasUngrouped) return null;

        const isUngroupedExpanded = expandedGroups['ungrouped'] !== false;

        return (
          <Box sx={{ mb: 1.5 }}>
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

              <NotesIcon
                sx={{
                  fontSize: 16,
                  mr: 1,
                  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, fontSize: '0.85rem', flex: 1 }}
                noWrap
              >
                General (Ungrouped)
              </Typography>

              <ActionButtonContainer className="hover-actions">
                <Tooltip title="New Note" arrow>
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
              </ActionButtonContainer>
            </ProjectItemRow>

            {/* Expanded Ungrouped Content */}
            <Collapse in={isUngroupedExpanded} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  ml: 2,
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
                    <Typography sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}>
                      {w.emoji || '📄'}
                    </Typography>
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
                    <Typography sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}>
                      📄
                    </Typography>
                    <input
                      autoFocus
                      placeholder="Workspace name..."
                      value={newWorkspaceTitle}
                      onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateWorkspaceInline();
                        else if (e.key === 'Escape') {
                          setCreatingWorkspaceInGroupId(null);
                          setNewWorkspaceTitle('');
                        }
                      }}
                      onBlur={() => {
                        if (!newWorkspaceTitle.trim()) {
                          setCreatingWorkspaceInGroupId(null);
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
                mt: 1,
                mb: 1.5,
                opacity: theme.palette.mode === 'dark' ? 0.05 : 0.08,
              }}
            />
          </Box>
        );
      })()}
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
