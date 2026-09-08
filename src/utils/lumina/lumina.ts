import type { LuminaActionPayload, ParsedLuminaAction } from './lumina.types';

export interface ExtractedActionTag {
  type: ParsedLuminaAction['type'];
  payload: LuminaActionPayload;
  startIndex: number;
  endIndex: number;
}

function fallbackExtractPayload(
  type: ParsedLuminaAction['type'],
  rawSegment: string,
): LuminaActionPayload | null {
  try {
    if (type === 'CREATE_WORKSPACE') {
      const titleMatch = rawSegment.match(/"title"\s*:\s*"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : 'Espacio de Trabajo';

      let content = '';
      const contentIndex = rawSegment.indexOf('"content": "');
      if (contentIndex !== -1) {
        const afterContent = contentIndex + '"content": "'.length;
        const endMatch = rawSegment
          .slice(afterContent)
          .match(/"(?:\s*,\s*"project_group_id"|\s*\}\]|\s*\}\s*$)/);
        if (endMatch && endMatch.index !== undefined) {
          content = rawSegment.slice(
            afterContent,
            afterContent + endMatch.index,
          );
        } else {
          content = rawSegment.slice(afterContent);
        }
        content = content
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }

      const pgMatch = rawSegment.match(/"project_group_id"\s*:\s*"([^"]+)"/);
      const project_group_id = pgMatch ? pgMatch[1] : undefined;

      const pNameMatch = rawSegment.match(
        /"(?:project_name|new_project_name|group_name)"\s*:\s*"([^"]+)"/,
      );
      const project_name = pNameMatch ? pNameMatch[1] : undefined;

      const emojiMatch = rawSegment.match(/"emoji"\s*:\s*"([^"]+)"/);
      const emoji = emojiMatch ? emojiMatch[1] : undefined;

      const colorMatch = rawSegment.match(/"color"\s*:\s*"([^"]+)"/);
      const color = colorMatch ? colorMatch[1] : undefined;

      return {
        title,
        content,
        project_group_id,
        project_name,
        emoji,
        color,
      };
    }

    if (type === 'CREATE_TASK') {
      const titleMatch = rawSegment.match(/"title"\s*:\s*"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : 'Nueva Tarea';

      const timerMatch = rawSegment.match(/"estimate_timer"\s*:\s*(\d+)/);
      const estimate_timer = timerMatch ? parseInt(timerMatch[1], 10) : 30;

      const priorityMatch = rawSegment.match(/"priority_level"\s*:\s*(\d+)/);
      const priority_level = priorityMatch ? parseInt(priorityMatch[1], 10) : 1;

      const deadlineMatch = rawSegment.match(/"deadline"\s*:\s*"([^"]+)"/);
      const deadline = deadlineMatch ? deadlineMatch[1] : undefined;

      let notes_encrypted = '';
      const notesIndex = rawSegment.indexOf('"notes_encrypted": "');
      if (notesIndex !== -1) {
        const afterNotes = notesIndex + '"notes_encrypted": "'.length;
        const endMatch = rawSegment
          .slice(afterNotes)
          .match(/"(?:\s*,\s*"[a-z_]+"|\s*\}\]|\s*\}\s*$)/);
        if (endMatch && endMatch.index !== undefined) {
          notes_encrypted = rawSegment.slice(
            afterNotes,
            afterNotes + endMatch.index,
          );
        } else {
          notes_encrypted = rawSegment.slice(afterNotes);
        }
        notes_encrypted = notes_encrypted
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
      }

      return {
        title,
        estimate_timer,
        priority_level,
        deadline,
        notes_encrypted,
      };
    }
  } catch (err) {
    console.error('Fallback extract failed:', err);
  }
  return null;
}

/**
 * Extracts all `[ACTION: TYPE { ... }]` tags from text with balanced JSON brace parsing,
 * correctly handling nested subtasks `[{"title": "..."}]`, quotes, and escaped characters.
 */
