import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  isToday,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import type { FilterState } from '../components/FilterPopover/FilterPopover';
import type { SortState } from '../components/SortPopover/SortPopover';

export type DateRangeFilter = 'today' | 'this_week' | 'this_month' | 'all';

export const useTasksFilters = (tasks: TaskResponse[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<
    TaskFilterInput | undefined
  >(undefined);
  const [activeFilterState, setActiveFilterState] = useState<
    FilterState | undefined
  >(undefined);
  const [activeSort, setActiveSort] = useState<TaskSortInput | undefined>(
    undefined,
  );
  const [isCompletedFilterActive, setIsCompletedFilterActive] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeFilter>(() => {
    const saved = localStorage.getItem('tasksDateRange');
    return (saved as DateRangeFilter) || 'all';
  });

  useEffect(() => {
    localStorage.setItem('tasksDateRange', dateRange);
  }, [dateRange]);

  const applyLocalFilters = useCallback(
    (tasksToFilter: TaskResponse[]) => {
      let result = tasksToFilter;

      // Filter by date range
      if (dateRange !== 'all') {
        result = result.filter((task) => {
          const dateToUse =
            task.status === 'Done' || !task.deadline
              ? task.created_at || task.updated_at
              : task.deadline;

          if (!dateToUse) return false;

          const taskDate = new Date(dateToUse);
          const now = new Date();

          if (dateRange === 'today') {
            return isToday(taskDate);
          }

          if (dateRange === 'this_week') {
            const start = startOfWeek(now, { weekStartsOn: 1 });
            const end = endOfWeek(now, { weekStartsOn: 1 });
            return isWithinInterval(taskDate, { start, end });
          }

          if (dateRange === 'this_month') {
            const start = startOfMonth(now);
            const end = endOfMonth(now);
            return isWithinInterval(taskDate, { start, end });
          }

          return true;
        });
      }

      if (searchTerm) {
        result = result.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.notes_encrypted
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }
      const isStatusFiltered = (activeFilterState?.statuses?.length ?? 0) > 0;

      if (isCompletedFilterActive) {
        result = result.filter((task) => task.status === 'Done');
      } else if (!isStatusFiltered) {
        // Only hide Done tasks by default if we are not explicitly filtering by status
        result = result.filter((task) => task.status !== 'Done');
      }

      return result;
    },
    [dateRange, searchTerm, activeFilterState, isCompletedFilterActive],
  );

  const filteredTasks = useMemo(
    () => applyLocalFilters(tasks),
    [tasks, applyLocalFilters],
  );

  const handleApplySort = (sort: SortState) => {
    const { sort: mappedSort, order: mappedOrder } = sort;
    if (!mappedSort && mappedOrder === undefined) {
      setActiveSort(undefined);
    } else {
      setActiveSort({ sort: mappedSort, order: mappedOrder });
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    const priorityMap: Record<string, number> = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const newFilterInput: TaskFilterInput = {
      status:
        filters.statuses.length > 0
          ? (filters.statuses as NonNullable<TaskFilterInput['status']>)
          : undefined,
      priorityLevel:
        filters.priorities.length > 0
          ? filters.priorities.map((p) => priorityMap[p])
          : undefined,
      category: filters.categories.length > 0 ? filters.categories : undefined,
    };

    if (
      filters.statuses.length === 0 &&
      filters.priorities.length === 0 &&
      filters.categories.length === 0
    ) {
      setActiveFilters(undefined);
      setActiveFilterState(undefined);
    } else {
      setActiveFilters(newFilterInput);
      setActiveFilterState(filters);
    }
  };

  const setPriorityFilter = (priority: number | undefined) => {
    if (priority === undefined) {
      setActiveFilters(undefined);
      setActiveFilterState(undefined);
    } else {
      const priorityMap: Record<number, string> = {
        3: 'High',
        2: 'Medium',
        1: 'Low',
      };
      setActiveFilters({ priorityLevel: [priority] });
      setActiveFilterState({
        priorities: [priorityMap[priority]],
        categories: [],
        statuses: [],
      });
    }
  };

  const setStatusFilter = (status: string | 'all') => {
    if (status === 'all') {
      setActiveFilters(undefined);
      setActiveFilterState(undefined);
    } else {
      setActiveFilters({
        status: [status as NonNullable<TaskFilterInput['status']>[number]],
      });
      setActiveFilterState({
        priorities: [],
        categories: [],
        statuses: [status],
      });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    activeFilters,
    activeFilterState,
    activeSort,
    isCompletedFilterActive,
    setIsCompletedFilterActive,
    dateRange,
    setDateRange,
    filteredTasks,
    handleApplySort,
    handleApplyFilters,
    setPriorityFilter,
    setStatusFilter,
    applyLocalFilters,
  };
};
