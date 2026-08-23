import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import {
  getConverter,
  convertXlsxToMarkdown,
  readFileAsText,
} from '@/pages/Workspace/components/Editor/components/EditorHeader/components/ImportContentModal/documentConverters';

const makeFile = (name: string, content: BlobPart = 'x'): File =>
  new File([content], name);

describe('getConverter — extension dispatch', () => {
  it('routes .md and .txt to the plain-text reader', () => {
    expect(getConverter(makeFile('notes.md'))).toBe(readFileAsText);
    expect(getConverter(makeFile('notes.txt'))).toBe(readFileAsText);
  });

  it('routes .docx to the Word converter (not legacy .doc)', () => {
    expect(getConverter(makeFile('report.docx'))).not.toBeNull();
    expect(getConverter(makeFile('REPORT.DOCX'))).not.toBeNull();
  });

  it('FIXED: legacy .doc is not silently mis-routed to the .docx converter — it is unsupported', () => {
    // mammoth only reads the modern .docx XML format; feeding it a binary
    // .doc file would throw deep inside the conversion instead of giving a
    // clear "unsupported format" message, so .doc must resolve to null here.
    expect(getConverter(makeFile('legacy.doc'))).toBeNull();
  });

  it('routes .xlsx and .xls to the Excel converter', () => {
    expect(getConverter(makeFile('sheet.xlsx'))).toBe(convertXlsxToMarkdown);
    expect(getConverter(makeFile('sheet.xls'))).toBe(convertXlsxToMarkdown);
  });

  it('routes .pdf to the PDF converter', () => {
    expect(getConverter(makeFile('doc.pdf'))).not.toBeNull();
  });

  it('returns null for .zip and any unrecognized extension (no silent mis-conversion)', () => {
    expect(getConverter(makeFile('archive.zip'))).toBeNull();
    expect(getConverter(makeFile('photo.jpg'))).toBeNull();
    expect(getConverter(makeFile('noextension'))).toBeNull();
  });
});

describe('convertXlsxToMarkdown — real workbook conversion', () => {
  const bufferToFile = (buffer: ArrayBuffer, name: string) =>
    new File([buffer], name, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

  it('converts a single-sheet workbook into a markdown table with the real header and rows', async () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      ['Name', 'Score'],
      ['Alice', 90],
      ['Bob', 85],
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    const markdown = await convertXlsxToMarkdown(
      bufferToFile(buffer, 'scores.xlsx'),
    );

    expect(markdown).toContain('## Sheet1');
    expect(markdown).toContain('| Name | Score |');
    expect(markdown).toContain('| --- | --- |');
    expect(markdown).toContain('| Alice | 90 |');
    expect(markdown).toContain('| Bob | 85 |');
  });

  it('converts every sheet in a multi-sheet workbook, each under its own heading', async () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([['A'], ['1']]),
      'First',
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([['B'], ['2']]),
      'Second',
    );
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    const markdown = await convertXlsxToMarkdown(
      bufferToFile(buffer, 'multi.xlsx'),
    );

    expect(markdown).toContain('## First');
    expect(markdown).toContain('## Second');
  });

  it('marks a genuinely empty sheet instead of producing a header-only broken table', async () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([]),
      'Blank',
    );
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    const markdown = await convertXlsxToMarkdown(
      bufferToFile(buffer, 'blank.xlsx'),
    );

    expect(markdown).toContain('## Blank');
    expect(markdown).toContain('_Empty sheet_');
  });
});
