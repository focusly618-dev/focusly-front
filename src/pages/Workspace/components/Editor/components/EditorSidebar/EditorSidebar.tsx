import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Divider,
} from '@mui/material';
import {
  ChevronRight,
  ChevronLeft,
  Toc as TocIcon,
  Hub as HubIcon,
  BarChart as BarChartIcon,
  DescriptionOutlined as DocIcon,
  MenuBookOutlined as ReadingTimeIcon,
  TextFieldsOutlined as WordsIcon,
  TitleOutlined as HeadingIcon,
  NotesOutlined as ParagraphsIcon,
} from '@mui/icons-material';
import { ModernFolderFilledIcon } from '@/components/ui';
import {
  RightSidebar,
  SidebarHeaderTop,
  SidebarBody,
  DragHandle,
} from './EditorSidebar.styles';
import type { EditorSidebarProps } from './EditorSidebar.type';
import { parseHeadings, NoteOutlineList, NoteGraphView } from './GraphSidebar';

export const EditorSidebar = (props: EditorSidebarProps) => {
  const {
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    markdownContent,
    markdownEditorRef,
    currentTitle,
    currentFolder,
    selectTask,
  } = props;

  const theme = useTheme();

  const SIDEBAR_MIN = 300;
  const SIDEBAR_MAX = 380;
  const GRAPH_MIN = 340;
  const GRAPH_MAX = 1400;

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('workspace_sidebar_width');
    const width = saved ? parseInt(saved, 10) : 340;
    return Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, width));
  });

  const [graphPanelWidth, setGraphPanelWidth] = useState(() => {
    const saved = localStorage.getItem('workspace_sidebar_graph_width');
    const width = saved ? parseInt(saved, 10) : 700;
    return Math.max(GRAPH_MIN, Math.min(GRAPH_MAX, width));
  });

  const [isDragging, setIsDragging] = useState(false);
  const [activeInsightView, setActiveInsightView] = useState<
    'outline' | 'graph' | 'stats'
  >('outline');

  const isGraphView = activeInsightView === 'graph';
  const effectiveSidebarWidth = isGraphView ? graphPanelWidth : sidebarWidth;

  const headings = useMemo(
    () => parseHeadings(markdownContent ?? ''),
    [markdownContent],
  );

  const stats = useMemo(() => {
    const raw = markdownContent ?? '';
    const trimmed = raw.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = raw.length;
    const charsNoSpaces = raw.replace(/\s+/g, '').length;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    const h1Count = headings.filter((h) => h.level === 1).length;
    const h2Count = headings.filter((h) => h.level === 2).length;
    const h3Count = headings.filter((h) => h.level >= 3).length;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      : 0;

    return {
      words,
      chars,
      charsNoSpaces,
      readingTimeMinutes,
      h1Count,
      h2Count,
      h3Count,
      paragraphs,
    };
  }, [markdownContent, headings]);

  const handleJumpToHeading = (pos: number) => {
    markdownEditorRef?.current?.setCursor(pos);
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startWidth = effectiveSidebarWidth;
      const startX = e.clientX;
      const [min, max] = isGraphView
        ? [GRAPH_MIN, GRAPH_MAX]
        : [SIDEBAR_MIN, SIDEBAR_MAX];

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = startX - moveEvent.clientX;
        const newWidth = Math.max(min, Math.min(max, startWidth + deltaX));
        if (isGraphView) setGraphPanelWidth(newWidth);
        else setSidebarWidth(newWidth);
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [effectiveSidebarWidth, isGraphView],
  );

  useEffect(() => {
    localStorage.setItem('workspace_sidebar_width', String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem(
      'workspace_sidebar_graph_width',
      String(graphPanelWidth),
    );
  }, [graphPanelWidth]);

  const headerLabel =
    activeInsightView === 'outline'
      ? 'OUTLINE'
      : activeInsightView === 'graph'
        ? 'MAPA DE NOTAS'
        : 'ESTADÍSTICAS';

  const noteTitle = currentTitle?.trim() || selectTask?.title || 'Esta nota';

  return (
    <RightSidebar
      id="joyride-editor-sidebar"
      isOpen={isRightSidebarOpen}
      widthVal={effectiveSidebarWidth}
      isDragging={isDragging}
    >
      {isRightSidebarOpen && (
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <DragHandle
            isDragging={isDragging}
            onPointerDown={handlePointerDown}
          />
        </Box>
      )}

      <SidebarHeaderTop>
        {isRightSidebarOpen && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="caption"
              fontWeight={750}
              color="text.secondary"
              letterSpacing={1.2}
            >
              {headerLabel}
            </Typography>
          </Box>
        )}
        <Box display="flex" alignItems="center" gap={0.5}>
          {isRightSidebarOpen && (
            <>
              <Tooltip
                title="Outline — Índice de encabezados"
                placement="bottom"
              >
                <IconButton
                  size="small"
                  onClick={() => setActiveInsightView('outline')}
                  sx={{
                    color:
                      activeInsightView === 'outline'
                        ? theme.palette.primary.main
                        : 'text.secondary',
                    bgcolor:
                      activeInsightView === 'outline'
                        ? `${theme.palette.primary.main}15`
                        : 'transparent',
                    '&:hover': {
                      bgcolor:
                        activeInsightView === 'outline'
                          ? `${theme.palette.primary.main}22`
                          : theme.palette.action.hover,
                      color:
                        activeInsightView === 'outline'
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                    },
                  }}
                >
                  <TocIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Mapa de notas — Visualización de conexiones"
                placement="bottom"
              >
                <IconButton
                  size="small"
                  onClick={() => setActiveInsightView('graph')}
                  sx={{
                    color:
                      activeInsightView === 'graph'
                        ? theme.palette.primary.main
                        : 'text.secondary',
                    bgcolor:
                      activeInsightView === 'graph'
                        ? `${theme.palette.primary.main}15`
                        : 'transparent',
                    '&:hover': {
                      bgcolor:
                        activeInsightView === 'graph'
                          ? `${theme.palette.primary.main}22`
                          : theme.palette.action.hover,
                      color:
                        activeInsightView === 'graph'
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                    },
                  }}
                >
                  <HubIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Estadísticas del documento" placement="bottom">
                <IconButton
                  size="small"
                  onClick={() => setActiveInsightView('stats')}
                  sx={{
                    color:
                      activeInsightView === 'stats'
                        ? theme.palette.primary.main
                        : 'text.secondary',
                    bgcolor:
                      activeInsightView === 'stats'
                        ? `${theme.palette.primary.main}15`
                        : 'transparent',
                    '&:hover': {
                      bgcolor:
                        activeInsightView === 'stats'
                          ? `${theme.palette.primary.main}22`
                          : theme.palette.action.hover,
                      color:
                        activeInsightView === 'stats'
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                    },
                  }}
                >
                  <BarChartIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
          <IconButton
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: theme.palette.action.hover,
                color: theme.palette.text.primary,
              },
            }}
          >
            {isRightSidebarOpen ? (
              <ChevronRight sx={{ fontSize: 18 }} />
            ) : (
              <ChevronLeft />
            )}
          </IconButton>
        </Box>
      </SidebarHeaderTop>

      {isRightSidebarOpen && (
        <SidebarBody>
          {activeInsightView === 'outline' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
                <NoteOutlineList
                  headings={headings}
                  onJump={handleJumpToHeading}
                />
              </Box>
            </Box>
          )}

          {activeInsightView === 'graph' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
                <NoteGraphView
                  rootLabel={noteTitle}
                  headings={headings}
                  onJump={handleJumpToHeading}
                />
              </Box>
            </Box>
          )}

          {activeInsightView === 'stats' && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                height: '100%',
                overflowY: 'auto',
                pr: 0.5,
              }}
            >
              {/* Document Info Card */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.03)'
                      : 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DocIcon
                    sx={{
                      fontSize: 18,
                      color: 'primary.main',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      fontSize: '13px',
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {noteTitle}
                  </Typography>
                </Box>

                {currentFolder?.name && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1,
                      py: 0.4,
                      borderRadius: '8px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                      border: '1px solid',
                      borderColor: 'divider',
                      width: 'fit-content',
                    }}
                  >
                    <ModernFolderFilledIcon
                      sx={{
                        fontSize: 14,
                        color: currentFolder.color || 'primary.main',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        fontSize: '11px',
                        color: 'text.secondary',
                      }}
                    >
                      {currentFolder.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* 2x2 Metric Cards Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 1.5,
                }}
              >
                {/* Words */}
                <Box
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                  >
                    <WordsIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '0.5px',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                      }}
                    >
                      Palabras
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '18px',
                      lineHeight: 1.2,
                      color: 'text.primary',
                    }}
                  >
                    {stats.words.toLocaleString()}
                  </Typography>
                </Box>

                {/* Characters */}
                <Box
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                  >
                    <WordsIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '0.5px',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                      }}
                    >
                      Caracteres
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '18px',
                      lineHeight: 1.2,
                      color: 'text.primary',
                    }}
                  >
                    {stats.chars.toLocaleString()}
                  </Typography>
                </Box>

                {/* Reading Time */}
                <Box
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                  >
                    <ReadingTimeIcon
                      sx={{ fontSize: 14, color: 'info.main' }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '0.5px',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                      }}
                    >
                      Lectura
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '18px',
                      lineHeight: 1.2,
                      color: 'info.main',
                    }}
                  >
                    {stats.readingTimeMinutes} min
                  </Typography>
                </Box>

                {/* Headings */}
                <Box
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                  >
                    <HeadingIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        fontSize: '10px',
                        letterSpacing: '0.5px',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                      }}
                    >
                      Encabezados
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: '18px',
                      lineHeight: 1.2,
                      color: 'primary.main',
                    }}
                  >
                    {headings.length}
                  </Typography>
                </Box>
              </Box>

              {/* Structural Breakdown */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.03)'
                      : 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 750,
                    fontSize: '11px',
                    letterSpacing: '0.8px',
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 1.5,
                  }}
                >
                  Estructura del contenido
                </Typography>

                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '12.5px', color: 'text.secondary' }}
                    >
                      Títulos principales (H1)
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '12.5px',
                        color: 'text.primary',
                      }}
                    >
                      {stats.h1Count}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '12.5px', color: 'text.secondary' }}
                    >
                      Secciones (H2)
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '12.5px',
                        color: 'text.primary',
                      }}
                    >
                      {stats.h2Count}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '12.5px', color: 'text.secondary' }}
                    >
                      Subsecciones (H3+)
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '12.5px',
                        color: 'text.primary',
                      }}
                    >
                      {stats.h3Count}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                    >
                      <ParagraphsIcon
                        sx={{ fontSize: 15, color: 'text.secondary' }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontSize: '12.5px', color: 'text.secondary' }}
                      >
                        Párrafos
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: '12.5px',
                        color: 'text.primary',
                      }}
                    >
                      {stats.paragraphs}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </SidebarBody>
      )}
    </RightSidebar>
  );
};
