// The editor's typeface, as Notion offers it: a personal preference kept in
// this browser. Applied through CSS variables on the note's wrapper, which
// the editor theme and the title read, so changing it never rebuilds the
// editor.
import { useState } from 'react';

export type EditorFontStyle = 'default' | 'serif' | 'mono';

export const EDITOR_FONT_STYLES: EditorFontStyle[] = [
  'default',
  'serif',
  'mono',
];

interface EditorFont {
  label: string;
  /** null: the app's own font (the theme's). */
  family: string | null;
  /** Each face reads at a different size; these even them out. */
  size: string;
}

export const EDITOR_FONTS: Record<EditorFontStyle, EditorFont> = {
  default: { label: 'Default', family: null, size: '15px' },
  serif: {
    label: 'Serif',
    family: '"Source Serif 4", Georgia, "Times New Roman", serif',
    size: '16px',
  },
  mono: {
    label: 'Mono',
    family: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    size: '14px',
  },
};

export const toEditorFontStyle = (
  value: string | null | undefined,
): EditorFontStyle =>
  value === 'serif' || value === 'mono' ? value : 'default';

/** The CSS variables that put a note in its typeface. */
export const editorFontVars = (style: EditorFontStyle) => {
  const font = EDITOR_FONTS[style];
  return {
    '--editor-font-size': font.size,
    ...(font.family && { '--editor-font-family': font.family }),
  };
};

const STORAGE_KEY = 'editor_font_style';

/** The picked style, remembered per browser (storage can be unavailable, in
 * which case it just lasts for the session). */
export const useEditorFontStyle = () => {
  const [fontStyle, setFontStyleState] = useState<EditorFontStyle>(() => {
    try {
      return toEditorFontStyle(localStorage.getItem(STORAGE_KEY));
    } catch {
      return 'default';
    }
  });

  const setFontStyle = (style: EditorFontStyle) => {
    setFontStyleState(style);
    try {
      localStorage.setItem(STORAGE_KEY, style);
    } catch {
      // Not remembered, but still applied.
    }
  };

  return { fontStyle, setFontStyle };
};
