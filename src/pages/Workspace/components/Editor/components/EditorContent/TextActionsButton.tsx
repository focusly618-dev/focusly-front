import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { alpha, ButtonBase, Tooltip, useTheme } from '@mui/material';
import { AutoAwesome as SparkleIcon } from '@mui/icons-material';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';

const SIZE = 30;

interface TextActionsButtonProps {
  editorRef: RefObject<MarkdownEditorRef | null>;
  surfaceRef: RefObject<HTMLDivElement | null>;
  /** The live selection's text ('' for a cursor). */
  selectedText: string;
  /** Bumped on every selection change, cursor moves included. */
  selectionTick: number;
  hidden?: boolean;
  onOpen: (button: DOMRect) => void;
}

/**
 * The text actions (the right-click menu: AI rewrite, task, summary...) as a
 * button in the editor's right margin, level with the line being written or
 * with the selection, so they're in sight instead of behind a right click.
 * Quiet next to a cursor, prominent once text is selected.
 */
export const TextActionsButton = ({
  editorRef,
  surfaceRef,
  selectedText,
  selectionTick,
  hidden = false,
  onOpen,
}: TextActionsButtonProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [top, setTop] = useState<number | null>(null);
  const hasSelection = selectedText.trim().length > 0;

  const place = useCallback(() => {
    const editor = editorRef.current;
    const surface = surfaceRef.current;
    if (!editor || !surface) return;
    const { from } = editor.getSelection();
    // The selection's first line, or the cursor's line
    const caret = editor.coordsAtPos(from, 1);
    if (!caret) {
      setTop(null);
      return;
    }
    const lineHeight = caret.bottom - caret.top;
    const surfaceTop = surface.getBoundingClientRect().top;
    setTop(caret.top - surfaceTop + (lineHeight - SIZE) / 2);
  }, [editorRef, surfaceRef]);

  // After CodeMirror has laid out the change that moved the selection
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [place, selectionTick, selectedText]);

  useEffect(() => {
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  if (hidden || top === null) return null;

  const label = hasSelection
    ? t('editorAI.textActions.selection')
    : t('editorAI.textActions.paragraph');
  const brand = theme.palette.primary.main;

  return (
    <Tooltip title={label} placement="left" arrow>
      <ButtonBase
        aria-label={label}
        aria-haspopup="menu"
        className="text-actions-button"
        // Keep the editor's selection: the button must not take focus first
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => onOpen(e.currentTarget.getBoundingClientRect())}
        sx={{
          position: 'absolute',
          top,
          right: { xs: 2, md: -46 },
          zIndex: 5,
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          color: hasSelection ? theme.palette.common.white : 'text.secondary',
          bgcolor: hasSelection ? brand : 'background.paper',
          border: `1px solid ${hasSelection ? brand : theme.palette.divider}`,
          boxShadow: hasSelection
            ? `0 4px 14px ${alpha(brand, 0.35)}`
            : `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
          opacity: hasSelection ? 1 : 0.7,
          transform: hasSelection ? 'scale(1.08)' : 'scale(1)',
          transition:
            'top 120ms ease-out, opacity 150ms ease, transform 150ms ease, background-color 150ms ease, color 150ms ease',
          '&:hover, &:focus-visible': {
            opacity: 1,
            color: hasSelection ? theme.palette.common.white : brand,
            borderColor: brand,
          },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <SparkleIcon sx={{ fontSize: 16 }} />
      </ButtonBase>
    </Tooltip>
  );
};
