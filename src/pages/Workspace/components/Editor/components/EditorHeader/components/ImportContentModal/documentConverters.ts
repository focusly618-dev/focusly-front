import mammoth from 'mammoth';
import TurndownService from 'turndown';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

export const convertDocxToMarkdown = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  return turndownService.turndown(html).trim();
};

export const convertPdfToMarkdown = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) pages.push(text);
  }

  // PDF text extraction has no structural markup to preserve (no real
  // headings/bold) — this is a plain-text dump of each page, not a
  // faithful markdown conversion of layout/formatting.
  return pages.join('\n\n');
};

export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

// Dispatches each staged file to its real converter based on extension.
// Returns null for anything we don't convert — legacy .doc (mammoth only
// reads the modern .docx XML format), .zip, and Excel (.xlsx/.xls — dropped
// after real-world report exports with a title/parameter block before the
// data table produced garbled single-column output; naive "row 1 = header"
// conversion isn't reliable enough for arbitrary spreadsheets).
export const getConverter = (
  file: File,
): ((file: File) => Promise<string>) | null => {
  const name = file.name.toLowerCase();
  if (name.endsWith('.md') || name.endsWith('.txt')) return readFileAsText;
  if (name.endsWith('.docx')) return convertDocxToMarkdown;
  if (name.endsWith('.pdf')) return convertPdfToMarkdown;
  return null;
};
