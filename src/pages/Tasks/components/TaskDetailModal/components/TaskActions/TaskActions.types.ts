import type { Task } from '@/redux/tasks/task.types';

export interface TaskActionsProps {
  initialTask: Task | null | undefined;
  handleDelete: () => Promise<void>;
  onClose: () => void;
  handleUpdate: () => void;
  handleSave: () => void;
  loadingSave: boolean;
  isAIScheduleEnabled?: boolean;
  setIsAIScheduleEnabled?: (enabled: boolean) => void;
  isReadOnly?: boolean;
}
