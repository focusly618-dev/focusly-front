// A small, non-Lezer inline-markdown-to-HTML pass for text that ends up
// inside a widget's innerHTML (table cells, callout titles) — those are
// plain DOM the live-preview decoration system never walks with the syntax
// tree, so they need their own (deliberately modest) renderer. Always
// escapes first: this text is user-authored note content going into
// innerHTML, not a place to trust raw HTML through.
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const renderInlineMarkdown = (raw: string): string => {
  let text = escapeHtml(raw.trim());
  text = text.replace(
    /`([^`]+?)`/g,
    '<code class="cm-live-inlinecode">$1</code>',
  );
  text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<span class="cm-live-link">$1</span>',
  );
  return text;
};
