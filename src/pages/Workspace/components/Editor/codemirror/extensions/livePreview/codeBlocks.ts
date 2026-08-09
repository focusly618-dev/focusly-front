import { Decoration } from '@codemirror/view';
import type { Handler } from './utils';

// Fenced ``` code blocks — card framing only. Token colors come from the
// embedded language grammar (see markdownLanguage.ts / theme/highlightStyle.ts),
// not from decorations here. The two fence lines stay visible (dimmed);
// Obsidian never hides them.
export const handleFencedCode: Handler = (node, view, _sel, push) => {
  const { doc } = view.state;
  const startLine = doc.lineAt(node.from).number;
  const endLine = doc.lineAt(node.to).number;

  for (let ln = startLine; ln <= endLine; ln++) {
    const line = doc.line(ln);
    let cls: string;
    if (ln === startLine || ln === endLine) {
      cls = 'cm-code-fence-line';
    } else if (ln === startLine + 1) {
      cls = 'cm-code-block-line cm-code-block-line-first';
    } else if (ln === endLine - 1) {
      cls = 'cm-code-block-line cm-code-block-line-last';
    } else {
      cls = 'cm-code-block-line';
    }
    push(line.from, line.from, Decoration.line({ attributes: { class: cls } }));
  }
};
