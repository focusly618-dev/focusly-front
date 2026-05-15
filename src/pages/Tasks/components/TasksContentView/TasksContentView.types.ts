import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';

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
  updateTask: (taskId: string, updates: Partial<TaskResponse>) => Promise<void>;
  setSearchTerm: (term: string) => void;
}
