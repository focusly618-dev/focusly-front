import React, { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  useTheme,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import { Excalidraw, hashElementsVersion } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { AppState } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { notify, getFriendlyErrorMessage } from '@/utils';
import { surfaceColor } from '@/context';
import { GET_CANVAS, UPDATE_CANVAS } from '@/pages/Workspace/Canvas.graphql';
import type { Canvas, UpdateCanvasInput } from '@/pages/Workspace/canvas.types';
import { toSavedAppState } from './canvasScene.utils';

// Excalidraw reports every pointer move; saves wait for this much quiet.
const SAVE_DEBOUNCE_MS = 1500;

interface EditorCanvasProps {
  /** Name and icon are shown and edited in the editor's header; saved here. */
  title: string;
  icon: string | null;
  /** Hands over the saved name and icon once the canvas loads. */
  onLoaded: (name: string, icon: string | null) => void;
  onClose: () => void;
  canvasId: string | null;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  title,
  icon,
  onLoaded,
  onClose,
  canvasId,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Always from the network: autosaves don't return the scene, so a cached
  // copy would be the one from when the canvas was last opened.
  const { data, loading, error } = useQuery<{ canvas: Canvas }>(GET_CANVAS, {
    variables: { id: canvasId },
    skip: !canvasId,
    fetchPolicy: 'network-only',
  });
  const canvas = data?.canvas;

  const [updateCanvasMutation] = useMutation(UPDATE_CANVAS, {
    fetchPolicy: 'no-cache',
  });

  // ── Autosave: changes pile up in `pending` and go out after a pause, or
  // right away when the canvas closes.
  const pending = useRef<UpdateCanvasInput | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const lastSceneVersion = useRef<number | null>(null);

  const flush = useCallback(() => {
    clearTimeout(saveTimer.current);
    const input = pending.current;
    if (!input) return;
    pending.current = null;
    updateCanvasMutation({ variables: { input } }).catch((e) => {
      notify.error({
        title: 'No se pudo guardar el canvas',
        description: getFriendlyErrorMessage(e, 'Se reintentará al editar.'),
      });
      // Back in line, under any newer change, so the next save carries it.
      pending.current = { ...input, ...pending.current };
    });
  }, [updateCanvasMutation]);

  const scheduleSave = useCallback(
    (changes: Omit<UpdateCanvasInput, 'id'>) => {
      if (!canvasId) return;
      pending.current = { ...pending.current, ...changes, id: canvasId };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
    },
    [canvasId, flush],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', flush);
    return () => {
      window.removeEventListener('beforeunload', flush);
      flush();
    };
  }, [flush]);

  // A rename or new icon from the header goes out with the next save.
  // Declared before the effect below on purpose: on the render the canvas
  // arrives, this one runs first, while `saved` is still unset, so the link's
  // (maybe stale) text shown until then is never saved over the real values.
  const saved = useRef<{ name: string; icon: string | null } | null>(null);
  useEffect(() => {
    if (!saved.current) return;
    const changes: Omit<UpdateCanvasInput, 'id'> = {};
    const name = title.trim();
    if (name && name !== saved.current.name) changes.name = name;
    if (icon && icon !== saved.current.icon) changes.icon = icon;
    if (!changes.name && !changes.icon) return;
    saved.current = { ...saved.current, ...changes };
    scheduleSave(changes);
  }, [title, icon, scheduleSave]);

  // The saved name and icon win over the link's text, which may be outdated.
  useEffect(() => {
    if (canvas) {
      saved.current = { name: canvas.name, icon: canvas.icon };
      onLoaded(canvas.name, canvas.icon);
      lastSceneVersion.current = hashElementsVersion(
        canvas.data?.elements ?? [],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas?.id]);

  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState) => {
      // Scrolling, zooming and selecting don't change the version; only
      // edits to the drawing are worth a save.
      const version = hashElementsVersion(elements);
      if (version === lastSceneVersion.current) return;
      lastSceneVersion.current = version;
      scheduleSave({
        data: {
          elements: elements.filter((el) => !el.isDeleted),
          appState: toSavedAppState(appState),
        },
      });
    },
    [scheduleSave],
  );

  const renderBody = () => {
    if (loading) {
      return (
        <Box sx={centeredSx}>
          <CircularProgress size={28} />
        </Box>
      );
    }
    if (!canvasId || error || !canvas) {
      return (
        <Box sx={centeredSx}>
          <Typography variant="body1" fontWeight={600}>
            No se encontró este canvas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Puede que se haya borrado, o que el link sea de antes de que los
            canvas se guardaran.
          </Typography>
          <Button variant="outlined" onClick={onClose} sx={{ mt: 1 }}>
            Volver al documento
          </Button>
        </Box>
      );
    }
    return (
      <Excalidraw
        key={canvas.id}
        theme={isDark ? 'dark' : 'light'}
        onChange={handleChange}
        initialData={{
          elements: canvas.data?.elements ?? [],
          appState: {
            viewBackgroundColor: 'transparent',
            ...canvas.data?.appState,
            theme: isDark ? 'dark' : 'light',
          },
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 480,
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        bgcolor: surfaceColor(theme, '#121212', '#1F1F20', '#ffffff'),
        animation: 'fadeIn 0.25s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      {renderBody()}
    </Box>
  );
};

const centeredSx = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  px: 3,
  textAlign: 'center',
} as const;
