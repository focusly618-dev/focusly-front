import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { alpha, Box, ButtonBase, Tooltip, useTheme } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  StrikethroughS,
  Code,
  Link,
  Title,
  FormatListBulleted,
  CheckBoxOutlined,
  FormatQuote,
} from '@mui/icons-material';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';
import type { TextFormat } from '../../codemirror/extensions/formatting';

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform);
const mod = isMac ? '⌘' : 'Ctrl+';
const shift = isMac ? '⇧' : 'Shift+';

interface Action {
  format: TextFormat;
  icon: ReactNode;
  shortcut?: string;
}

const GROUPS: Action[][] = [
  [
    { format: 'bold', icon: <FormatBold />, shortcut: `${mod}B` },
    { format: 'italic', icon: <FormatItalic />, shortcut: `${mod}I` },
    { format: 'strike', icon: <StrikethroughS />, shortcut: `${mod}${shift}S` },
    { format: 'code', icon: <Code />, shortcut: `${mod}E` },
    { format: 'link', icon: <Link /> },
  ],
  [
    { format: 'h2', icon: <Title /> },
    {
      format: 'bullet',
      icon: <FormatListBulleted />,
      shortcut: `${mod}${shift}8`,
    },
    { format: 'todo', icon: <CheckBoxOutlined />, shortcut: `${mod}${shift}9` },
    { format: 'quote', icon: <FormatQuote /> },
  ],
];

const GAP = 8;

interface FormatToolbarProps {
  editorRef: RefObject<MarkdownEditorRef | null>;
  surfaceRef: RefObject<HTMLDivElement | null>;
  selectedText: string;
  selectionTick: number;
  hidden?: boolean;
}

/**
 * Bold, italic, a heading, a list... over the selected text, so formatting
 * needs no Markdown. Shows once the selection is made (not while dragging),
 * above it, or below when there's no room.
 */
export const FormatToolbar = ({
  editorRef,
  surfaceRef,
  selectedText,
  selectionTick,
  hidden = false,
}: FormatToolbarProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const hasSelection = selectedText.trim().length > 0;

  // Not while the selection is still being dragged out
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const down = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setDragging(true);
    };
    const up = () => setDragging(false);
    surface.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      surface.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [surfaceRef]);

  const place = useCallback(() => {
    const editor = editorRef.current;
    const surface = surfaceRef.current;
    if (!editor || !surface || !hasSelection) {
      setPos(null);
      return;
    }
    const { from } = editor.getSelection();
    const start = editor.coordsAtPos(from, 1);
    if (!start) {
      setPos(null);
      return;
    }
    const box = surface.getBoundingClientRect();
    const bar = barRef.current?.getBoundingClientRect();
    const height = bar?.height ?? 34;
    const width = bar?.width ?? 330;
    let top = start.top - box.top - height - GAP;
    // No room above (near the window's top): just under the line
    if (start.top - height - GAP < 64) top = start.bottom - box.top + GAP;
    const left = Math.min(
      Math.max(start.left - box.left - 8, 0),
      Math.max(box.width - width, 0),
    );
    setPos({ top, left });
  }, [editorRef, surfaceRef, hasSelection]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [place, selectionTick, selectedText, dragging]);

  useEffect(() => {
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  if (hidden || dragging || !hasSelection || !pos) return null;

  const apply = (format: TextFormat) =>
    editorRef.current?.format(format, t('editor.format.linkPlaceholder'));

  return (
    <Box
      ref={barRef}
      role="toolbar"
      aria-label={t('editor.format.toolbar')}
      className="format-toolbar"
      // The buttons must not take the editor's focus (and its selection)
      onMouseDown={(e) => e.preventDefault()}
      sx={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        p: '3px',
        borderRadius: '10px',
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.45)'
            : '0 8px 24px rgba(15,23,42,0.12)',
        animation: 'formatToolbarIn 120ms ease-out',
        '@keyframes formatToolbarIn': {
          from: { opacity: 0, transform: 'translateY(3px)' },
          to: { opacity: 1, transform: 'none' },
        },
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }}
    >
      {GROUPS.map((group, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {i > 0 && (
            <Box
              aria-hidden
              sx={{ width: '1px', height: 18, mx: '3px', bgcolor: 'divider' }}
            />
          )}
          {group.map(({ format, icon, shortcut }) => {
            const name = t(`editor.format.${format}`);
            return (
              <Tooltip
                key={format}
                title={shortcut ? `${name} · ${shortcut}` : name}
                placement="top"
              >
                <ButtonBase
                  aria-label={name}
                  onClick={() => apply(format)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '7px',
                    color: 'text.secondary',
                    '& svg': { fontSize: 17 },
                    transition: 'background-color 120ms ease, color 120ms ease',
                    '&:hover, &:focus-visible': {
                      color: 'text.primary',
                      bgcolor: alpha(theme.palette.text.primary, 0.07),
                    },
                  }}
                >
                  {icon}
                </ButtonBase>
              </Tooltip>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
