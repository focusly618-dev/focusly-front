import type { ProjectGroupTypes } from '../../../Workspace/types/workspace.types';

export interface ProjectFoldersGridProps {
  groups: ProjectGroupTypes[];
  totalGroupPages?: number;
  groupPage?: number;
  onPageChange?: (page: number) => void;
  onSelectFolder: (groupId: string) => void;
  onCreateFolder: (
    name: string,
    color: string,
    emoji: string,
  ) => Promise<unknown> | void;
  onUpdateFolder: (
    id: string,
    input: { name?: string; color?: string; emoji?: string },
  ) => Promise<unknown> | void;
  onDeleteFolder: (id: string) => Promise<unknown> | void;
  folderSearchTerm?: string;
}
