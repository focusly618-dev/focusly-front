import type { EditorView } from '@codemirror/view';
import type { MarkdownEditorRef } from './MarkdownEditor.types';
import {
  buildDiff,
  resolveDiff,
  setPendingDiff,
} from './extensions/diffReview';
import { setTargetHighlight } from './extensions/targetHighlight';

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
  jumpToSection: ({ pos, text }: { pos?: number; text?: string }): boolean => {
    const view = getView();
    if (!view) return false;
    const doc = view.state.doc.toString();
    const docLength = doc.length;

    let targetFrom = -1;

    // Clean text: remove emojis, leading list numbers or bullet points
    const clean = text
      ? text
          .replace(
            /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
            '',
          )
          .replace(/^[#\s•\d.-]+/, '')
          .trim()
      : '';

    // 1. Search for matching heading or paragraph in the document
    if (clean && clean.length >= 2) {
      const lowerDoc = doc.toLowerCase();
      const lowerClean = clean.toLowerCase();

      // Look for markdown heading containing the text
      const regexSafe = lowerClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const headingMatch = new RegExp(`^#{1,6}\\s+.*${regexSafe}`, 'im').exec(
        lowerDoc,
      );
      if (headingMatch && headingMatch.index !== undefined) {
        const line = view.state.doc.lineAt(headingMatch.index);
        targetFrom = line.from;
      } else {
        // Fallback: look for any line containing the clean text
        const textIdx = lowerDoc.indexOf(lowerClean);
        if (textIdx !== -1) {
          const line = view.state.doc.lineAt(textIdx);
          targetFrom = line.from;
        }
      }
    }

    // 2. If not found by text, try character offset pos
    if (targetFrom === -1 && pos !== undefined && pos >= 0) {
      if (pos < docLength) {
        const line = view.state.doc.lineAt(pos);
        targetFrom = line.from;
      } else if (docLength > 0) {
        const line = view.state.doc.lineAt(docLength);
        targetFrom = line.from;
      }
    }

    // 3. If not found, do not mutate the user's document
    if (targetFrom === -1) {
      if (pos === 0) {
        targetFrom = 0;
      } else {
        return false;
      }
    }

    // 4. Scroll smoothly into view, set selection on the heading, and fire pulsing highlight
    const line = view.state.doc.lineAt(targetFrom);
    view.dispatch({
      selection: { anchor: line.from, head: line.to },
      scrollIntoView: true,
      effects: [setTargetHighlight.of({ from: line.from, to: line.to })],
    });
    view.focus();

    // Auto-clear highlight effect after 3.8s
    setTimeout(() => {
      view.dispatch({
        effects: [setTargetHighlight.of(null)],
      });
    }, 3800);

    return true;
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
