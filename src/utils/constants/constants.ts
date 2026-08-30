import type { Task, TaskStatus } from '@/redux/tasks/task.types';

export const BASE_EMPTY_TASK: Partial<Task> = {
  title: '',
  notes_encrypted: '',
  status: 'Todo' as TaskStatus,
  priority_level: 2,
  category: 'Personal',
  real_timer: 0,
};

// Only ever shown as a display fallback (list rows, linked-task chips) or
// as a last-resort saved title if AI title generation fails — new
// workspaces start with an empty title so the user can type their own, or
// let it be auto-generated from their content. See useWorkspaceForm.hook.ts.
export const UNTITLED_WORKSPACE_TITLE = 'Untitled Strategic Plan';

export const DEFAULT_WORKSPACE_DATA = {
  title: '',
  content: '[]',
  saveStatus: true,
  groupId: undefined as string | undefined,
  taskId: null as string | null,
  projectId: undefined as string | undefined,
  emoji: undefined as string | undefined,
  background_color: undefined as string | undefined,
  card_show_background: false,
};
