import type { LuminaActionPayload, ParsedLuminaAction } from './lumina.types';

const ACTION_TAG_REGEX = /\[ACTION:\s*([A-Z_]+)\s*(\{.*?\})\]/gs;
// Matches the opening of a tag that hasn't closed yet (still streaming in
// token by token) — used to hide the raw fragment instead of flashing it.
const PENDING_ACTION_MARKER = /\[ACTION:/;

/**
 * A plan spanning several days/weeks (e.g. a month-long research plan)
 * legitimately emits one ACTION tag per task — extract every one of them,
 * not just the first, so the user sees the whole plan, not one task.
 */
export const parseLuminaActions = (
  text: string,
): {
  cleanText: string;
  actions: ParsedLuminaAction[];
  hasPendingAction: boolean;
} => {
  const actions: ParsedLuminaAction[] = [];
  const regex = new RegExp(ACTION_TAG_REGEX);
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    try {
      actions.push({
        type: match[1] as ParsedLuminaAction['type'],
        payload: JSON.parse(match[2]) as LuminaActionPayload,
      });
    } catch (e) {
      console.error('Failed to parse Lumina Action JSON:', e);
    }
  }

  const strippedText = text.replace(new RegExp(ACTION_TAG_REGEX), '').trim();

  // Anything left after stripping every *complete* tag can only be a tag
  // that's still being generated (opened with "[ACTION:" but not yet
  // closed) — cut it from what's shown and flag it so the caller can
  // render a loading state instead of raw, half-typed JSON.
  const pendingIndex = strippedText.search(PENDING_ACTION_MARKER);
  const hasPendingAction = pendingIndex !== -1;
  const cleanText = hasPendingAction
    ? strippedText.slice(0, pendingIndex).trim()
    : strippedText;

  return { cleanText, actions, hasPendingAction };
};
