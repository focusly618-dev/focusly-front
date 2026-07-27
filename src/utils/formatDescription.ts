/**
 * Utility to parse and format task descriptions (supporting Markdown & HTML tags)
 * into rich HTML for rendering formatted titles, headings, bold, highlights, lists, etc.
 */

export const formatDescriptionToHtml = (raw?: string): string => {
  if (!raw) return '';

  // 1. Clean metadata tags
  const text = raw
    .replace(/\[COLOR:(.*?)\]/g, '')
    .replace(/\[START_DATE:(.*?)\]/g, '')
    .replace(
      /https?:\/\/(www\.)?(calendar\.google\.com|google\.com\/calendar|meet\.google\.com)[^\s]*/g,
      '',
    )
    .trim();

  if (!text) return '';

  // If text already contains explicit HTML structural tags, return with mark highlight styling
  if (
    /<(h[1-6]|p|div|ul|ol|li|mark|strong|em|blockquote|pre|code)[^>]*>/i.test(
      text,
    )
  ) {
    return text.replace(
      /==([^=]+)==/g,
      '<mark class="formatted-highlight">$1</mark>',
    );
  }

  // 2. Process Markdown syntax line by line
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;
  let isNumberedList = false;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  const processInline = (str: string): string => {
    return (
      str
        // Highlights: ==text== or <mark>text</mark>
        .replace(/==([^=]+)==/g, '<mark class="formatted-highlight">$1</mark>')
        .replace(
          /<mark>(.*?)<\/mark>/gi,
          '<mark class="formatted-highlight">$1</mark>',
        )
        // Bold: **text** or __text__
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_]+)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        // Inline code: `text`
        .replace(/`([^`]+)`/g, '<code class="formatted-code">$1</code>')
        // Links: [label](url)
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="formatted-link">$1</a>',
        )
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code blocks ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        result.push(
          `<pre class="formatted-pre"><code>${codeBuffer.join('\n')}</code></pre>`,
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        if (inList) {
          result.push(isNumberedList ? '</ol>' : '</ul>');
          inList = false;
        }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      if (inList) {
        result.push(isNumberedList ? '</ol>' : '</ul>');
        inList = false;
      }
      result.push(
        `<h1 class="formatted-h1">${processInline(trimmed.slice(2))}</h1>`,
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      if (inList) {
        result.push(isNumberedList ? '</ol>' : '</ul>');
        inList = false;
      }
      result.push(
        `<h2 class="formatted-h2">${processInline(trimmed.slice(3))}</h2>`,
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      if (inList) {
        result.push(isNumberedList ? '</ol>' : '</ul>');
        inList = false;
      }
      result.push(
        `<h3 class="formatted-h3">${processInline(trimmed.slice(4))}</h3>`,
      );
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith('> ')) {
      if (inList) {
        result.push(isNumberedList ? '</ol>' : '</ul>');
        inList = false;
      }
      result.push(
        `<blockquote class="formatted-quote">${processInline(trimmed.slice(2))}</blockquote>`,
      );
      continue;
    }

    // Unordered list (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || isNumberedList) {
        if (inList) result.push(isNumberedList ? '</ol>' : '</ul>');
        result.push('<ul class="formatted-ul">');
        inList = true;
        isNumberedList = false;
      }
      result.push(`<li>${processInline(trimmed.slice(2))}</li>`);
      continue;
    }

    // Numbered list (1. 2.)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!inList || !isNumberedList) {
        if (inList) result.push(isNumberedList ? '</ol>' : '</ul>');
        result.push('<ol class="formatted-ol">');
        inList = true;
        isNumberedList = true;
      }
      result.push(`<li>${processInline(numMatch[2])}</li>`);
      continue;
    }

    // Close list if empty line
    if (inList && trimmed === '') {
      result.push(isNumberedList ? '</ol>' : '</ul>');
      inList = false;
    }

    if (trimmed !== '') {
      result.push(`<p class="formatted-p">${processInline(trimmed)}</p>`);
    } else {
      result.push('<div style="height: 6px;"></div>');
    }
  }

  if (inList) {
    result.push(isNumberedList ? '</ol>' : '</ul>');
  }

  if (inCodeBlock && codeBuffer.length > 0) {
    result.push(
      `<pre class="formatted-pre"><code>${codeBuffer.join('\n')}</code></pre>`,
    );
  }

  return result.join('');
};
