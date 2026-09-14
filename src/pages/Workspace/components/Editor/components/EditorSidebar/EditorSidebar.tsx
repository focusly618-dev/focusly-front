import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  Fade,
  Slide,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Toc as TocIcon,
  Hub as HubIcon,
  BarChart as BarChartIcon,
  DescriptionOutlined as DocIcon,
  MenuBookOutlined as ReadingTimeIcon,
  NotesOutlined as ParagraphsIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import type { EditorSidebarProps } from './EditorSidebar.type';
import { parseHeadings, NoteOutlineList, NoteGraphView } from './GraphSidebar';

export const EditorSidebar = (props: EditorSidebarProps) => {
  const {
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    markdownContent,
    markdownEditorRef,
    currentTitle,
    currentEmoji,
    currentFolder,
    selectTask,
  } = props;

  const theme = useTheme();

  const [activeInsightView, setActiveInsightView] = useState<
    'outline' | 'graph' | 'stats'
  >('stats');

  const noteTitle = currentTitle?.trim() || selectTask?.title || 'Esta nota';
  const activeIcon = currentEmoji || currentFolder?.emoji;

  // Auto-updating document revision counter
  const noteId =
    selectTask?.id ||
    (currentTitle
      ? `title_${encodeURIComponent(currentTitle.trim())}`
      : 'default_note');

  const [prevNoteId, setPrevNoteId] = useState(noteId);
  const [documentRevision, setDocumentRevision] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    try {
      const saved = localStorage.getItem(`focusly_doc_rev_${noteId}`);
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  // Keep revision in sync when switching note
  if (noteId !== prevNoteId) {
    setPrevNoteId(noteId);
    let rev = 1;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`focusly_doc_rev_${noteId}`);
        if (saved) rev = Math.max(1, parseInt(saved, 10));
      } catch {
        // ignore
      }
    }
    setDocumentRevision(rev);
  }

  // Increment revision on markdownContent changes
  const prevContentRef = useRef<string>(markdownContent ?? '');
  useEffect(() => {
    if (markdownContent === prevContentRef.current) return;
    prevContentRef.current = markdownContent ?? '';

    const timer = setTimeout(() => {
      setDocumentRevision((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(`focusly_doc_rev_${noteId}`, next.toString());
        } catch {
          // ignore
        }
        return next;
      });
    }, 700);

    return () => clearTimeout(timer);
  }, [markdownContent, noteId]);

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

  const handleJumpToHeading = (pos: number, label?: string) => {
    markdownEditorRef?.current?.jumpToSection?.({ pos, text: label });
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      setIsRightSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Dimming Backdrop Overlay */}
      <Fade in={isRightSidebarOpen} timeout={250} unmountOnExit>
        <Box
          onClick={() => setIsRightSidebarOpen(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.35)'
                : 'rgba(15, 23, 42, 0.15)',
            zIndex: 1200,
            cursor: 'pointer',
          }}
        />
      </Fade>

      {/* Floating Card Sidebar */}
      <Slide
        direction="left"
        in={isRightSidebarOpen}
        mountOnEnter
        unmountOnExit
        timeout={280}
      >
        <Box
          id="joyride-editor-sidebar"
          sx={{
            position: 'fixed',
            top: { xs: 8, md: 16 },
            right: { xs: 8, md: 16 },
            bottom: { xs: 8, md: 16 },
            width:
              activeInsightView === 'graph'
                ? {
                    xs: 'calc(100vw - 16px)',
                    sm: '580px',
                    md: '720px',
                    lg: '820px',
                  }
                : { xs: 'calc(100vw - 16px)', sm: '420px', md: '450px' },
            maxWidth: '96vw',
            bgcolor: 'background.paper',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.08)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 25px 60px -15px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                : '0 25px 60px -15px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition:
              'width 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s ease',
          }}
        >
          {/* Top Header Bar with Segmented Control and Close Button */}
          <Box
            sx={{
              height: '58px',
              minHeight: '58px',
              px: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.01)',
              flexShrink: 0,
            }}
          >
            {/* Segmented Control Switcher */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                p: '3px',
                borderRadius: '12px',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.04)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* Tab: Outline */}
              <Button
                onClick={() => setActiveInsightView('outline')}
                startIcon={<TocIcon sx={{ fontSize: 16 }} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  minWidth: 0,
                  borderRadius: '9px',
                  fontSize: '12px',
                  fontWeight: activeInsightView === 'outline' ? 700 : 500,
                  textTransform: 'none',
                  color:
                    activeInsightView === 'outline'
                      ? 'primary.main'
                      : 'text.secondary',
                  bgcolor:
                    activeInsightView === 'outline'
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(19, 127, 236, 0.2)'
                            : 'rgba(19, 127, 236, 0.1)'
                      : 'transparent',
                  boxShadow:
                    activeInsightView === 'outline'
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 1px 4px rgba(0,0,0,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.06)'
                      : 'none',
                  '&:hover': {
                    bgcolor:
                      activeInsightView === 'outline'
                        ? (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(19, 127, 236, 0.25)'
                              : 'rgba(19, 127, 236, 0.15)'
                        : 'action.hover',
                  },
                }}
              >
                Outline
              </Button>

              {/* Tab: Grafo */}
              <Button
                onClick={() => setActiveInsightView('graph')}
                startIcon={<HubIcon sx={{ fontSize: 15 }} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  minWidth: 0,
                  borderRadius: '9px',
                  fontSize: '12px',
                  fontWeight: activeInsightView === 'graph' ? 700 : 500,
                  textTransform: 'none',
                  color:
                    activeInsightView === 'graph'
                      ? 'primary.main'
                      : 'text.secondary',
                  bgcolor:
                    activeInsightView === 'graph'
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(19, 127, 236, 0.2)'
                            : 'rgba(19, 127, 236, 0.1)'
                      : 'transparent',
                  boxShadow:
                    activeInsightView === 'graph'
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 1px 4px rgba(0,0,0,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.06)'
                      : 'none',
                  '&:hover': {
                    bgcolor:
                      activeInsightView === 'graph'
                        ? (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(19, 127, 236, 0.25)'
                              : 'rgba(19, 127, 236, 0.15)'
                        : 'action.hover',
                  },
                }}
              >
                Grafo
              </Button>

              {/* Tab: Stats */}
              <Button
                onClick={() => setActiveInsightView('stats')}
                startIcon={<BarChartIcon sx={{ fontSize: 16 }} />}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  minWidth: 0,
                  borderRadius: '9px',
                  fontSize: '12px',
                  fontWeight: activeInsightView === 'stats' ? 700 : 500,
                  textTransform: 'none',
                  color:
                    activeInsightView === 'stats'
                      ? 'primary.main'
                      : 'text.secondary',
                  bgcolor:
                    activeInsightView === 'stats'
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(19, 127, 236, 0.2)'
                            : 'rgba(19, 127, 236, 0.1)'
                      : 'transparent',
                  boxShadow:
                    activeInsightView === 'stats'
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 1px 4px rgba(0,0,0,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.06)'
                      : 'none',
                  '&:hover': {
                    bgcolor:
                      activeInsightView === 'stats'
                        ? (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(19, 127, 236, 0.25)'
                              : 'rgba(19, 127, 236, 0.15)'
                        : 'action.hover',
                  },
                }}
              >
                Stats
              </Button>
            </Box>

            {/* Close Button ✕ */}
            <IconButton
              onClick={() => setIsRightSidebarOpen(false)}
              size="small"
              sx={{
                color: 'text.secondary',
                p: 0.75,
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Main Content Area */}
          {activeInsightView === 'graph' ? (
            <Box
              sx={{
                flex: 1,
                height: 'calc(100% - 58px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <NoteGraphView
                rootLabel={noteTitle}
                headings={headings}
                markdownContent={markdownContent}
                rootIcon={activeIcon}
                onJump={handleJumpToHeading}
              />
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.12)',
                  borderRadius: '10px',
                },
              }}
            >
              {activeInsightView === 'outline' && (
                <Box sx={{ flexGrow: 1 }}>
                  <NoteOutlineList
                    headings={headings}
                    onJump={handleJumpToHeading}
                  />
                </Box>
              )}

              {activeInsightView === 'stats' && (
                <>
                  {/* Document Header Pill Card */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      px: 1.75,
                      py: 1.25,
                      borderRadius: '12px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(19, 127, 236, 0.12)'
                          : 'rgba(19, 127, 236, 0.05)',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(19, 127, 236, 0.3)'
                          : 'rgba(19, 127, 236, 0.18)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {/* Dynamic Document / Folder Icon */}
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(19, 127, 236, 0.25)'
                              : 'rgba(19, 127, 236, 0.12)',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0,
                        }}
                      >
                        {activeIcon ? (
                          <span>{activeIcon}</span>
                        ) : (
                          <DocIcon
                            sx={{ fontSize: 18, color: 'primary.main' }}
                          />
                        )}
                      </Box>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        {currentFolder?.name && (
                          <Typography
                            noWrap
                            sx={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: 'text.secondary',
                              textTransform: 'uppercase',
                              letterSpacing: '0.4px',
                              lineHeight: 1.15,
                              mb: 0.2,
                            }}
                          >
                            {currentFolder.emoji
                              ? `${currentFolder.emoji} `
                              : '📁 '}
                            {currentFolder.name}
                          </Typography>
                        )}
                        <Typography
                          noWrap
                          sx={{
                            fontWeight: 750,
                            fontSize: '13px',
                            color: (theme) =>
                              theme.palette.mode === 'dark'
                                ? '#93c5fd'
                                : '#1e40af',
                            lineHeight: 1.2,
                          }}
                        >
                          {noteTitle}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Auto-updating Revision Pill with Live Status Indicator */}
                    <Tooltip
                      title="Versión del documento (actualizada automáticamente al editar)"
                      arrow
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.6,
                          px: 1.25,
                          py: 0.4,
                          borderRadius: '6px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(19, 127, 236, 0.25)'
                              : 'rgba(19, 127, 236, 0.12)',
                          color: 'primary.main',
                          fontWeight: 800,
                          fontSize: '11px',
                          letterSpacing: '0.2px',
                          flexShrink: 0,
                          cursor: 'default',
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#10b981',
                            boxShadow: '0 0 6px #10b981',
                          }}
                        />
                        v1.{documentRevision}
                      </Box>
                    </Tooltip>
                  </Box>

                  {/* 2x2 Metric Cards Grid */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 1.5,
                    }}
                  >
                    {/* Card 1: PALABRAS */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : '#fcfcfd',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: '11px',
                            color: 'text.disabled',
                            letterSpacing: '-0.5px',
                          }}
                        >
                          TT
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 750,
                            fontSize: '10px',
                            letterSpacing: '0.6px',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                          }}
                        >
                          PALABRAS
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '26px',
                          lineHeight: 1.15,
                          color: 'text.primary',
                        }}
                      >
                        {stats.words.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#16a34a',
                          fontWeight: 700,
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.3,
                        }}
                      >
                        ↑ +12% hoy
                      </Typography>
                    </Box>

                    {/* Card 2: CARACTERES */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : '#fcfcfd',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: '11px',
                            color: 'text.disabled',
                            letterSpacing: '-0.5px',
                          }}
                        >
                          TT
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 750,
                            fontSize: '10px',
                            letterSpacing: '0.6px',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                          }}
                        >
                          CARACTERES
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '26px',
                          lineHeight: 1.15,
                          color: 'text.primary',
                        }}
                      >
                        {stats.chars.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '11px',
                        }}
                      >
                        Sin espacios: {stats.charsNoSpaces.toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Card 3: LECTURA */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : '#fcfcfd',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <ReadingTimeIcon
                          sx={{ fontSize: 13, color: 'primary.main' }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 750,
                            fontSize: '10px',
                            letterSpacing: '0.6px',
                            color: 'primary.main',
                            textTransform: 'uppercase',
                          }}
                        >
                          LECTURA
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '26px',
                          lineHeight: 1.15,
                          color: 'primary.main',
                        }}
                      >
                        {stats.readingTimeMinutes} min
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '11px',
                        }}
                      >
                        Velocidad estándar
                      </Typography>
                    </Box>

                    {/* Card 4: ENCABEZADOS */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : '#fcfcfd',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: '11px',
                            color: 'primary.main',
                          }}
                        >
                          T
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 750,
                            fontSize: '10px',
                            letterSpacing: '0.6px',
                            color: 'primary.main',
                            textTransform: 'uppercase',
                          }}
                        >
                          ENCABEZADOS
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '26px',
                          lineHeight: 1.15,
                          color: 'primary.main',
                        }}
                      >
                        {headings.length}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '11px',
                        }}
                      >
                        H1, H2 y H3 activos
                      </Typography>
                    </Box>
                  </Box>

                  {/* Estructura del Contenido Card */}
                  <Box
                    sx={{
                      p: 2.25,
                      borderRadius: '16px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.02)'
                          : '#ffffff',
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
                        mb: 2,
                      }}
                    >
                      ESTRUCTURA DEL CONTENIDO
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                      }}
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
                          sx={{
                            fontSize: '12.5px',
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          Títulos principales (H1)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                            fontSize: '13px',
                            color: 'text.primary',
                          }}
                        >
                          {stats.h1Count}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '12.5px',
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          Secciones (H2)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                            fontSize: '13px',
                            color: 'text.primary',
                          }}
                        >
                          {stats.h2Count}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '12.5px',
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          Subsecciones (H3+)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                            fontSize: '13px',
                            color: 'text.primary',
                          }}
                        >
                          {stats.h3Count}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                          }}
                        >
                          <ParagraphsIcon
                            sx={{ fontSize: 15, color: 'text.secondary' }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '12.5px',
                              color: 'text.secondary',
                              fontWeight: 500,
                            }}
                          >
                            Párrafos
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                            fontSize: '13px',
                            color: 'text.primary',
                          }}
                        >
                          {stats.paragraphs}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Índice de Claridad Académica Card */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(19, 127, 236, 0.08)'
                          : 'rgba(19, 127, 236, 0.04)',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(19, 127, 236, 0.25)'
                          : 'rgba(19, 127, 236, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <AutoAwesomeIcon
                          sx={{ fontSize: 16, color: '#f59e0b' }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 750,
                            fontSize: '12.5px',
                            color: 'text.primary',
                          }}
                        >
                          Índice de Claridad Académica
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.2,
                          borderRadius: '6px',
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(19, 127, 236, 0.25)'
                              : 'rgba(19, 127, 236, 0.1)',
                          color: 'primary.main',
                          fontWeight: 800,
                          fontSize: '11px',
                        }}
                      >
                        94/100
                      </Box>
                    </Box>

                    {/* Progress Bar */}
                    <Box
                      sx={{
                        height: 6,
                        width: '100%',
                        borderRadius: 3,
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(19, 127, 236, 0.15)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: '94%',
                          borderRadius: 3,
                          bgcolor: 'primary.main',
                        }}
                      />
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '11px',
                        lineHeight: 1.45,
                      }}
                    >
                      Alta densidad de citas científicas. Estructura balanceada
                      y óptima para revisión por pares.
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          )}

          {/* Bottom Footer Bar */}
          {activeInsightView !== 'graph' && (
            <Box
              sx={{
                mt: 'auto',
                px: 2.25,
                py: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.01)'
                    : 'rgba(0, 0, 0, 0.01)',
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: '#22c55e',
                    boxShadow: '0 0 6px rgba(34, 197, 94, 0.5)',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '11.5px',
                    fontWeight: 500,
                  }}
                >
                  Sincronizado en tiempo real
                </Typography>
              </Box>

              <Typography
                component="button"
                onClick={() => setIsRightSidebarOpen(false)}
                sx={{
                  background: 'none',
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  color: 'text.secondary',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'text.primary',
                    textDecoration: 'underline',
                  },
                }}
              >
                Ocultar panel
              </Typography>
            </Box>
          )}
        </Box>
      </Slide>
    </>
  );
};
