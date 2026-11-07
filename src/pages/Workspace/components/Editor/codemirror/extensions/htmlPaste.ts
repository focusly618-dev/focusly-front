import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { syntaxTree } from '@codemirror/language';
import { EditorView } from '@codemirror/view';

/**
 * Pasting from Google Docs, Word, Notion or a web page keeps the formatting:
 * the clipboard's HTML becomes Markdown (headings, bold, lists, links,
 * tables, checklists), which the live preview shows as it was. Plain text,
 * code editors (their HTML is just styled spans) and pastes inside code
 * blocks stay plain text.
 */

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  strongDelimiter: '**',
});
turndown.use(gfm);
turndown.remove(['style', 'script', 'meta', 'title', 'head']);

// Google Docs wraps the whole copy in <b style="font-weight:normal"
// id="docs-internal-guid-…">: not bold at all.
turndown.addRule('googleDocsWrapper', {
  filter: (node) =>
    node.nodeName === 'B' &&
    (node as HTMLElement).id?.startsWith('docs-internal-guid'),
  replacement: (content) => content,
});

// Google Docs marks bold and italic with inline styles on spans
turndown.addRule('styledSpan', {
  filter: (node) => {
    if (node.nodeName !== 'SPAN') return false;
    const style = (node as HTMLElement).getAttribute('style') ?? '';
    return /font-weight:\s*(bold|[6-9]00)|font-style:\s*italic/i.test(style);
  },
  replacement: (content, node) => {
    if (!content.trim()) return content;
    const style = (node as HTMLElement).getAttribute('style') ?? '';
    const bold = /font-weight:\s*(bold|[6-9]00)/i.test(style);
    const italic = /font-style:\s*italic/i.test(style);
    const lead = content.match(/^\s*/)?.[0] ?? '';
    const trail = content.match(/\s*$/)?.[0] ?? '';
    let inner = content.trim();
    if (italic) inner = `*${inner}*`;
    if (bold) inner = `**${inner}**`;
    return `${lead}${inner}${trail}`;
  },
});

// Tags that mean the HTML carries real formatting, worth keeping
const RICH_HTML =
  /<(h[1-6]|b|strong|i|em|u|s|del|strike|ul|ol|li|table|blockquote|pre|a\s|img\s)\b|font-weight:\s*(bold|[6-9]00)|font-style:\s*italic/i;

/** Markdown for pasted HTML, or null when it should paste as plain text. */
export const htmlToMarkdown = (html: string): string | null => {
  if (!html || !RICH_HTML.test(html)) return null;
  const markdown = turndown
    .turndown(html)
    // Word and Docs leave non-breaking spaces and runs of blank lines
    .replace(/\u00a0/g, ' ')
    // turndown pads list markers ("-   item"): one space, as typed
    .replace(/^(\s*)([-*+]|\d+\.)[ ]{2,}/gm, '$1$2 ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return markdown || null;
};

const IN_CODE = /^(FencedCode|CodeBlock|CodeText|InlineCode)$/;

export const htmlPasteExtension = EditorView.domEventHandlers({
  paste(event, view) {
    const data = event.clipboardData;
    if (!data || data.files.length > 0) return false;
    const html = data.getData('text/html');
    if (!html) return false;

    const { from, to } = view.state.selection.main;
    for (
      let node: ReturnType<typeof syntaxTree>['topNode'] | null = syntaxTree(
        view.state,
      ).resolveInner(from, -1);
      node;
      node = node.parent
    ) {
      if (IN_CODE.test(node.name)) return false;
    }

    const markdown = htmlToMarkdown(html);
    if (!markdown) return false;

    event.preventDefault();
    view.dispatch({
      changes: { from, to, insert: markdown },
      selection: { anchor: from + markdown.length },
      scrollIntoView: true,
      userEvent: 'input.paste',
    });
    return true;
  },
});
