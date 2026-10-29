import { useCallback, useEffect, useRef } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { exportToBlob } from '@excalidraw/excalidraw';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import {
  CREATE_CANVAS_PREVIEW_UPLOAD,
  REMOVE_CANVAS_PREVIEW,
} from '@/pages/Workspace/Canvas.graphql';

// A picture is drawn once the drawing has been left alone this long, and
// right away when the canvas closes.
const PREVIEW_DEBOUNCE_MS = 4000;
// Its longest side: sharp on a card, a few dozen KB to store
export const PREVIEW_MAX_SIZE = 480;

export interface PreviewScene {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
}

/** A small picture of the drawing, as the bucket keeps it for its card. On
 * a white background, in light colors (the ones the drawing is saved in),
 * whatever the theme the canvas is shown in. Null when there's nothing drawn. */
export const renderCanvasPreview = async ({
  elements,
  appState,
  files,
}: PreviewScene): Promise<Blob | null> => {
  const drawn = elements.filter((el) => !el.isDeleted);
  if (drawn.length === 0) return null;
  return exportToBlob({
    elements: drawn,
    appState: {
      ...appState,
      exportBackground: true,
      viewBackgroundColor: '#ffffff',
      exportWithDarkMode: false,
    },
    files,
    // WebP where the browser can write it; Safari hands back PNG instead
    mimeType: 'image/webp',
    quality: 0.85,
    maxWidthOrHeight: PREVIEW_MAX_SIZE,
    exportPadding: 16,
  });
};

/**
 * Keeps the canvas's preview up to date as it's drawn on. Returns the
 * function to call on each change to the drawing. Failures stay quiet: the
 * card then just shows the previous picture, or the icon.
 */
export const useCanvasPreview = (canvasId: string | null) => {
  const client = useApolloClient();
  const [createUpload] = useMutation<{
    createCanvasPreviewUpload: { uploadUrl: string };
  }>(CREATE_CANVAS_PREVIEW_UPLOAD, { fetchPolicy: 'no-cache' });
  const [removePreview] = useMutation(REMOVE_CANVAS_PREVIEW, {
    fetchPolicy: 'no-cache',
  });

  const pending = useRef<PreviewScene | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const publish = useCallback(async () => {
    clearTimeout(timer.current);
    const scene = pending.current;
    if (!scene || !canvasId) return;
    pending.current = null;
    try {
      const blob = await renderCanvasPreview(scene);
      if (!blob) {
        await removePreview({ variables: { canvasId } });
      } else {
        const { data } = await createUpload({
          variables: {
            input: { canvasId, mimeType: blob.type, size: blob.size },
          },
        });
        const url = data?.createCanvasPreviewUpload.uploadUrl;
        if (!url) throw new Error('No upload link');
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': blob.type },
          body: blob,
        });
        if (!response.ok) throw new Error(`Upload failed (${response.status})`);
      }
      // The document's cards and the header's list show the new picture
      await client.refetchQueries({ include: ['GetCanvasesByWorkspace'] });
    } catch (error) {
      console.warn('Could not update the canvas preview:', error);
    }
  }, [canvasId, client, createUpload, removePreview]);

  const schedule = useCallback(
    (scene: PreviewScene) => {
      pending.current = scene;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void publish(), PREVIEW_DEBOUNCE_MS);
    },
    [publish],
  );

  // Closing the canvas: what's left goes out now
  useEffect(() => () => void publish(), [publish]);

  return schedule;
};
