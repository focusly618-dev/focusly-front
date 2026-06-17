import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Collapse,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    creatingWorkspaceInFolderId,
    setCreatingWorkspaceInFolderId,
    setCreatingWorkspaceInGroupId,
    newWorkspaceTitle,
    setNewWorkspaceTitle,
    toggleGroupExpand,
    handleSelectGroup,
    handleSelectWorkspace,
    handleOpenMenu,
    handleCreateGroupInline,
    handleCreateWorkspaceInline,
    setIsCreatingGroupInline,
    setExpandedGroups,
    selectedGroupId,
    editingGroupId,
    setEditingGroupId,
    editingGroupName,
    setEditingGroupName,
    handleRenameGroup,
  } = sidebar;

  const [isSectionExpanded, setIsSectionExpanded] = useState(true);

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
            placeholder={t('Project name...')}
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

      {/* Dynamic Project Groups */}
      {projectGroups.length === 0 && !isCreatingGroupInline && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontStyle: 'italic' }}
          >
            {t('No projects yet. Click + to create one.')}
          </Typography>
        </Box>
      )}

      {projectGroups.map((group: ProjectGroupTypes) => {
        const isGroupExpanded = expandedGroups[group.id] !== false;
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
              {editingGroupId === group.id ? (
                <input
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  value={editingGroupName}
                  onChange={(e) => setEditingGroupName(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      const trimmed = editingGroupName.trim();
                      if (trimmed && trimmed !== group.name) {
                        await handleRenameGroup(group.id, trimmed);
                      }
                      setEditingGroupId(null);
                    } else if (e.key === 'Escape') {
                      setEditingGroupId(null);
                    }
                  }}
                  onBlur={async () => {
                    const trimmed = editingGroupName.trim();
                    if (trimmed && trimmed !== group.name) {
                      await handleRenameGroup(group.id, trimmed);
                    }
                    setEditingGroupId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.04)',
                    border: 'none',
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    outline: 'none',
                    color: theme.palette.text.primary,
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    width: '100%',
                    padding: '2px 6px',
                    borderRadius: '4px 4px 0 0',
                  }}
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
                <Tooltip title={t('New Note')} arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreatingWorkspaceInFolderId((prev) =>
                        prev === `general-${group.id}`
                          ? null
                          : `general-${group.id}`,
                      );
                      setCreatingWorkspaceInGroupId(group.id);
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
            {isGroupExpanded && (
              <Box sx={{ pl: 1 }}>
                <Box sx={{ mt: 0.5 }}>
                  {groupWorkspaces.length === 0 &&
                    creatingWorkspaceInFolderId !== `general-${group.id}` && (
                      <Typography
                        variant="caption"
                        sx={{
                          pl: 4,
                          py: 0.5,
                          display: 'block',
                          color: 'text.disabled',
                          fontStyle: 'italic',
                        }}
                      >
                        {t('No notes')}
                      </Typography>
                    )}

                  {groupWorkspaces.map((w: WorkspaceTypes) => (
                    <WorkspaceItemRow
                      key={w.id}
                      isActive={isWorkspaceTab && selectedWorkspaceId === w.id}
                      onClick={() => handleSelectWorkspace(w)}
                      sx={{ pl: 4 }}
                    >
                      <Typography
                        sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}
                      >
                        {w.emoji || '📄'}
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ flex: 1, textOverflow: 'ellipsis' }}
                      >
                        {w.title || t('Untitled note')}
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

                  {creatingWorkspaceInFolderId === `general-${group.id}` && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px 8px 6px 32px',
                        borderRadius: '6px',
                        mb: 0.5,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <Typography
                        sx={{ mr: 1, fontSize: '1rem', lineHeight: 1 }}
                      >
                        📄
                      </Typography>
                      <input
                        autoFocus
                        placeholder={t('Note name...')}
                        value={newWorkspaceTitle}
                        onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateWorkspaceInline();
                          else if (e.key === 'Escape') {
                            setCreatingWorkspaceInFolderId(null);
                            setCreatingWorkspaceInGroupId(null);
                            setNewWorkspaceTitle('');
                          }
                        }}
                        onBlur={() => {
                          if (!newWorkspaceTitle.trim()) {
                            setCreatingWorkspaceInFolderId(null);
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
              </Box>
            )}

            <Divider sx={{ my: 0.5, opacity: 0.2 }} />
          </Box>
        );
      })}
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
            {t('Projects & Docs')}
          </Typography>
          <IconButton size="small" sx={{ p: 0.2, color: 'text.secondary' }}>
            {isSectionExpanded ? (
              <ExpandLess sx={{ fontSize: 16 }} />
            ) : (
              <ExpandMore sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Box>
        <Tooltip title={t('New Project')} arrow>
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
