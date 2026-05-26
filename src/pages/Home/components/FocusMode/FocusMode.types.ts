import type { Task } from '@/redux/tasks/task.types';

export type ViewMode = 'full' | 'mini';

export interface FocusModeProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onActiveChange?: (isActive: boolean) => void;
}
