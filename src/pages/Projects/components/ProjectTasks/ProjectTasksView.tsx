import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress } from '@mui/material';
import {
  ErrorOutline as ErrorOutlineIcon,
  FilterAltOff as FilterOffIcon,
  TaskAlt as TaskAltIcon,
  DriveFileMove as MoveIcon,
  CheckCircleOutline as CompleteIcon,
} from '@mui/icons-material';
import { EmptyState } from '@/components/ui';
import { useMultiSelect } from '../../hooks/useMultiSelect.hook';
import { SelectButton, SelectionToolbar } from '../SelectionToolbar';
import { ConfirmDeleteDialog } from '../../modals/ConfirmDeleteDialog/ConfirmDeleteDialog';
import type { ProjectOption } from '../CreateProjectTaskModal/CreateProjectTaskModal.types';
import { ProjectTasksByStatus } from './ProjectTasksByStatus';
import { ProjectTasksToolbar } from './ProjectTasksToolbar';
import { ProjectStatusMenu } from './ProjectStatusMenu';
import type { useProjectTasks } from './hooks/useProjectTasks.hook';
import type { ProjectTaskViewState } from './hooks/useProjectTaskViewState.hook';
import type { ProjectTaskItemData } from './projectTasks.types';
import {
  NO_TASK_FILTERS,
  filterProjectTasks,
  hasActiveFilters,
  sortProjectTasks,
  summarizeProjectTasks,
} from './projectTaskFilters';

export interface ProjectTasksViewProps {
  projectTasks: ReturnType<typeof useProjectTasks>;
  view: ProjectTaskViewState;
  /** The project being viewed; null shows every project's tasks. */
  projectId: string | null;
  projects: ProjectOption[];
  /** A search is narrowing the list. */
  searching?: boolean;
  onOpenTask: (task: ProjectTaskItemData) => void;
  /** Opens the task form (with a status / title already filled in). */
  onNewTask: (status?: string, title?: string) => void;
}

