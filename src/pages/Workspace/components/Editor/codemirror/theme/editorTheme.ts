import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { alpha, type Theme } from '@mui/material/styles';
import { surfaceColor } from '@/context';

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

// The canvas color, as in the create popover and the header.
const CANVAS_ACCENT = '#0ea5e9';

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
        // The note's typeface (Default/Serif/Mono) comes in as CSS variables
        // set on its wrapper — see editorFonts.ts.
        fontSize: 'var(--editor-font-size, 15px)',
      },
      // CM6's base theme falls back to a dotted outline on focus, meant to
      // be overridden — Obsidian's editor has no visible border/outline at
      // all, focused or not.
      '&.cm-focused': {
        outline: 'none',
      },
      '.cm-scroller': {
        fontFamily: `var(--editor-font-family, ${theme.typography.fontFamily ?? 'inherit'})`,
        lineHeight: '1.7',
        overflow: 'auto',
      },
      '.cm-content': {
        padding: '4px 0 200px 0',
        caretColor: theme.palette.primary.main,
        color: isDark ? '#d4d4d8' : theme.palette.text.primary,
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
      '.cm-live-strong': {
        fontWeight: 700,
        color: isDark ? '#ffffff' : theme.palette.text.primary,
      },
      '.cm-live-em': { fontStyle: 'italic' },
      '.cm-live-strike': { textDecoration: 'line-through' },
      '.cm-live-h1': {
        fontSize: '1.7em',
        fontWeight: 800,
        lineHeight: '1.4',
        color: isDark ? '#ffffff' : theme.palette.text.primary,
      },
      '.cm-live-h2': {
        fontSize: '1.4em',
        fontWeight: 750,
        lineHeight: '1.4',
        color: isDark ? '#ffffff' : theme.palette.text.primary,
      },
      '.cm-live-h3': {
        fontSize: '1.22em',
        fontWeight: 700,
        lineHeight: '1.4',
        color: isDark ? '#ffffff' : theme.palette.text.primary,
      },
      '.cm-live-h4': {
        fontSize: '1.1em',
        fontWeight: 700,
        lineHeight: '1.4',
        color: isDark ? '#ffffff' : theme.palette.text.primary,
      },
      '.cm-live-h5': {
        fontSize: '1.02em',
        fontWeight: 700,
        lineHeight: '1.4',
        color: isDark ? '#ffffff' : theme.palette.text.primary,
      },
      '.cm-live-h6': {
        fontSize: '0.95em',
        fontWeight: 700,
        lineHeight: '1.4',
        color: isDark ? '#a1a1aa' : theme.palette.text.secondary,
      },
      '.cm-live-link': {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        textDecorationColor: alpha(theme.palette.primary.main, 0.4),
        cursor: 'text',
      },
      // Canvas links inside a sentence, styled after Notion's page links: the
      // icon on its own, the title underlined by a faint line, a soft wash on
      // hover. (One with a line to itself is a card, further down.)
      '.cm-live-canvas-link': {
        color: `${theme.palette.text.primary} !important`,
        fontWeight: 500,
        textDecoration: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.12s ease',
      },
      '.cm-live-canvas-link:hover': {
        backgroundColor: alpha(theme.palette.text.primary, 0.06),
      },
      '.cm-canvas-icon': {
        fontSize: '1.15em',
        marginRight: '2px',
      },
      '.cm-canvas-title': {
        textDecoration: 'underline',
        textDecorationThickness: '1px',
        textUnderlineOffset: '3px',
        textDecorationColor: alpha(theme.palette.text.primary, 0.25),
      },
      // A canvas link with a line to itself: a full-width card with its
      // icon, name and an "open" button. Always in the app's font, whatever
      // typeface the note is in.
      '.cm-canvas-card': {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        boxSizing: 'border-box',
        margin: '6px 0',
        padding: '12px 14px',
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(
          theme.palette.text.primary,
          isDark ? 0.02 : 0.015,
        ),
        fontFamily: theme.typography.fontFamily ?? 'inherit',
        lineHeight: 1.35,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.text.primary, 0.18),
          backgroundColor: alpha(theme.palette.text.primary, 0.035),
        },
      },
      '.cm-canvas-card-icon': {
        flexShrink: 0,
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        backgroundColor: alpha(CANVAS_ACCENT, isDark ? 0.14 : 0.1),
      },
      '.cm-canvas-card-preview': {
        flexShrink: 0,
        width: '72px',
        height: '48px',
        borderRadius: '8px',
        overflow: 'hidden',
        // The picture has a white background whatever the theme
        backgroundColor: '#ffffff',
        border: `1px solid ${theme.palette.divider}`,
        '& img': {
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        },
      },
      '.cm-canvas-card-text': {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      },
      '.cm-canvas-card-title': {
        fontSize: '14px',
        fontWeight: 600,
        color: theme.palette.text.primary,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      '.cm-canvas-card-sub': {
        fontSize: '12px',
        color: theme.palette.text.secondary,
      },
      '.cm-canvas-card-action': {
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 10px 6px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 600,
        color: CANVAS_ACCENT,
        backgroundColor: alpha(CANVAS_ACCENT, isDark ? 0.14 : 0.1),
        transition: 'background-color 0.15s ease',
      },
      '.cm-canvas-card:hover .cm-canvas-card-action': {
        backgroundColor: alpha(CANVAS_ACCENT, isDark ? 0.24 : 0.18),
      },
      '.cm-live-inlinecode': {
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.88em',
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.05)',
        color: isDark ? '#e4e4e7' : '#3f3f46',
        borderRadius: '5px',
        padding: '2px 6px',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
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
      '.cm-live-bullet': {
        color: isDark
          ? theme.palette.primary.light
          : theme.palette.primary.main,
        display: 'inline-block',
        width: '1.2em',
        textAlign: 'center',
        fontWeight: 700,
        userSelect: 'none',
      },
      '.cm-live-image-container': {
        display: 'inline-block',
        position: 'relative',
        margin: '10px 0',
        maxWidth: '100%',
        borderRadius: '12px',
        verticalAlign: 'middle',
        transition: 'all 0.2s ease',
      },
      '.cm-live-image-container.cm-selected': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '3px',
      },
      '.cm-live-image': {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '520px',
        borderRadius: '10px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? '0 4px 16px rgba(0, 0, 0, 0.45)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      },
      '.cm-live-image-container:hover .cm-live-image': {
        boxShadow: isDark
          ? '0 6px 22px rgba(0, 0, 0, 0.6)'
          : '0 6px 18px rgba(0, 0, 0, 0.12)',
      },
      '.cm-live-image-delete-btn': {
        position: 'absolute',
        top: '8px',
        right: '8px',
        opacity: 0,
        pointerEvents: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
        backgroundColor: surfaceColor(
          theme,
          'rgba(24, 24, 27, 0.88)',
          'rgba(34, 34, 34, 0.88)',
          'rgba(255, 255, 255, 0.92)',
        ),
        backdropFilter: 'blur(8px)',
        color: theme.palette.error.main,
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        transform: 'scale(0.9)',
        transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 10,
      },
      '.cm-live-image-container:hover .cm-live-image-delete-btn': {
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'scale(1)',
      },
      '.cm-live-image-delete-btn:hover': {
        backgroundColor: theme.palette.error.main,
        color: '#ffffff',
        transform: 'scale(1.08)',
        boxShadow: `0 4px 14px ${alpha(theme.palette.error.main, 0.45)}`,
      },
      '.cm-live-image-delete-btn:active': {
        transform: 'scale(0.94)',
      },

      // Fenced code blocks — seamless unified container
      '.cm-code-block-line': {
        backgroundColor: surfaceColor(theme, '#111827', '#242424', '#f8fafc'),
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.88em',
        padding: '2px 14px',
        borderLeft: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
      },
      '.cm-code-block-header': {
        position: 'relative',
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        paddingTop: '6px',
        paddingBottom: '3px',
        marginTop: '8px',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
      },
      '.cm-mermaid-code-header': {
        paddingTop: '7px',
        paddingBottom: '7px',
      },
      '.cm-code-block-footer': {
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        paddingBottom: '6px',
        marginBottom: '8px',
        minHeight: '10px',
      },
      '.cm-code-fence-active': {
        color: theme.palette.text.disabled,
      },
      '.cm-code-lang-badge': {
        display: 'inline-block',
        fontSize: '0.72em',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: isDark ? '#94a3b8' : '#64748b',
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.05)',
        padding: '2px 7px',
        borderRadius: '4px',
        letterSpacing: '0.06em',
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        userSelect: 'none',
      },

      '.cm-hr-line': {
        borderTop: `1px solid ${theme.palette.divider}`,
        height: '1px',
      },

      // A formula being edited: its source like code, the result under it
      '.cm-math-source-line': {
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.88em',
        backgroundColor: alpha(
          theme.palette.text.primary,
          isDark ? 0.04 : 0.03,
        ),
        padding: '0 12px !important',
      },

      // While drag-selecting in the document, block widgets let pointer and
      // wheel events pass straight through to the editor so dragging from
      // top-to-bottom or bottom-to-top across tables, diagrams or formulas
      // never gets trapped inside nested DOM.
      '&.cm-dragging-selection .cm-live-table-wrapper, &.cm-dragging-selection .cm-live-mermaid, &.cm-dragging-selection .cm-live-math-block, &.cm-dragging-selection .cm-live-details-header, &.cm-dragging-selection .cm-live-callout-header':
        {
          pointerEvents: 'none !important',
          userSelect: 'none !important',
        },
      '.cm-live-table-wrapper:not(.cm-live-table-editing), .cm-live-table-wrapper:not(.cm-live-table-editing) [contenteditable="true"]':
        {
          userSelect: 'none',
        },
      // Tables
      '.cm-live-table-wrapper': {
        position: 'relative',
        overflowX: 'auto',
        margin: '10px 0',
        // Room for the toolbar, which sits just over the table
        paddingTop: '2px',
      },
      // Edited in place (extensions/livePreview/table.ts)
      '.cm-live-table th, .cm-live-table td[contenteditable]': {
        minWidth: '96px',
        cursor: 'text',
        outline: 'none',
        transition: 'box-shadow 120ms ease',
      },
      '.cm-live-table [contenteditable]:empty::before': {
        content: '"\\200b"',
      },
      '.cm-live-table [contenteditable]:focus': {
        boxShadow: `inset 0 0 0 2px ${alpha(theme.palette.primary.main, 0.55)}`,
        backgroundColor: alpha(
          theme.palette.primary.main,
          isDark ? 0.08 : 0.04,
        ),
      },
      '.cm-live-table-toolbar': {
        display: 'none',
        position: 'sticky',
        left: 0,
        width: 'fit-content',
        gap: '2px',
        padding: '3px',
        marginBottom: '6px',
        borderRadius: '9px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: isDark
          ? '0 6px 18px rgba(0,0,0,0.4)'
          : '0 6px 18px rgba(15,23,42,0.1)',
      },
      '.cm-live-table-editing .cm-live-table-toolbar': { display: 'flex' },
      '.cm-live-table-action': {
        width: '26px',
        height: '26px',
        display: 'grid',
        placeItems: 'center',
        border: 'none',
        borderRadius: '6px',
        background: 'transparent',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        padding: 0,
      },
      '.cm-live-table-action svg': { width: '15px', height: '15px' },
      '.cm-live-table-action:hover': {
        color: theme.palette.text.primary,
        backgroundColor: alpha(theme.palette.text.primary, 0.07),
      },
      '.cm-live-table-action[data-action="deleteTable"]:hover': {
        color: theme.palette.error.main,
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

      // Mermaid diagrams: centered, scrolling sideways when wider than the note
      '.cm-live-mermaid-row': {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        alignItems: 'stretch',
        margin: '10px 0',
      },
      '.cm-live-mermaid-row .cm-live-mermaid': {
        margin: 0,
        minWidth: 0,
      },
      '.cm-live-mermaid': {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'auto',
        margin: '10px 0',
        padding: '34px 12px 18px',
        borderRadius: '10px',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        color: theme.palette.text.secondary,
        fontSize: '0.85em',
        transition:
          'border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
      },
      '.cm-live-mermaid.is-resizing': {
        borderColor: alpha(theme.palette.primary.main, 0.55),
        userSelect: 'none',
      },
      '.cm-live-mermaid.is-dragging-diagram': {
        opacity: 0.65,
        borderColor: alpha(theme.palette.primary.main, 0.6),
        userSelect: 'none',
      },
      '.cm-live-mermaid[data-drop-side="left"]': {
        boxShadow: `inset 4px 0 0 0 ${theme.palette.primary.main}`,
      },
      '.cm-live-mermaid[data-drop-side="right"]': {
        boxShadow: `inset -4px 0 0 0 ${theme.palette.primary.main}`,
      },
      '.cm-live-mermaid[data-drop-side="above"]': {
        boxShadow: `inset 0 4px 0 0 ${theme.palette.primary.main}`,
      },
      '.cm-live-mermaid[data-drop-side="below"]': {
        boxShadow: `inset 0 -4px 0 0 ${theme.palette.primary.main}`,
      },
      '.cm-mermaid-drag-handle': {
        position: 'absolute',
        top: '6px',
        left: '8px',
        zIndex: 5,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '26px',
        height: '26px',
        padding: 0,
        borderRadius: '7px',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
        backgroundColor: isDark
          ? 'rgba(30, 41, 59, 0.88)'
          : 'rgba(241, 245, 249, 0.94)',
        color: theme.palette.text.secondary,
        cursor: 'grab',
        userSelect: 'none',
        transition: 'all 0.15s ease',
      },
      '.cm-mermaid-drag-handle:hover': {
        color: theme.palette.text.primary,
        borderColor: alpha(theme.palette.primary.main, 0.45),
      },
      '.cm-mermaid-drag-handle:active': {
        cursor: 'grabbing',
      },
      '.cm-live-mermaid-body': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        overflowX: 'auto',
      },
      '.cm-live-mermaid-body svg': { maxWidth: '100%', height: 'auto' },
      '.cm-mermaid-resize-handle': {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'ns-resize',
        userSelect: 'none',
        zIndex: 5,
      },
      '.cm-mermaid-resize-pill': {
        width: '36px',
        height: '4px',
        borderRadius: '999px',
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.18)'
          : 'rgba(0, 0, 0, 0.16)',
        transition: 'all 0.15s ease',
      },
      '.cm-live-mermaid:hover .cm-mermaid-resize-pill, .cm-live-mermaid.is-resizing .cm-mermaid-resize-pill':
        {
          width: '48px',
          backgroundColor: theme.palette.primary.main,
        },
      '.cm-mermaid-toolbar': {
        position: 'absolute',
        top: '6px',
        right: '8px',
        zIndex: 5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '2px',
        borderRadius: '8px',
        backgroundColor: isDark
          ? 'rgba(30, 41, 59, 0.88)'
          : 'rgba(241, 245, 249, 0.94)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
        backdropFilter: 'blur(6px)',
        userSelect: 'none',
      },
      '.cm-mermaid-code-header .cm-mermaid-toolbar': {
        top: '4px',
        right: '10px',
      },
      '.cm-mermaid-mode-btn, .cm-mermaid-zoom-btn': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '26px',
        height: '24px',
        padding: 0,
        border: 'none',
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      },
      '.cm-mermaid-mode-btn:hover, .cm-mermaid-zoom-btn:hover, .cm-mermaid-zoom-reset:hover':
        {
          color: theme.palette.text.primary,
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)',
        },
      '.cm-mermaid-zoom-reset': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '38px',
        height: '24px',
        padding: '0 4px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '11px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      },
      '.cm-mermaid-zoom-reset::after': {
        content: 'attr(data-zoom-label)',
      },
      '.cm-mermaid-toolbar-sep': {
        width: '1px',
        height: '16px',
        margin: '0 2px',
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(0, 0, 0, 0.1)',
      },
      '.cm-mermaid-mode-btn.is-active': {
        color: theme.palette.primary.main,
        backgroundColor: alpha(
          theme.palette.primary.main,
          isDark ? 0.22 : 0.14,
        ),
      },
      '.cm-live-mermaid-error, .cm-live-geojson-error': {
        color: theme.palette.error.main,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: '0.85em',
        padding: '36px 12px 12px',
        borderRadius: '8px',
        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
      },

      // GeoJSON: a small map of its shapes on a quiet card
      '.cm-live-geojson': {
        margin: '10px 0',
        borderRadius: '10px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(
          theme.palette.text.primary,
          isDark ? 0.03 : 0.02,
        ),
        overflow: 'hidden',
      },
      '.cm-live-geojson svg': {
        display: 'block',
        width: '100%',
        height: 'auto',
        backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      },
      '.cm-live-geojson .area': {
        fill: alpha(theme.palette.primary.main, 0.16),
        stroke: theme.palette.primary.main,
        strokeWidth: 1.5,
        strokeLinejoin: 'round',
      },
      '.cm-live-geojson .line': {
        fill: 'none',
        stroke: theme.palette.primary.main,
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      '.cm-live-geojson .point': {
        fill: theme.palette.primary.main,
        stroke: theme.palette.background.paper,
        strokeWidth: 2,
      },
      '.cm-live-geojson-caption': {
        padding: '6px 12px',
        fontSize: '0.75em',
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`,
      },

      // <details> sections: a quiet toggle row, the open body set in by a hairline
      '.cm-live-details-header': {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 4px',
        margin: '2px 0',
        borderRadius: '6px',
        fontWeight: 600,
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.04) },
      },
      '.cm-live-details-chevron': {
        display: 'inline-block',
        width: '1em',
        color: theme.palette.text.secondary,
        fontSize: '0.85em',
        transition: 'transform 0.15s ease',
      },
      '.cm-live-details-chevron-open': { transform: 'rotate(90deg)' },
      '.cm-live-details-body': {
        borderLeft: `2px solid ${theme.palette.divider}`,
        paddingLeft: '18px !important',
        marginLeft: '10px',
      },
      '.cm-live-math-error': {
        color: theme.palette.error.main,
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '0.85em',
      },

      // The "/" menu (extensions/slashMenu.ts): a quiet list, icon + name,
      // the Markdown it writes in grey on the right.
      '.cm-tooltip.cm-slash-menu': {
        // CodeMirror shrinks a tooltip that doesn't fit and keeps that height
        // after filtering; the list's own max height bounds it instead.
        height: 'auto !important',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: isDark
          ? '0 12px 32px rgba(0,0,0,0.45)'
          : '0 12px 32px rgba(15,23,42,0.12)',
        padding: '6px',
        overflow: 'hidden',
      },
      '.cm-tooltip.cm-slash-menu > ul': {
        fontFamily: theme.typography.fontFamily ?? 'inherit',
        minWidth: '248px',
        maxWidth: '280px',
        maxHeight: '320px',
      },
      '.cm-tooltip.cm-slash-menu > ul > li.cm-slash-option': {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '5px 8px',
        borderRadius: '8px',
        color: theme.palette.text.primary,
        fontSize: '13.5px',
        lineHeight: 1.3,
      },
      '.cm-tooltip.cm-slash-menu > ul > li.cm-slash-option[aria-selected]': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          isDark ? 0.16 : 0.09,
        ),
        color: theme.palette.text.primary,
      },
      '.cm-slash-icon': {
        flex: '0 0 auto',
        width: '26px',
        height: '26px',
        display: 'grid',
        placeItems: 'center',
        borderRadius: '7px',
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.secondary,
        backgroundColor: alpha(
          theme.palette.text.primary,
          isDark ? 0.03 : 0.02,
        ),
      },
      '.cm-slash-icon svg': { width: '15px', height: '15px' },
      '.cm-slash-option[aria-selected] .cm-slash-icon': {
        color: theme.palette.primary.main,
        borderColor: alpha(theme.palette.primary.main, 0.4),
      },
      '.cm-slash-menu .cm-completionLabel': { flex: 1 },
      '.cm-slash-menu .cm-completionDetail': {
        marginLeft: 'auto',
        fontStyle: 'normal',
        fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
        fontSize: '11px',
        color: theme.palette.text.disabled,
      },

      // The heading jumped to (from the graph or the outline): a soft tint
      // behind its line that holds for a moment, then fades away.
      '.cm-target-line': {
        borderRadius: '4px',
        animation: 'cmTargetFade 1.6s ease-out forwards',
      },
      '@keyframes cmTargetFade': {
        '0%, 40%': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            isDark ? 0.14 : 0.09,
          ),
        },
        '100%': {
          backgroundColor: alpha(theme.palette.primary.main, 0),
        },
      },
    },
    { dark: isDark },
  );
};
