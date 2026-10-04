import type { ProjectGroupTypes } from '@/pages/Workspace/workspace.types';

export interface ProjectFolderCardProps {
  group: ProjectGroupTypes;
  onSelect: (groupId: string) => void;
  onCustomize?: (group: ProjectGroupTypes) => void;
  onDelete?: (group: ProjectGroupTypes) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (group: ProjectGroupTypes) => void;
}
