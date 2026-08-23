import { describe, it, expect } from 'vitest';
import { convertMarkdownToDocx } from '@/pages/Workspace/components/Editor/components/EditorHeader/documentExporters';

// A .docx file is a zip archive — "PK" (0x50 0x4B) is the ZIP local-file-header
// magic number, so any valid output must start with it regardless of content.
const readZipMagicNumber = async (blob: Blob): Promise<string> => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return String.fromCharCode(bytes[0], bytes[1]);
};

describe('convertMarkdownToDocx', () => {
  it('produces a valid, non-empty .docx (zip) blob for plain text', async () => {
    const blob = await convertMarkdownToDocx('Just a plain paragraph.');
    expect(blob.size).toBeGreaterThan(0);
    expect(blob.type).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    expect(await readZipMagicNumber(blob)).toBe('PK');
  });

  it('does not throw on a realistic mixed document (headings, lists, quote, bold/italic, hr)', async () => {
    const markdown = [
      '# Title',
      '',
      '## Subheading',
      '',
      'Some **bold** and *italic* and `code` text.',
      '',
      '- bullet one',
      '- bullet two',
      '',
      '1. first',
      '2. second',
      '',
      '> a quoted line',
      '',
      '---',
      '',
      'Final paragraph.',
    ].join('\n');

    const blob = await convertMarkdownToDocx(markdown);
    expect(blob.size).toBeGreaterThan(0);
    expect(await readZipMagicNumber(blob)).toBe('PK');
  });

  it('handles an empty document without throwing', async () => {
    const blob = await convertMarkdownToDocx('');
    expect(blob.size).toBeGreaterThan(0);
  });
});
