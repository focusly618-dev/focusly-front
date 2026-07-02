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

export const parseLuminaAction = (
  text: string,
): { cleanText: string; action: ParsedLuminaAction | null } => {
  const regex =
    /\[ACTION:\s*(CREATE_TASK|CREATE_WORKSPACE|CREATE_PROJECT_GROUP|INSERT_TO_WORKSPACE)\s*(\{.*?\})\]/;
  const match = text.match(regex);
  if (!match) {
    return { cleanText: text, action: null };
  }

  const cleanText = text.replace(regex, '').trim();
  try {
    const actionType = match[1] as ParsedLuminaAction['type'];
    const payload = JSON.parse(match[2]) as LuminaActionPayload;
    return {
      cleanText,
      action: {
        type: actionType,
        payload,
      },
    };
  } catch (e) {
    console.error('Failed to parse Lumina Action JSON:', e);
    return { cleanText: text, action: null };
  }
};
