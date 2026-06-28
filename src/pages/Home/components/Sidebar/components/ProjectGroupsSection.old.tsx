import { Box, Typography, IconButton, Tooltip, Divider } from '@mui/material';
import {
  ChevronRight,
  ExpandMore,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
  NotesOutlined as NotesIcon,
} from '@mui/icons-material';
import {
  ProjectsList,
  ProjectItemRow,
  WorkspaceItemRow,
  ColorDot,
  ActionButtonContainer,
} from '../Sidebar.styles';
import type { UseSidebarReturn } from '../hooks/useSidebar';
import type {
  WorkspaceTypes,
  ProjectTypes,
  ProjectGroupTypes,
} from '@/pages/Workspace/types/workspace.types';

interface ProjectGroupsSectionProps {
  sidebar: UseSidebarReturn;
}

export const ProjectGroupsSection = ({
  sidebar,
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
    handleSelectProject,
    handleSelectWorkspace,
    handleOpenMenu,
    handleCreateGroupInline,
    handleCreateFolderInline,
    handleCreateWorkspaceInline,
    setIsCreatingGroupInline,
    setExpandedGroups,
    setExpandedProjects,
  } = sidebar;

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
        <Tooltip title="New Project Group" arrow>
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
              placeholder="Group name..."
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
              No project groups yet. Click + to create one.
            </Typography>
          </Box>
        )}

        {projectGroups.map((group: ProjectGroupTypes) => {
          const isGroupExpanded = expandedGroups[group.id] !== false;
          const groupFolders = (projectsData?.projects || []).filter(
            (f: ProjectTypes) => f.groupId === group.id,
          );
          const groupGeneralWorkspaces = (
            workspacesData?.workspaces || []
          ).filter(
            (w: WorkspaceTypes) => w.groupId === group.id && !w.projectId,
          );

          return (
            <Box key={group.id} sx={{ mb: 1.5 }}>
              {/* Group Header */}
              <ProjectItemRow
                isActive={false}
                onClick={() => {}}
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
                <Box sx={{ pl: 1 }}>
                  {/* Espacios de trabajo (General workspaces in this group) */}
                  <Box sx={{ mb: 1 }}>
                    <ProjectItemRow isActive={false} onClick={() => {}}>
                      <IconButton
                        size="small"
                        onClick={(e) =>
                          toggleProjectExpand(`general-${group.id}`, e)
                        }
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
                      <Box sx={{ mt: 0.5 }}>
                        {groupGeneralWorkspaces.length === 0 &&
                          creatingWorkspaceInFolderId !==
                            `general-${group.id}` && (
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
                              No notes
                            </Typography>
                          )}
                        {groupGeneralWorkspaces.map((w: WorkspaceTypes) => (
                          <WorkspaceItemRow
                            key={w.id}
                            isActive={
                              isWorkspaceTab && selectedWorkspaceId === w.id
                            }
                            onClick={() => handleSelectWorkspace(w)}
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

                        {creatingWorkspaceInFolderId ===
                          `general-${group.id}` && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 8px 6px 28px',
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

                  {/* Espacios de equipo (Folders in this group) */}
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
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

                  {groupFolders.map((project: ProjectTypes) => {
                    const isExpanded = expandedProjects[project.id];
                    const projectWorkspaces = (
                      workspacesData?.workspaces || []
                    ).filter((w: WorkspaceTypes) => w.projectId === project.id);
                    const isProjectActive =
                      selectedProjectId === project.id && !selectedWorkspaceId;

                    return (
                      <Box key={project.id} sx={{ mb: 0.5 }}>
                        <ProjectItemRow
                          isActive={isWorkspaceTab && isProjectActive}
                          onClick={() => handleSelectProject(project.id)}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => toggleProjectExpand(project.id, e)}
                            sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
                          >
                            {isExpanded ? (
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

                        {isExpanded && (
                          <Box sx={{ mt: 0.5 }}>
                            {projectWorkspaces.length === 0 ? (
                              creatingWorkspaceInFolderId ===
                              project.id ? null : (
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
                                  No notes inside
                                </Typography>
                              )
                            ) : (
                              projectWorkspaces.map((w: WorkspaceTypes) => (
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
                              ))
                            )}

                            {creatingWorkspaceInFolderId === project.id && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '6px 8px 6px 28px',
                                  borderRadius: '6px',
                                  mb: 0.5,
                                  backgroundColor:
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(255,255,255,0.03)'
                                      : 'rgba(0,0,0,0.02)',
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
                        padding: '6px 8px',
                        borderRadius: '6px',
                        mb: 0.5,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(0,0,0,0.02)',
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
              )}

              <Divider sx={{ my: 0.5, opacity: 0.2 }} />
            </Box>
          );
        })}

        {/* Render Ungrouped/General Section if there are any ungrouped folders/workspaces */}
        {((projectsData?.projects || []).filter((f: ProjectTypes) => !f.groupId)
          .length > 0 ||
          (workspacesData?.workspaces || []).filter(
            (w: WorkspaceTypes) => !w.groupId && !w.projectId,
          ).length > 0) && (
          <Box sx={{ mb: 1.5 }}>
            {/* Group Header */}
            <ProjectItemRow isActive={false} onClick={() => {}}>
              <IconButton
                size="small"
                onClick={(e) => toggleGroupExpand('ungrouped', e)}
                sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
              >
                {expandedGroups['ungrouped'] !== false ? (
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
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </ActionButtonContainer>
            </ProjectItemRow>

            {/* Expanded Group Content */}
            {expandedGroups['ungrouped'] !== false && (
              <Box sx={{ pl: 1 }}>
                {/* Espacios de trabajo (General workspaces with no group) */}
                <Box sx={{ mb: 1 }}>
                  <ProjectItemRow isActive={false} onClick={() => {}}>
                    <IconButton
                      size="small"
                      onClick={(e) =>
                        toggleProjectExpand('general-ungrouped', e)
                      }
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
                    <Box sx={{ mt: 0.5 }}>
                      {(workspacesData?.workspaces || []).filter(
                        (w: WorkspaceTypes) => !w.groupId && !w.projectId,
                      ).length === 0 &&
                        creatingWorkspaceInFolderId !== 'general-ungrouped' && (
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
                            No notes
                          </Typography>
                        )}
                      {(workspacesData?.workspaces || [])
                        .filter(
                          (w: WorkspaceTypes) => !w.groupId && !w.projectId,
                        )
                        .map((w: WorkspaceTypes) => (
                          <WorkspaceItemRow
                            key={w.id}
                            isActive={
                              isWorkspaceTab && selectedWorkspaceId === w.id
                            }
                            onClick={() => handleSelectWorkspace(w)}
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

                      {creatingWorkspaceInFolderId === 'general-ungrouped' && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 8px 6px 28px',
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

                {/* Espacios de equipo (Folders with no group) */}
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
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

                {(projectsData?.projects || [])
                  .filter((f: ProjectTypes) => !f.groupId)
                  .map((project: ProjectTypes) => {
                    const isExpanded = expandedProjects[project.id];
                    const projectWorkspaces = (
                      workspacesData?.workspaces || []
                    ).filter((w: WorkspaceTypes) => w.projectId === project.id);
                    const isProjectActive =
                      selectedProjectId === project.id && !selectedWorkspaceId;

                    return (
                      <Box key={project.id} sx={{ mb: 0.5 }}>
                        <ProjectItemRow
                          isActive={isWorkspaceTab && isProjectActive}
                          onClick={() => handleSelectProject(project.id)}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => toggleProjectExpand(project.id, e)}
                            sx={{ p: 0.2, mr: 0.5, color: 'text.disabled' }}
                          >
                            {isExpanded ? (
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

                        {isExpanded && (
                          <Box sx={{ mt: 0.5 }}>
                            {projectWorkspaces.length === 0 ? (
                              creatingWorkspaceInFolderId ===
                              project.id ? null : (
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
                                  No notes inside
                                </Typography>
                              )
                            ) : (
                              projectWorkspaces.map((w: WorkspaceTypes) => (
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
                              ))
                            )}

                            {creatingWorkspaceInFolderId === project.id && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '6px 8px 6px 28px',
                                  borderRadius: '6px',
                                  mb: 0.5,
                                  backgroundColor:
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(255,255,255,0.03)'
                                      : 'rgba(0,0,0,0.02)',
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
                {creatingFolderInGroupId === 'ungrouped' && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      mb: 0.5,
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(0,0,0,0.02)',
                    }}
                  >
                    <ColorDot color="#3b82f6" sx={{ mr: 1.2 }} />
                    <input
                      autoFocus
                      placeholder="Folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateFolderInline(null);
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
            )}
            <Divider sx={{ my: 0.5, opacity: 0.2 }} />
          </Box>
        )}
      </ProjectsList>
    </>
  );
};