/** A project's tasks (or all projects'), grouped by status. */
export const ProjectTasksView: React.FC<ProjectTasksViewProps> = ({
  projectTasks,
  view,
  projectId,
  projects,
  searching = false,
  onOpenTask,
  onNewTask,
}) => {
  const { t, i18n } = useTranslation();
  const selection = useMultiSelect<ProjectTaskItemData>();
  const [moveAnchor, setMoveAnchor] = useState<HTMLElement | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { filters, sort } = view;
  const isAllProjects = !projectId;

  // Project names/colors from the project list (a task may only carry its id).
  const tasks = useMemo(() => {
    const byId = new Map(projects.map((p) => [p.id, p]));
    return projectTasks.tasks.map((task) => {
      const project = task.projectId ? byId.get(task.projectId) : undefined;
      return project ? { ...task, project } : task;
    });
  }, [projectTasks.tasks, projects]);

  const shown = useMemo(
    () =>
      sortProjectTasks(filterProjectTasks(tasks, filters), sort, i18n.language),
    [tasks, filters, sort, i18n.language],
  );
  const summary = useMemo(() => summarizeProjectTasks(tasks), [tasks]);

  // A changed project or filter clears the selection.
  const selectionKey = `${projectId}|${filters.projectId}`;
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey);
  if (selectionKey !== prevSelectionKey) {
    setPrevSelectionKey(selectionKey);
    selection.actions.stopSelecting();
  }

  const findTask = (id: string) => tasks.find((task) => task.id === id);
  const targetProjectId =
    projectId ??
    filters.projectId ??
    (projects.length === 1 ? projects[0].id : null);

  const handleAddTask = (statusId: string, title: string) => {
    const trimmed = title.trim();
    // Quick add only when the project is clear; otherwise the form opens with
    // the title so the user picks one.
    if (trimmed && targetProjectId) {
      void projectTasks.createProjectTask({
        title: trimmed,
        status: statusId,
        projectId: targetProjectId,
      });
      return;
    }
    onNewTask(statusId, trimmed);
  };

  if (projectTasks.error && !tasks.length) {
    return (
      <EmptyState
        icon={<ErrorOutlineIcon />}
        title={t('projectTasks.error.title')}
        description={t('projectTasks.error.description')}
        actionText={t('projectTasks.error.retry')}
        onAction={() => projectTasks.refetch()}
      />
    );
  }

  if (projectTasks.loading && !tasks.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={28} sx={{ color: '#008767' }} />
      </Box>
    );
  }

  const toolbar = (
    <ProjectTasksToolbar
      summary={summary}
      loadedCount={tasks.length}
      totalCount={projectTasks.totalCount}
      filters={filters}
      onFiltersChange={view.setFilters}
      sort={sort}
      onSortChange={view.setSort}
      showEmptyStatuses={view.showEmptyStatuses}
      onShowEmptyStatusesChange={view.setShowEmptyStatuses}
      projects={isAllProjects ? projects : undefined}
      selectAction={
        tasks.length > 0 && !selection.state.isSelecting ? (
          <SelectButton onStart={selection.actions.startSelecting} />
        ) : undefined
      }
    />
  );

  if (!tasks.length) {
    const empty = searching ? (
      <EmptyState
        title={t('projectTasks.emptySearch.title')}
        description={t('projectTasks.emptySearch.description')}
      />
    ) : (
      <EmptyState
        icon={<TaskAltIcon />}
        title={t(
          isAllProjects && !filters.projectId
            ? 'projectTasks.empty.title'
            : 'projectTasks.emptyProject.title',
        )}
        description={t(
          isAllProjects && !filters.projectId
            ? 'projectTasks.empty.description'
            : 'projectTasks.emptyProject.description',
        )}
        actionText={t('projectTasks.empty.action')}
        onAction={() => onNewTask()}
      />
    );
    // Keep the project picker reachable when the chosen project is empty.
    return filters.projectId ? (
      <>
        {toolbar}
        {empty}
      </>
    ) : (
      empty
    );
  }

  const selected = selection.state.selectedItems;

  return (
    <Box>
      {toolbar}

      {selection.state.isSelecting && (
        <Box sx={{ mb: 1.5 }}>
          <SelectionToolbar
            isSelecting
            selectedCount={selection.state.selectedCount}
            allSelected={selection.actions.areAllSelected(shown)}
            hasItems={shown.length > 0}
            onCancel={selection.actions.stopSelecting}
            onToggleAll={() => selection.actions.toggleAll(shown)}
            onDelete={() => setConfirmDelete(true)}
          >
            <Button
              size="small"
              disabled={!selected.length}
              startIcon={<CompleteIcon sx={{ fontSize: 18 }} />}
              onClick={async () => {
                await projectTasks.setProjectTasksStatus(selected, 'completed');
                selection.actions.stopSelecting();
              }}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#008767' }}
            >
              {t('projectTasks.bulk.complete')}
            </Button>
            <Button
              size="small"
              disabled={!selected.length}
              startIcon={<MoveIcon sx={{ fontSize: 18 }} />}
              onClick={(e) => setMoveAnchor(e.currentTarget)}
              aria-haspopup="menu"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {t('projectTasks.bulk.move')}
            </Button>
          </SelectionToolbar>
        </Box>
      )}

      {shown.length === 0 ? (
        <EmptyState
          icon={<FilterOffIcon />}
          title={t('projectTasks.emptyFilters.title')}
          description={t('projectTasks.emptyFilters.description')}
          actionText={t('projectTasks.filters.clear')}
          onAction={() =>
            view.setFilters({
              ...NO_TASK_FILTERS,
              projectId: filters.projectId,
            })
          }
        />
      ) : (
        <ProjectTasksByStatus
          tasks={shown}
          // Filtering by a quick filter shows only the groups with matches.
          showEmptyStatuses={
            view.showEmptyStatuses && !hasActiveFilters(filters)
          }
          showProject={isAllProjects && !filters.projectId}
          onTaskClick={onOpenTask}
          onToggleComplete={projectTasks.toggleProjectTaskComplete}
          onChangeStatus={projectTasks.setProjectTaskStatus}
          onToggleSubtask={(taskId, subtaskId) =>
            projectTasks.toggleProjectSubtask(
              taskId,
              subtaskId,
              findTask(taskId)?.subtasks,
            )
          }
          onAddSubtask={(taskId, title) =>
            projectTasks.addProjectSubtask(
              taskId,
              title,
              findTask(taskId)?.subtasks,
            )
          }
          onAddTask={handleAddTask}
          selectionMode={selection.state.isSelecting}
          isSelected={selection.actions.isSelected}
          onToggleSelect={selection.actions.toggle}
        />
      )}

      {projectTasks.hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            onClick={() => projectTasks.loadMore()}
            disabled={projectTasks.isLoadingMore}
            sx={{ textTransform: 'none', fontWeight: 600, color: '#008767' }}
          >
            {projectTasks.isLoadingMore
              ? t('projectTasks.loadingMore')
              : t('projectTasks.loadMore')}
          </Button>
        </Box>
      )}

      <ProjectStatusMenu
        anchorEl={moveAnchor}
        onClose={() => setMoveAnchor(null)}
        onSelect={async (status) => {
          await projectTasks.setProjectTasksStatus(selected, status);
          selection.actions.stopSelecting();
        }}
      />

      <ConfirmDeleteDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={t('projectTasks.bulkDelete.title', { count: selected.length })}
        description={t('projectTasks.bulkDelete.description', {
          count: selected.length,
        })}
        itemNames={selected.map((task) => task.title)}
        onConfirm={async () => {
          await projectTasks.deleteProjectTasks(
            selected.map((task) => task.id),
          );
          selection.actions.stopSelecting();
        }}
      />
    </Box>
  );
};
