import type { Task, TaskStatus } from '@/redux/tasks/task.types';

export const BASE_EMPTY_TASK: Partial<Task> = {
  title: '',
  notes_encrypted: '',
  status: 'Todo' as TaskStatus,
  priority_level: 2,
  category: 'Personal',
  real_timer: 0,
};

export const DEFAULT_WORKSPACE_DATA = {
  title: 'Untitled Strategic Plan',
  content: '[]',
  saveStatus: true,
  groupId: undefined as string | undefined,
  taskId: null as string | null,
  projectId: undefined as string | undefined,
  emoji: undefined as string | undefined,
  background_color: undefined as string | undefined,
  card_show_background: false,
};
