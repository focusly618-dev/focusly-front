import { StateEffect, StateField } from '@codemirror/state';

// Callout fold state, keyed by the blockquote's start position. A real
// StateField (not a plugin instance property) because it must be readable
// from blockDecorations.ts's StateField, which has no view/plugin access —
// but it's still not part of the document or undo history, since only
// `doc`/`selection` changes are tracked by @codemirror/commands' history().
export const setCalloutFold = StateEffect.define<{
  pos: number;
  folded: boolean;
}>();

export const calloutFoldField = StateField.define<Map<number, boolean>>({
  create() {
    return new Map();
  },
  update(value, tr) {
    let map = value;
    // Keys are positions: follow them through edits above the block
    if (tr.docChanged && value.size > 0) {
      map = new Map();
      value.forEach((folded, pos) => map.set(tr.changes.mapPos(pos), folded));
    }
    for (const effect of tr.effects) {
      if (effect.is(setCalloutFold)) {
        if (map === value) map = new Map(value);
        map.set(effect.value.pos, effect.value.folded);
      }
    }
    return map;
  },
});
