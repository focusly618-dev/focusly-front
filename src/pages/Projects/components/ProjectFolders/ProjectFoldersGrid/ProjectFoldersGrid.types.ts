import type { ProjectGroupTypes } from '@/pages/Workspace/workspace.types';
import type { MultiSelect } from '@/pages/Projects/hooks/useMultiSelect.hook';

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
  onDeleteFolders: (ids: string[]) => Promise<unknown> | void;
  folderSearchTerm?: string;
  /** Owned by the page, whose filters row has the "Select" button. */
  selection: MultiSelect<ProjectGroupTypes>;
}
