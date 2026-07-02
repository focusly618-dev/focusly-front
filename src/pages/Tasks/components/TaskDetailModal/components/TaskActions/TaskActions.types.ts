import type { Task } from '@/redux/tasks/task.types';

export interface TaskActionsProps {
  initialTask: Task | null | undefined;
  handleDelete: () => Promise<void>;
  onClose: () => void;
  handleUpdate: () => void;
  handleSave: () => void;
  loadingSave: boolean;
  isReadOnly?: boolean;
  isDirty?: boolean;
  handleImproveTask?: (
    mode: 'subtasks' | 'estimate' | 'priority' | 'all',
  ) => void;
  disabled?: boolean;
}
