/**
 * Models sometimes write their reasoning into the reply itself ("THOUGHT
 * The user wants a short title..."), as plain text the server can't tell
 * apart (the thinking it can tell apart is already dropped there). These
 * keep it out of what lands in a document or a title.
 */

// A reply opening with a reasoning section. In capitals the label counts
// even glued to what follows ("THOUGHTThe user wants..."); written as a word
// ("Thought") only with a colon, so titles like "Thoughtful design" or
// "Thoughts on launch" stay titles.
const REASONING_START =
  /^\s*(?:\*\*|#+\s*)?(?:(?:THOUGHTS?|THINKING|REASONING|ANALYSIS)(?![a-z])|(?:Thoughts?|Thinking|Reasoning|Analysis)\s*(?:\*\*)?\s*:)\s*(?:\*\*)?\s*:?/;

/** Whether a text starts with a model's reasoning written as text. */
export const isLeakedReasoning = (text: string): boolean =>
  REASONING_START.test(text);

// Where the actual answer is announced after the reasoning
const ANSWER_MARKER =
  /\n\s*(?:\*\*|#+\s*)?(?:FINAL ANSWER|ANSWER|RESPONSE|OUTPUT|RESULT|TITLE|TÍTULO|RESPUESTA)\b\s*(?:\*\*)?\s*:?\s*/i;

/** The reply without a leading reasoning section ('' when nothing but
 * reasoning came back). */
export const stripLeakedReasoning = (text: string): string => {
  if (!REASONING_START.test(text)) return text.trim();
  const marker = ANSWER_MARKER.exec(text);
  if (marker) return text.slice(marker.index + marker[0].length).trim();
  // Unlabelled: the answer is what follows the reasoning's first block
  const blocks = text.split(/\n\s*\n/);
  return blocks.length > 1 ? blocks.slice(1).join('\n\n').trim() : '';
};

// How reasoning reads, as opposed to a title
const SOUNDS_LIKE_REASONING =
  /\b(the user|user wants|i need to|i should|let me|let's|i will|i'll|el usuario|necesito|debo)\b/i;

/** A document title from a model reply, or '' when it isn't one (better
 * no title than a sentence of reasoning as the document's name). */
export const cleanTitle = (raw: string): string => {
  const answer = stripLeakedReasoning(raw);
  const line =
    answer
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .pop() ?? '';
  const title = line
    .replace(/^#+\s*/, '')
    .replace(/^\*\*(.*)\*\*$/, '$1')
    .replace(/^(?:title|título)\s*:\s*/i, '')
    .replace(/^["'“”«]+|["'“”»]+$/g, '')
    .replace(/[.。]+$/, '')
    .trim();
  if (!title || title.length > 80) return '';
  if (title.split(/\s+/).length > 12) return '';
  if (REASONING_START.test(title) || SOUNDS_LIKE_REASONING.test(title))
    return '';
  return title;
};
