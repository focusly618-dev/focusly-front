import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { STATUS_SECTIONS } from './TasksContentView.types';

interface UseTasksContentViewProps {
  filteredTasks: TaskResponse[];
  viewMode: 'list' | 'grid' | 'board' | 'workload';
  deleteTasks?: (ids: string[]) => Promise<void>;
}

export const useTasksContentView = ({
  filteredTasks,
  viewMode,
  deleteTasks,
}: UseTasksContentViewProps) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const PAGE_SIZE = 7;
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set(),
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prevViewMode, setPrevViewMode] = useState(viewMode);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [limit, setLimit] = useState(7);
  const [page, setPage] = useState(1);

  // Sync state if view mode changes
  if (viewMode !== prevViewMode) {
    setPrevViewMode(viewMode);
    setSelectedTaskIds(new Set());
    setIsConfirmOpen(false);
    setSelectedStatus('All');
    setPage(1);
  }

  const isListView =
    viewMode !== 'grid' && viewMode !== 'board' && viewMode !== 'workload';

  const isTaskReadOnly = useCallback(
    (t: TaskResponse) => {
      if (!t) return false;
      if (t.is_owner !== undefined) return !t.is_owner;
      if (!user) return false;
      if (t.task_type === 'GoogleTask' || t.google_event_id) {
        const organizerEmail = (t as unknown as { organizer_email?: string })
          .organizer_email;
        if (organizerEmail && user.email) {
          return organizerEmail.toLowerCase() !== user.email?.toLowerCase();
        }
      }
      if (t.user_id && user.id && t.user_id !== user.id) {
        return true;
      }
      return false;
    },
    [user],
  );

  const handleToggleSelect = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const tabs = useMemo(() => {
    return [
      {
        id: 'All',
        label: t('tasks.status.all', 'Todas'),
        color: '#008767',
        filter: () => true,
      },
      {
        id: 'Todo',
        label: t('tasks.status.todo', 'Por Hacer'),
        color: '#008767',
        filter: (tTask: TaskResponse) =>
          tTask.status === 'Todo' ||
          tTask.status === 'Backlog' ||
          !tTask.status,
      },
      {
        id: 'Planning',
        label: t('tasks.status.planning', 'Planificado'),
        color: '#3b82f6',
        filter: (tTask: TaskResponse) =>
          tTask.status === 'Planning' || tTask.status === 'Scheduled',
      },
      {
        id: 'Review',
        label: t('tasks.status.review', 'En Revisión'),
        color: '#06b6d4',
        filter: (tTask: TaskResponse) => tTask.status === 'Review',
      },
      {
        id: 'Pending',
        label: t('tasks.status.pending', 'Pendientes'),
        color: '#f59e0b',
        filter: (tTask: TaskResponse) =>
          tTask.status === 'Pending' || tTask.status === 'On Hold',
      },
      {
        id: 'Done',
        label: t('tasks.status.done', 'Completadas'),
        color: '#10b981',
        filter: (tTask: TaskResponse) => tTask.status === 'Done',
      },
    ];
  }, [t]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: filteredTasks.length,
    };
    STATUS_SECTIONS.forEach((section) => {
      counts[section.id] = filteredTasks.filter(section.filter).length;
    });
    return counts;
  }, [filteredTasks]);
  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === selectedStatus) || tabs[0];
  }, [selectedStatus, tabs]);

  const displayedTasks = useMemo(() => {
    return filteredTasks.filter(activeTab.filter);
  }, [filteredTasks, activeTab]);

  const totalPages = Math.max(1, Math.ceil(displayedTasks.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return displayedTasks.slice(start, start + PAGE_SIZE);
  }, [displayedTasks, page, PAGE_SIZE]);

  const isAllSelected = useMemo(() => {
    if (paginatedTasks.length === 0) return false;
    return paginatedTasks.every((task) => selectedTaskIds.has(task.id));
  }, [paginatedTasks, selectedTaskIds]);

  const isSomeSelected = useMemo(() => {
    if (paginatedTasks.length === 0) return false;
    const selectedCount = paginatedTasks.filter((task) =>
      selectedTaskIds.has(task.id),
    ).length;
    return selectedCount > 0 && selectedCount < paginatedTasks.length;
  }, [paginatedTasks, selectedTaskIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        paginatedTasks.forEach((task) => next.delete(task.id));
        return next;
      });
    } else {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        paginatedTasks.forEach((task) => next.add(task.id));
        return next;
      });
    }
  };

  const handleDeleteSelectedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!deleteTasks) return;
    setIsDeleting(true);
    try {
      await deleteTasks(Array.from(selectedTaskIds));
      setSelectedTaskIds(new Set());
      setIsConfirmOpen(false);
    } catch (err) {
      console.error('Error deleting tasks:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedTaskIds(new Set());
  };

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      // If we are close to the bottom (within 100px), increase the limit to show more items
      if (scrollHeight - scrollTop - clientHeight < 100) {
        if (displayedTasks.length > limit) {
          setLimit((prev) => prev + 24);
        }
      }
    },
    [displayedTasks.length, limit],
  );

  return {
    selectedTaskIds,
    isConfirmOpen,
    isDeleting,
    selectedStatus,
    setSelectedStatus,
    limit,
    setLimit,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalPages,
    paginatedTasks,
    isListView,
    isTaskReadOnly,
    handleToggleSelect,
    tabs,
    tabCounts,
    activeTab,
    displayedTasks,
    isAllSelected,
    isSomeSelected,
    handleToggleSelectAll,
    handleDeleteSelectedClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleClearSelection,
    handleScroll,
  };
};
