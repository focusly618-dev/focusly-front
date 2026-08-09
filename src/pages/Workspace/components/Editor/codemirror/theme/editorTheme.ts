import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { alpha, type Theme } from '@mui/material/styles';

// Editor chrome + every `.cm-live-*` class the live-preview decorations
// apply (see extensions/livePreview/*). Kept in one Compartment so a
// light/dark/graydark theme change reconfigures all of it in one dispatch —
// see MarkdownEditor.tsx.
export const buildEditorTheme = (theme: Theme): Extension => {
  const isDark = theme.palette.mode === 'dark';

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
    },
    { dark: isDark },
  );
};
