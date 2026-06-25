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
  ColorDot,
} from '../Sidebar.styles';
import type { UseSidebarReturn } from '../hooks/useSidebar';
import type {
  WorkspaceTypes,
  ProjectGroupTypes,
  ProjectTypes,
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
    projectsData,
    workspacesData,
    isWorkspaceTab,
    selectedWorkspaceId,
    selectedProjectId,
    expandedGroups,
    expandedProjects,
    isCreatingGroupInline,
    newGroupName,
    setNewGroupName,
    creatingFolderInGroupId,
    setCreatingFolderInGroupId,
    creatingWorkspaceInFolderId,
    setCreatingWorkspaceInFolderId,
    setCreatingWorkspaceInGroupId,
    newFolderName,
    setNewFolderName,
    newWorkspaceTitle,
    setNewWorkspaceTitle,
    toggleGroupExpand,
    toggleProjectExpand,
    handleSelectGroup,
    handleSelectProject,
    handleSelectWorkspace,
    handleOpenMenu,
    handleCreateGroupInline,
    handleCreateFolderInline,
    handleCreateWorkspaceInline,
    setIsCreatingGroupInline,
    setExpandedGroups,
    setExpandedProjects,
    selectedGroupId,
  } = sidebar;

  const [isSectionExpanded, setIsSectionExpanded] = useState(true);

  const totalGroupsCount = projectGroups.length;
  const totalFoldersCount = (projectsData?.projects || []).length;
  const totalWorkspacesCount = (workspacesData?.workspaces || []).length;
  const isEmpty =
    totalGroupsCount === 0 &&
    totalFoldersCount === 0 &&
    totalWorkspacesCount === 0;

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
        
        // General workspaces in this group (no project/folder)
        const groupGeneralWorkspaces = (workspacesData?.workspaces || []).filter(
          (w: WorkspaceTypes) => w.groupId === group.id && !w.projectId,
        );

        // Folders in this group
        const groupFolders = (projectsData?.projects || []).filter(
          (f: ProjectTypes) => f.groupId === group.id,
        );

        return (
          <Box key={group.id} sx={{ mb: 1.5 }}>
            {/* Group Header */}
            <ProjectItemRow
              isActive={
                isWorkspaceTab &&
                selectedGroupId === group.id &&
                !selectedWorkspaceId &&
                !selectedProjectId
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
                <Tooltip title="New Folder" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreatingFolderInGroupId((prev) =>
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
            {isGroupExpanded && (
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
                  gap: 0.5,
                }}
              >
                {/* Espacios de trabajo (General workspaces in this group) */}
                <Box>
                  <ProjectItemRow
                    isActive={false}
                    onClick={() => {}}
                    sx={{ py: 0.5, '&:hover .hover-actions': { opacity: 1 } }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => toggleProjectExpand(`general-${group.id}`, e)}
                      sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
                    >
                      {expandedProjects[`general-${group.id}`] !== false ? (
                        <ExpandMore fontSize="inherit" />
                      ) : (
                        <ChevronRight fontSize="inherit" />
                      )}
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.disabled',
                        textTransform: 'uppercase',
                        fontSize: '0.68rem',
                        letterSpacing: '0.05em',
                        flex: 1,
                      }}
                    >
                      Espacios de trabajo
                    </Typography>
                    <ActionButtonContainer className="hover-actions">
                      <Tooltip title="New Note" arrow>
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
                            setExpandedProjects((prev) => ({
                              ...prev,
                              [`general-${group.id}`]: true,
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

                  {expandedProjects[`general-${group.id}`] !== false && (
                    <Box
                      sx={{
                        ml: 1.5,
                        pl: 0,
                        borderLeft: `1px dashed ${
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.08)'
                        }`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.25,
                      }}
                    >
                      {groupGeneralWorkspaces.length === 0 &&
                        creatingWorkspaceInFolderId !== `general-${group.id}` && (
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

                      {groupGeneralWorkspaces.map((w: WorkspaceTypes) => (
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

                      {creatingWorkspaceInFolderId === `general-${group.id}` && (
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
                  )}
                </Box>

                {/* Espacios de equipo (Folders in this group) */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      pt: 1,
                      pb: 0.5,
                      display: 'block',
                      fontWeight: 700,
                      color: 'text.disabled',
                      textTransform: 'uppercase',
                      fontSize: '0.68rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Espacios de equipo
                  </Typography>

                  <Box
                    sx={{
                      ml: 1.5,
                      pl: 0,
                      borderLeft: `1px dashed ${
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.08)'
                      }`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                    }}
                  >
                    {groupFolders.map((project: ProjectTypes) => {
                      const isFolderExpanded = expandedProjects[project.id];
                      const folderWorkspaces = (workspacesData?.workspaces || []).filter(
                        (w: WorkspaceTypes) => w.projectId === project.id,
                      );
                      const isProjectActive =
                        selectedProjectId === project.id && !selectedWorkspaceId;

                      return (
                        <Box key={project.id}>
                          <ProjectItemRow
                            isActive={isWorkspaceTab && isProjectActive}
                            onClick={() => handleSelectProject(project.id)}
                            sx={{ '&:hover .hover-actions': { opacity: 1 } }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => toggleProjectExpand(project.id, e)}
                              sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
                            >
                              {isFolderExpanded ? (
                                <ExpandMore fontSize="inherit" />
                              ) : (
                                <ChevronRight fontSize="inherit" />
                              )}
                            </IconButton>
                            <ColorDot color={project.color} sx={{ mr: 1.2 }} />
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                flex: 1,
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {project.name}
                            </Typography>
                            <ActionButtonContainer className="hover-actions">
                              <Tooltip title="Add note under folder" arrow>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCreatingWorkspaceInFolderId((prev) =>
                                      prev === project.id ? null : project.id,
                                    );
                                    setCreatingWorkspaceInGroupId(group.id);
                                    setExpandedProjects((prev) => ({
                                      ...prev,
                                      [project.id]: true,
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
                                  handleOpenMenu(e, 'project', project)
                                }
                                sx={{ p: 0.2, color: 'text.secondary' }}
                              >
                                <MoreHorizIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </ActionButtonContainer>
                          </ProjectItemRow>

                          {isFolderExpanded && (
                            <Box
                              sx={{
                                ml: 1.5,
                                pl: 0,
                                borderLeft: `1px dotted ${
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.08)'
                                }`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.25,
                              }}
                            >
                              {folderWorkspaces.length === 0 &&
                                creatingWorkspaceInFolderId !== project.id && (
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
                                    No notes inside
                                  </Typography>
                                )}

                              {folderWorkspaces.map((w: WorkspaceTypes) => (
                                <WorkspaceItemRow
                                  key={w.id}
                                  isActive={
                                    isWorkspaceTab &&
                                    selectedWorkspaceId === w.id
                                  }
                                  onClick={() => handleSelectWorkspace(w)}
                                >
                                  <Typography
                                    sx={{
                                      mr: 1,
                                      fontSize: '1rem',
                                      lineHeight: 1,
                                    }}
                                  >
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
                                      onClick={(e) =>
                                        handleOpenMenu(e, 'workspace', w)
                                      }
                                      sx={{ p: 0.2, color: 'text.secondary' }}
                                    >
                                      <MoreHorizIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </ActionButtonContainer>
                                </WorkspaceItemRow>
                              ))}

                              {creatingWorkspaceInFolderId === project.id && (
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
                                  <Typography
                                    sx={{
                                      mr: 1,
                                      fontSize: '1rem',
                                      lineHeight: 1,
                                    }}
                                  >
                                    📄
                                  </Typography>
                                  <input
                                    autoFocus
                                    placeholder="Workspace name..."
                                    value={newWorkspaceTitle}
                                    onChange={(e) =>
                                      setNewWorkspaceTitle(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter')
                                        handleCreateWorkspaceInline();
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
                          )}
                        </Box>
                      );
                    })}

                    {/* Inline Folder Creation within this group */}
                    {creatingFolderInGroupId === group.id && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '6px 8px 6px 18px',
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
                        <ColorDot color="#3b82f6" sx={{ mr: 1.2 }} />
                        <input
                          autoFocus
                          placeholder="Folder name..."
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter')
                              handleCreateFolderInline(group.id);
                            else if (e.key === 'Escape') {
                              setCreatingFolderInGroupId(null);
                              setNewFolderName('');
                            }
                          }}
                          onBlur={() => {
                            if (!newFolderName.trim())
                              setCreatingFolderInGroupId(null);
                            else handleCreateFolderInline(group.id);
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
              </Box>
            )}

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
        const ungroupedFolders = (projectsData?.projects || []).filter(
          (f: ProjectTypes) => !f.groupId,
        );
        const ungroupedWorkspaces = (workspacesData?.workspaces || []).filter(
          (w: WorkspaceTypes) => !w.groupId && !w.projectId,
        );
        const hasUngrouped =
          ungroupedFolders.length > 0 ||
          ungroupedWorkspaces.length > 0 ||
          creatingFolderInGroupId === 'ungrouped' ||
          creatingWorkspaceInFolderId === 'general-ungrouped';

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
                <Tooltip title="New Folder" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreatingFolderInGroupId((prev) =>
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
            {isUngroupedExpanded && (
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
                  gap: 0.5,
                }}
              >
                {/* Espacios de trabajo (Ungrouped general workspaces) */}
                <Box>
                  <ProjectItemRow
                    isActive={false}
                    onClick={() => {}}
                    sx={{ py: 0.5, '&:hover .hover-actions': { opacity: 1 } }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => toggleProjectExpand('general-ungrouped', e)}
                      sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
                    >
                      {expandedProjects['general-ungrouped'] !== false ? (
                        <ExpandMore fontSize="inherit" />
                      ) : (
                        <ChevronRight fontSize="inherit" />
                      )}
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'text.disabled',
                        textTransform: 'uppercase',
                        fontSize: '0.68rem',
                        letterSpacing: '0.05em',
                        flex: 1,
                      }}
                    >
                      Espacios de trabajo
                    </Typography>
                    <ActionButtonContainer className="hover-actions">
                      <Tooltip title="New Note" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCreatingWorkspaceInFolderId((prev) =>
                              prev === 'general-ungrouped'
                                ? null
                                : 'general-ungrouped',
                            );
                            setCreatingWorkspaceInGroupId(null);
                            setExpandedProjects((prev) => ({
                              ...prev,
                              'general-ungrouped': true,
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

                  {expandedProjects['general-ungrouped'] !== false && (
                    <Box
                      sx={{
                        ml: 1.5,
                        pl: 0,
                        borderLeft: `1px dashed ${
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.08)'
                        }`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.25,
                      }}
                    >
                      {ungroupedWorkspaces.length === 0 &&
                        creatingWorkspaceInFolderId !== 'general-ungrouped' && (
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

                      {creatingWorkspaceInFolderId === 'general-ungrouped' && (
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
                  )}
                </Box>

                {/* Espacios de equipo (Ungrouped folders) */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      pt: 1,
                      pb: 0.5,
                      display: 'block',
                      fontWeight: 700,
                      color: 'text.disabled',
                      textTransform: 'uppercase',
                      fontSize: '0.68rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Espacios de equipo
                  </Typography>

                  <Box
                    sx={{
                      ml: 1.5,
                      pl: 0,
                      borderLeft: `1px dashed ${
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.08)'
                      }`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                    }}
                  >
                    {ungroupedFolders.map((project: ProjectTypes) => {
                      const isFolderExpanded = expandedProjects[project.id];
                      const folderWorkspaces = (workspacesData?.workspaces || []).filter(
                        (w: WorkspaceTypes) => w.projectId === project.id,
                      );
                      const isProjectActive =
                        selectedProjectId === project.id && !selectedWorkspaceId;

                      return (
                        <Box key={project.id}>
                          <ProjectItemRow
                            isActive={isWorkspaceTab && isProjectActive}
                            onClick={() => handleSelectProject(project.id)}
                            sx={{ '&:hover .hover-actions': { opacity: 1 } }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => toggleProjectExpand(project.id, e)}
                              sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
                            >
                              {isFolderExpanded ? (
                                <ExpandMore fontSize="inherit" />
                              ) : (
                                <ChevronRight fontSize="inherit" />
                              )}
                            </IconButton>
                            <ColorDot color={project.color} sx={{ mr: 1.2 }} />
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                flex: 1,
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {project.name}
                            </Typography>
                            <ActionButtonContainer className="hover-actions">
                              <Tooltip title="Add note under folder" arrow>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCreatingWorkspaceInFolderId((prev) =>
                                      prev === project.id ? null : project.id,
                                    );
                                    setCreatingWorkspaceInGroupId(null);
                                    setExpandedProjects((prev) => ({
                                      ...prev,
                                      [project.id]: true,
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
                                  handleOpenMenu(e, 'project', project)
                                }
                                sx={{ p: 0.2, color: 'text.secondary' }}
                              >
                                <MoreHorizIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </ActionButtonContainer>
                          </ProjectItemRow>

                          {isFolderExpanded && (
                            <Box
                              sx={{
                                ml: 1.5,
                                pl: 0,
                                borderLeft: `1px dotted ${
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.08)'
                                }`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.25,
                              }}
                            >
                              {folderWorkspaces.length === 0 &&
                                creatingWorkspaceInFolderId !== project.id && (
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
                                    No notes inside
                                  </Typography>
                                )}

                              {folderWorkspaces.map((w: WorkspaceTypes) => (
                                <WorkspaceItemRow
                                  key={w.id}
                                  isActive={
                                    isWorkspaceTab &&
                                    selectedWorkspaceId === w.id
                                  }
                                  onClick={() => handleSelectWorkspace(w)}
                                >
                                  <Typography
                                    sx={{
                                      mr: 1,
                                      fontSize: '1rem',
                                      lineHeight: 1,
                                    }}
                                  >
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
                                      onClick={(e) =>
                                        handleOpenMenu(e, 'workspace', w)
                                      }
                                      sx={{ p: 0.2, color: 'text.secondary' }}
                                    >
                                      <MoreHorizIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </ActionButtonContainer>
                                </WorkspaceItemRow>
                              ))}

                              {creatingWorkspaceInFolderId === project.id && (
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
                                  <Typography
                                    sx={{
                                      mr: 1,
                                      fontSize: '1rem',
                                      lineHeight: 1,
                                    }}
                                  >
                                    📄
                                  </Typography>
                                  <input
                                    autoFocus
                                    placeholder="Workspace name..."
                                    value={newWorkspaceTitle}
                                    onChange={(e) =>
                                      setNewWorkspaceTitle(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter')
                                        handleCreateWorkspaceInline();
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
                          )}
                        </Box>
                      );
                    })}

                    {/* Inline Folder Creation within general */}
                    {creatingFolderInGroupId === 'ungrouped' && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '6px 8px 6px 18px',
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
                        <ColorDot color="#3b82f6" sx={{ mr: 1.2 }} />
                        <input
                          autoFocus
                          placeholder="Folder name..."
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter')
                              handleCreateFolderInline(null);
                            else if (e.key === 'Escape') {
                              setCreatingFolderInGroupId(null);
                              setNewFolderName('');
                            }
                          }}
                          onBlur={() => {
                            if (!newFolderName.trim())
                              setCreatingFolderInGroupId(null);
                            else handleCreateFolderInline(null);
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
              </Box>
            )}

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
