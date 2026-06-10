export interface TaskFilterInput {
  status?: (
    | 'Todo'
    | 'Planning'
    | 'Pending'
    | 'On Hold'
    | 'Review'
    | 'Done'
    | 'Backlog'
    | 'Scheduled'
    | 'Archived'
  )[];
  priorityLevel?: number[];
  category?: string[];
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface TaskSortInput {
  sort?: string;
  order?: string;
}

export interface TaskResponse {
  id: string;
  user_id: string;
  is_owner?: boolean;
  title: string;
  notes_encrypted: string;
  estimate_timer: number;
  estimate_minutes: number;
  real_timer?: number;
  duration?: string;
  priority_level: number;
  category: string;
  color?: string;
  deadline: string;
  status:
    | 'Todo'
    | 'Planning'
    | 'Pending'
    | 'On Hold'
    | 'Review'
    | 'Done'
    | 'Backlog'
    | 'Scheduled'
    | 'Archived';
  completed_at?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  tags: { name: string }[];
  filters?: TaskFilterInput;
  sort?: TaskSortInput;
  links?: { title: string; url: string }[];
  google_event_id?: string;
  collaborators?: {
    name: string;
    email: string;
    avatar?: string;
    responseStatus?: string;
  }[];
  estimated_start_date?: string;
  estimated_end_date?: string;
  task_type?: string;
  source?: string;
  workspace?: {
    id: string;
    title: string;
    content?: string;
    updatedAt?: string;
    folder?: {
      id: string;
      name: string;
      color?: string;
    } | null;
    project?: {
      id: string;
      name: string;
      color?: string;
    } | null;
  };
  use_ai?: boolean;
}

export interface updateTask {
  id: string;
  title?: string;
  notes_encrypted?: string;
  estimate_timer?: number;
  priority_level?: number;
  deadline?: string;
  status?:
    | 'Todo'
    | 'Planning'
    | 'Pending'
    | 'On Hold'
    | 'Review'
    | 'Done'
    | 'Backlog'
    | 'Scheduled'
    | 'Archived';
  estimated_start_date?: string;
  estimated_end_date?: string;
  use_ai?: boolean;
}

export interface CreateTaskRequest {
  user_id: string;
  title: string;
  notes_encrypted: string;
  estimate_timer: number;
  priority_level: number;
  deadline: string;
  status:
    | 'Todo'
    | 'Planning'
    | 'Pending'
    | 'On Hold'
    | 'Review'
    | 'Done'
    | 'Backlog'
    | 'Scheduled'
    | 'Archived';
  tags: string[];
  estimated_start_date?: string;
  estimated_end_date?: string;
  use_ai?: boolean;
}
