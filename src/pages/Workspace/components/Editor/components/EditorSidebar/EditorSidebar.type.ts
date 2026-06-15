import type { TaskSearchItems } from '@/pages/Workspace/types/workspace.types';

export interface EditorSidebarProps {
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (b: boolean) => void;
  selectTask: TaskSearchItems | null;
  handleUpdateTask?: (
    taskId: string,
    updates: Partial<TaskSearchItems>,
  ) => Promise<void>;
  onOpenTaskDetails?: (task: TaskSearchItems, mode?: 'view' | 'edit') => void;
  onStartFocus?: (task: TaskSearchItems) => void;
  activeFocusTaskId?: string | null;
  onUnlinkTask?: () => void;
  setShowPalette?: (b: boolean) => void;
}

