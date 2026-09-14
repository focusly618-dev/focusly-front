import type { ProjectGroupTypes } from '@/pages/Workspace/workspace.types';

export interface ProjectFolderCardProps {
  group: ProjectGroupTypes;
  index: number;
  onSelect: (groupId: string) => void;
  onCustomize?: (group: ProjectGroupTypes) => void;
  onDelete?: (group: ProjectGroupTypes) => void;
}
