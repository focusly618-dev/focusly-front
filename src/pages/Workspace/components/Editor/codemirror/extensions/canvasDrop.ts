import { EditorView, dropCursor } from '@codemirror/view';
import { CANVAS_DRAG_TYPE } from '../../components/EditorContent/canvasLinks.utils';
import { ownLineInsert } from '../markdownInsert';

// A canvas dragged in from the header's list lands as its card, on a line of
// its own where it's dropped, instead of as text in the middle of a line.
export const canvasDropExtension = [
  dropCursor(),
  EditorView.domEventHandlers({
    dragover(event) {
      if (!event.dataTransfer?.types.includes(CANVAS_DRAG_TYPE)) return false;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      return false;
    },
    drop(event, view) {
      const link = event.dataTransfer?.getData(CANVAS_DRAG_TYPE);
      if (!link) return false;
      event.preventDefault();
      const pos =
        view.posAtCoords({ x: event.clientX, y: event.clientY }) ??
        view.state.doc.length;
      const change = ownLineInsert(view.state.doc.toString(), pos, link);
      view.dispatch({
        changes: change,
        selection: { anchor: change.from + change.insert.length },
        scrollIntoView: true,
        userEvent: 'input.drop',
      });
      view.focus();
      return true;
    },
  }),
];
