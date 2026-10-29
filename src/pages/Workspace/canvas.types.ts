import type { AppState } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

/** A stored image of a canvas: its bytes live in the bucket, not here. */
export interface CanvasFileMeta {
  mimeType: string;
  created: number;
}

/** The saved Excalidraw scene, with the images it uses (by id). */
export interface CanvasData {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files?: Record<string, CanvasFileMeta>;
}

/** A signed link to read one stored image. */
export interface CanvasFileLink {
  id: string;
  mimeType: string;
  url: string;
}

export interface Canvas {
  id: string;
  name: string;
  /** An emoji shown before the name; null means the default one. */
  icon: string | null;
  workspaceId: string | null;
  /** Only filled when reading one canvas; null on lists and saves. */
  data: CanvasData | null;
  /** On lists: a short-lived link to a small picture of the drawing, and
   * when that picture last changed. Null while it has none. */
  previewUrl?: string | null;
  previewAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCanvasInput {
  name: string;
  icon?: string;
  workspaceId: string | null;
  data?: CanvasData;
}

export interface UpdateCanvasInput {
  id: string;
  name?: string;
  icon?: string;
  data?: CanvasData;
}
