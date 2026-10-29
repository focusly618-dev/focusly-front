import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTheme, CircularProgress, Typography, Button } from '@mui/material';
import { Excalidraw, hashElementsVersion } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { notify, getFriendlyErrorMessage } from '@/utils';
import { GET_CANVAS, UPDATE_CANVAS } from '@/pages/Workspace/Canvas.graphql';
import type {
  Canvas,
  CanvasData,
  UpdateCanvasInput,
} from '@/pages/Workspace/canvas.types';
import { toSavedAppState } from './canvasScene.utils';
import { CanvasCentered, CanvasFrame } from './CanvasLoading';
import { useCanvasFiles } from './useCanvasFiles.hook';
import { useCanvasPreview } from './useCanvasPreview.hook';
import {
  canvasLimitError,
  useCanvasLimitNotice,
  useCanvasReadOnly,
} from './canvasPlan';
import { CanvasReadOnlyNotice } from './CanvasReadOnlyNotice';
import { useBilling } from '@/hooks/useBilling';

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

  // On a phone the canvas is only looked at: nothing is saved from there
  const readOnly = useCanvasReadOnly();
  const { canvasLimits } = useBilling();
  const canvasLimitNotice = useCanvasLimitNotice();
  // Said once while the canvas stays over its plan's size, not on every save
  const toldTooLarge = useRef(false);

  const flush = useCallback(() => {
    clearTimeout(saveTimer.current);
    const input = pending.current;
    if (!input) return;
    pending.current = null;
    updateCanvasMutation({ variables: { input } })
      .then(() => {
        toldTooLarge.current = false;
      })
      .catch((e) => {
        const limit = canvasLimitError(e);
        if (limit) {
          if (!toldTooLarge.current) canvasLimitNotice(limit);
          toldTooLarge.current = true;
          // Kept: once the drawing is back under the limit, it saves
          pending.current = { ...input, ...pending.current };
          return;
        }
        notify.error({
          title: 'No se pudo guardar el canvas',
          description: getFriendlyErrorMessage(e, 'Se reintentará al editar.'),
        });
        // Back in line, under any newer change, so the next save carries it.
        pending.current = { ...input, ...pending.current };
      });
  }, [updateCanvasMutation, canvasLimitNotice]);

  const scheduleSave = useCallback(
    (changes: Omit<UpdateCanvasInput, 'id'>) => {
      if (!canvasId) return;
      pending.current = { ...pending.current, ...changes, id: canvasId };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
    },
    [canvasId, flush],
  );

  // ── Images: stored in the bucket as they're pasted; the scene saves which
  // ones it uses, so a finished upload saves the scene again.
  const lastScene = useRef<Pick<CanvasData, 'elements' | 'appState'>>({
    elements: [],
    appState: {},
  });
  const onImageStored = useRef(() => {});
  const images = useCanvasFiles({
    canvasId,
    onStored: useCallback(() => onImageStored.current(), []),
    maxImageBytes: canvasLimits?.max_image_bytes,
    onPlanLimit: canvasLimitNotice,
  });
  // The small picture of the drawing its card shows
  const schedulePreview = useCanvasPreview(canvasId);

  const saveScene = useCallback(() => {
    scheduleSave({
      data: { ...lastScene.current, files: images.storedFiles() },
    });
  }, [scheduleSave, images]);
  useEffect(() => {
    onImageStored.current = saveScene;
  }, [saveScene]);

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
      lastScene.current = {
        elements: canvas.data?.elements ?? [],
        appState: canvas.data?.appState ?? {},
      };
      images.resetStored(canvas.data?.files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas?.id]);

  // Once both the scene and Excalidraw are ready, its stored images come in
  const [excalidraw, setExcalidraw] = useState<ExcalidrawImperativeAPI | null>(
    null,
  );
  useEffect(() => {
    if (excalidraw && canvas) void images.loadStoredImages(excalidraw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidraw, canvas?.id]);

  const handleChange = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => {
      if (readOnly) return;
      images.storeNewImages(elements, files);
      // Scrolling, zooming and selecting don't change the version; only
      // edits to the drawing are worth a save.
      const version = hashElementsVersion(elements);
      if (version === lastSceneVersion.current) return;
      lastSceneVersion.current = version;
      lastScene.current = {
        elements: elements.filter((el) => !el.isDeleted),
        appState: toSavedAppState(appState),
      };
      saveScene();
      schedulePreview({
        elements,
        appState: lastScene.current.appState,
        files,
      });
    },
    [images, saveScene, schedulePreview, readOnly],
  );

  const renderBody = () => {
    if (loading) {
      return (
        <CanvasCentered>
          <CircularProgress size={28} />
        </CanvasCentered>
      );
    }
    if (!canvasId || error || !canvas) {
      return (
        <CanvasCentered>
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
        </CanvasCentered>
      );
    }
    return (
      <>
        <Excalidraw
          key={canvas.id}
          viewModeEnabled={readOnly}
          theme={isDark ? 'dark' : 'light'}
          onChange={handleChange}
          excalidrawAPI={setExcalidraw}
          initialData={{
            elements: canvas.data?.elements ?? [],
            appState: {
              viewBackgroundColor: 'transparent',
              ...canvas.data?.appState,
              theme: isDark ? 'dark' : 'light',
            },
          }}
        />
        {readOnly && <CanvasReadOnlyNotice />}
      </>
    );
  };

  return <CanvasFrame>{renderBody()}</CanvasFrame>;
};
