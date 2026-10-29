import { useCallback, useMemo, useRef } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import type {
  BinaryFileData,
  BinaryFiles,
  DataURL,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { FileId } from '@excalidraw/excalidraw/element/types';
import { notify } from '@/utils';
import {
  CREATE_CANVAS_FILE_UPLOAD,
  GET_CANVAS_FILES,
} from '@/pages/Workspace/Canvas.graphql';
import type {
  CanvasFileLink,
  CanvasFileMeta,
} from '@/pages/Workspace/canvas.types';
import { canvasLimitError, type CanvasLimitCode } from './canvasPlan';
import {
  MAX_CANVAS_FILE_BYTES,
  blobToDataUrl,
  canvasFileProblem,
  dataUrlToBlob,
  imagesToStore,
} from './canvasFiles.utils';

/**
 * A canvas's images. Each one pasted in goes up to the bucket once (the
 * scene then keeps just its id, in `files`); on opening, the stored ones are
 * fetched back and handed to Excalidraw.
 */
export const useCanvasFiles = ({
  canvasId,
  onStored,
  maxImageBytes,
  onPlanLimit,
}: {
  canvasId: string | null;
  /** An image finished uploading: the scene's `files` should be saved. */
  onStored: () => void;
  /** The user's plan's limit, when known; the largest plan's otherwise. */
  maxImageBytes?: number;
  /** An image the plan doesn't cover: it isn't stored, nor tried again. */
  onPlanLimit?: (limit: { code: CanvasLimitCode; limit?: number }) => void;
}) => {
  const client = useApolloClient();
  const [createUpload] = useMutation<{
    createCanvasFileUpload: { uploadUrl: string };
  }>(CREATE_CANVAS_FILE_UPLOAD, { fetchPolicy: 'no-cache' });

  const stored = useRef<Record<string, CanvasFileMeta>>({});
  const uploading = useRef(new Set<string>());
  const refused = useRef(new Set<string>());

  /** The images the saved scene already has (on opening). */
  const resetStored = useCallback(
    (files: Record<string, CanvasFileMeta> | undefined) => {
      stored.current = { ...(files ?? {}) };
      uploading.current.clear();
      refused.current.clear();
    },
    [],
  );

  const upload = useCallback(
    async (file: BinaryFileData) => {
      if (!canvasId) return;
      const id = file.id as string;
      uploading.current.add(id);
      try {
        const blob = await dataUrlToBlob(file.dataURL);
        const problem = canvasFileProblem(file.mimeType, blob.size);
        if (
          !problem &&
          maxImageBytes !== undefined &&
          blob.size > maxImageBytes
        ) {
          refused.current.add(id);
          onPlanLimit?.({
            code: 'canvas_image_too_large',
            limit: maxImageBytes,
          });
          return;
        }
        if (problem) {
          refused.current.add(id);
          notify.warning({
            title: 'Esta imagen no se guardará',
            description:
              problem === 'type'
                ? 'Solo se guardan imágenes PNG, JPEG, GIF o WebP.'
                : `Las imágenes del canvas pueden pesar hasta ${MAX_CANVAS_FILE_BYTES / (1024 * 1024)} MB.`,
          });
          return;
        }
        const { data } = await createUpload({
          variables: {
            input: {
              canvasId,
              fileId: id,
              mimeType: file.mimeType,
              size: blob.size,
            },
          },
        });
        const url = data?.createCanvasFileUpload.uploadUrl;
        if (!url) throw new Error('No upload link');
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': file.mimeType },
          body: blob,
        });
        if (!response.ok) throw new Error(`Upload failed (${response.status})`);

        stored.current = {
          ...stored.current,
          [id]: { mimeType: file.mimeType, created: file.created },
        };
        onStored();
      } catch (error) {
        const limit = canvasLimitError(error);
        if (limit) {
          refused.current.add(id);
          onPlanLimit?.(limit);
          return;
        }
        // Left out of `stored`: the next change to the canvas retries it
        notify.error({
          title: 'No se pudo guardar una imagen',
          description: 'Se volverá a intentar al seguir editando.',
        });
      } finally {
        uploading.current.delete(id);
      }
    },
    [canvasId, createUpload, onStored, maxImageBytes, onPlanLimit],
  );

  /** Sends up any image the canvas shows that isn't stored yet. */
  const storeNewImages = useCallback(
    (elements: readonly ExcalidrawElement[], files: BinaryFiles) => {
      imagesToStore(
        elements,
        files,
        (id) =>
          id in stored.current ||
          uploading.current.has(id) ||
          refused.current.has(id),
      ).forEach((file) => void upload(file));
    },
    [upload],
  );

  /** Fetches the stored images back into the open canvas. */
  const loadStoredImages = useCallback(
    async (api: ExcalidrawImperativeAPI) => {
      if (!canvasId || Object.keys(stored.current).length === 0) return;
      try {
        const { data } = await client.query<{ canvasFiles: CanvasFileLink[] }>({
          query: GET_CANVAS_FILES,
          variables: { canvasId },
          fetchPolicy: 'no-cache',
        });
        const loaded = await Promise.all(
          data.canvasFiles.map(async (link) => {
            const response = await fetch(link.url);
            if (!response.ok) return null;
            return {
              id: link.id as FileId,
              mimeType: link.mimeType as BinaryFileData['mimeType'],
              dataURL: (await blobToDataUrl(await response.blob())) as DataURL,
              created: stored.current[link.id]?.created ?? Date.now(),
            };
          }),
        );
        api.addFiles(loaded.filter((f): f is BinaryFileData => f !== null));
      } catch {
        notify.error({
          title: 'No se pudieron cargar las imágenes del canvas',
          description: 'Vuelve a abrirlo para intentarlo de nuevo.',
        });
      }
    },
    [canvasId, client],
  );

  /** The stored images, as the scene's `files` to save. */
  const storedFiles = useCallback(() => stored.current, []);

  // Stable across renders, so the canvas's change handler is too
  return useMemo(
    () => ({ storedFiles, resetStored, storeNewImages, loadStoredImages }),
    [storedFiles, resetStored, storeNewImages, loadStoredImages],
  );
};
