import { useState, useMemo, useEffect, useCallback } from 'react';
import moment from 'moment';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import type { FilterState } from '../components/FilterPopover/FilterPopover';
import type { SortState } from '../components/SortPopover/SortPopover';

export type DateRangeFilter = 'today' | 'last7' | 'last30' | 'all';

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

          const taskDateStr = moment(dateToUse).format('YYYY-MM-DD');

          if (dateRange === 'today') {
            return taskDateStr === moment().format('YYYY-MM-DD');
          }

          let startDateStr = '';
          if (dateRange === 'last7') {
            startDateStr = moment().subtract(7, 'days').format('YYYY-MM-DD');
          } else if (dateRange === 'last30') {
            startDateStr = moment().subtract(30, 'days').format('YYYY-MM-DD');
          }

          return taskDateStr >= startDateStr;
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
