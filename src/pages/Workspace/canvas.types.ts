import type { AppState } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

/** The saved Excalidraw scene. Images (`files`) aren't stored yet. */
export interface CanvasData {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
}

export interface Canvas {
  id: string;
  name: string;
  /** An emoji shown before the name; null means the default one. */
  icon: string | null;
  workspaceId: string | null;
  /** Only filled when reading one canvas; null on lists and saves. */
  data: CanvasData | null;
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
