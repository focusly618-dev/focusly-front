import { describe, it, expect } from 'vitest';
import { Text } from '@codemirror/state';
import { paragraphAt } from '@/pages/Workspace/components/Editor/codemirror/imperativeApi';

const doc = Text.of([
  '# Title', // 1
  '', // 2
  'First line of a paragraph', // 3
  'second line of it', // 4
  '   ', // 5 (whitespace only)
  'Another paragraph', // 6
]);
const slice = (r: { from: number; to: number } | null) =>
  r ? doc.sliceString(r.from, r.to) : null;
const posIn = (line: number, offset = 2) => doc.line(line).from + offset;

describe('paragraphAt (right-click target without a selection)', () => {
  it('takes every line of the paragraph clicked, from any of them', () => {
    const whole = 'First line of a paragraph\nsecond line of it';
    expect(slice(paragraphAt(doc, posIn(3)))).toBe(whole);
    expect(slice(paragraphAt(doc, posIn(4)))).toBe(whole);
  });

  it('stops at blank and whitespace-only lines', () => {
    expect(slice(paragraphAt(doc, posIn(1)))).toBe('# Title');
    expect(slice(paragraphAt(doc, posIn(6)))).toBe('Another paragraph');
  });

  it('gives nothing on a blank line', () => {
    expect(paragraphAt(doc, doc.line(2).from)).toBeNull();
    expect(paragraphAt(doc, posIn(5, 1))).toBeNull();
  });
});
