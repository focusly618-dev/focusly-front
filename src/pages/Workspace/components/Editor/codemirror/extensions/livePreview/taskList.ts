import { Decoration, WidgetType, type EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { Handler } from './utils';

// - [ ] / - [x] — rendered as a real, clickable checkbox at all times (not
// reveal-on-cursor: Obsidian keeps these as checkboxes even while the
// cursor is on that line, since a raw "[ ]" isn't something you'd want to
// hand-edit character by character).
class TaskCheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) {
    super();
  }

  eq(other: TaskCheckboxWidget) {
    return other.checked === this.checked;
  }

  toDOM() {
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = this.checked;
    box.className = 'cm-live-task-checkbox';
    return box;
  }

  // Only intercept mousedown ourselves (to toggle); let everything else
  // (e.g. a click just past the box) fall through to normal cursor placement.
  ignoreEvent(event: Event) {
    return event.type !== 'mousedown';
  }
}

export const handleTaskMarker: Handler = (node, view, _sel, push) => {
  const text = view.state.sliceDoc(node.from, node.to);
  const checked = /\[[xX]\]/.test(text);
  push(
    node.from,
    node.to,
    Decoration.replace({ widget: new TaskCheckboxWidget(checked) }),
  );
};

function findTaskMarkerRange(
  view: EditorView,
  pos: number,
): { from: number; to: number } | null {
  let result: { from: number; to: number } | null = null;
  syntaxTree(view.state).iterate({
    from: Math.max(0, pos - 4),
    to: Math.min(view.state.doc.length, pos + 4),
    enter(n) {
      if (n.type.name === 'TaskMarker') result = { from: n.from, to: n.to };
    },
  });
  return result;
}

export const handleTaskCheckboxMousedown = (
  event: MouseEvent,
  view: EditorView,
): boolean => {
  const target = event.target as HTMLElement;
  if (!target.classList?.contains('cm-live-task-checkbox')) return false;

  const pos = view.posAtDOM(target);
  const markerRange = findTaskMarkerRange(view, pos);
  if (!markerRange) return false;

  const current = view.state.sliceDoc(markerRange.from, markerRange.to);
  const next = /\[[xX]\]/.test(current) ? '[ ]' : '[x]';
  view.dispatch({
    changes: { from: markerRange.from, to: markerRange.to, insert: next },
  });
  event.preventDefault();
  return true;
};
