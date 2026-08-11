import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { alpha, type Theme } from '@mui/material/styles';

// Editor chrome + every `.cm-live-*` class the live-preview decorations
// apply (see extensions/livePreview/*). Kept in one Compartment so a
// light/dark/graydark theme change reconfigures all of it in one dispatch —
// see MarkdownEditor.tsx.
// One color per Obsidian callout type (grouped by the semantic families
// Obsidian itself uses) — reused for both the colored left-border/tint on
// every line of the callout and the header's icon/title color.
const calloutTypeColors = (theme: Theme): Record<string, string> => ({
  note: theme.palette.info.main,
  info: theme.palette.info.main,
  abstract: theme.palette.info.main,
  summary: theme.palette.info.main,
  tldr: theme.palette.info.main,
  tip: theme.palette.primary.main,
  hint: theme.palette.primary.main,
  todo: theme.palette.primary.main,
  success: theme.palette.success.main,
  check: theme.palette.success.main,
  done: theme.palette.success.main,
  question: theme.palette.warning.main,
  help: theme.palette.warning.main,
  faq: theme.palette.warning.main,
  warning: theme.palette.warning.main,
  caution: theme.palette.warning.main,
  attention: theme.palette.warning.main,
  failure: theme.palette.error.main,
  fail: theme.palette.error.main,
  missing: theme.palette.error.main,
  danger: theme.palette.error.main,
  error: theme.palette.error.main,
  bug: theme.palette.error.main,
  example: theme.palette.secondary.main,
  quote: theme.palette.text.secondary,
  cite: theme.palette.text.secondary,
  important: theme.palette.secondary.main,
});

export const buildEditorTheme = (theme: Theme): Extension => {
  const isDark = theme.palette.mode === 'dark';
  const calloutColors = calloutTypeColors(theme);

  const calloutLineStyles = Object.fromEntries(
    Object.entries(calloutColors).map(([type, color]) => [
      `.cm-live-callout-line-${type}`,
      {
        borderLeft: `3px solid ${color}`,
        paddingLeft: '10px',
        backgroundColor: alpha(color, isDark ? 0.08 : 0.05),
      },
    ]),
  );

  const calloutHeaderColorStyles = Object.fromEntries(
    Object.entries(calloutColors).map(([type, color]) => [
      `.cm-live-callout-header.cm-live-callout-${type}`,
      { color },
    ]),
  );

  return EditorView.theme(
    {
      '&': {
        height: '100%',
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
        fontSize: '15px',
      },
      // CM6's base theme falls back to a dotted outline on focus, meant to
      // be overridden — Obsidian's editor has no visible border/outline at
      // all, focused or not.
      '&.cm-focused': {
        outline: 'none',
      },
      '.cm-scroller': {
        fontFamily: theme.typography.fontFamily ?? 'inherit',
        lineHeight: '1.7',
        overflow: 'auto',
      },
      '.cm-content': {
        padding: '4px 0 200px 0',
        caretColor: theme.palette.primary.main,
      },
      '.cm-line': {
        padding: '0 2px',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: theme.palette.primary.main,
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
        backgroundColor: `${alpha(theme.palette.primary.main, isDark ? 0.28 : 0.18)} !important`,
      },
      '.cm-placeholder': {
        color: theme.palette.text.disabled,
      },

      // Live Preview formatting
      '.cm-live-strong': { fontWeight: 700 },
      '.cm-live-em': { fontStyle: 'italic' },
      '.cm-live-h1': { fontSize: '1.7em', fontWeight: 800, lineHeight: '1.4' },
      '.cm-live-h2': { fontSize: '1.4em', fontWeight: 750, lineHeight: '1.4' },
      '.cm-live-h3': { fontSize: '1.22em', fontWeight: 700, lineHeight: '1.4' },
      '.cm-live-h4': { fontSize: '1.1em', fontWeight: 700, lineHeight: '1.4' },
      '.cm-live-h5': { fontSize: '1.02em', fontWeight: 700, lineHeight: '1.4' },
      '.cm-live-h6': {
        fontSize: '0.95em',
        fontWeight: 700,
        lineHeight: '1.4',
        color: theme.palette.text.secondary,
      },
      '.cm-live-link': {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        textDecorationColor: alpha(theme.palette.primary.main, 0.4),
        cursor: 'text',
      },
      '.cm-live-inlinecode': {
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.9em',
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.05)',
        borderRadius: '4px',
        padding: '1px 5px',
      },
      '.cm-live-quote-line': {
        borderLeft: `3px solid ${theme.palette.divider}`,
        paddingLeft: '12px',
        color: theme.palette.text.secondary,
      },
      '.cm-live-task-checkbox': {
        marginRight: '6px',
        cursor: 'pointer',
        accentColor: theme.palette.primary.main,
        verticalAlign: 'middle',
      },
      '.cm-live-image': {
        display: 'block',
        maxWidth: '100%',
        borderRadius: '10px',
        margin: '8px 0',
        border: `1px solid ${theme.palette.divider}`,
      },

      // Fenced code blocks
      '.cm-code-fence-line': {
        color: theme.palette.text.disabled,
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.85em',
      },
      '.cm-code-block-line': {
        backgroundColor: isDark ? '#0f172a' : '#f4f4f5',
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.88em',
      },
      '.cm-code-block-line-first': {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
      },
      '.cm-code-block-line-last': {
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
      },

      '.cm-hr-line': {
        borderTop: `1px solid ${theme.palette.divider}`,
        height: '1px',
      },

      // Tables
      '.cm-live-table-wrapper': {
        overflowX: 'auto',
        margin: '10px 0',
      },
      '.cm-live-table': {
        borderCollapse: 'collapse',
        width: 'auto',
        fontSize: '0.92em',
      },
      '.cm-live-table th, .cm-live-table td': {
        border: `1px solid ${theme.palette.divider}`,
        padding: '6px 12px',
        textAlign: 'left',
      },
      '.cm-live-table th': {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.03)',
        fontWeight: 700,
      },
      '.cm-live-table tbody tr:nth-of-type(even) td': {
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(0, 0, 0, 0.015)',
      },

      // Callouts
      '.cm-live-callout-header': {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px 4px 8px',
        fontWeight: 700,
        userSelect: 'none',
      },
      '.cm-live-callout-icon': { fontSize: '0.95em', lineHeight: 1 },
      '.cm-live-callout-title': { flex: 1 },
      '.cm-live-callout-chevron': {
        fontSize: '0.8em',
        color: theme.palette.text.secondary,
      },
      ...calloutLineStyles,
      ...calloutHeaderColorStyles,

      // Math (KaTeX)
      '.cm-live-math-block': {
        display: 'block',
        overflowX: 'auto',
        margin: '10px 0',
        padding: '6px 0',
        textAlign: 'center',
      },
      '.cm-live-math-inline': { display: 'inline-block' },
      '.cm-live-math-error': {
        color: theme.palette.error.main,
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.85em',
      },
    },
    { dark: isDark },
  );
};
