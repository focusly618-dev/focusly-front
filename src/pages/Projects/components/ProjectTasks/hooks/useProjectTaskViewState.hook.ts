import { useState } from 'react';
import {
  NO_TASK_FILTERS,
  type ProjectTaskFilters,
  type ProjectTaskLayout,
  type ProjectTaskSort,
} from '../projectTaskFilters';

const SORT_KEY = 'focusly_project_tasks_sort';
const SHOW_EMPTY_KEY = 'focusly_project_tasks_show_empty';
const LAYOUT_KEY = 'focusly_project_tasks_layout';
const SORTS: ProjectTaskSort[] = ['dueDate', 'priority', 'title', 'recent'];
const LAYOUTS: ProjectTaskLayout[] = ['list', 'kanban'];

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

/** Filters, order, layout and empty-status toggle of the project tasks view. */
export const useProjectTaskViewState = () => {
  const [filters, setFilters] = useState<ProjectTaskFilters>(NO_TASK_FILTERS);
  const [sort, setSortState] = useState<ProjectTaskSort>(() => {
    const saved = read(SORT_KEY) as ProjectTaskSort | null;
    return saved && SORTS.includes(saved) ? saved : 'dueDate';
  });
  const [showEmptyStatuses, setShowEmptyState] = useState(
    () => read(SHOW_EMPTY_KEY) === 'true',
  );
  const [layout, setLayoutState] = useState<ProjectTaskLayout>(() => {
    const saved = read(LAYOUT_KEY) as ProjectTaskLayout | null;
    return saved && LAYOUTS.includes(saved) ? saved : 'list';
  });

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
    layout,
    setLayout: (value: ProjectTaskLayout) => {
      setLayoutState(value);
      write(LAYOUT_KEY, value);
    },
  };
};

export type ProjectTaskViewState = ReturnType<typeof useProjectTaskViewState>;
