import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import type { FilterState } from '../components/FilterPopover/FilterPopover';
import type { SortState } from '../components/SortPopover/SortPopover';

export type DateRangeFilter = 'today' | 'this_week' | 'this_month' | 'all';

export const useTasksFilters = (
  viewMode?: 'list' | 'grid' | 'board' | 'workload',
) => {
  const [searchParams] = useSearchParams();
  const urlDateRange = searchParams.get('dateRange') as DateRangeFilter | null;
  const urlFilter = searchParams.get('filter');

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

  const [dateRange, setDateRangeState] = useState<DateRangeFilter>(() => {
    if (urlDateRange && ['today', 'this_week', 'this_month', 'all'].includes(urlDateRange)) {
      return urlDateRange;
    }
    const saved = localStorage.getItem('tasksDateRange');
    return (saved as DateRangeFilter) || 'all';
  });
  const [referenceDate, setReferenceDate] = useState<Date>(() => new Date());

  useEffect(() => {
    if (urlDateRange && ['today', 'this_week', 'this_month', 'all'].includes(urlDateRange)) {
      setDateRangeState(urlDateRange);
      setReferenceDate(new Date());
    }
  }, [urlDateRange]);

  useEffect(() => {
    localStorage.setItem('tasksDateRange', dateRange);
  }, [dateRange]);

  const setDateRange = useCallback((range: DateRangeFilter) => {
    setDateRangeState(range);
    setReferenceDate(new Date());
  }, []);

  const goToPreviousPeriod = useCallback(() => {
    setReferenceDate((prev) => {
      if (dateRange === 'today') return subDays(prev, 1);
      if (dateRange === 'this_week') return subWeeks(prev, 1);
      if (dateRange === 'this_month') return subMonths(prev, 1);
      return prev;
    });
  }, [dateRange]);

  const goToNextPeriod = useCallback(() => {
    setReferenceDate((prev) => {
      if (dateRange === 'today') return addDays(prev, 1);
      if (dateRange === 'this_week') return addWeeks(prev, 1);
      if (dateRange === 'this_month') return addMonths(prev, 1);
      return prev;
    });
  }, [dateRange]);

  let periodLabel: string;
  const realNow = new Date();
  if (dateRange === 'today') {
    periodLabel = isSameDay(referenceDate, realNow)
      ? 'Today'
      : format(referenceDate, 'EEE, MMM d');
  } else if (dateRange === 'this_week') {
    periodLabel = isSameWeek(referenceDate, realNow, { weekStartsOn: 1 })
      ? 'This Week'
      : `${format(startOfWeek(referenceDate, { weekStartsOn: 1 }), 'MMM d')} – ${format(endOfWeek(referenceDate, { weekStartsOn: 1 }), 'MMM d')}`;
  } else if (dateRange === 'this_month') {
    periodLabel = isSameMonth(referenceDate, realNow)
      ? 'This Month'
      : format(referenceDate, 'MMMM yyyy');
  } else {
    periodLabel = 'All Tasks';
  }

  // Sent to the backend as TaskFilterInput.startDate/endDate so the
  // Today/Week/Month navigation queries the server for the right slice of
  // tasks instead of fetching everything and filtering it in the browser.
  // The backend's own date filter (tasks_service.py's
  // _apply_filters_and_sorting) already checks the same field priority
  // (estimated_start_date, falling back to deadline) this page's filtering
  // used before, so moving the boundary here doesn't change which tasks
  // match — it just computes those same boundaries once and lets the
  // server do the filtering.
  const dateRangeFilter = useMemo((): {
    startDate?: string;
    endDate?: string;
  } => {
    if (dateRange === 'today') {
      return {
        startDate: startOfDay(referenceDate).toISOString(),
        endDate: endOfDay(referenceDate).toISOString(),
      };
    }
    if (dateRange === 'this_week') {
      return {
        startDate: startOfWeek(referenceDate, { weekStartsOn: 1 }).toISOString(),
        endDate: endOfWeek(referenceDate, { weekStartsOn: 1 }).toISOString(),
      };
    }
    if (dateRange === 'this_month') {
      const startMonth = startOfMonth(referenceDate);
      const startWeek = startOfWeek(referenceDate, { weekStartsOn: 1 });
      const start = startWeek < startMonth ? startWeek : startMonth;
      return {
        startDate: start.toISOString(),
        endDate: endOfMonth(referenceDate).toISOString(),
      };
    }
    return {};
  }, [dateRange, referenceDate]);

  const applyLocalFilters = useCallback(
    (tasksToFilter: TaskResponse[]) => {
      // Date-range filtering (Today/Week/Month) is done server-side now —
      // see dateRangeFilter above, sent as TaskFilterInput.startDate/endDate
      // — so `tasksToFilter` here has already been restricted to the right
      // window; nothing left to do for it in the browser.
      let result = tasksToFilter;

      if (searchTerm) {
        result = result.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.notes_encrypted
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }

      const selectedTags = activeFilterState?.categories || [];
      if (selectedTags.length > 0) {
        const targetTags = new Set(selectedTags.map((t) => t.toLowerCase()));
        result = result.filter((task) => {
          const taskTags = task.tags || [];
          return taskTags.some((tag) => {
            const tagName = typeof tag === 'string' ? tag : tag.name || '';
            return targetTags.has(tagName.toLowerCase());
          });
        });
      }
      const isStatusFiltered = (activeFilterState?.statuses?.length ?? 0) > 0;

      if (!isStatusFiltered && viewMode === 'grid') {
        // Hide Done tasks by default only if we are in grid view and not explicitly filtering by status
        result = result.filter((task) => task.status !== 'Done');
      }

      if (urlFilter === 'inbox') {
        result = result.filter(
          (task) => !task.deadline && !task.estimated_start_date,
        );
      }

      return result;
    },
    [searchTerm, activeFilterState?.statuses?.length, activeFilterState?.categories, viewMode, urlFilter],
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
      tags: filters.categories.length > 0 ? filters.categories : undefined,
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
    dateRange,
    setDateRange,
    referenceDate,
    goToPreviousPeriod,
    goToNextPeriod,
    periodLabel,
    dateRangeFilter,

    handleApplySort,
    handleApplyFilters,
    setPriorityFilter,
    setStatusFilter,
    applyLocalFilters,
  };
};
