import type { ProjectTaskItemData } from '../ProjectTasks/projectTasks.types';

export interface ProjectOption {
  id: string;
  name: string;
  color?: string;
  emoji?: string;
}

export interface CreateProjectTaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: ProjectTaskItemData | null;
  projects?: ProjectOption[];
  selectedProjectId?: string | null;
  projectName?: string;
  projectEmoji?: string;
  sprintName?: string;
  linkedSpecTitle?: string;
  linkedSpecSection?: string;
  linkedWorkspaceId?: string | null;
  defaultStatus?: string;
  /** Title prefilled when creating (e.g. typed in a quick-add row). */
  defaultTitle?: string;
  onCreate?: (task: Record<string, unknown>) => void | Promise<unknown>;
  onUpdate?: (
    taskId: string,
    task: Record<string, unknown>,
  ) => void | Promise<unknown>;
  onDelete?: (taskId: string) => void | Promise<unknown>;
}
