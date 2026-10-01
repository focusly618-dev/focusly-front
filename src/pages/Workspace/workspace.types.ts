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
  workspaces?: { id: string }[];
  workspaceCount?: number;
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
  tasks?: TaskSearchItems[];
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
  tasks?: TaskSearchItems[];
  projectId?: string;
  groupId?: string;
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
  tasksData: { tasks: TaskSearchItems[]; hasMore?: boolean } | undefined;
  onStartFocus?: (task?: TaskSearchItems | null) => void;
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: (isOpen: boolean) => void;
  saveState?: 'idle' | 'saving' | 'saved';
  workspaces?: WorkspaceTypes[];
  activeFocusTaskId?: string | null;
  onUnlinkTask?: () => void;
  loadMore: () => Promise<void>;
}

export interface WorkspaceProps {
  isEditorOpen: boolean;
  onEditorChange: (isOpen: boolean) => void;
  onStartFocus?: (task?: TaskSearchItems | null) => void;
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
  notes?: string;
  links?: { title: string; url: string }[];
  google_event_id?: string;
  task_type?: 'PlatformTask' | 'GoogleTask';
  source?: 'google' | 'platform';
  workspace_id?: string | null;
  workspaces?: {
    id: string;
    title: string;
    folder?: {
      name: string;
      color?: string;
    } | null;
  }[];
}
export { colorPaletteMap } from './components/Library/constants/library.constants';
