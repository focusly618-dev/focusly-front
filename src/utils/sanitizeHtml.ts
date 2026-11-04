import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML that came from outside the app before it's rendered with
 * dangerouslySetInnerHTML: task descriptions (typed by the user, or the
 * description of a Google Calendar event, which anyone who invites the user
 * can write). Keeps formatting (paragraphs, lists, emphasis, links, tables)
 * and drops everything that runs code: scripts, event handlers, iframes,
 * javascript: links.
 *
 * Its own DOMPurify instance: the hooks below must not change how other
 * libraries (mermaid, the editor) sanitize with the shared one.
 */
const purify = DOMPurify(window);

const ALLOWED_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'del',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'li',
  'mark',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
];
const ALLOWED_ATTR = [
  'href',
  'target',
  'rel',
  'class',
  'colspan',
  'rowspan',
  'style',
];

// Links: web, email and phone, or within Focusly. Nothing else (javascript:,
// data:, vbscript:...) keeps its href.
const SAFE_HREF = /^(?:https?:|mailto:|tel:|\/(?!\/)|#)/i;

// formatDescriptionToHtml's paragraph spacer is the only inline style kept:
// arbitrary CSS could still lay fake UI over the app.
const ALLOWED_STYLES = new Set(['height: 6px;']);

purify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName === 'style' && !ALLOWED_STYLES.has(data.attrValue.trim())) {
    data.keepAttr = false;
  }
});

purify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName !== 'A') return;
  const href = node.getAttribute('href')?.trim();
  if (!href || !SAFE_HREF.test(href)) {
    node.removeAttribute('href');
    return;
  }
  // Outside links open in a new tab, without access to this one
  if (/^https?:/i.test(href)) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const sanitizeHtml = (html: string): string =>
  purify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });

/**
 * A URL safe to put in an href attribute of HTML built by hand: web, email,
 * phone or an in-app path, with quotes escaped. Anything else gives null.
 */
export const safeHref = (url: string): string | null => {
  const trimmed = url.trim();
  if (!SAFE_HREF.test(trimmed)) return null;
  return trimmed
    .replace(/&(?!amp;|lt;|gt;|quot;|#39;)/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
