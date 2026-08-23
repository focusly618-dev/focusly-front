import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import {
  buildDiff,
  diffReviewExtensions,
  diffRangesField,
  setPendingDiff,
  resolveDiff,
} from '@/pages/Workspace/components/Editor/codemirror/extensions/diffReview';

describe('buildDiff', () => {
  it('produces no diff ranges when the proposed text is identical', () => {
    const { combinedText, ranges } = buildDiff('hello world', 'hello world');
    expect(combinedText).toBe('hello world');
    expect(ranges).toEqual([]);
  });

  it('marks a pure addition as "add" ranges covering exactly the new text', () => {
    const { combinedText, ranges } = buildDiff('hello', 'hello world');
    expect(combinedText).toBe('hello world');
    expect(ranges.every((r) => r.kind === 'add')).toBe(true);
    const addedText = ranges.map((r) => combinedText.slice(r.from, r.to)).join('');
    expect(addedText.trim()).toBe('world');
  });

  it('marks a pure deletion as "del" ranges covering exactly the removed text', () => {
    const { combinedText, ranges } = buildDiff('hello world', 'hello');
    expect(combinedText).toBe('hello world');
    expect(ranges.every((r) => r.kind === 'del')).toBe(true);
    const removedText = ranges.map((r) => combinedText.slice(r.from, r.to)).join('');
    expect(removedText.trim()).toBe('world');
  });

  it('FIXED scenario: a replacement keeps BOTH the old and new wording in the combined text', () => {
    // This is the exact shape of "clarify point 1" — old wording removed
    // (struck through) and new wording added (underlined), never silently
    // swapped without the user seeing what changed.
    const { combinedText, ranges } = buildDiff(
      'The point is somewhat unclear.',
      'The point is crystal clear.',
    );
    const dels = ranges.filter((r) => r.kind === 'del');
    const adds = ranges.filter((r) => r.kind === 'add');
    expect(dels.length).toBeGreaterThan(0);
    expect(adds.length).toBeGreaterThan(0);
    expect(combinedText).toContain('somewhat unclear');
    expect(combinedText).toContain('crystal clear');
  });
});

const makeView = (doc: string) =>
  new EditorView({
    state: EditorState.create({ doc, extensions: diffReviewExtensions }),
  });

describe('resolveDiff — accept/reject against a real EditorView', () => {
  it('accept: drops the deleted (struck-through) spans and keeps the added text', () => {
    const original = 'The point is somewhat unclear.';
    const proposed = 'The point is crystal clear.';
    const { combinedText, ranges } = buildDiff(original, proposed);

    const view = makeView(combinedText);
    view.dispatch({ effects: setPendingDiff.of(ranges) });
    expect(view.state.field(diffRangesField)).toEqual(ranges);

    resolveDiff(view, 'accept');

    expect(view.state.doc.toString()).toBe(proposed);
    expect(view.state.field(diffRangesField)).toEqual([]);
  });

  it('reject: drops the added (underlined) spans and restores the original text exactly', () => {
    const original = 'The point is somewhat unclear.';
    const proposed = 'The point is crystal clear.';
    const { combinedText, ranges } = buildDiff(original, proposed);

    const view = makeView(combinedText);
    view.dispatch({ effects: setPendingDiff.of(ranges) });

    resolveDiff(view, 'reject');

    expect(view.state.doc.toString()).toBe(original);
    expect(view.state.field(diffRangesField)).toEqual([]);
  });

  it('accept on a pure addition keeps the new text with no pending ranges left over', () => {
    const original = 'hello';
    const proposed = 'hello world';
    const { combinedText, ranges } = buildDiff(original, proposed);

    const view = makeView(combinedText);
    view.dispatch({ effects: setPendingDiff.of(ranges) });
    resolveDiff(view, 'accept');

    expect(view.state.doc.toString()).toBe('hello world');
  });

  it('reject on a pure deletion restores the removed text', () => {
    const original = 'hello world';
    const proposed = 'hello';
    const { combinedText, ranges } = buildDiff(original, proposed);

    const view = makeView(combinedText);
    view.dispatch({ effects: setPendingDiff.of(ranges) });
    resolveDiff(view, 'reject');

    expect(view.state.doc.toString()).toBe('hello world');
  });

  it('is a no-op on a document with no pending diff (nothing staged, nothing to resolve)', () => {
    const view = makeView('untouched document');
    expect(() => resolveDiff(view, 'accept')).not.toThrow();
    expect(view.state.doc.toString()).toBe('untouched document');
  });
});
