import React, { useState, useMemo, useCallback } from 'react';
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
  const { user } = useAppSelector((state) => state.auth);

  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set(),
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prevViewMode, setPrevViewMode] = useState(viewMode);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [limit, setLimit] = useState(24);

  // Sync state if view mode changes
  if (viewMode !== prevViewMode) {
    setPrevViewMode(viewMode);
    setSelectedTaskIds(new Set());
    setIsConfirmOpen(false);
    setSelectedStatus('All');
  }

  const isListView =
    viewMode !== 'grid' && viewMode !== 'board' && viewMode !== 'workload';

  const isTaskReadOnly = useCallback(
    (t: TaskResponse) => {
      if (!user) return true;
      if (t.task_type === 'GoogleTask' || t.google_event_id) {
        const organizerEmail = (t as unknown as { organizer_email?: string })
          .organizer_email;
        if (organizerEmail) {
          return organizerEmail.toLowerCase() !== user.email?.toLowerCase();
        }
      }
      if (t.user_id && t.user_id !== user.id) {
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
        label: 'All',
        color: '#6366f1',
        filter: (t: TaskResponse) => t.status !== 'Done',
      },
      ...STATUS_SECTIONS,
    ];
  }, []);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: filteredTasks.filter((t) => t.status !== 'Done').length,
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

  const selectableDisplayedTasks = useMemo(() => {
    return displayedTasks.filter((t) => !isTaskReadOnly(t));
  }, [displayedTasks, isTaskReadOnly]);

  const isAllSelected = useMemo(() => {
    if (selectableDisplayedTasks.length === 0) return false;
    return selectableDisplayedTasks.every((task) =>
      selectedTaskIds.has(task.id),
    );
  }, [selectableDisplayedTasks, selectedTaskIds]);

  const isSomeSelected = useMemo(() => {
    if (selectableDisplayedTasks.length === 0) return false;
    const selectedCount = selectableDisplayedTasks.filter((task) =>
      selectedTaskIds.has(task.id),
    ).length;
    return selectedCount > 0 && selectedCount < selectableDisplayedTasks.length;
  }, [selectableDisplayedTasks, selectedTaskIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        selectableDisplayedTasks.forEach((task) => next.delete(task.id));
        return next;
      });
    } else {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        selectableDisplayedTasks.forEach((task) => next.add(task.id));
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
