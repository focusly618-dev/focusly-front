import { type EditorState, StateEffect, StateField } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';

// Blocks with a view/code toggle: drawn by default, edited as code on demand.
export const HTML_APP_FENCE = 'html-app';
export const CODE_MODE_FENCES = new Set(['mermaid', HTML_APP_FENCE]);

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

// Explicit view/code mode for ```mermaid blocks, keyed by the FencedCode
// block's start position (`node.from`).
// - Not in set (default): Preview mode (eye icon active — rendered diagram).
// - In set: Code mode (`</>` icon active — editable Markdown code, without
//   a duplicate diagram rendered underneath).
export const setDiagramCodeMode = StateEffect.define<{
  pos: number;
  codeMode: boolean;
}>();

export const diagramCodeModeField = StateField.define<Set<number>>({
  create() {
    return new Set();
  },
  update(value, tr) {
    let set = value;

    if (tr.docChanged && value.size > 0) {
      const mapped = new Set<number>();
      value.forEach((pos) => {
        const nextPos = tr.changes.mapPos(pos, 1);
        let snapped = nextPos;
        syntaxTree(tr.state).iterate({
          from: Math.max(0, nextPos - 1),
          to: Math.min(tr.state.doc.length, nextPos + 1),
          enter(node) {
            if (node.name === 'FencedCode') {
              snapped = node.from;
              return false;
            }
          },
        });
        mapped.add(snapped);
      });
      set = mapped;
    }

    // When a new ```mermaid block is inserted (e.g. from the `/` menu) or its
    // inner code is edited while the cursor is inside it, keep/put it in code mode.
    if (tr.docChanged && tr.state.selection.main.empty) {
      const head = tr.state.selection.main.head;
      syntaxTree(tr.state).iterate({
        from: head,
        to: head,
        enter(node) {
          if (node.name !== 'FencedCode') return;
          const startLine = tr.state.doc.lineAt(node.from);
          const endLine = tr.state.doc.lineAt(node.to);
          if (endLine.number - startLine.number < 2) return false;
          const lang = startLine.text
            .replace(/^`{3,}\s*/, '')
            .trim()
            .split(/\s+/)[0]
            ?.toLowerCase();
          if (
            CODE_MODE_FENCES.has(lang) &&
            head > startLine.to &&
            head < endLine.from
          ) {
            let touched = false;
            tr.changes.iterChangedRanges((_fA, _tA, fromB, toB) => {
              if (fromB <= node.to && toB >= node.from) touched = true;
            });
            if (touched) {
              if (set === value) set = new Set(value);
              set.add(node.from);
            }
          }
          return false;
        },
      });
    }

    for (const effect of tr.effects) {
      if (effect.is(setDiagramCodeMode)) {
        if (set === value) set = new Set(value);
        if (effect.value.codeMode) {
          set.add(effect.value.pos);
        } else {
          set.delete(effect.value.pos);
        }
      }
    }

    return set;
  },
});

export const isDiagramInCodeMode = (
  state: EditorState,
  nodeFrom: number,
): boolean => state.field(diagramCodeModeField, false)?.has(nodeFrom) ?? false;
