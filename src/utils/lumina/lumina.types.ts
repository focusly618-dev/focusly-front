export interface LuminaActionPayload {
  title?: string;
  name?: string;
  notes_encrypted?: string;
  estimate_timer?: number;
  priority_level?: number;
  /** ISO date (YYYY-MM-DD) this task should land on the calendar */
  deadline?: string;
  groupId?: string;
  content?: string;
  markdown?: string;
  content_encrypted?: string;
  project_group_id?: string;
}

export interface ParsedLuminaAction {
  type:
    | 'CREATE_TASK'
    | 'CREATE_WORKSPACE'
    | 'CREATE_PROJECT_GROUP'
    | 'INSERT_TO_WORKSPACE'
    | 'CREATE_NOTE';
  payload: LuminaActionPayload;
}
