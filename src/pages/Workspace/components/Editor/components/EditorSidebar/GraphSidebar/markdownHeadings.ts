export interface HeadingItem {
  level: number;
  text: string;
  pos: number;
}

// Plain-text line scan, not the CM6/Lezer syntax tree — this only needs to
// extract heading text + level + offset for a side panel, not decide what to
// hide/reveal while editing, so there's no reason to depend on the editor's
// live syntax tree here.
export const parseHeadings = (markdown: string): HeadingItem[] => {
  const items: HeadingItem[] = [];
  let pos = 0;

  for (const line of markdown.split('\n')) {
    const match = /^(#{1,6})\s+(.+)$/.exec(line);
    if (match) {
      items.push({ level: match[1].length, text: match[2].trim(), pos });
    }
    pos += line.length + 1;
  }

  return items;
};
