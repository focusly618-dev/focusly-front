export interface HeadingItem {
  level: number;
  text: string;
  pos: number;
}

export const getHeadingPath = (
  headings: HeadingItem[],
  targetPos: number,
): HeadingItem[] => {
  const path: HeadingItem[] = [];

  for (const heading of headings) {
    while (path.length > 0 && path[path.length - 1].level >= heading.level) {
      path.pop();
    }
    path.push(heading);

    if (heading.pos === targetPos) return [...path];
  }

  return [];
};

// Plain-text line scan, not the CM6/Lezer syntax tree — this only needs to
// extract heading text + level + offset for a side panel, not decide what to
// hide/reveal while editing, so there's no reason to depend on the editor's
// live syntax tree here.
export const parseHeadings = (markdown: string): HeadingItem[] => {
  const items: HeadingItem[] = [];
  let pos = 0;

  for (const line of markdown.split('\n')) {
    const match = /^\s*(#{1,6})\s*(.+)$/.exec(line);
    if (match && match[2].trim()) {
      items.push({ level: match[1].length, text: match[2].trim(), pos });
    }
    pos += line.length + 1;
  }

  // Fallback: If no markdown `#` headings were found, extract bullet points or bold lines
  if (items.length === 0 && markdown.trim().length > 0) {
    let linePos = 0;
    for (const line of markdown.split('\n')) {
      const trimmed = line.trim();
      // Match bold titles like **Objetivo**
      const boldMatch = /^\*\*(.+?)\*\*:?$/.exec(trimmed);
      if (boldMatch && boldMatch[1].trim()) {
        items.push({ level: 1, text: boldMatch[1].trim(), pos: linePos });
      } else {
        // Match numbered lists like 1. Paso uno
        const numMatch = /^(\d+)\.\s+(.+)$/.exec(trimmed);
        if (numMatch && numMatch[2].trim()) {
          items.push({ level: 2, text: numMatch[2].trim(), pos: linePos });
        } else {
          // Match bullet points like - Tarea o * Punto
          const bulletMatch = /^[-*•]\s+(.+)$/.exec(trimmed);
          if (bulletMatch && bulletMatch[1].trim()) {
            items.push({ level: 2, text: bulletMatch[1].trim(), pos: linePos });
          }
        }
      }
      linePos += line.length + 1;
    }
  }

  return items;
};
