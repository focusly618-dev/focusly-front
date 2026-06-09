import type {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

export interface ProjectGroupTypes {
  id: string;
  name: string;
  userId: string;
  color?: string;
  emoji?: string;
  folders?: ProjectTypes[];
  generalWorkspaces?: WorkspaceTypes[];
  folderCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTypes {
  id: string;
  name: string;
  userId: string;
  color?: string;
  groupId?: string;
  workspaceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceTypes {
  id: string;
  userId: string;
  taskId?: string;
  task?: TaskSearchItems;
  projectId?: string;
  groupId?: string;
  project?: ProjectTypes;
  title: string;
  saveStatus: boolean;
  content: string;
  emoji?: string;
  background_color?: string;
  card_show_background?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceFormData {
  id?: string;
  title: string;
  content: string;
  taskId?: string | null;
  projectId?: string;
  project?: ProjectTypes;
  saveStatus: boolean;
  emoji?: string;
  background_color?: string;
  card_show_background?: boolean;
}

export interface WorkspaceEditorProps {
  onBack: () => void;
  register: UseFormRegister<WorkspaceFormData>;
  setValue: UseFormSetValue<WorkspaceFormData>;
  watch: UseFormWatch<WorkspaceFormData>;
  getValues: UseFormGetValues<WorkspaceFormData>;
  selectTask: TaskSearchItems | null;
  handleSelectTask: (task: TaskSearchItems | null) => void;
  handleUpdateTask: (
    taskId: string,
    updates: Partial<TaskSearchItems>,
  ) => Promise<void>;
  tasksData: { tasks: TaskSearchItems[] } | undefined;
  onStartFocus?: (task?: TaskSearchItems | null) => void;
  onOpenTaskDetails?: (task: TaskSearchItems, mode?: 'view' | 'edit') => void;
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (isOpen: boolean) => void;
  saveStatus?: 'idle' | 'saving' | 'saved';
  workspaces?: WorkspaceTypes[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomSlashMenuItems: (editor: any) => any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWorkspaceMentionMenuItems: (editor: any) => any[];
  activeFocusTaskId?: string | null;
  onUnlinkTask?: () => void;
}

export interface WorkspaceProps {
  isEditorOpen: boolean;
  onEditorChange: (isOpen: boolean) => void;
  onStartFocus?: (task?: TaskSearchItems | null) => void;
  onOpenTaskDetails?: (task: TaskSearchItems, mode?: 'view' | 'edit') => void;
  isSidebarOpen: boolean;
  onSidebarChange: (isOpen: boolean) => void;
  activeFocusTaskId?: string | null;
}
export interface TaskSearchItems {
  id: string;
  title: string;
  status: string;
  estimate_timer: number;
  real_timer?: number;
  duration?: number;
  priority_level: number;
  category?: string;
  deadline: string;
  created_at?: string;
  notes_encrypted?: string;
  links?: { title: string; url: string }[];
  google_event_id?: string;
  workspaces?: {
    id: string;
    title: string;
    folder?: {
      name: string;
      color?: string;
    } | null;
  }[];
}
export const colorPaletteMap: Record<
  string,
  { gradient: string; isLight: boolean }
> = {
  aurora: {
    gradient: 'linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)',
    isLight: true,
  },
  sunset: {
    gradient: 'linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)',
    isLight: true,
  },
  ocean: {
    gradient: 'linear-gradient(135deg, #7dd3fc 0%, #67e8f9 100%)',
    isLight: true,
  },
  forest: {
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #86efac 100%)',
    isLight: true,
  },
  midnight: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    isLight: false,
  },
  rose: {
    gradient: 'linear-gradient(135deg, #fecdd3 0%, #f9a8d4 100%)',
    isLight: true,
  },
  golden: {
    gradient: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
    isLight: true,
  },
  cosmic: {
    gradient: 'linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 100%)',
    isLight: true,
  },
  ember: {
    gradient: 'linear-gradient(135deg, #fca5a5 0%, #f87171 100%)',
    isLight: true,
  },
  dusk: {
    gradient: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
    isLight: true,
  },
  arctic: {
    gradient: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)',
    isLight: true,
  },
  spring: {
    gradient: 'linear-gradient(135deg, #bef264 0%, #d9f99d 100%)',
    isLight: true,
  },
  candy: {
    gradient: 'linear-gradient(135deg, #f5d0fe 0%, #e9d5ff 100%)',
    isLight: true,
  },
  neon: {
    gradient: 'linear-gradient(135deg, #67e8f9 0%, #c084fc 100%)',
    isLight: true,
  },
  borealis: {
    gradient: 'linear-gradient(135deg, #86efac 0%, #5eead4 100%)',
    isLight: true,
  },
  royal: {
    gradient: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    isLight: false,
  },
  grape: {
    gradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)',
    isLight: true,
  },
  kyoto: {
    gradient: 'linear-gradient(135deg, #fecaca 0%, #fef08a 100%)',
    isLight: true,
  },
  aqua: {
    gradient: 'linear-gradient(135deg, #99f6e4 0%, #a5f3fc 100%)',
    isLight: true,
  },
  mauve: {
    gradient: 'linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%)',
    isLight: true,
  },
  shore: {
    gradient: 'linear-gradient(135deg, #bae6fd 0%, #fef3c7 100%)',
    isLight: true,
  },
  peach: {
    gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    isLight: true,
  },
  indigo: {
    gradient: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)',
    isLight: true,
  },
  nebula: {
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%)',
    isLight: true,
  },
  mint: {
    gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    isLight: true,
  },
  blood: {
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    isLight: true,
  },
  silver: {
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    isLight: true,
  },
  obsidian: {
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    isLight: false,
  },
};
