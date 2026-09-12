import type { WorkspaceTypes } from '../../../Workspace/types/workspace.types';

export interface ProjectDocCardMenuProps {
  anchorEl: HTMLElement | null;
  selectedWorkspace: WorkspaceTypes | null;
  showPaletteInMenu: boolean;
  onClose: () => void;
  onTogglePalette: (show: boolean) => void;
  onSetBackground: (color: string) => void;
  onRemoveBackground: () => void;
  onDeleteWorkspace: (id: string) => void;
}
