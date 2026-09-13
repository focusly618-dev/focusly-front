import { StateEffect, StateField } from '@codemirror/state';
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view';

export interface TargetHighlightRange {
  from: number;
  to: number;
}

export const setTargetHighlight =
  StateEffect.define<TargetHighlightRange | null>();

const lineHighlightDeco = Decoration.line({
  attributes: { class: 'cm-target-line-glow' },
});

const markHighlightDeco = Decoration.mark({
  class: 'cm-target-text-glow',
});

export const targetHighlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(setTargetHighlight)) {
        if (!effect.value) {
          return Decoration.none;
        }
        const { from, to } = effect.value;
        const decos = [];
        try {
          const docLen = tr.state.doc.length;
          const safeFrom = Math.max(0, Math.min(from, docLen));
          const safeTo = Math.max(safeFrom, Math.min(to, docLen));

          const startLine = tr.state.doc.lineAt(safeFrom);
          const endLine = tr.state.doc.lineAt(safeTo);

          for (let l = startLine.number; l <= endLine.number; l++) {
            const line = tr.state.doc.line(l);
            decos.push(lineHighlightDeco.range(line.from));
          }

          if (safeFrom < safeTo) {
            decos.push(markHighlightDeco.range(safeFrom, safeTo));
          }

          return Decoration.set(decos, true);
        } catch {
          return Decoration.none;
        }
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const targetHighlightExtension = [targetHighlightField];
