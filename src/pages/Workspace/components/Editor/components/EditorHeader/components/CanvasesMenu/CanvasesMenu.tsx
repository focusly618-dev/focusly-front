import { useState, type DragEvent, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Box,
  Button,
  ButtonBase,
  ClickAwayListener,
  CircularProgress,
  IconButton,
  Paper,
  Popper,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DeleteOutlineRounded as DeleteIcon,
  DragIndicatorRounded as DragIcon,
  DrawOutlined as CanvasIcon,
  PostAddRounded as InsertIcon,
} from '@mui/icons-material';
import type { Canvas } from '@/pages/Workspace/canvas.types';
import type { MarkdownEditorRef } from '../../../../codemirror/MarkdownEditor.types';
import type { CanvasView } from '../../../../useCanvasView.hook';
import {
  CANVAS_DRAG_TYPE,
  DEFAULT_CANVAS_ICON,
  canvasLink,
} from '../../../EditorContent/canvasLinks.utils';
import { CANVAS_ACCENT } from '../../../CanvasIdentity/CanvasIdentityField';
import { useDocumentCanvases } from './useDocumentCanvases.hook';

// Amber, as a quiet "this one isn't in the text" next to the canvas's name
const MISSING_COLOR = '#d97706';

interface CanvasesMenuProps {
  workspaceId: string | null;
  documentText: string;
  markdownEditorRef?: RefObject<MarkdownEditorRef | null>;
  canvasView?: CanvasView;
}

/**
 * Every canvas of the document, in the header: open one, drag it (or put it)
 * back into the text if its card was deleted, or delete it for good. Shown
 * once the document has a canvas.
 */
