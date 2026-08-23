import { diffWords } from 'diff';
import {
  StateEffect,
  StateField,
  type Extension,
  type Transaction,
} from '@codemirror/state';
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view';

export interface DiffRange {
  from: number;
  to: number;
  kind: 'add' | 'del';
}

export interface DiffBuildResult {
  combinedText: string;
  ranges: DiffRange[];
}

// Walks a word-level diff between the current document and the AI's proposed
// replacement, producing one string that contains BOTH versions at once —
// old text kept (marked for deletion) and new text inserted (marked as
// added) — so the user can see exactly what would change before committing
// to it, the same shape as a git diff rendered inline instead of side-by-side.
export const buildDiff = (
  originalText: string,
  proposedText: string,
): DiffBuildResult => {
  const parts = diffWords(originalText, proposedText);
  let combinedText = '';
  const ranges: DiffRange[] = [];

  for (const part of parts) {
    const from = combinedText.length;
    combinedText += part.value;
    const to = combinedText.length;
    if (part.added) ranges.push({ from, to, kind: 'add' });
    else if (part.removed) ranges.push({ from, to, kind: 'del' });
  }

  return { combinedText, ranges };
};

export const setPendingDiff = StateEffect.define<DiffRange[]>();
export const clearPendingDiff = StateEffect.define<null>();

const diffMarks = {
  add: Decoration.mark({ class: 'cm-diff-add' }),
  del: Decoration.mark({ class: 'cm-diff-del' }),
};

const buildDecorations = (ranges: DiffRange[]): DecorationSet =>
  Decoration.set(
    ranges
      .filter((r) => r.from < r.to)
      .map((r) => diffMarks[r.kind].range(r.from, r.to)),
    true,
  );

// Independent of document content on purpose (unlike livePreview's
// syntax-tree-derived decorations) — this only ever changes in response to
// the two effects below, mirroring the StateField convention already used
// by blockDecorationsField/calloutFoldField in ./livePreview.
export const diffRangesField = StateField.define<DiffRange[]>({
  create: () => [],
  update(ranges, tr: Transaction) {
    for (const effect of tr.effects) {
      if (effect.is(setPendingDiff)) return effect.value;
      if (effect.is(clearPendingDiff)) return [];
    }
    if (tr.docChanged && ranges.length > 0) {
      return ranges
        .map((r) => ({
          from: tr.changes.mapPos(r.from, 1),
          to: tr.changes.mapPos(r.to, -1),
          kind: r.kind,
        }))
        .filter((r) => r.from < r.to);
    }
    return ranges;
  },
});

export const diffDecorationsField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    const ranges = tr.state.field(diffRangesField);
    const hadEffect = tr.effects.some(
      (e) => e.is(setPendingDiff) || e.is(clearPendingDiff),
    );
    if (!tr.docChanged && !hadEffect) return deco;
    return buildDecorations(ranges);
  },
  provide: (field) => EditorView.decorations.from(field),
});

const diffTheme = EditorView.baseTheme({
  '.cm-diff-del': {
    textDecoration: 'line-through',
    opacity: '0.6',
  },
  '.cm-diff-add': {
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  '&light .cm-diff-del': { color: '#b91c1c', backgroundColor: 'rgba(239,68,68,0.12)' },
  '&light .cm-diff-add': { color: '#15803d', backgroundColor: 'rgba(34,197,94,0.14)' },
  '&dark .cm-diff-del': { color: '#fca5a5', backgroundColor: 'rgba(239,68,68,0.16)' },
  '&dark .cm-diff-add': { color: '#86efac', backgroundColor: 'rgba(34,197,94,0.18)' },
});

export const diffReviewExtensions: Extension[] = [
  diffRangesField,
  diffDecorationsField,
  diffTheme,
];

// Applies (kind === 'accepted' ? keep adds, drop dels : keep dels, drop adds)
// as a single batched transaction so the ranges — computed against the
// pre-transaction document — all remain valid deletion targets at once.
export const resolveDiff = (
  view: EditorView,
  resolution: 'accept' | 'reject',
): void => {
  const ranges = view.state.field(diffRangesField, false) ?? [];
  const toDelete = ranges.filter((r) =>
    resolution === 'accept' ? r.kind === 'del' : r.kind === 'add',
  );

  view.dispatch({
    changes: toDelete.map((r) => ({ from: r.from, to: r.to, insert: '' })),
    effects: clearPendingDiff.of(null),
  });
};
