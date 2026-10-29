import type { BinaryFileData, BinaryFiles } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

// Images pasted into a canvas: what the bucket accepts (the server checks
// the same), which ones still need storing, and turning their data URLs
// into uploadable files and back.

export const CANVAS_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
];
export const MAX_CANVAS_FILE_BYTES = 10 * 1024 * 1024;

/** Why an image can't be stored, or null when it can. */
export const canvasFileProblem = (
  mimeType: string,
  size: number,
): 'type' | 'size' | null => {
  if (!CANVAS_FILE_TYPES.includes(mimeType)) return 'type';
  if (size <= 0 || size > MAX_CANVAS_FILE_BYTES) return 'size';
  return null;
};

/**
 * The images on the canvas that aren't stored yet: those its live image
 * elements show, that Excalidraw has the data of, and that `isHandled`
 * doesn't rule out (stored, on their way up, or refused).
 */
export const imagesToStore = (
  elements: readonly ExcalidrawElement[],
  files: BinaryFiles,
  isHandled: (fileId: string) => boolean,
): BinaryFileData[] => {
  const seen = new Set<string>();
  const out: BinaryFileData[] = [];
  for (const el of elements) {
    if (el.isDeleted || el.type !== 'image' || !el.fileId) continue;
    const id = el.fileId as string;
    const file = files[id];
    if (!file || seen.has(id) || isHandled(id)) continue;
    seen.add(id);
    out.push(file);
  }
  return out;
};

export const dataUrlToBlob = async (dataURL: string): Promise<Blob> =>
  (await fetch(dataURL)).blob();

export const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
