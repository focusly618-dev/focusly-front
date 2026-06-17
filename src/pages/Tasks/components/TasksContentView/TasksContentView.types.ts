import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import type { Task } from '@/redux/tasks/task.types';

export const STATUS_SECTIONS = [
  {
    id: 'Todo',
    label: 'To Do',
    color: '#64748b',
    filter: (t: TaskResponse) => t.status === 'Todo' || !t.status,
  },
  {
    id: 'Planning',
    label: 'Planning',
    color: '#3b82f6',
    filter: (t: TaskResponse) => t.status === 'Planning',
  },
  {
    id: 'Scheduled',
    label: 'Scheduled',
    color: '#8b5cf6',
    filter: (t: TaskResponse) => t.status === 'Scheduled',
  },
  {
    id: 'Review',
    label: 'Review',
    color: '#06b6d4',
    filter: (t: TaskResponse) => t.status === 'Review',
  },
  {
    id: 'Pending',
    label: 'Pending',
    color: '#f59e0b',
    filter: (t: TaskResponse) => t.status === 'Pending',
  },
  {
    id: 'On Hold',
    label: 'On Hold',
    color: '#ef4444',
    filter: (t: TaskResponse) => t.status === 'On Hold',
  },
  {
    id: 'Done',
    label: 'Done',
    color: '#10b981',
    filter: (t: TaskResponse) => t.status === 'Done',
  },
  {
    id: 'Backlog',
    label: 'Backlog',
    color: '#94a3b8',
    filter: (t: TaskResponse) => t.status === 'Backlog',
  },
  {
    id: 'Archived',
    label: 'Archived',
    color: '#4b5563',
    filter: (t: TaskResponse) => t.status === 'Archived',
  },
];

export interface TasksContentViewProps {
  viewMode: 'list' | 'grid' | 'board' | 'workload';
  isLoading: boolean;
  tasks: TaskResponse[];
  filteredTasks: TaskResponse[];
  handleTaskClick: (task: TaskResponse) => void;
  updateTask: (taskId: string, updates: TaskResponse) => Promise<void>;
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
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}
