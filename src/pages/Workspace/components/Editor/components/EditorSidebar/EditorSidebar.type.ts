import type { RefObject } from 'react';
import type { TaskSearchItems } from '@/pages/Workspace/workspace.types';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';

export interface EditorSidebarProps {
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (b: boolean) => void;
  markdownContent?: string;
  markdownEditorRef?: RefObject<MarkdownEditorRef | null>;
  currentTitle?: string;
  currentEmoji?: string;
  currentFolder?: { name?: string; color?: string; emoji?: string } | null;
  // Optional legacy props
  selectTask?: TaskSearchItems | null;
  handleUpdateTask?: (
    taskId: string,
    updates: Partial<TaskSearchItems>,
  ) => Promise<void>;
  onStartFocus?: (task: TaskSearchItems) => void;
  activeFocusTaskId?: string | null;
  onUnlinkTask?: () => void;
  setShowPalette?: (b: boolean | ((prev: boolean) => boolean)) => void;
}
