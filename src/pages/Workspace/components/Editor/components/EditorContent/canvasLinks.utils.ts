// The document side of canvases: the links to them in the markdown. Kept apart
// from canvasScene.utils so it doesn't pull Excalidraw in with it.

const MAX_NAME_LENGTH = 60;

/** The icon of a canvas that hasn't been given one. */
export const DEFAULT_CANVAS_ICON = '🎨';

// One emoji at the start of a label: a pictograph with its variation selector,
// skin tone and zero-width-joined parts, or a two-letter flag.
export const LEADING_EMOJI =
  /^(\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier}|\u200D\p{Extended_Pictographic})*|\p{Regional_Indicator}{2})\s*/u;

/** A canvas's name from the text it was made from: its first line, capped. */
export const canvasNameFrom = (text: string): string => {
  const firstLine = text
    .trim()
    .split('\n')[0]
    .replace(/^#+\s*/, '')
    .trim();
  if (!firstLine) return 'Canvas sin título';
  return firstLine.length > MAX_NAME_LENGTH
    ? `${firstLine.slice(0, MAX_NAME_LENGTH).trimEnd()}…`
    : firstLine;
};

/** The markdown link that opens a canvas from the document. Brackets and
 * line breaks would end the link early, so the name goes in without them. */
export const canvasLink = (
  id: string,
  name: string,
  icon: string | null = DEFAULT_CANVAS_ICON,
): string =>
  `[${icon || DEFAULT_CANVAS_ICON} ${name.replace(/[[\]\n]/g, '').trim()}](#canvas-${id})`;

/** A link's text split into its leading emoji, if any, and the name. */
export const splitCanvasLabel = (
  label: string,
): { icon: string | null; name: string } => {
  const trimmed = label.trim();
  const match = trimmed.match(LEADING_EMOJI);
  if (!match) return { icon: null, name: trimmed };
  return { icon: match[1], name: trimmed.slice(match[0].length).trim() };
};

/** Where the document links to this canvas, in any of the link forms. */
export const findCanvasLinks = (
  doc: string,
  id: string,
): { from: number; to: number; text: string }[] => {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const linkTo = new RegExp(
    String.raw`\[[^\]\n]*\]\((?:#canvas-?|canvas:)${escapedId}\)`,
    'g',
  );
  return [...doc.matchAll(linkTo)].map((m) => ({
    from: m.index,
    to: m.index + m[0].length,
    text: m[0],
  }));
};
