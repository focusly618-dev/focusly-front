import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Pagination, useTheme } from '@mui/material';
import { PushPin as PushPinIcon } from '@mui/icons-material';
import {
  EmptyState,
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
} from '@/components/ui';
import { useWorkspace } from '../../hooks/useWorkspace.hook';
import type { WorkspaceTypes, ProjectGroupTypes } from '../../workspace.types';
import {
  LibraryContainer,
  GridContainer,
  WorkspaceCard,
} from './WorkspaceLibrary.styles';
import {
  WorkspaceCardItem,
  WorkspaceListItem,
  WorkspaceLibraryHeader,
} from './components';
import { AllProjectsModal } from './modals/AllProjectsModal';
import { TemplatesModal } from './modals/TemplatesModal';

// Decoupled hooks & components from Projects module
import {
  useProjectFolders,
  useProjectNotes,
  useWorkspaceCardMenu,
} from '@/pages/Projects/hooks';
import { ProjectFoldersGrid } from '@/pages/Projects/components/ProjectFolders';
import { ProjectDocCardMenu } from '@/pages/Projects/components/ProjectDocCardMenu';
import {
  ProjectTasksByStatus,
  useProjectTasks,
  type ProjectTaskItemData,
} from '@/pages/Projects/components/ProjectTasks';
import { CreateProjectTaskModal } from '@/pages/Projects/components/CreateProjectTaskModal';

interface WorkspaceLibraryProps {
  onCreate: (
    initialTitle?: string,
    initialContent?: string,
    targetGroupId?: string,
  ) => void;
  onSelect: (workspace: WorkspaceTypes) => void;
  selectedGroupId: string | null;
}

