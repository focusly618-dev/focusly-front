// Text put into the note from outside the keyboard (Lumina's replies, the
// AI rewrite actions, inserts) has to land the way markdown reads it: a table
// glued to the end of a sentence stays a sentence, a $$ block needs its own
// lines, and a line typed right under a table becomes one of its rows.

/** Windows line endings, and a reply wrapped whole in a ```markdown fence
 * (it's markdown to put in the note, not a code sample). */
export const normalizeInsertedMarkdown = (text: string): string => {
  const unix = text.replace(/\r\n?/g, '\n');
  const wrapped = /^\s*```(?:markdown|md)[ \t]*\n([\s\S]*?)\n```\s*$/i.exec(
    unix,
  );
  return wrapped ? wrapped[1] : unix;
};

// Starts of block-level markdown: fences, math, tables, collapsed sections,
// headings, lists and quotes.
const BLOCK_START =
  /^\s*(```|~~~|\$\$|\||<details|#{1,6}\s|[-*+]\s|\d+[.)]\s|>)/;

/** Whether text is (or holds) block-level markdown rather than a few words. */
export const isBlockMarkdown = (text: string): boolean =>
  text.trim().includes('\n') || BLOCK_START.test(text);

/**
 * The text to put over doc[from, to] so a block lands on lines of its own:
 * a blank line before and after it, unless its neighbors already give it
 * one (or it's at the very start or end). Words go in untouched.
 */
export const padBlockInsert = (
  doc: string,
  from: number,
  to: number,
  text: string,
): string => {
  if (!isBlockMarkdown(text)) return text;
  const body = text.replace(/^\n+/, '').replace(/\s+$/, '');
  const before = doc.slice(0, from);
  const after = doc.slice(to);

  let prefix = '';
  if (before.trim()) {
    if (!before.endsWith('\n')) prefix = '\n\n';
    else if (!/\n[ \t]*\n$/.test(before)) prefix = '\n';
  }
  let suffix = '';
  if (after.trim()) {
    if (!after.startsWith('\n')) suffix = '\n\n';
    else if (!/^\n[ \t]*\n/.test(after)) suffix = '\n';
  }
  return prefix + body + suffix;
};

/** Both steps: what to insert over doc[from, to] for incoming markdown. */
export const prepareMarkdownInsert = (
  doc: string,
  from: number,
  to: number,
  text: string,
): string => padBlockInsert(doc, from, to, normalizeInsertedMarkdown(text));
