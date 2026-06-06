import type { Task } from '@/redux/tasks/task.types';

export interface TaskData {
  id?: string;
  title: string;
  description: string;
  priority: 'High' | 'Med' | 'Low' | 'No priority';
  category: string;
  deadline: Date | null;
  duration: string;
  tags: string[];
  links?: { title: string; url: string }[];
  google_event_id?: string;
  status?: Task['status'];
  realTime?: string;
  shouldGenerateMeet?: boolean;
  collaborators?: { name: string; email: string; avatar?: string }[];
}

export interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialStart: Date | null;
  initialEnd: Date | null;
  initialTask?: Task | null;
  handleDelete?: (id: string) => Promise<void>;
  handleUpdate?: (task: Task) => Promise<void>;
  isAIScheduleEnabled?: boolean;
  setIsAIScheduleEnabled?: (enabled: boolean) => void;
}

export interface UseTaskDetailModalProps {
  onSave: (task: Task) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
  initialStart: Date | null;
  initialEnd?: Date | null;
  initialTask?: Task | null;
  isAIScheduleEnabled?: boolean;
  setIsAIScheduleEnabled?: (enabled: boolean) => void;
}

export interface TaskInput {
  title: string;
  notes_encrypted: string;
  estimate_timer: number;
  real_timer: number;
  tags: string[];
  deadline: string;
  priority_level: number;
  category: string;
  color?: string;
  links: { title: string; url: string }[];
  status?: string;
  google_event_id?: string;
  user_id?: string;
  collaborators?: { name: string; email: string; avatar?: string }[];
  estimated_start_date?: string;
  estimated_end_date?: string;
}

export interface UseTaskCollectionsProps {
  initialTask?: Task | null;
  onAddLink?: (links: { title: string; url: string }[]) => void;
  onRemoveLink?: (links: { title: string; url: string }[]) => void;
}

export interface UseTaskFormStateProps {
  initialTask?: Task | null;
  initialStart: Date | null;
}

export interface UseTaskMutationsProps {
  onSave: (task: Task) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
  initialTask?: Task | null;
  resetForm: () => void;
}
