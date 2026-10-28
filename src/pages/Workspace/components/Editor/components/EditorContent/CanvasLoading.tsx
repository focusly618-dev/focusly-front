import React from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { surfaceColor } from '@/context';

// Kept apart from EditorCanvas (and free of Excalidraw) so the editor can
// draw the canvas's frame and spinner while the drawing tool downloads.

/** The bordered area an open canvas fills. */
export const CanvasFrame = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
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
      {children}
    </Box>
  );
};

/** Centers a spinner or a message inside the canvas's frame. */
export const CanvasCentered = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      px: 3,
      textAlign: 'center',
    }}
  >
    {children}
  </Box>
);

/** The canvas's frame with a spinner: shown while it (or its scene) loads. */
export const CanvasLoading = () => (
  <CanvasFrame>
    <CanvasCentered>
      <CircularProgress size={28} />
    </CanvasCentered>
  </CanvasFrame>
);
