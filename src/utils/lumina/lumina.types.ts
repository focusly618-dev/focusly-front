export interface LuminaActionPayload {
  /**
   * Plan-local handle for something this plan creates ("p1", "w1"), so other
   * actions in the same reply can point at it before it has a real id.
   */
  ref?: string;
  /** The project (CREATE_PROJECT_GROUP ref) created earlier in this plan. */
  project_ref?: string;
  /** The workspace (CREATE_WORKSPACE ref) created earlier in this plan. */
  workspace_ref?: string;
  /** UPDATE_TASK: the task's new status (Todo, Done, Archived…). */
  status?: string;
  /** UPDATE_SUBTASKS: subtasks to append to the task. */
  add?: Array<{ title: string; estimate_timer?: number }>;
  /** UPDATE_SUBTASKS: titles of subtasks to mark done / not done / delete. */
  complete?: string[];
  reopen?: string[];
  remove?: string[];
  /** Calendar events (CREATE_EVENT / UPDATE_EVENT). Local date-times. */
  description?: string;
  start?: string;
  end?: string;
  duration_minutes?: number;
  all_day?: boolean;
  location?: string;
  /** Emails invited to a new event. */
  attendees?: string[];
  /** UPDATE_EVENT: emails to invite / to drop. */
  add_attendees?: string[];
  remove_attendees?: string[];
  /** Add a Google Meet link. */
  meet?: boolean;
  /** Existing task id to edit — UPDATE_TASK only, never present on CREATE_TASK. */
  id?: string;
  title?: string;
  name?: string;
  notes?: string;
  estimate_timer?: number;
  priority_level?: number;
  /** ISO date (YYYY-MM-DD) this task should land on the calendar */
  deadline?: string;
  /** Full ISO datetime — UPDATE_TASK's way of moving a task to a new slot. */
  estimated_start_date?: string;
  estimated_end_date?: string;
  groupId?: string;
  /** CREATE_TASK from the editor: the document the task gets linked to. */
  workspace_id?: string;
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

export const LUMINA_ACTION_TYPES = [
  'CREATE_TASK',
  'UPDATE_TASK',
  'UPDATE_SUBTASKS',
  'DELETE_TASK',
  'CREATE_EVENT',
  'UPDATE_EVENT',
  'DELETE_EVENT',
  'CREATE_WORKSPACE',
  'CREATE_PROJECT_GROUP',
  'INSERT_TO_WORKSPACE',
  'CREATE_NOTE',
] as const;

export interface ParsedLuminaAction {
  type: (typeof LUMINA_ACTION_TYPES)[number];
  payload: LuminaActionPayload;
}

/** Actions this app knows how to preview and run (models can invent others). */
export const isKnownLuminaAction = (action: ParsedLuminaAction) =>
  (LUMINA_ACTION_TYPES as readonly string[]).includes(action.type);
