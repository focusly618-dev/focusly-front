import { EditorSelection, type ChangeSpec } from '@codemirror/state';
import { keymap, type EditorView } from '@codemirror/view';

/**
 * Formatting without knowing Markdown: the commands behind the format
 * toolbar and the usual shortcuts (Cmd/Ctrl+B, I...). They write the
 * Markdown; the live preview hides it.
 */

export type InlineFormat = 'bold' | 'italic' | 'strike' | 'code';
export type BlockFormat = 'h1' | 'h2' | 'h3' | 'bullet' | 'todo' | 'quote';
export type TextFormat = InlineFormat | BlockFormat | 'link';

const INLINE_MARKERS: Record<InlineFormat, string> = {
  bold: '**',
  italic: '*',
  strike: '~~',
  code: '`',
};

const BLOCK_PREFIXES: Record<BlockFormat, string> = {
  h1: '# ',
  h2: '## ',
  h3: '### ',
  bullet: '- ',
  todo: '- [ ] ',
  quote: '> ',
};

// Any block prefix a line can start with: replaced, never stacked
const ANY_BLOCK_PREFIX = /^(#{1,6} |- \[[ xX]\] |[-*+] |\d+[.)] |> )/;

/** Wraps the selection in `marker`, or unwraps it when it's already
 * wrapped (inside or right around it). An empty selection gets an empty
 * pair with the cursor in the middle. */
export const toggleInline = (view: EditorView, format: InlineFormat) => {
  const marker = INLINE_MARKERS[format];
  const size = marker.length;
  const { state } = view;
  view.dispatch(
    state.changeByRange((range) => {
      const text = state.sliceDoc(range.from, range.to);
      const before = state.sliceDoc(range.from - size, range.from);
      const after = state.sliceDoc(range.to, range.to + size);

      // Inside: "**word**" selected
      if (
        text.length >= size * 2 &&
        text.startsWith(marker) &&
        text.endsWith(marker) &&
        // "*" mustn't unwrap a bold "**word**"
        !(
          format === 'italic' &&
          text.startsWith('**') &&
          !text.startsWith('***')
        )
      ) {
        const inner = text.slice(size, text.length - size);
        return {
          changes: { from: range.from, to: range.to, insert: inner },
          range: EditorSelection.range(range.from, range.from + inner.length),
        };
      }
      // Around: "word" selected inside "**word**"
      if (
        before === marker &&
        after === marker &&
        !(
          format === 'italic' &&
          state.sliceDoc(range.from - 2, range.from) === '**' &&
          state.sliceDoc(range.from - 3, range.from) !== '***'
        )
      ) {
        return {
          changes: [
            { from: range.from - size, to: range.from, insert: '' },
            { from: range.to, to: range.to + size, insert: '' },
          ],
          range: EditorSelection.range(range.from - size, range.to - size),
        };
      }
      return {
        changes: [
          { from: range.from, insert: marker },
          { from: range.to, insert: marker },
        ],
        range: EditorSelection.range(range.from + size, range.to + size),
      };
    }),
    { scrollIntoView: true, userEvent: 'input.format' },
  );
  view.focus();
  return true;
};

/** Gives every selected line the block format, or takes it away when they
 * all have it already. Other block prefixes are replaced, not stacked. */
export const toggleBlock = (view: EditorView, format: BlockFormat) => {
  const prefix = BLOCK_PREFIXES[format];
  const { state } = view;
  const lines = new Map<number, string>();
  for (const range of state.selection.ranges) {
    const first = state.doc.lineAt(range.from).number;
    const last = state.doc.lineAt(range.to).number;
    for (let n = first; n <= last; n += 1) {
      const line = state.doc.line(n);
      lines.set(line.from, line.text);
    }
  }
  const all = [...lines.values()];
  // The exact prefix: a to-do line ("- [ ] ") also starts with a bullet's
  const prefixOf = (text: string) => ANY_BLOCK_PREFIX.exec(text)?.[0] ?? '';
  const allHave = all.every((text) => prefixOf(text) === prefix);
  const changes: ChangeSpec[] = [];
  for (const [from, text] of lines) {
    const existing = ANY_BLOCK_PREFIX.exec(text)?.[0] ?? '';
    // A bullet prefix also starts every to-do line: only exact matches count
    const has = existing === prefix;
    if (allHave || has) {
      if (allHave)
        changes.push({ from, to: from + existing.length, insert: '' });
      continue;
    }
    changes.push({ from, to: from + existing.length, insert: prefix });
  }
  view.dispatch({
    changes,
    scrollIntoView: true,
    userEvent: 'input.format',
  });
  view.focus();
  return true;
};

/** Turns the selection into a link and selects the address to type over:
 * [text](https://). With nothing selected, a placeholder text. */
export const insertLink = (view: EditorView, placeholderText = 'link') => {
  const { state } = view;
  const range = state.selection.main;
  const text = state.sliceDoc(range.from, range.to) || placeholderText;
  const url = 'https://';
  const insert = `[${text}](${url})`;
  const urlFrom = range.from + text.length + 3;
  view.dispatch({
    changes: { from: range.from, to: range.to, insert },
    selection: EditorSelection.range(urlFrom, urlFrom + url.length),
    scrollIntoView: true,
    userEvent: 'input.format',
  });
  view.focus();
  return true;
};

export const applyFormat = (
  view: EditorView,
  format: TextFormat,
  linkPlaceholder?: string,
) => {
  if (format === 'link') return insertLink(view, linkPlaceholder);
  if (format in INLINE_MARKERS)
    return toggleInline(view, format as InlineFormat);
  return toggleBlock(view, format as BlockFormat);
};

/** Cmd on Mac, Ctrl elsewhere. Cmd+K (search) and Cmd+J (Lumina) belong
 * to the app, so links have no shortcut here: the toolbar has them. */
export const formattingKeymap = keymap.of([
  { key: 'Mod-b', run: (view) => toggleInline(view, 'bold') },
  { key: 'Mod-i', run: (view) => toggleInline(view, 'italic') },
  { key: 'Mod-Shift-s', run: (view) => toggleInline(view, 'strike') },
  { key: 'Mod-e', run: (view) => toggleInline(view, 'code') },
  { key: 'Mod-Alt-1', run: (view) => toggleBlock(view, 'h1') },
  { key: 'Mod-Alt-2', run: (view) => toggleBlock(view, 'h2') },
  { key: 'Mod-Alt-3', run: (view) => toggleBlock(view, 'h3') },
  { key: 'Mod-Shift-8', run: (view) => toggleBlock(view, 'bullet') },
  { key: 'Mod-Shift-9', run: (view) => toggleBlock(view, 'todo') },
]);
