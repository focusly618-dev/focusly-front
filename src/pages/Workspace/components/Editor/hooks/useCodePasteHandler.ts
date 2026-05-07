import { useEffect, useCallback } from 'react';

/**
 * Heuristics to detect if pasted text is likely code.
 * Uses multiple signals and a scoring system for accuracy.
 */
const CODE_PATTERNS = [
  // Language keywords
  /\b(function|const|let|var|class|import|export|return|if|else|for|while|switch|case|try|catch|throw|async|await|yield)\b/,
  // Common syntax
  /[{}[\]];?\s*$/m, // Lines ending with braces/brackets
  /=>\s*[{(]/, // Arrow functions
  /\b(def|fn|pub|impl|struct|enum|trait|mod)\b/, // Rust/Python
  /\b(public|private|protected|static|void|int|string|boolean)\b/i, // Java/C#/TS
  /^\s*(#include|#define|#import|#pragma)/m, // C/C++
  // Operators & patterns
  /[!=]==?/, // Equality operators
  /\|\||&&/, // Logical operators
  /console\.(log|error|warn)/, // Console methods
  /\.\w+\(/, // Method calls like .map(
  /\/\/.*$/m, // Single-line comments
  /\/\*[\s\S]*?\*\//, // Multi-line comments
  /^\s{2,}(return|if|for|while|const|let|var)/m, // Indented code keywords
  // Template literals, regex, common patterns
  /`\$\{.*\}`/, // Template literals
  /\bthis\./, // this. references
  /\bnew\s+\w+/, // new Constructor
  /=>\s*{/, // Arrow function body
  /^\s*@\w+/m, // Decorators
  // Shell/terminal
  /^\$\s+\w+/m, // Shell commands
  /\b(npm|yarn|pip|cargo|docker|git)\s+\w+/,
];

/**
 * Detect a likely programming language from the pasted content.
 */
function detectLanguage(text: string): string {
  if (/\b(import|export|const|let|=>|console\.)/i.test(text))
    return 'typescript';
  if (
    /\b(def |class |print\(|import )/i.test(text) &&
    !/\bfunction\b/.test(text)
  )
    return 'python';
  if (/\b(func |fmt\.|package |go\b)/i.test(text)) return 'go';
  if (/\b(fn |let mut |impl |pub )/i.test(text)) return 'rust';
  if (/\b(public static|System\.out|void main)/i.test(text)) return 'java';
  if (
    /<\/?[a-z][\s\S]*>/i.test(text) &&
    /className|onClick|useState/.test(text)
  )
    return 'tsx';
  if (/<\/?[a-z][\s\S]*>/i.test(text)) return 'html';
  if (/^\s*\{[\s\S]*\}\s*$/m.test(text) && /"[\w]+":\s/.test(text))
    return 'json';
  if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/im.test(text))
    return 'sql';
  if (/^\s*[\w-]+\s*:\s*[\w#"']/m.test(text) && !/[{};]/.test(text))
    return 'css';
  if (/^\$\s+|^#!\//m.test(text)) return 'bash';
  return 'javascript';
}

function isLikelyCode(text: string): boolean {
  // Very short text is unlikely to be code
  if (text.trim().length < 15) return false;

  // If it's a single line without any code signals, it's probably not code
  const lines = text.split('\n');
  if (lines.length === 1 && !/[{};()=]/.test(text)) return false;

  // JSON detection
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed);
      return true;
    } catch {
      // Not valid JSON, continue with other checks
    }
  }

  // Score-based detection
  let score = 0;
  for (const pattern of CODE_PATTERNS) {
    if (pattern.test(text)) score++;
  }

  // Check for consistent indentation (strong code signal)
  const indentedLines = lines.filter((l) => /^\s{2,}\S/.test(l));
  if (indentedLines.length > lines.length * 0.3) score += 2;

  // Check for semicolons at end of lines
  const semicolonLines = lines.filter((l) => /;\s*$/.test(l.trim()));
  if (semicolonLines.length > lines.length * 0.2) score += 2;

  // Threshold: 3+ signals = likely code
  return score >= 3;
}

/**
 * Hook that attaches a paste handler to the BlockNote editor.
 * When code is detected in pasted text, it inserts a code block instead of plain text.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCodePasteHandler(editor: any) {
  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (!editor) return;

      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      // If HTML is present, let BlockNote handle it (it may already be formatted)
      const htmlData = clipboardData.getData('text/html');
      if (htmlData && /<pre|<code/i.test(htmlData)) return;

      const text = clipboardData.getData('text/plain');
      if (!text || !isLikelyCode(text)) return;

      // Prevent default paste
      event.preventDefault();
      event.stopPropagation();

      const language = detectLanguage(text);

      try {
        // Get the current block (where cursor is)
        const currentBlock = editor.getTextCursorPosition()?.block;
        if (!currentBlock) return;

        // Insert a code block after the current block
        editor.insertBlocks(
          [
            {
              type: 'codeBlock' as const,
              props: { language },
              content: text,
            },
          ],
          currentBlock,
          'after',
        );
      } catch (err) {
        console.warn('[CodePasteHandler] Failed to insert code block:', err);
        // Fallback: let the default paste happen
      }
    },
    [editor],
  );

  useEffect(() => {
    if (!editor) return;

    // Find the editor DOM element
    const editorElement = document.querySelector('.bn-editor');
    if (!editorElement) return;

    editorElement.addEventListener('paste', handlePaste as EventListener, true);

    return () => {
      editorElement.removeEventListener(
        'paste',
        handlePaste as EventListener,
        true,
      );
    };
  }, [editor, handlePaste]);
}
