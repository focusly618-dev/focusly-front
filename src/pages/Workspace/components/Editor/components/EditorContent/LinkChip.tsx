import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import {
  alpha,
  Box,
  ButtonBase,
  InputBase,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  LinkRounded as LinkIcon,
  EditOutlined as EditIcon,
  LinkOffRounded as UnlinkIcon,
} from '@mui/icons-material';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';

type Link = NonNullable<ReturnType<MarkdownEditorRef['linkAt']>>;

const GAP = 6;

interface LinkChipProps {
  editorRef: RefObject<MarkdownEditorRef | null>;
  surfaceRef: RefObject<HTMLDivElement | null>;
  selectedText: string;
  selectionTick: number;
  hidden?: boolean;
}

/**
 * A link's address never shows in the text: with the cursor on a link, this
 * shows it under the link, to open it, change it in place, or remove the
 * link (its text stays).
 */
export const LinkChip = ({
  editorRef,
  surfaceRef,
  selectedText,
  selectionTick,
  hidden = false,
}: LinkChipProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [link, setLink] = useState<Link | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const chipRef = useRef<HTMLDivElement>(null);
  const editingRef = useRef(false);

  const place = useCallback(() => {
    const editor = editorRef.current;
    const surface = surfaceRef.current;
    // Only for a cursor (a selection gets the format toolbar)
    if (!editor || !surface || selectedText) {
      setLink(null);
      return;
    }
    const found = editor.linkAt(editor.getSelection().from);
    const start = found && editor.coordsAtPos(found.from, 1);
    if (!found || !start) {
      setLink(null);
      return;
    }
    const box = surface.getBoundingClientRect();
    setLink(found);
    setPos({
      top: start.bottom - box.top + GAP,
      left: Math.max(0, Math.min(start.left - box.left, box.width - 300)),
    });
  }, [editorRef, surfaceRef, selectedText]);

  useLayoutEffect(() => {
    if (editing) return;
    const frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [place, selectionTick, editing]);

  useEffect(() => {
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  if (hidden || !link || !pos) return null;

  // Enter saves and the input's blur that follows saves too: only the first
  // one applies, and only while the address is still where it was
  const save = () => {
    if (!editingRef.current) return;
    editingRef.current = false;
    const editor = editorRef.current;
    const url = draft.trim();
    const current = editor?.linkAt(link.from + 1);
    if (editor && url && url !== link.url && current?.url === link.url) {
      editor.applyChanges([
        { from: current.urlFrom, to: current.urlTo, insert: url },
      ]);
    }
    setEditing(false);
    editor?.focus();
  };

  const cancel = () => {
    editingRef.current = false;
    setEditing(false);
    editorRef.current?.focus();
  };

  const unlink = () => {
    editorRef.current?.applyChanges([
      { from: link.from, to: link.to, insert: link.text },
    ]);
    setLink(null);
    editorRef.current?.focus();
  };

  const iconButton = {
    width: 26,
    height: 26,
    borderRadius: '7px',
    color: 'text.secondary',
    '& svg': { fontSize: 16 },
    '&:hover, &:focus-visible': {
      color: 'text.primary',
      bgcolor: alpha(theme.palette.text.primary, 0.07),
    },
  };

  return (
    <Box
      ref={chipRef}
      className="link-chip"
      // Clicks here mustn't move the editor's cursor off the link
      onMouseDown={(e) => {
        if (!(e.target as HTMLElement).closest('input')) e.preventDefault();
      }}
      sx={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        maxWidth: 360,
        p: '3px 4px 3px 10px',
        borderRadius: '10px',
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.45)'
            : '0 8px 24px rgba(15,23,42,0.12)',
      }}
    >
      <LinkIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
      {editing ? (
        <InputBase
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              save();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
          onBlur={save}
          placeholder="https://"
          inputProps={{ 'aria-label': t('editor.link.address') }}
          sx={{ fontSize: 13, width: 240 }}
        />
      ) : (
        <Box
          component="a"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={t('editor.link.open')}
          sx={{
            fontSize: 13,
            color: 'primary.main',
            textDecoration: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
            mr: 0.5,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {link.url || t('editor.link.empty')}
        </Box>
      )}
      {!editing && (
        <>
          <Tooltip title={t('editor.link.edit')}>
            <ButtonBase
              aria-label={t('editor.link.edit')}
              onClick={() => {
                setDraft(link.url);
                editingRef.current = true;
                setEditing(true);
              }}
              sx={iconButton}
            >
              <EditIcon />
            </ButtonBase>
          </Tooltip>
          <Tooltip title={t('editor.link.remove')}>
            <ButtonBase
              aria-label={t('editor.link.remove')}
              onClick={unlink}
              sx={iconButton}
            >
              <UnlinkIcon />
            </ButtonBase>
          </Tooltip>
        </>
      )}
    </Box>
  );
};
