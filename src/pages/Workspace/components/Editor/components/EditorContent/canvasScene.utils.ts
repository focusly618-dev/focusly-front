import { convertToExcalidrawElements } from '@excalidraw/excalidraw';
import type { AppState } from '@excalidraw/excalidraw/types';
import type { Theme } from '@mui/material';
import { surfaceColor } from '@/context';
import type { CanvasData } from '@/pages/Workspace/canvas.types';

const MAX_CARD_TEXT_LENGTH = 240;

/** A new canvas's scene: empty, or one card holding the text it was made from. */
export const buildInitialCanvasData = (
  text: string,
  theme: Theme,
): CanvasData => {
  const isDark = theme.palette.mode === 'dark';
  const trimmed = text.trim();
  const appState = { viewBackgroundColor: 'transparent' };
  if (!trimmed) return { elements: [], appState };

  const cardText =
    trimmed.length > MAX_CARD_TEXT_LENGTH
      ? `${trimmed.slice(0, MAX_CARD_TEXT_LENGTH)}...`
      : trimmed;
  return {
    elements: convertToExcalidrawElements([
      {
        type: 'rectangle',
        x: 120,
        y: 100,
        width: 340,
        height: 180,
        backgroundColor: surfaceColor(theme, '#1e293b', '#2A2A2C', '#f0f9ff'),
        strokeColor: '#0ea5e9',
        fillStyle: 'solid',
        roundness: { type: 3 },
      },
      {
        type: 'text',
        x: 140,
        y: 120,
        text: cardText,
        fontSize: 16,
        strokeColor: isDark ? '#f8fafc' : '#0f172a',
      },
    ]),
    appState,
  };
};

/** The part of the app state worth saving: the view, not selections or tools.
 * The theme is left out so a canvas follows the app's light/dark mode. */
export const toSavedAppState = (appState: AppState): Partial<AppState> => ({
  viewBackgroundColor: appState.viewBackgroundColor,
  gridModeEnabled: appState.gridModeEnabled,
  scrollX: appState.scrollX,
  scrollY: appState.scrollY,
  zoom: appState.zoom,
});
