import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import type { Task } from '@/redux/tasks/task.types';

export const STATUS_SECTIONS = [
  {
    id: 'Todo',
    label: 'Por Hacer',
    color: '#008767',
    filter: (t: TaskResponse) =>
      t.status === 'Todo' || t.status === 'Backlog' || !t.status,
  },
  {
    id: 'Planning',
    label: 'Planificado',
    color: '#3b82f6',
    filter: (t: TaskResponse) =>
      t.status === 'Planning' || t.status === 'Scheduled',
  },
  {
    id: 'Review',
    label: 'En Revisión',
    color: '#06b6d4',
    filter: (t: TaskResponse) => t.status === 'Review',
  },
  {
    id: 'Pending',
    label: 'Pendientes',
    color: '#f59e0b',
    filter: (t: TaskResponse) =>
      t.status === 'Pending' || t.status === 'On Hold',
  },
  {
    id: 'Done',
    label: 'Completadas',
    color: '#10b981',
    filter: (t: TaskResponse) => t.status === 'Done',
  },
];

export interface TasksContentViewProps {
  viewMode: 'list' | 'grid' | 'board' | 'workload';
  isLoading: boolean;
  tasks: TaskResponse[];
  filteredTasks: TaskResponse[];
  handleTaskClick: (task: TaskResponse) => void;
  updateTask: (
    taskId: string,
    updates: TaskResponse,
    options?: { silent?: boolean },
  ) => Promise<void>;
  setSearchTerm: (term: string) => void;
  isAIScheduleEnabled?: boolean;
  setIsAIScheduleEnabled?: (enabled: boolean) => void;
  onStartFocus?: (task: Task) => void;
  activeFilters?: TaskFilterInput;
  activeSort?: TaskSortInput;
  searchTerm?: string;
  dateRange?: string;
  deleteTasks?: (ids: string[]) => Promise<void>;
  totalCount: number;
}
