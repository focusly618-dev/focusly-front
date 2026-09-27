import { Decoration, WidgetType } from '@codemirror/view';
import { overlaps, type Handler } from './utils';

class BulletWidget extends WidgetType {
  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-live-bullet';
    span.textContent = '•';
    span.setAttribute('aria-hidden', 'true');
    return span;
  }
}

// Handles list markers (*, -, + in bullet lists)
// When the cursor is on the line, reveals the raw marker for editing.
// When the cursor is elsewhere, replaces the marker with a clean bullet point (•).
export const handleListMark: Handler = (node, view, sel, push) => {
  const line = view.state.doc.lineAt(node.from);
  const revealed = overlaps(sel, line.from, line.to);

  // Check if parent ListItem contains a Task or TaskMarker (e.g. - [ ] or * [ ])
  const parent = node.node.parent;
  let isTask = false;
  if (parent) {
    for (let c = parent.firstChild; c; c = c.nextSibling) {
      if (c.type.name === 'Task' || c.type.name === 'TaskMarker') {
        isTask = true;
        break;
      }
    }
  }

  // If this is a Task list item, hide the '-' or '*' marker when not editing
  // so only the interactive checkbox widget appears
  if (isTask) {
    if (!revealed) {
      const hideEnd = Math.min(node.to + 1, line.to);
      push(node.from, hideEnd, Decoration.replace({}));
    }
    return;
  }

  // Only apply bullet point to BulletList items (not OrderedList)
  const grandParent = parent?.parent;
  if (grandParent?.type.name !== 'BulletList') return;

  // When cursor is on this line, reveal the raw marker (*, -, +) so the user can edit
  if (revealed) return;

  // Otherwise, replace the marker with a clean bullet point (•)
  push(node.from, node.to, Decoration.replace({ widget: new BulletWidget() }));
};
