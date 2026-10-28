import type { Text } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { MarkdownEditorRef } from './MarkdownEditor.types';
import {
  buildDiff,
  resolveDiff,
  setPendingDiff,
} from './extensions/diffReview';
import { setTargetHighlight } from './extensions/targetHighlight';
import {
  normalizeInsertedMarkdown,
  prepareMarkdownInsert,
} from './markdownInsert';

/** The paragraph (run of non-blank lines) holding `pos`; null on a blank line. */
export const paragraphAt = (
  doc: Text,
  pos: number,
): { from: number; to: number } | null => {
  const isBlank = (n: number) => doc.line(n).text.trim() === '';
  let first = doc.lineAt(pos).number;
  if (isBlank(first)) return null;
  let last = first;
  while (first > 1 && !isBlank(first - 1)) first--;
  while (last < doc.lines && !isBlank(last + 1)) last++;
  return { from: doc.line(first).from, to: doc.line(last).to };
};

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
  selectParagraphAt: (x, y) => {
    const view = getView();
    if (!view) return null;
    const pos = view.posAtCoords({ x, y });
    if (pos === null) return null;
    // posAtCoords snaps to the nearest line: a click in the empty space below
    // the text would otherwise pick the last paragraph.
    const block = view.lineBlockAt(pos);
    const top = view.documentTop + block.top;
    if (y < top || y > top + block.height) return null;
    const range = paragraphAt(view.state.doc, pos);
    if (!range) return null;
    view.dispatch({ selection: { anchor: range.from, head: range.to } });
    return {
      text: view.state.doc.sliceString(range.from, range.to),
      ...range,
    };
  },
  replaceRange: (from, to, text) => {
    const view = getView();
    if (!view) return;
    const insert = prepareMarkdownInsert(
      view.state.doc.toString(),
      from,
      to,
      text,
    );
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.trimEnd().length },
      scrollIntoView: true,
    });
    view.focus();
  },
  applyChanges: (changes) => {
    const view = getView();
    if (!view || changes.length === 0) return;
    view.dispatch({ changes });
  },
  coordsAtPos: (pos, side = 1) => {
    const view = getView();
    if (!view) return null;
    const rect = view.coordsAtPos(pos, side);
    return rect
      ? {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        }
      : null;
  },
  insertAtCursor: (text) => {
    const view = getView();
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const insert = prepareMarkdownInsert(
      view.state.doc.toString(),
      from,
      to,
      text,
    );
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.trimEnd().length },
      scrollIntoView: true,
    });
    view.focus();
  },
  insertAtEnd: (text) => {
    const view = getView();
    if (!view) return;
    const end = view.state.doc.length;
    const body = normalizeInsertedMarkdown(text);
    const needsSeparator =
      end > 0 && view.state.sliceDoc(end - 1, end) !== '\n';
    const insert = (needsSeparator ? '\n\n' : '') + body;
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

    // 4. Bring the heading to the middle of the screen and tint it briefly.
    // The selection is left alone: selecting the line would reveal its "##"
    // and move the caret away from where the user was writing.
    const line = view.state.doc.lineAt(targetFrom);
    view.dispatch({
      effects: [
        EditorView.scrollIntoView(line.from, { y: 'center' }),
        setTargetHighlight.of({ from: line.from, to: line.to }),
      ],
    });

    // The tint has faded by then; drop its decoration
    setTimeout(() => {
      view.dispatch({ effects: [setTargetHighlight.of(null)] });
    }, 1800);

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
