import type { EditorState } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import type { SyntaxNode } from '@lezer/common';
import { overlaps, type BlockHandler, type Handler } from './utils';
import { MermaidWidget } from './mermaidWidget';

const extractFenceInfo = (
  node: SyntaxNode,
  state: EditorState,
): { info: string; code: string } => {
  let info = '';
  let code = '';
  const cursor = node.cursor();
  for (let ok = cursor.firstChild(); ok; ok = cursor.nextSibling()) {
    if (cursor.type.name === 'CodeInfo') {
      info = state.sliceDoc(cursor.from, cursor.to).trim();
    } else if (cursor.type.name === 'CodeText') {
      code = state.sliceDoc(cursor.from, cursor.to);
    }
  }
  return { info, code };
};

// Fenced ``` code blocks — card framing only. Token colors come from the
// embedded language grammar (see markdownLanguage.ts / theme/highlightStyle.ts),
// not from decorations here. The two fence lines stay visible (dimmed);
// Obsidian never hides them. A ```mermaid fence also gets this framing
// underneath — see handleMermaidBlock below for the diagram widget that
// covers it when the cursor is elsewhere.
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

// Renders a ```mermaid fence as an actual diagram. A BlockHandler (state-based,
// full-document walk) since it needs `block: true` — see blockDecorations.ts.
// The framing lines from handleFencedCode above still get computed for this
// same range, but stay inert underneath the widget until the cursor enters it.
export const handleMermaidBlock: BlockHandler = (node, state, sel, push) => {
  if (overlaps(sel, node.from, node.to)) return;

  const { info, code } = extractFenceInfo(node.node, state);
  if (info.toLowerCase() !== 'mermaid') return;

  const startLine = state.doc.lineAt(node.from);
  const endLine = state.doc.lineAt(node.to);
  push(
    startLine.from,
    endLine.to,
    Decoration.replace({ widget: new MermaidWidget(code), block: true }),
  );
};
