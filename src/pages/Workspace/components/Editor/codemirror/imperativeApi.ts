import type { EditorView } from '@codemirror/view';
import type { MarkdownEditorRef } from './MarkdownEditor.types';
import { buildDiff, resolveDiff, setPendingDiff } from './extensions/diffReview';

// All BlockNote call sites (AI text-actions menu, the Lumina chat
// insert-content event) used to reach into `editor.document`/`insertBlocks`
// directly. This is the one seam the rest of the app talks to instead, so
// swapping the editor implementation again later only means rewriting this
// file, not every call site.
export const createImperativeApi = (
  getView: () => EditorView | null,
): MarkdownEditorRef => ({
  getSelection: () => {
    const view = getView();
    if (!view) return { text: '', from: 0, to: 0 };
    const { from, to } = view.state.selection.main;
    return { text: view.state.sliceDoc(from, to), from, to };
  },
  replaceRange: (from, to, text) => {
    const view = getView();
    if (!view) return;
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
      scrollIntoView: true,
    });
    view.focus();
  },
  insertAtCursor: (text) => {
    const view = getView();
    if (!view) return;
    const { from, to } = view.state.selection.main;
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
      scrollIntoView: true,
    });
    view.focus();
  },
  insertAtEnd: (text) => {
    const view = getView();
    if (!view) return;
    const end = view.state.doc.length;
    const needsSeparator =
      end > 0 && view.state.sliceDoc(end - 1, end) !== '\n';
    const insert = (needsSeparator ? '\n\n' : '') + text;
    view.dispatch({
      changes: { from: end, insert },
      selection: { anchor: end + insert.length },
      scrollIntoView: true,
    });
  },
  setCursor: (pos) => {
    const view = getView();
    if (!view) return;
    const clamped = Math.max(0, Math.min(pos, view.state.doc.length));
    view.dispatch({
      selection: { anchor: clamped },
      scrollIntoView: true,
    });
    view.focus();
  },
  getValue: () => getView()?.state.doc.toString() ?? '',
  focus: () => getView()?.focus(),
  showDiff: (proposedText) => {
    const view = getView();
    if (!view) return;
    const originalText = view.state.doc.toString();
    const { combinedText, ranges } = buildDiff(originalText, proposedText);
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: combinedText },
      effects: setPendingDiff.of(ranges),
    });
  },
  resolveDiff: (resolution) => {
    const view = getView();
    if (!view) return;
    resolveDiff(view, resolution);
  },
});
