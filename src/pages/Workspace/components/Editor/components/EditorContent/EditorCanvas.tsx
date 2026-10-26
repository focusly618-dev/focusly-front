import React, { useCallback, useMemo, useRef } from 'react';
import { Box, useTheme, InputBase, Chip, alpha, Tooltip } from '@mui/material';
import {
  Excalidraw,
  convertToExcalidrawElements,
} from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { AutoflowIcon } from '@/components/ui';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

interface EditorCanvasProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  onClose: () => void;
  initialText?: string;
  projectId?: string | null;
  canvasId?: string | null;
  canvasName?: string;
}

export interface Canvas {
  id: string;
  projectId: string;
  name: string;
  data: CanvasData;
  createdAt: string;
  updatedAt: string;
}
export interface CanvasData {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
}

export interface CreateCanvasRequest {
  projectId: string | null;
  name: string;
  data: CanvasData;
}

export interface UpdateCanvasRequest {
  name?: string;
  data?: CanvasData;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  title,
  onTitleChange,
  initialText,
  projectId,
  canvasId,
  canvasName,
}) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    async (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => {
      const payload = {
        projectId,
        name: canvasName,
        data: {
          elements,
          appState: {
            theme: appState.theme,
            viewBackgroundColor: appState.viewBackgroundColor,
            gridModeEnabled: appState.gridModeEnabled,
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom,
          },
          files,
        },
      };

      // Sustituir por tu función de guardado con debounce.
      console.log('Canvas ID:', canvasId);
      console.log('Payload:', payload);
    },
    [canvasId, canvasName, projectId],
  );
  // Convert initialText into a sleek starting card element on the canvas
  const initialElements = useMemo(() => {
    if (!initialText || initialText.trim().length === 0) return [];
    try {
      const isDark = theme.palette.mode === 'dark';
      const truncatedText =
        initialText.length > 240
          ? `${initialText.slice(0, 240)}...`
          : initialText;

      return convertToExcalidrawElements([
        {
          type: 'rectangle',
          x: 120,
          y: 100,
          width: 340,
          height: 180,
          backgroundColor: isDark ? '#1e293b' : '#f0f9ff',
          strokeColor: '#0ea5e9',
          fillStyle: 'solid',
          roundness: { type: 3 },
        },
        {
          type: 'text',
          x: 140,
          y: 120,
          text: truncatedText,
          fontSize: 16,
          strokeColor: isDark ? '#f8fafc' : '#0f172a',
        },
      ]);
    } catch {
      return [];
    }
  }, [initialText, theme.palette.mode]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        animation: 'fadeIn 0.25s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* ── Top Bar: Title & Controls ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1.5,
        }}
      >
        {/* Title & Icon Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: 1,
            minWidth: 260,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: alpha('#0ea5e9', 0.12),
              color: '#0ea5e9',
              flexShrink: 0,
            }}
          >
            <AutoflowIcon sx={{ fontSize: 22 }} />
          </Box>

          <Tooltip
            title="Click para editar el nombre del Canvas"
            placement="top"
          >
            <InputBase
              inputRef={inputRef}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Nombre del Canvas..."
              autoFocus
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                fontWeight: 700,
                color: 'text.primary',
                flex: 1,
                borderRadius: '8px',
                px: 1,
                py: 0.25,
                transition: 'background-color 0.15s, box-shadow 0.15s',
                '&:hover': {
                  bgcolor: alpha(theme.palette.text.primary, 0.04),
                },
                '&.Mui-focused': {
                  bgcolor: alpha(theme.palette.text.primary, 0.06),
                  boxShadow: `0 0 0 2px ${alpha('#0ea5e9', 0.35)}`,
                },
              }}
            />
          </Tooltip>

          <Chip
            size="small"
            label="Canvas View"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              fontWeight: 600,
              fontSize: '11px',
              bgcolor: alpha('#0ea5e9', 0.12),
              color: '#0ea5e9',
              border: `1px solid ${alpha('#0ea5e9', 0.2)}`,
            }}
          />
        </Box>
      </Box>

      {/* ── Excalidraw Canvas Area ── */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 'calc(100vh - 220px)', md: 'calc(100vh - 200px)' },
          minHeight: '620px',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 10px 40px rgba(0, 0, 0, 0.5)'
              : '0 8px 30px rgba(0, 0, 0, 0.06)',
          position: 'relative',
          bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        }}
      >
        <Excalidraw
          theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
          onChange={handleChange}
          initialData={{
            elements: initialElements,
            appState: {
              theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
              viewBackgroundColor: 'transparent',
            },
          }}
        />
      </Box>
    </Box>
  );
};