export const extractLuminaActionTags = (
  text: string,
): {
  tags: ExtractedActionTag[];
  hasPendingAction: boolean;
  pendingStartIndex: number;
} => {
  const tags: ExtractedActionTag[] = [];
  const actionPrefix = '[ACTION:';
  let cursor = 0;
  let hasPendingAction = false;
  let pendingStartIndex = -1;

  while (cursor < text.length) {
    const startIndex = text.indexOf(actionPrefix, cursor);
    if (startIndex === -1) break;

    const afterPrefix = startIndex + actionPrefix.length;
    const braceStart = text.indexOf('{', afterPrefix);

    if (braceStart === -1) {
      hasPendingAction = true;
      pendingStartIndex = startIndex;
      break;
    }

    const typeCandidate = text.slice(afterPrefix, braceStart).trim();
    if (!typeCandidate) {
      cursor = braceStart + 1;
      continue;
    }

    let depth = 0;
    let inString = false;
    let escape = false;
    let braceEnd = -1;

    for (let i = braceStart; i < text.length; i++) {
      const char = text[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (char === '\\') {
        escape = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') {
          depth++;
        } else if (char === '}') {
          depth--;
          if (depth === 0) {
            braceEnd = i;
            break;
          }
        }
      }
    }

    // If depth scanning didn't cleanly find braceEnd (e.g. unescaped quotes inside JSON strings),
    // look for explicit closing `}]` or conversational boundary
    if (braceEnd === -1) {
      const directClose = text.indexOf('}]', braceStart);
      if (directClose !== -1) {
        braceEnd = directClose;
      }
    }

    let tagEnd = -1;
    if (braceEnd !== -1) {
      tagEnd = text.indexOf(']', braceEnd);
      if (tagEnd === -1) {
        tagEnd = braceEnd;
      }
    } else {
      // Missing closing brace. Check if conversational text or next action follows
      const conversationalBreak = text
        .slice(braceStart)
        .search(/"(?:\s*\}|)\s*\]?\s*\n\n(?=[¡¿A-Za-z])/);
      const nextAction = text.indexOf(actionPrefix, braceStart);

      if (
        conversationalBreak !== -1 &&
        (nextAction === -1 || conversationalBreak < nextAction - braceStart)
      ) {
        tagEnd = braceStart + conversationalBreak;
        braceEnd = tagEnd;
      } else if (nextAction !== -1) {
        tagEnd = nextAction;
        braceEnd = tagEnd;
      }
    }

    if (braceEnd === -1 || tagEnd === -1) {
      hasPendingAction = true;
      pendingStartIndex = startIndex;
      break;
    }

    const payloadRaw = text.slice(braceStart, braceEnd + 1);
    try {
      const payload = JSON.parse(payloadRaw) as LuminaActionPayload;
      tags.push({
        type: typeCandidate as ParsedLuminaAction['type'],
        payload,
        startIndex,
        endIndex: tagEnd + 1,
      });
      cursor = tagEnd + 1;
    } catch {
      // Resilient fallback extraction for malformed JSON strings
      const fallbackPayload = fallbackExtractPayload(
        typeCandidate as ParsedLuminaAction['type'],
        payloadRaw,
      );
      if (fallbackPayload) {
        tags.push({
          type: typeCandidate as ParsedLuminaAction['type'],
          payload: fallbackPayload,
          startIndex,
          endIndex: tagEnd + 1,
        });
      }
      cursor = tagEnd + 1;
    }
  }

  return { tags, hasPendingAction, pendingStartIndex };
};

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
  const { tags, hasPendingAction, pendingStartIndex } =
    extractLuminaActionTags(text);

  const actions: ParsedLuminaAction[] = tags.map((t) => ({
    type: t.type,
    payload: t.payload,
  }));

  // Strip all recognized action tags from the text
  let cleanText = '';
  let lastIndex = 0;

  for (const tag of tags) {
    cleanText += text.slice(lastIndex, tag.startIndex);
    lastIndex = tag.endIndex;
  }

  if (hasPendingAction && pendingStartIndex !== -1) {
    if (pendingStartIndex > lastIndex) {
      cleanText += text.slice(lastIndex, pendingStartIndex);
    }
  } else {
    cleanText += text.slice(lastIndex);
  }

  // FAIL-SAFE: Unconditionally scrub ANY remaining [ACTION: ... artifacts
  // so no raw technical protocol tokens ever leak into the user's chat bubble
  cleanText = cleanText.replace(
    /\[ACTION:\s*[A-Z_]+[\s\S]*?(?:\}\]\s*|\}\s*(?=\n\n)|(?<="|\d)\s*(?=\n\n\s*[¡¿A-Za-z])|(?=\n\s*\[ACTION:)|$)/g,
    '',
  );
  cleanText = cleanText.replace(
    /\[ACTION:\s*[A-Z_]+[\s\S]*?(?:\]|(?=\n\n(?:[¡¿A-Za-z#*]|$))|$)/g,
    '',
  );
  // Clean up any orphan `}]` leftovers
  cleanText = cleanText.replace(/^\s*\}\]\s*/gm, '');
  cleanText = cleanText.replace(/\s*\}\]\s*/g, '\n');
  cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim();

  return { cleanText, actions, hasPendingAction };
};
