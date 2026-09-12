import type { ProjectGroupTypes } from '../../../Workspace/types/workspace.types';

export interface ProjectFolderCardProps {
  group: ProjectGroupTypes;
  index: number;
  onSelect: (groupId: string) => void;
  onCustomize?: (group: ProjectGroupTypes) => void;
  onDelete?: (group: ProjectGroupTypes) => void;
}
