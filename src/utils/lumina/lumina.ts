import type { LuminaActionPayload, ParsedLuminaAction } from './lumina.types';

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
