import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from 'react';
import type { BlockNoteEditor } from '@blocknote/core';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { CODE_BLOCK_LANGUAGES } from '../../hooks/useWorkspaceEditor.hook';

interface CodeBlockLanguageMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: BlockNoteEditor<any, any, any>;
  /**
   * The already `position: relative` element wrapping <BlockNoteView>
   * (`BlockNoteWrapper`). Trigger buttons are positioned absolutely
   * relative to this element's box.
   */
  containerRef: RefObject<HTMLElement | null>;
}

interface TrackedCodeBlock {
  id: string;
  language: string;
  top: number;
  left: number;
  width: number;
}

/**
 * Renders a custom, app-styled "language" trigger + menu docked to the
 * bottom of every code block, replacing the look of BlockNote's built-in
 * native <select> (hidden via a pure-CSS rule in WorkspaceEditor.styles.ts
 * — see the comment there for why it must stay CSS-only).
 *
 * This never touches createCodeBlockSpec, the Shiki highlighter, the
 * Tab/Enter/Shift-Enter/Delete shortcuts, or the ```lang input rule — it
 * only reads block state via the public `editor.getBlock` API and writes
 * via the public `editor.updateBlock` API, the same call BlockNote's own
 * native <select> change handler makes internally. The stored block shape
 * (`type: "codeBlock"`, `props.language`) is therefore unaffected.
 */
export const CodeBlockLanguageMenu = ({
  editor,
  containerRef,
}: CodeBlockLanguageMenuProps) => {
  const theme = useTheme();
  const [blocks, setBlocks] = useState<TrackedCodeBlock[]>([]);
  const [menuState, setMenuState] = useState<{
    blockId: string;
    anchorEl: HTMLElement;
  } | null>(null);
  const [search, setSearch] = useState('');

  const recompute = useCallback(() => {
    const container = containerRef.current;
    const editorRoot = editor.domElement;
    if (!container || !editorRoot) return;

    const containerRect = container.getBoundingClientRect();
    const nodes = editorRoot.querySelectorAll<HTMLElement>(
      '.bn-block-content[data-content-type="codeBlock"]',
    );

    const next: TrackedCodeBlock[] = [];
    nodes.forEach((node) => {
      // BlockNote always stamps the block id on the ancestor wrapper's
      // `data-id` attribute.
      const outer = node.closest<HTMLElement>('[data-id]');
      const id = outer?.getAttribute('data-id');
      if (!id) return;

      const block = editor.getBlock(id);
      const language =
        block && block.type === 'codeBlock'
          ? ((block.props as { language?: string }).language ?? 'text')
          : 'text';

      const rect = node.getBoundingClientRect();
      next.push({
        id,
        language,
        top: Math.round(rect.bottom - containerRect.top),
        left: Math.round(rect.left - containerRect.left),
        width: Math.round(rect.width),
      });
    });

    setBlocks((prev) => {
      if (
        prev.length === next.length &&
        prev.every(
          (b, i) =>
            b.id === next[i].id &&
            b.language === next[i].language &&
            Math.abs(b.top - next[i].top) < 2 &&
            Math.abs(b.left - next[i].left) < 2 &&
            Math.abs(b.width - next[i].width) < 2,
        )
      ) {
        return prev;
      }
      return next;
    });
  }, [editor, containerRef]);

  useEffect(() => {
    let teardown: Array<() => void> = [];
    let rafId: number | null = null;

    const throttledRecompute = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        recompute();
      });
    };

    const setup = () => {
      const editorRoot = editor.domElement;
      const container = containerRef.current;
      if (!editorRoot || !container) return;

      recompute();

      // Structural changes: new/removed code blocks, language auto-set by
      // the ```lang input rule, undo/redo, etc.
      const unsubscribeChange = editor.onChange(() => throttledRecompute());

      // Any size change (typing wraps a line, sidebar collapses, window
      // resize). Read-only observation only — no DOM writes.
      const resizeObserver = new ResizeObserver(() => throttledRecompute());
      resizeObserver.observe(container);

      window.addEventListener('resize', throttledRecompute);
      // `scroll` doesn't bubble, but a capture-phase listener on `window`
      // still receives it from any nested scroll container.
      window.addEventListener('scroll', throttledRecompute, true);

      teardown = [
        unsubscribeChange,
        () => resizeObserver.disconnect(),
        () => window.removeEventListener('resize', throttledRecompute),
        () => window.removeEventListener('scroll', throttledRecompute, true),
        () => {
          if (rafId !== null) cancelAnimationFrame(rafId);
        },
      ];
    };

    if (editor.domElement) {
      setup();
    } else {
      editor.onMount(setup);
    }

    return () => teardown.forEach((fn) => fn());
  }, [editor, containerRef, recompute]);

  const languageEntries = useMemo(
    () => Object.entries(CODE_BLOCK_LANGUAGES),
    [],
  );

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return languageEntries;
    const q = search.toLowerCase();
    return languageEntries.filter(
      ([key, { name, aliases }]) =>
        name.toLowerCase().includes(q) ||
        key.toLowerCase().includes(q) ||
        aliases?.some((a) => a.toLowerCase().includes(q)),
    );
  }, [languageEntries, search]);

  const activeLanguage = menuState
    ? blocks.find((b) => b.id === menuState.blockId)?.language
    : undefined;

  const handleSelect = (languageKey: string) => {
    if (menuState) {
      // Same public call BlockNote's own native <select> change handler
      // makes internally.
      editor.updateBlock(menuState.blockId, {
        props: { language: languageKey },
      });
    }
    setMenuState(null);
    setSearch('');
  };

  return (
    <>
      {blocks.map(({ id, language, top, left, width }) => (
        <Box
          key={id}
          sx={{
            position: 'absolute',
            top,
            left,
            width,
            display: 'flex',
            justifyContent: 'flex-end',
            pointerEvents: 'none',
            zIndex: 5,
            transform: 'translateY(-32px)',
            px: '10px',
          }}
        >
          <Button
            size="small"
            onClick={(e) =>
              setMenuState({ blockId: id, anchorEl: e.currentTarget })
            }
            endIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
            sx={{
              pointerEvents: 'auto',
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: 1.4,
              color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#334155',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(15,23,42,0.06)',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              px: 1.25,
              py: 0.25,
              minWidth: 0,
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.14)'
                    : 'rgba(15,23,42,0.1)',
              },
            }}
          >
            {CODE_BLOCK_LANGUAGES[language]?.name ?? language}
          </Button>
        </Box>
      ))}

      <Menu
        open={!!menuState}
        anchorEl={menuState?.anchorEl ?? null}
        onClose={() => {
          setMenuState(null);
          setSearch('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: 220,
            maxHeight: 340,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
          <TextField
            autoFocus
            size="small"
            fullWidth
            placeholder="Search language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredEntries.map(([key, { name }]) => (
          <MenuItem
            key={key}
            selected={key === activeLanguage}
            onClick={() => handleSelect(key)}
            sx={{ py: 1 }}
          >
            <ListItemText
              primary={name}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
            {key === activeLanguage && (
              <CheckIcon
                sx={{ fontSize: 16, color: theme.palette.primary.main, ml: 1 }}
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
