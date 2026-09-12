export interface ProjectOption {
  id: string;
  name: string;
  color?: string;
  emoji?: string;
}

export interface CreateProjectTaskModalProps {
  open: boolean;
  onClose: () => void;
  projects?: ProjectOption[];
  selectedProjectId?: string | null;
  projectName?: string;
  projectEmoji?: string;
  sprintName?: string;
  linkedSpecTitle?: string;
  linkedSpecSection?: string;
  defaultStatus?: string;
  onCreate?: (task: Record<string, unknown>) => void | Promise<unknown>;
}
