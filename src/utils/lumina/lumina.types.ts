export interface LuminaActionPayload {
  /** Existing task id to edit — UPDATE_TASK only, never present on CREATE_TASK. */
  id?: string;
  title?: string;
  name?: string;
  notes_encrypted?: string;
  estimate_timer?: number;
  priority_level?: number;
  /** ISO date (YYYY-MM-DD) this task should land on the calendar */
  deadline?: string;
  /** Full ISO datetime — UPDATE_TASK's way of moving a task to a new slot. */
  estimated_start_date?: string;
  estimated_end_date?: string;
  groupId?: string;
  content?: string;
  markdown?: string;
  content_encrypted?: string;
  project_group_id?: string;
  project_name?: string;
  new_project_name?: string;
  emoji?: string;
  color?: string;
  subtasks?: Array<
    | string
    | {
        id?: string;
        title: string;
        estimate_timer?: number;
        completed?: boolean;
      }
  >;
}

export interface ParsedLuminaAction {
  type:
    | 'CREATE_TASK'
    | 'UPDATE_TASK'
    | 'CREATE_WORKSPACE'
    | 'CREATE_PROJECT_GROUP'
    | 'INSERT_TO_WORKSPACE'
    | 'CREATE_NOTE';
  payload: LuminaActionPayload;
}
