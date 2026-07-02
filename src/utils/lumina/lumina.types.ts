export interface LuminaActionPayload {
  title?: string;
  name?: string;
  notes_encrypted?: string;
  estimate_timer?: number;
  priority_level?: number;
  groupId?: string;
  content?: string;
  markdown?: string;
}

export interface ParsedLuminaAction {
  type:
    | 'CREATE_TASK'
    | 'CREATE_WORKSPACE'
    | 'CREATE_PROJECT_GROUP'
    | 'INSERT_TO_WORKSPACE';
  payload: LuminaActionPayload;
}
