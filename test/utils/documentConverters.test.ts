import { describe, it, expect } from 'vitest';
import {
  getConverter,
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

  it('returns null for .xlsx/.xls — Excel import was removed (naive row-1-as-header conversion produced garbled output on real report exports)', () => {
    expect(getConverter(makeFile('sheet.xlsx'))).toBeNull();
    expect(getConverter(makeFile('sheet.xls'))).toBeNull();
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