export const WorkspaceLibrary = ({
  onCreate,
  onSelect,
  selectedGroupId,
}: WorkspaceLibraryProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const { handleOpen: handleDeleteConfirm } = useWorkspace();

  // ── Decoupled Hooks ──
  const folders = useProjectFolders();
  const notes = useProjectNotes(selectedGroupId);
  const cardMenu = useWorkspaceCardMenu();
  const projectTasks = useProjectTasks({
    projectId: selectedGroupId,
  });

  // ── View Mode State ──
  const [viewMode, setViewMode] = useState<'gallery' | 'list' | 'grid'>(() => {
    return (
      (localStorage.getItem('workspace_view_mode') as
        | 'gallery'
        | 'list'
        | 'grid') || 'gallery'
    );
  });

  const [projectTab, setProjectTab] = useState<'projects' | 'tasks'>(
    'projects',
  );
  const [isAllFoldersModalOpen, setIsAllFoldersModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedProjectTask, setSelectedProjectTask] =
    useState<ProjectTaskItemData | null>(null);

  // ── Templates Modal ──
  const isTemplatesModalOpen = searchParams.get('modal') === 'templates';

  const handleCloseTemplatesModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('modal');
    setSearchParams(newParams);
  };

  const handleSelectTemplate = (
    title: string,
    content: string,
    groupId?: string,
  ) => {
    handleCloseTemplatesModal();
    onCreate(title, content, groupId);
  };

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

  const isInsideFolder = Boolean(selectedGroupId);
  const activeGroup = selectedGroupId
    ? folders.data.allGroups.find(
        (g: ProjectGroupTypes) => g.id === selectedGroupId,
      )
    : null;

  return (
    <LibraryContainer sx={{ pb: 6 }}>
      {/* ── Breadcrumbs ── */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
        sx={{ userSelect: 'none' }}
      >
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
              {t('nav.projects')}
            </Typography>
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ fontSize: '13px' }}
            >
              &gt;
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              {isCustomEmoji(activeGroup?.emoji) ? (
                <Box component="span" sx={{ fontSize: '14px', lineHeight: 1 }}>
                  {activeGroup?.emoji}
                </Box>
              ) : activeGroup?.emoji === 'outlined' ? (
                <ModernFolderOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: activeGroup?.color || 'primary.main',
                  }}
                />
              ) : (
                <ModernFolderFilledIcon
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
                {activeGroup?.name ||
                  t('workspaceLibrary.breadcrumb.folderFallback')}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: 'primary.main', fontSize: '13px' }}
          >
            {t('nav.projects')}
          </Typography>
        )}
      </Box>

      {/* ── Header Controls ── */}
      <WorkspaceLibraryHeader
        isInsideFolder={isInsideFolder}
        activeGroupName={activeGroup?.name}
        searchTerm={notes.state.searchTerm}
        onSearchChange={notes.actions.setSearchTerm}
        onClearSearch={() => notes.actions.setSearchTerm('')}
        folderSearchTerm={folders.state.folderSearchTerm}
        onFolderSearchChange={folders.actions.setFolderSearchTerm}
        onClearFolderSearch={() => folders.actions.setFolderSearchTerm('')}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        projectSortBy={folders.state.projectSortBy}
        onProjectSortChange={(sort) => folders.actions.setProjectSortBy(sort)}
        projectColorFilter={folders.state.projectColorFilter}
        onProjectColorFilterChange={folders.actions.setProjectColorFilter}
        noteSortBy={notes.state.noteSortBy}
        onNoteSortChange={(sort) => notes.actions.setNoteSortBy(sort)}
        noteFilterType={notes.state.noteFilterType}
        onNoteFilterChange={(type) => notes.actions.setNoteFilterType(type)}
        onCreate={() =>
          onCreate(undefined, undefined, selectedGroupId ?? undefined)
        }
        onCreateTask={() => {
          setSelectedProjectTask(null);
          setIsCreateTaskModalOpen(true);
        }}
        hasMultipleWorkspaces={notes.data.totalNotes > 1}
        projectTab={projectTab}
        onProjectTabChange={setProjectTab}
      />

      {/* ── Content View ── */}
      {!isInsideFolder ? (
        projectTab === 'tasks' ? (
          /* ── Project Tasks By Status View ── */
          <Box sx={{ mt: 3, pb: 4 }}>
            <ProjectTasksByStatus
              tasks={projectTasks.tasks}
              onTaskClick={(task) => {
                setSelectedProjectTask(task);
                setIsCreateTaskModalOpen(true);
              }}
              onAddTask={(statusId, title) => {
                if (title?.trim()) {
                  const targetProjectId =
                    selectedGroupId || folders.data.allGroups[0]?.id;
                  projectTasks.createProjectTask({
                    title: title.trim(),
                    status: statusId,
                    projectId: targetProjectId,
                  });
                } else {
                  setSelectedProjectTask(null);
                  setIsCreateTaskModalOpen(true);
                }
              }}
              onToggleComplete={projectTasks.toggleProjectTaskComplete}
              onToggleSubtask={(taskId, subtaskId) => {
                const targetTask = projectTasks.tasks.find(
                  (t) => t.id === taskId,
                );
                projectTasks.toggleProjectSubtask(
                  taskId,
                  subtaskId,
                  targetTask?.subtasks,
                );
              }}
            />
          </Box>
        ) : (
          /* ── Root Projects Folders Grid View ── */
          <ProjectFoldersGrid
            groups={folders.data.groups}
            totalGroupPages={folders.state.totalGroupPages}
            groupPage={folders.state.groupPage}
            onPageChange={folders.actions.setGroupPage}
            onSelectFolder={handleSelectFolder}
            onCreateFolder={folders.actions.createFolder}
            onUpdateFolder={folders.actions.updateFolder}
            onDeleteFolder={folders.actions.deleteFolder}
            folderSearchTerm={folders.state.folderSearchTerm}
          />
        )
      ) : (
        /* ── Inside Folder: Notes View ── */
        <>
          {notes.state.error && (
            <Typography color="error" sx={{ my: 2 }}>
              Error: {notes.state.error.message}
            </Typography>
          )}

          {!notes.state.error && (
            <GridContainer viewMode={viewMode}>
              {/* Empty Folder State */}
              {!notes.state.searchTerm &&
                !notes.data.notes.length &&
                !notes.state.loading && (
                  <EmptyState
                    icon={<PushPinIcon />}
                    title={t('workspaceLibrary.emptyFolder.title')}
                    description={t('workspaceLibrary.emptyFolder.desc')}
                    actionText={t('workspaceLibrary.emptyFolder.action')}
                    onAction={() =>
                      onCreate(
                        undefined,
                        undefined,
                        selectedGroupId ?? undefined,
                      )
                    }
                    sx={{ gridColumn: '1 / -1', py: 10 }}
                  />
                )}

              {/* Skeletons while loading */}
              {notes.state.loading && !notes.data.notes.length
                ? [1, 2, 3, 4, 5].map((i) => {
                    if (viewMode === 'list') {
                      return (
                        <Box
                          key={i}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: '12px',
                            border: `1px solid ${theme.palette.divider}`,
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: 'action.disabledBackground',
                            }}
                          />
                          <Box
                            sx={{
                              height: 16,
                              bgcolor: 'action.hover',
                              borderRadius: 1,
                              flex: 1,
                            }}
                          />
                        </Box>
                      );
                    }
                    return (
                      <WorkspaceCard key={i} compact={viewMode === 'grid'}>
                        <Box
                          sx={{
                            width: '80%',
                            height: 24,
                            bgcolor: 'action.hover',
                            mb: 1.5,
                            borderRadius: 1,
                          }}
                        />
                        {viewMode !== 'grid' && (
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
                          </>
                        )}
                      </WorkspaceCard>
                    );
                  })
                : notes.data.notes.map((workspace: WorkspaceTypes) => {
                    const group = folders.data.allGroups.find(
                      (g: ProjectGroupTypes) => g.id === workspace.groupId,
                    );

                    if (viewMode === 'list') {
                      return (
                        <WorkspaceListItem
                          key={workspace.id}
                          workspace={workspace}
                          onSelect={onSelect}
                          onMenuOpen={cardMenu.actions.handleMenuOpen}
                          onUnlinkTask={cardMenu.actions.handleUnlinkTask}
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
                        onMenuOpen={cardMenu.actions.handleMenuOpen}
                        onUnlinkTask={cardMenu.actions.handleUnlinkTask}
                        groupName={group?.name}
                        groupColor={group?.color}
                        compact={viewMode === 'grid'}
                      />
                    );
                  })}
            </GridContainer>
          )}

          {/* Notes Pagination */}
          {!notes.state.error &&
            notes.data.notes.length > 0 &&
            notes.state.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <Pagination
                  count={notes.state.totalPages}
                  page={notes.state.page}
                  onChange={(_e, val) => notes.actions.setPage(val)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
        </>
      )}

      {/* ── Context Menu for Notes ── */}
      <ProjectDocCardMenu
        anchorEl={cardMenu.state.anchorEl}
        selectedWorkspace={cardMenu.state.selectedWorkspace}
        showPaletteInMenu={cardMenu.state.showPaletteInMenu}
        onClose={cardMenu.actions.handleMenuClose}
        onTogglePalette={cardMenu.actions.setShowPaletteInMenu}
        onSetBackground={cardMenu.actions.handleSetBackground}
        onRemoveBackground={cardMenu.actions.handleRemoveBackground}
        onDeleteWorkspace={handleDeleteConfirm}
      />

      {/* ── All Folders Modal ── */}
      <AllProjectsModal
        open={isAllFoldersModalOpen}
        onClose={() => setIsAllFoldersModalOpen(false)}
        projects={folders.data.allGroups.map((g: ProjectGroupTypes) => ({
          id: g.id,
          name: g.name,
          userId: g.userId,
          color: g.color,
          workspaceCount: g.workspaces?.length ?? 0,
          createdAt: g.createdAt || '',
          updatedAt: g.updatedAt || '',
        }))}
        selectedId={selectedGroupId}
        onSelect={(groupId) => {
          handleSelectFolder(groupId);
          setIsAllFoldersModalOpen(false);
        }}
      />

      {/* ── Templates Modal ── */}
      <TemplatesModal
        open={isTemplatesModalOpen}
        onClose={handleCloseTemplatesModal}
        projects={folders.data.allGroups}
        selectedGroupId={selectedGroupId}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* ── Create / Edit Project Task Modal ── */}
      <CreateProjectTaskModal
        open={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          setSelectedProjectTask(null);
        }}
        task={selectedProjectTask}
        projects={folders.data.allGroups.map((g) => ({
          id: g.id,
          name: g.name,
          color: g.color,
          emoji: g.emoji,
        }))}
        selectedProjectId={selectedProjectTask?.projectId || selectedGroupId}
        projectName={activeGroup?.name || folders.data.allGroups[0]?.name}
        projectEmoji={activeGroup?.emoji || folders.data.allGroups[0]?.emoji}
        onCreate={async (taskData) => {
          const targetProjectId =
            (taskData.projectId as string) ||
            selectedGroupId ||
            folders.data.allGroups[0]?.id;
          await projectTasks.createProjectTask({
            title: String(taskData.title || 'New Task'),
            status: String(taskData.status || 'in_progress'),
            priority: String(taskData.priority || 'Medium'),
            duration: taskData.estimatedDuration as string | undefined,
            dueDate: taskData.dueDate as string | undefined,
            description: taskData.description as string | undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subtasks: taskData.subtasks as any,
            projectId: targetProjectId,
            workspaceId: taskData.workspaceId as string | undefined,
          });
        }}
        onUpdate={async (taskId, taskData) => {
          await projectTasks.updateProjectTask({
            id: taskId,
            title: String(taskData.title || ''),
            status: String(taskData.status || 'in_progress'),
            priority: String(taskData.priority || 'Medium'),
            duration: taskData.estimatedDuration as string | undefined,
            dueDate: taskData.dueDate as string | undefined,
            description: taskData.description as string | undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subtasks: taskData.subtasks as any,
            projectId: taskData.projectId as string | undefined,
            workspaceId: taskData.workspaceId as string | undefined,
          });
        }}
        onDelete={async (taskId) => {
          await projectTasks.deleteProjectTask(taskId);
        }}
      />
    </LibraryContainer>
  );
};
