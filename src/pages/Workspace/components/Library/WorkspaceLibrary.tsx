import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Pagination, Tab, useTheme } from '@mui/material';
import {
  PushPin as PushPinIcon,
  Add as AddIcon,
  TaskAlt as TaskAltIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
} from '@mui/icons-material';
import {
  EmptyState,
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
} from '@/components/ui';
import { useWorkspaceActions } from '../../hooks/useWorkspaceActions.hook';
import { notify } from '@/utils';
import type { WorkspaceTypes, ProjectGroupTypes } from '../../workspace.types';
import {
  LibraryContainer,
  GridContainer,
  SegmentedTabs,
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
  useMultiSelect,
  useProjectOptions,
} from '@/pages/Projects/hooks';
import { ProjectFoldersGrid } from '@/pages/Projects/components/ProjectFolders';
import {
  DashedCard,
  AddCircleIconWrapper,
} from '@/pages/Projects/components/ProjectFolders/ProjectFoldersGrid/ProjectFoldersGrid.styles';
import { ProjectDocCardMenu } from '@/pages/Projects/components/ProjectDocCardMenu';
import {
  ProjectTasksView,
  useProjectTasks,
  useProjectTaskViewState,
  type ProjectTaskItemData,
  type UpdateProjectTaskInput,
} from '@/pages/Projects/components/ProjectTasks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { CreateProjectTaskModal } from '@/pages/Projects/components/CreateProjectTaskModal';
import {
  SelectButton,
  SelectionToolbar,
} from '@/pages/Projects/components/SelectionToolbar';
import {
  CreateFolderModal,
  DeleteWorkspacesModal,
} from '@/pages/Projects/modals';
import type { ProjectTab } from '@/redux/tasks/task.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setProjectTab } from '@/redux/tasks/task.slice';

