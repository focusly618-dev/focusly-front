import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { GET_TAGS } from '@/pages/Tasks/Task.graphql';
import { useTasksData } from '@/pages/Tasks/hooks/useTasksData.hook';
import { useTasksFilters } from '@/pages/Tasks/hooks/useTasksFilters.hook';
import { useTasksMutations } from '@/pages/Tasks/hooks/useTasksMutations.hook';
import { useTasksUI } from '@/pages/Tasks/hooks/useTasksUI.hook';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';

export const useTasks = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // ── View & UI local state ──────────────────────────────────────────
  const [viewMode, setViewMode] = useState<
    'list' | 'grid' | 'board' | 'workload'
  >('list');
  const [runOnboarding, setRunOnboarding] = useState(
    () => localStorage.getItem('onboarding_tasks_completed') !== 'true',
  );

  // ── Composed hooks ─────────────────────────────────────────────────

  const ui = useTasksUI();
  const filterLogic = useTasksFilters([]);

  const data = useTasksData({
    userId: user?.id,
    filters: filterLogic.activeFilters,
    sort: filterLogic.activeSort,
    offset: page * pageSize,
    limit: pageSize,
  });

  const mutations = useTasksMutations({
    userId: user?.id,
    tasks: data.tasks,
    onSuccess: ui.triggerToast,
  });

  const { data: tagsData } = useQuery(GET_TAGS, {
    variables: { userId: user?.id },
    skip: !user?.id || !ui.filterAnchorEl,
  });

  const tags: string[] = useMemo(
    () => tagsData?.getTagsByUser || [],
    [tagsData],
  );

  // ── Derived data ───────────────────────────────────────────────────
  const filteredTasks = useMemo(
    () => filterLogic.applyLocalFilters(data.tasks),
    [data.tasks, filterLogic],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: data.tasks.length,
      Todo: 0,
      Planning: 0,
      Scheduled: 0,
      Done: 0,
    };
    data.tasks.forEach((t) => {
      const status = t.status || 'Todo';
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });
    return counts;
  }, [data.tasks]);

  const { highPriorityTasks, todayTasks, upcomingTasks } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA');

    const high: TaskResponse[] = [];
    const today: TaskResponse[] = [];
    const upcoming: TaskResponse[] = [];

    filteredTasks.forEach((task) => {
      if (task.status === 'Done') return;

      const dateToUse = task.deadline;
      const taskDateStr = dateToUse
        ? new Date(dateToUse).toLocaleDateString('en-CA')
        : '';
      const isHighPriority = (task.priority_level ?? 0) >= 3;
      const isOverdue = taskDateStr && taskDateStr < todayStr;

      if (isHighPriority || isOverdue) {
        high.push(task);
      } else if (taskDateStr === todayStr) {
        today.push(task);
      } else {
        upcoming.push(task);
      }
    });

    return {
      highPriorityTasks: high,
      todayTasks: today,
      upcomingTasks: upcoming,
    };
  }, [filteredTasks]);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleTaskClick = (task: TaskResponse): void => {
    setSearchParams({ tab: 'Tasks', taskId: task.id });
  };

  const handleFilterClick = (
    event: React.MouseEvent<HTMLElement>,
    type: string,
  ): void => {
    if (type === 'filter') {
      ui.setFilterAnchorEl(event.currentTarget);
    } else if (type === 'sort') {
      ui.setSortAnchorEl(event.currentTarget);
    } else if (type === 'completed') {
      filterLogic.setIsCompletedFilterActive((prev) => !prev);
    }
  };

  const handleFinishOnboarding = (): void => {
    setRunOnboarding(false);
    localStorage.setItem('onboarding_tasks_completed', 'true');
  };

  // ── Return ─────────────────────────────────────────────────────────
  return {
    // Data
    tasks: data.tasks,
    totalCount: data.totalCount,
    isLoading: data.isLoading,
    completedTasksCount: data.completedTasksCount,
    pendingTasksCount: data.pendingTasksCount,
    filteredTasks,
    tags,
    page,
    setPage,
    pageSize,
    setPageSize,

    // Filters & search
    searchTerm: filterLogic.searchTerm,
    setSearchTerm: filterLogic.setSearchTerm,
    highPriorityTasks,
    todayTasks,
    upcomingTasks,
    isCompletedFilterActive: filterLogic.isCompletedFilterActive,
    dateRange: filterLogic.dateRange,
    setDateRange: filterLogic.setDateRange,
    activeSort: filterLogic.activeSort,
    activeFilters: filterLogic.activeFilters,
    activeFilterState: filterLogic.activeFilterState,
    handleApplySort: filterLogic.handleApplySort,
    handleApplyFilters: filterLogic.handleApplyFilters,

    // UI state
    selectedTask: ui.selectedTask,
    isModalOpen: ui.isModalOpen,
    handleCloseModal: ui.handleCloseModal,
    handleSaveModal: ui.handleCloseModal,
    filterAnchorEl: ui.filterAnchorEl,
    sortAnchorEl: ui.sortAnchorEl,
    expandedTaskIds: ui.expandedTaskIds,
    toggleTaskExpansion: ui.toggleTaskExpansion,
    showSuccessToast: ui.showSuccessToast,
    setShowSuccessToast: ui.setShowSuccessToast,
    toastMessage: ui.toastMessage,
    toastSubMessage: ui.toastSubMessage,

    // Mutations

    updateTask: mutations.updateTask,
    deleteTasks: mutations.deleteTasks,

    // View & modal
    viewMode,
    setViewMode,
    runOnboarding,
    setRunOnboarding,

    // Actions
    handleTaskClick,
    handleFilterClick,
    handleFilterClose: () => ui.setFilterAnchorEl(null),
    handleSortClose: () => ui.setSortAnchorEl(null),
    handleFinishOnboarding,
    setPriorityFilter: filterLogic.setPriorityFilter,
    setStatusFilter: filterLogic.setStatusFilter,
    statusCounts,
  };
};