export const CanvasesMenu = (props: CanvasesMenuProps) => {
  const { t } = useTranslation();
  const canvases = useDocumentCanvases(props);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isOpen = anchor !== null;
  const [isDragging, setIsDragging] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (canvases.canvases.length === 0) return null;
  // With a canvas open, the document (where cards are dropped) is hidden
  const canDrag = !props.canvasView?.isActive;

  const close = () => {
    setAnchor(null);
    setConfirmingId(null);
  };

  const toggle = (button: HTMLElement) => {
    if (isOpen) return close();
    void canvases.refresh();
    setAnchor(button);
  };

  const handleDragStart = (event: DragEvent, canvas: Canvas) => {
    const link = canvasLink(canvas.id, canvas.name, canvas.icon);
    event.dataTransfer.setData(CANVAS_DRAG_TYPE, link);
    event.dataTransfer.setData('text/plain', link);
    event.dataTransfer.effectAllowed = 'copy';
    // After the browser has taken the drag image: the list then fades and
    // lets drops through to the text under it
    setTimeout(() => setIsDragging(true));
  };

  const handleDragEnd = (event: DragEvent) => {
    setIsDragging(false);
    if (event.dataTransfer.dropEffect !== 'none') close();
  };

  const handleDelete = async (canvas: Canvas) => {
    setDeletingId(canvas.id);
    const deleted = await canvases.remove(canvas);
    setDeletingId(null);
    if (deleted) setConfirmingId(null);
  };

  return (
    <>
      <Tooltip
        title={t('workspaceEditor.canvases.button', 'Canvas del documento')}
      >
        <IconButton
          onClick={(e) => toggle(e.currentTarget)}
          size="small"
          aria-label={t(
            'workspaceEditor.canvases.button',
            'Canvas del documento',
          )}
          aria-expanded={isOpen}
          sx={{
            height: '34px',
            px: 1,
            gap: 0.5,
            borderRadius: '8px',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.12)'
                : '#e2e8f0',
            color: 'text.primary',
            bgcolor: (theme) =>
              isOpen
                ? theme.palette.action.hover
                : theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : '#ffffff',
            '&:hover': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.08)'
                  : '#f8fafc',
            },
          }}
        >
          <Badge
            variant="dot"
            invisible={canvases.missingCount === 0}
            sx={{ '& .MuiBadge-dot': { bgcolor: MISSING_COLOR } }}
          >
            <CanvasIcon sx={{ fontSize: 17, color: CANVAS_ACCENT }} />
          </Badge>
          <Typography
            component="span"
            sx={{ fontSize: '12px', fontWeight: 600, lineHeight: 1 }}
          >
            {canvases.canvases.length}
          </Typography>
        </IconButton>
      </Tooltip>

      <Popper
        open={isOpen}
        anchorEl={anchor}
        placement="bottom-end"
        // Not a modal: nothing may cover the document while a card is dragged
        sx={{
          zIndex: 1300,
          pointerEvents: isDragging ? 'none' : undefined,
        }}
        modifiers={[{ name: 'offset', options: { offset: [0, 6] } }]}
      >
        <ClickAwayListener mouseEvent="onMouseDown" onClickAway={close}>
          <Paper
            onKeyDown={(e) => e.key === 'Escape' && close()}
            sx={{
              width: 300,
              maxWidth: 'calc(100vw - 32px)',
              p: 0.75,
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
              backgroundImage: 'none',
              opacity: isDragging ? 0.4 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'text.secondary',
                px: 1,
                pt: 0.5,
                pb: 0.75,
              }}
            >
              {t('workspaceEditor.canvases.title', 'Canvas de este documento')}
            </Typography>

            <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
              {canvases.canvases.map((canvas) =>
                confirmingId === canvas.id ? (
                  <DeleteConfirmation
                    key={canvas.id}
                    canvas={canvas}
                    deleting={deletingId === canvas.id}
                    onCancel={() => setConfirmingId(null)}
                    onConfirm={() => void handleDelete(canvas)}
                  />
                ) : (
                  <CanvasRow
                    key={canvas.id}
                    canvas={canvas}
                    inDocument={canvases.isInDocument(canvas.id)}
                    draggable={canDrag}
                    onDragStart={(e) => handleDragStart(e, canvas)}
                    onDragEnd={handleDragEnd}
                    onOpen={() => {
                      close();
                      canvases.open(canvas);
                    }}
                    onInsert={() => {
                      close();
                      canvases.insert(canvas);
                    }}
                    onDelete={() => setConfirmingId(canvas.id)}
                  />
                ),
              )}
            </Box>

            {canDrag && (
              <Typography
                sx={{
                  fontSize: '11px',
                  color: 'text.disabled',
                  px: 1,
                  pt: 0.75,
                  pb: 0.25,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  mt: 0.5,
                }}
              >
                {t(
                  'workspaceEditor.canvases.dragHint',
                  'Arrastra un canvas al documento para colocarlo donde quieras.',
                )}
              </Typography>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

interface CanvasRowProps {
  canvas: Canvas;
  inDocument: boolean;
  draggable: boolean;
  onDragStart: (event: DragEvent) => void;
  onDragEnd: (event: DragEvent) => void;
  onOpen: () => void;
  onInsert: () => void;
  onDelete: () => void;
}

const CanvasRow = ({
  canvas,
  inDocument,
  draggable,
  onDragStart,
  onDragEnd,
  onOpen,
  onInsert,
  onDelete,
}: CanvasRowProps) => {
  const { t } = useTranslation();
  const insertLabel = t(
    'workspaceEditor.canvases.insert',
    'Insertar en el documento',
  );
  const deleteLabel = t('workspaceEditor.canvases.delete', 'Eliminar');

  return (
    <Box
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.25,
        borderRadius: '8px',
        pr: 0.5,
        cursor: draggable ? 'grab' : undefined,
        '&:hover, &:focus-within': { bgcolor: 'action.hover' },
        '&:hover .canvas-row-drag': { opacity: 1 },
        '&:hover .canvas-row-actions, &:focus-within .canvas-row-actions': {
          opacity: 1,
        },
      }}
    >
      <DragIcon
        className="canvas-row-drag"
        sx={{
          fontSize: 16,
          color: 'text.disabled',
          opacity: 0,
          flexShrink: 0,
          ml: 0.25,
          visibility: draggable ? 'visible' : 'hidden',
          transition: 'opacity 0.15s ease',
        }}
      />

      <Tooltip
        title={t('workspaceEditor.canvases.open', 'Abrir canvas')}
        placement="left"
        enterDelay={600}
      >
        <ButtonBase
          onClick={onOpen}
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 1,
            py: 0.75,
            pr: 0.5,
            borderRadius: '6px',
            textAlign: 'left',
            cursor: 'inherit',
          }}
        >
          <CanvasThumbnail canvas={canvas} />
          <Box component="span" sx={{ minWidth: 0, display: 'block' }}>
            <Typography
              component="span"
              noWrap
              sx={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {canvas.name}
            </Typography>
            <Typography
              component="span"
              noWrap
              sx={{
                display: 'block',
                fontSize: '11px',
                color: inDocument ? 'text.disabled' : MISSING_COLOR,
              }}
            >
              {inDocument
                ? t('workspaceEditor.canvases.inDocument', 'En el documento')
                : t(
                    'workspaceEditor.canvases.notInDocument',
                    'No está en el documento',
                  )}
            </Typography>
          </Box>
        </ButtonBase>
      </Tooltip>

      <Box
        className="canvas-row-actions"
        sx={{
          display: 'flex',
          flexShrink: 0,
          // The way back in stays in sight for a canvas the text lost
          opacity: inDocument ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        <Tooltip title={insertLabel}>
          <IconButton
            size="small"
            onClick={onInsert}
            aria-label={insertLabel}
            sx={{
              color: inDocument ? 'text.secondary' : CANVAS_ACCENT,
              '&:hover': { color: CANVAS_ACCENT },
            }}
          >
            <InsertIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={deleteLabel}>
          <IconButton
            size="small"
            onClick={onDelete}
            aria-label={deleteLabel}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <DeleteIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

/** The picture of the drawing, or its icon until it has one (or when the
 * picture can't load). */
const CanvasThumbnail = ({ canvas }: { canvas: Canvas }) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url =
    canvas.previewUrl && canvas.previewUrl !== failedUrl
      ? canvas.previewUrl
      : null;

  return (
    <Box
      component="span"
      sx={{
        width: url ? 42 : 28,
        height: 28,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        borderRadius: '7px',
        fontSize: '16px',
        ...(url
          ? {
              // The picture has a white background whatever the theme
              bgcolor: '#ffffff',
              border: '1px solid',
              borderColor: 'divider',
            }
          : {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.04)',
            }),
      }}
    >
      {url ? (
        <Box
          component="img"
          src={url}
          alt=""
          draggable={false}
          onError={() => setFailedUrl(url)}
          sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        canvas.icon || DEFAULT_CANVAS_ICON
      )}
    </Box>
  );
};

const DeleteConfirmation = ({
  canvas,
  deleting,
  onCancel,
  onConfirm,
}: {
  canvas: Canvas;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Box
      role="alertdialog"
      aria-label={t('workspaceEditor.canvases.deleteTitle', {
        name: canvas.name,
        defaultValue: '¿Eliminar «{{name}}»?',
      })}
      sx={{
        borderRadius: '8px',
        px: 1,
        py: 1,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(239, 68, 68, 0.08)'
            : 'rgba(239, 68, 68, 0.05)',
      }}
    >
      <Typography
        noWrap
        sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}
      >
        {t('workspaceEditor.canvases.deleteTitle', {
          name: canvas.name,
          defaultValue: '¿Eliminar «{{name}}»?',
        })}
      </Typography>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 0.25 }}>
        {t(
          'workspaceEditor.canvases.deleteHint',
          'Se borran el dibujo, sus imágenes y sus enlaces en el documento.',
        )}
      </Typography>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75, mt: 1 }}
      >
        <Button
          size="small"
          onClick={onCancel}
          disabled={deleting}
          autoFocus
          sx={{ color: 'text.secondary', textTransform: 'none', minWidth: 0 }}
        >
          {t('common.cancel', 'Cancelar')}
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          disableElevation
          onClick={onConfirm}
          disabled={deleting}
          startIcon={
            deleting ? (
              <CircularProgress size={12} color="inherit" />
            ) : undefined
          }
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '7px' }}
        >
          {t('workspaceEditor.canvases.delete', 'Eliminar')}
        </Button>
      </Box>
    </Box>
  );
};