// Subtasks as the task modal sends them (already in backend shape).
type TaskModalSubtasks = NonNullable<UpdateProjectTaskInput['subtasks']>;

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
  const { deleteWorkspaces } = useWorkspaceActions();

  // ── Decoupled Hooks ──
  const folders = useProjectFolders();
  const notes = useProjectNotes(selectedGroupId);
  const cardMenu = useWorkspaceCardMenu();
  const isInsideFolder = Boolean(selectedGroupId);
  // Inside a project: its documents or its tasks (kept in the URL).
  const folderView: 'documents' | 'tasks' =
    searchParams.get('view') === 'tasks' ? 'tasks' : 'documents';
  const taskView = useProjectTaskViewState();
  const debouncedNotesSearch = useDebouncedValue(notes.state.searchTerm);
  const tasksProjectId = selectedGroupId ?? taskView.filters.projectId;
  const tasksSearch = isInsideFolder
    ? debouncedNotesSearch
    : folders.state.debouncedSearchTerm;
  const projectTasks = useProjectTasks({
    projectId: tasksProjectId,
    searchTerm: tasksSearch,
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

  const dispatch = useAppDispatch();
  const projectTab = useAppSelector(
    (state) => state.task.projectTab || 'projects',
  );
  const [isAllFoldersModalOpen, setIsAllFoldersModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedProjectTask, setSelectedProjectTask] =
    useState<ProjectTaskItemData | null>(null);
  // Status/title preselected when a new task is started from a status group.
  const [newTaskStatus, setNewTaskStatus] = useState<string | undefined>();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { options: projectOptions } = useProjectOptions();

  // ── Workspace Selection & Deletion ──
  const workspaceSelection = useMultiSelect<WorkspaceTypes>();
  const folderSelection = useMultiSelect<ProjectGroupTypes>();
  const [workspacesToDelete, setWorkspacesToDelete] = useState<
    WorkspaceTypes[]
  >([]);
  const [prevGroupId, setPrevGroupId] = useState(selectedGroupId);
  if (selectedGroupId !== prevGroupId) {
    setPrevGroupId(selectedGroupId);
    workspaceSelection.actions.stopSelecting();
    folderSelection.actions.stopSelecting();
  }

  const handleConfirmDeleteWorkspaces = async (ids: string[]) => {
    const emptiesCurrentPage = notes.data.notes.every((note) =>
      ids.includes(note.id),
    );
    await deleteWorkspaces(ids);
    workspaceSelection.actions.stopSelecting();
    if (emptiesCurrentPage && notes.state.page > 1) {
      notes.actions.setPage(notes.state.page - 1);
    }
  };

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
    newParams.delete('view');
    setSearchParams(newParams);
  };

  const handleFolderViewChange = (next: 'documents' | 'tasks') => {
    const newParams = new URLSearchParams(searchParams);
    if (next === 'tasks') newParams.set('view', 'tasks');
    else newParams.delete('view');
    setSearchParams(newParams);
  };

  /** Opens the task form, prefilled with a status/title when given. */
  const openNewTask = (status?: string, title?: string) => {
    setSelectedProjectTask(null);
    setNewTaskStatus(status);
    setNewTaskTitle(title ?? '');
    setIsCreateTaskModalOpen(true);
  };

  // The task form opens on the task's project, else the one being viewed.
  const modalProjectId =
    selectedProjectTask?.projectId || tasksProjectId || null;
  const modalProject = projectOptions.find((p) => p.id === modalProjectId);

  const projectTasksView = (
    <ProjectTasksView
      projectTasks={projectTasks}
      view={taskView}
      projectId={selectedGroupId}
      projects={projectOptions}
      searching={Boolean(tasksSearch.trim())}
      onOpenTask={(task) => {
        setSelectedProjectTask(task);
        setIsCreateTaskModalOpen(true);
      }}
      onNewTask={openNewTask}
    />
  );

  const isFolderEmpty =
    !notes.state.searchTerm && !notes.data.notes.length && !notes.state.loading;
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
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {t('nav.workspace', 'Espacios')}
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
                '&:hover': { color: '#008767' },
              }}
              onClick={() => handleSelectFolder('')}
            >
              {t('nav.projects', 'Proyectos')}
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
                    color: activeGroup?.color || '#008767',
                  }}
                />
              ) : (
                <ModernFolderFilledIcon
                  sx={{
                    fontSize: 16,
                    color: activeGroup?.color || '#008767',
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
            sx={{ fontWeight: 700, color: '#008767', fontSize: '13px' }}
          >
            {t('nav.projects', 'Proyectos')}
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
        onCreateProject={() => setIsCreateFolderModalOpen(true)}
        onCreateTask={() => openNewTask()}
        folderView={folderView}
        projectTab={projectTab}
        onProjectTabChange={(tab: ProjectTab) => {
          folderSelection.actions.stopSelecting();
          dispatch(setProjectTab(tab));
        }}
        selectAction={
          isInsideFolder
            ? folderView === 'documents' &&
              notes.data.notes.length > 0 &&
              !workspaceSelection.state.isSelecting && (
                <SelectButton
                  onStart={workspaceSelection.actions.startSelecting}
                />
              )
            : projectTab === 'projects' &&
              folders.data.groups.length > 0 &&
              !folderSelection.state.isSelecting && (
                <SelectButton
                  onStart={folderSelection.actions.startSelecting}
                />
              )
        }
      />

      {/* ── Content View ── */}
      {!isInsideFolder ? (
        projectTab === 'tasks' ? (
          /* ── Every project's tasks, by status ── */
          <Box sx={{ mt: 3, pb: 4 }}>{projectTasksView}</Box>
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
            onDeleteFolders={folders.actions.deleteFolders}
            folderSearchTerm={folders.state.folderSearchTerm}
            selection={folderSelection}
          />
        )
      ) : (
        /* ── Inside Folder: its documents or its tasks ── */
        <>
          <SegmentedTabs
            value={folderView}
            onChange={(_e, next) => handleFolderViewChange(next)}
            aria-label={t('workspaceLibrary.folderView.label')}
            sx={{ alignSelf: 'flex-start', mb: 2.5 }}
          >
            <Tab
              value="documents"
              label={t('workspaceLibrary.folderView.documents')}
              icon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
            />
            <Tab
              value="tasks"
              label={t('workspaceLibrary.folderView.tasks')}
              icon={<TaskAltIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
            />
          </SegmentedTabs>

          {folderView === 'tasks' ? (
            <Box sx={{ pb: 4 }}>{projectTasksView}</Box>
          ) : (
            <>
              {notes.state.error && (
                <Typography color="error" sx={{ my: 2 }}>
                  Error: {notes.state.error.message}
                </Typography>
              )}

              {!notes.state.error && workspaceSelection.state.isSelecting && (
                <SelectionToolbar
                  isSelecting
                  selectedCount={workspaceSelection.state.selectedCount}
                  allSelected={workspaceSelection.actions.areAllSelected(
                    notes.data.notes,
                  )}
                  hasItems={notes.data.notes.length > 0}
                  onCancel={workspaceSelection.actions.stopSelecting}
                  onToggleAll={() =>
                    workspaceSelection.actions.toggleAll(notes.data.notes)
                  }
                  onDelete={() =>
                    setWorkspacesToDelete(
                      workspaceSelection.state.selectedItems,
                    )
                  }
                />
              )}

              {!notes.state.error && (
                <GridContainer viewMode={viewMode}>
                  {/* Skeletons while loading */}
                  {notes.state.loading && !notes.data.notes.length ? (
                    [1, 2, 3, 4, 5].map((i) => {
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
                  ) : (
                    <>
                      {!notes.state.searchTerm &&
                        !workspaceSelection.state.isSelecting &&
                        (viewMode !== 'list' || isFolderEmpty) && (
                          <DashedCard
                            id="card-create-workspace"
                            onClick={() =>
                              onCreate(
                                undefined,
                                undefined,
                                selectedGroupId ?? undefined,
                              )
                            }
                            sx={{
                              minHeight:
                                viewMode === 'gallery'
                                  ? '235px'
                                  : viewMode === 'grid'
                                    ? '200px'
                                    : '160px',
                            }}
                          >
                            <AddCircleIconWrapper>
                              <AddIcon sx={{ fontSize: 22 }} />
                            </AddCircleIconWrapper>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 700,
                                fontSize: '15px',
                                color: 'text.primary',
                                mb: 0.5,
                              }}
                            >
                              {t(
                                'workspaceLibrary.emptyFolder.action',
                                'Crear espacio de trabajo',
                              )}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary', fontSize: '12px' }}
                            >
                              {t(
                                'workspaceLibrary.emptyFolder.subAction',
                                'Crear una nota o documento',
                              )}
                            </Typography>
                          </DashedCard>
                        )}

                      {/* Empty Folder State (below the create card) */}
                      {isFolderEmpty && (
                        <EmptyState
                          icon={<PushPinIcon />}
                          title={t('workspaceLibrary.emptyFolder.title')}
                          description={t('workspaceLibrary.emptyFolder.desc')}
                          sx={{ gridColumn: '1 / -1', py: 6 }}
                        />
                      )}

                      {notes.data.notes.map((workspace: WorkspaceTypes) => {
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
                              selectionMode={
                                workspaceSelection.state.isSelecting
                              }
                              selected={workspaceSelection.actions.isSelected(
                                workspace.id,
                              )}
                              onToggleSelect={workspaceSelection.actions.toggle}
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
                            selectionMode={workspaceSelection.state.isSelecting}
                            selected={workspaceSelection.actions.isSelected(
                              workspace.id,
                            )}
                            onToggleSelect={workspaceSelection.actions.toggle}
                          />
                        );
                      })}
                    </>
                  )}
                </GridContainer>
              )}

              {/* Notes Pagination */}
              {!notes.state.error &&
                notes.data.notes.length > 0 &&
                notes.state.totalPages > 1 && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', py: 3 }}
                  >
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
        onDeleteWorkspace={(id) => {
          const workspace = notes.data.notes.find((note) => note.id === id);
          if (workspace) setWorkspacesToDelete([workspace]);
        }}
      />

      {/* ── Delete Workspaces Confirm (single or bulk) ── */}
      <DeleteWorkspacesModal
        open={workspacesToDelete.length > 0}
        onClose={() => setWorkspacesToDelete([])}
        workspaces={workspacesToDelete}
        onConfirmDelete={handleConfirmDeleteWorkspaces}
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

      {/* ── Create Folder Modal (from Header button) ── */}
      <CreateFolderModal
        open={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={folders.actions.createFolder}
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
        defaultStatus={newTaskStatus}
        defaultTitle={newTaskTitle}
        projects={projectOptions}
        selectedProjectId={modalProjectId}
        projectName={modalProject?.name || projectOptions[0]?.name}
        projectEmoji={modalProject?.emoji || projectOptions[0]?.emoji}
        onCreate={async (taskData) => {
          const targetProjectId =
            (taskData.projectId as string) ||
            tasksProjectId ||
            projectOptions[0]?.id;
          if (!targetProjectId) {
            // A task without a project never shows up in this view.
            notify.warning({
              title: t('tasks.projectRequired.title'),
              description: t('tasks.projectRequired.description'),
              duration: 3000,
            });
            throw new Error('A project task needs a project');
          }
          await projectTasks.createProjectTask({
            title: String(taskData.title || 'New Task'),
            status: String(taskData.status || 'in_progress'),
            priority: String(taskData.priority || 'Medium'),
            duration: taskData.estimatedDuration as string | undefined,
            dueDate: taskData.dueDate as string | undefined,
            description: taskData.description as string | undefined,
            modules: taskData.modules as string[] | undefined,
            subtasks: ((taskData.subtasks as TaskModalSubtasks) ?? []).map(
              (subtask) => ({
                id: subtask.id,
                title: subtask.title || '',
                completed: subtask.completed,
                time: subtask.estimate_timer
                  ? String(subtask.estimate_timer)
                  : undefined,
              }),
            ),
            projectId: targetProjectId,
            workspaceId: taskData.workspaceId as string | undefined,
          });
        }}
        onUpdate={async (taskId, taskData) => {
          // The modal only sends what the user changed; anything missing here
          // stays as it is on the backend.
          await projectTasks.updateProjectTask({
            id: taskId,
            title: taskData.title as string | undefined,
            status: taskData.status as string | undefined,
            priority: taskData.priority as string | undefined,
            duration: taskData.estimatedDuration as string | undefined,
            dueDate: taskData.dueDate as string | undefined,
            description: taskData.description as string | undefined,
            tags: taskData.modules as string[] | undefined,
            subtasks: taskData.subtasks as TaskModalSubtasks | undefined,
            projectId: taskData.projectId as string | undefined,
            workspaceId: taskData.workspaceId as string | null | undefined,
          });
        }}
        onDelete={async (taskId) => {
          await projectTasks.deleteProjectTask(taskId);
        }}
      />
    </LibraryContainer>
  );
};
