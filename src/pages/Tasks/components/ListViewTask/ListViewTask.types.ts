import type { TaskResponse } from "@/api/Tasks/apiTaskTypes";
import type { Task } from "@/redux/tasks/task.types";

export interface ListViewTaskProps {
  task: TaskResponse;
  expandedTaskIds: Set<string>;
  toggleTaskExpansion: (taskId: string) => void;
  handleSubtaskToggle: (task: TaskResponse, index: number) => void;
  handleOpenSubtaskModal: (task: TaskResponse, index?: number) => void;
  onTaskClick: (task: TaskResponse) => void;
  updateTask?: (taskId: string, updates: TaskResponse) => Promise<void>;
  isAIScheduleEnabled?: boolean;
  onStartFocus?: (task: Task) => void;
}

export interface UseListViewTask {
    statusAnchor: null | HTMLElement;
    setStatusAnchor: (anchor: null | HTMLElement) => void;
    priorityAnchor: null | HTMLElement;
    setPriorityAnchor: (anchor: null | HTMLElement) => void;
    dateAnchor: null | HTMLElement;
    setDateAnchor: (anchor: null | HTMLElement) => void;
    handlePrioritySelect: (level: number) => Promise<void>;
    handleDateSelect: (daysToAdd: number) => Promise<void>;
    handleStatusSelect: (status: string) => Promise<void>;
    getStatusColor: (status: string) => string;
    getPriorityColor: (level: number) => string;
    statusColor: string;
    priorityColor: string;
}