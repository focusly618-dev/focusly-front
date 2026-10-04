import { useState } from 'react';
import {
  NO_TASK_FILTERS,
  type ProjectTaskFilters,
  type ProjectTaskSort,
} from '../projectTaskFilters';

const SORT_KEY = 'focusly_project_tasks_sort';
const SHOW_EMPTY_KEY = 'focusly_project_tasks_show_empty';
const SORTS: ProjectTaskSort[] = ['dueDate', 'priority', 'title', 'recent'];

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Blocked storage: the choice just isn't remembered.
  }
};

/** Filters, order and empty-status toggle of the project tasks view. */
export const useProjectTaskViewState = () => {
  const [filters, setFilters] = useState<ProjectTaskFilters>(NO_TASK_FILTERS);
  const [sort, setSortState] = useState<ProjectTaskSort>(() => {
    const saved = read(SORT_KEY) as ProjectTaskSort | null;
    return saved && SORTS.includes(saved) ? saved : 'dueDate';
  });
  const [showEmptyStatuses, setShowEmptyState] = useState(
    () => read(SHOW_EMPTY_KEY) === 'true',
  );

  return {
    filters,
    setFilters,
    sort,
    setSort: (value: ProjectTaskSort) => {
      setSortState(value);
      write(SORT_KEY, value);
    },
    showEmptyStatuses,
    setShowEmptyStatuses: (value: boolean) => {
      setShowEmptyState(value);
      write(SHOW_EMPTY_KEY, String(value));
    },
  };
};

export type ProjectTaskViewState = ReturnType<typeof useProjectTaskViewState>;
