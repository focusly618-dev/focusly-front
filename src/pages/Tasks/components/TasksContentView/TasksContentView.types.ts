import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { Task } from '@/redux/tasks/task.types';

export interface TasksContentViewProps {
  viewMode: 'list' | 'grid' | 'board' | 'workload';
  isLoading: boolean;
  tasks: TaskResponse[];
  filteredTasks: TaskResponse[];
  expandedTaskIds: Set<string>;
  toggleTaskExpansion: (taskId: string) => void;
  handleSubtaskToggle: (task: TaskResponse, index: number) => void;
  handleOpenSubtaskModal: (task: TaskResponse, index?: number) => void;
  handleTaskClick: (task: TaskResponse) => void;
  updateTask: (taskId: string, updates: TaskResponse) => Promise<void>;
  setSearchTerm: (term: string) => void;
  isAIScheduleEnabled?: boolean;
  setIsAIScheduleEnabled?: (enabled: boolean) => void;
  onStartFocus?: (task: Task) => void;
  activeFilters?: any;
  activeSort?: any;
  searchTerm?: string;
  dateRange?: string;
}
