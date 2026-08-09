import type { RefObject } from 'react';
import type { TaskSearchItems } from '@/pages/Workspace/types/workspace.types';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';

export interface EditorSidebarProps {
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (b: boolean) => void;
  selectTask: TaskSearchItems | null;
  handleUpdateTask?: (
    taskId: string,
    updates: Partial<TaskSearchItems>,
  ) => Promise<void>;
  onStartFocus?: (task: TaskSearchItems) => void;
  activeFocusTaskId?: string | null;
  onUnlinkTask?: () => void;
  setShowPalette?: (b: boolean | ((prev: boolean) => boolean)) => void;
  markdownContent?: string;
  markdownEditorRef?: RefObject<MarkdownEditorRef | null>;
}
