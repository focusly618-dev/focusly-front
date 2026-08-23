import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  BorderStyle,
} from 'docx';

const HEADING_LEVELS = [
  HeadingLevel.HEADING_1,
  HeadingLevel.HEADING_2,
  HeadingLevel.HEADING_3,
  HeadingLevel.HEADING_4,
  HeadingLevel.HEADING_5,
  HeadingLevel.HEADING_6,
];

const NUMBERED_LIST_REF = 'exported-numbered-list';

// Splits one line into runs, handling the common inline markers (bold,
// italic, bold+italic, inline code) — not a full CommonMark parser, but
// covers what the editor's own formatting toolbar actually produces.
const parseInline = (text: string): TextRun[] => {
  const pattern =
    /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|`(.+?)`/g;
  const runs: TextRun[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun(text.slice(lastIndex, match.index)));
    }
    if (match[1] !== undefined) {
      runs.push(new TextRun({ text: match[1], bold: true, italics: true }));
    } else if (match[2] !== undefined) {
      runs.push(new TextRun({ text: match[2], bold: true }));
    } else if (match[3] !== undefined) {
      runs.push(new TextRun({ text: match[3], italics: true }));
    } else if (match[4] !== undefined) {
      runs.push(new TextRun({ text: match[4], italics: true }));
    } else if (match[5] !== undefined) {
      runs.push(new TextRun({ text: match[5], font: 'Courier New' }));
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun(text.slice(lastIndex)));
  }

  return runs.length > 0 ? runs : [new TextRun(text)];
};

export const convertMarkdownToDocx = async (
  markdown: string,
): Promise<Blob> => {
  const lines = markdown.split('\n');
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    const bulletMatch = /^\s*[-*+]\s+(.*)$/.exec(line);
    const numberedMatch = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const quoteMatch = /^>\s?(.*)$/.exec(line);

    if (headingMatch) {
      paragraphs.push(
        new Paragraph({
          heading: HEADING_LEVELS[headingMatch[1].length - 1],
          children: parseInline(headingMatch[2]),
        }),
      );
    } else if (bulletMatch) {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: parseInline(bulletMatch[1]),
        }),
      );
    } else if (numberedMatch) {
      paragraphs.push(
        new Paragraph({
          numbering: { reference: NUMBERED_LIST_REF, level: 0 },
          children: parseInline(numberedMatch[1]),
        }),
      );
    } else if (quoteMatch) {
      paragraphs.push(
        new Paragraph({
          indent: { left: 480 },
          border: {
            left: {
              style: BorderStyle.SINGLE,
              size: 12,
              space: 8,
              color: '999999',
            },
          },
          children: parseInline(quoteMatch[1]),
        }),
      );
    } else if (/^(---|\*\*\*|___)\s*$/.test(line.trim())) {
      paragraphs.push(
        new Paragraph({
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 6,
              space: 1,
              color: '999999',
            },
          },
        }),
      );
    } else {
      paragraphs.push(new Paragraph({ children: parseInline(line) }));
    }
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: NUMBERED_LIST_REF,
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: 'start',
            },
          ],
        },
      ],
    },
    sections: [{ children: paragraphs }],
  });

  return Packer.toBlob(doc);
};
