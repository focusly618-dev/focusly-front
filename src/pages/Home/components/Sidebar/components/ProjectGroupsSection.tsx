import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Skeleton,
  CircularProgress,
} from '@mui/material';
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
  ActionButtonContainer,
} from '../Sidebar.styles';
import type { UseSidebarReturn } from '../hooks/useSidebar';
import type {
  WorkspaceTypes,
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
    isProjectsLoading,
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
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          Projects & Docs
          {isProjectsLoading && (
            <CircularProgress
              size={10}
              thickness={5}
              sx={{ color: 'text.disabled', opacity: 0.6 }}
            />
          )}
        </Typography>
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

        {/* Loading Skeletons */}
        {isProjectsLoading && projectGroups.length === 0 && (
          <Box sx={{ px: 1, py: 0.5 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ mb: 1.5 }}>
                {/* Group header skeleton */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    py: 0.75,
                    borderRadius: '8px',
                  }}
                >
                  <Skeleton variant="circular" width={14} height={14} />
                  <Skeleton
                    variant="rectangular"
                    width={14}
                    height={14}
                    sx={{ borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    width={`${55 + i * 15}%`}
                    height={16}
                    sx={{ borderRadius: '4px', flex: 1 }}
                  />
                </Box>
                {/* Workspace item skeletons inside group */}
                {i < 3 && (
                  <Box sx={{ pl: 3, mt: 0.25 }}>
                    {Array.from({ length: i }).map((_, j) => (
                      <Box
                        key={j}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1,
                          py: 0.5,
                          borderRadius: '6px',
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          width={18}
                          height={18}
                          sx={{ flexShrink: 0 }}
                        />
                        <Skeleton
                          variant="text"
                          width={`${45 + j * 20}%`}
                          height={14}
                          sx={{ borderRadius: '4px' }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                <Divider sx={{ mt: 1, opacity: 0.15 }} />
              </Box>
            ))}
          </Box>
        )}

        {/* Dynamic Project Groups */}
        {!isProjectsLoading &&
          projectGroups.length === 0 &&
          !isCreatingGroupInline && (
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
                          No notes
                        </Typography>
                      )}

                    {groupWorkspaces.map((w: WorkspaceTypes) => (
                      <WorkspaceItemRow
                        key={w.id}
                        isActive={
                          isWorkspaceTab && selectedWorkspaceId === w.id
                        }
                        onClick={() => handleSelectWorkspace(w)}
                        sx={{ pl: 2 }}
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
                          placeholder="Note name..."
                          value={newWorkspaceTitle}
                          onChange={(e) => setNewWorkspaceTitle(e.target.value)}
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
                </Box>
              )}

              <Divider sx={{ my: 0.5, opacity: 0.2 }} />
            </Box>
          );
        })}
      </ProjectsList>
    </>
  );
};
