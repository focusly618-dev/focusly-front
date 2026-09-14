import { useMemo, useState, type ReactNode } from 'react';
import {
  Box,
  Button,
  Fade,
  IconButton,
  Slide,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BarChartOutlined as BarChartIcon,
  CalendarTodayOutlined as CalendarIcon,
  Close as CloseIcon,
  DescriptionOutlined as DocumentIcon,
  FlagOutlined as FlagIcon,
  HubOutlined as HubIcon,
  LinkOffOutlined as UnlinkIcon,
  NotesOutlined as ParagraphsIcon,
  PlayArrowRounded as PlayIcon,
  TocOutlined as TocIcon,
  TimerOutlined as TimerIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { getPriorityConfig } from '@/components/ui/PriorityBadge/priority.constants';
import type { EditorSidebarProps } from './EditorSidebar.type';
import { parseHeadings, NoteGraphView, NoteOutlineList } from './GraphSidebar';

type InsightView = 'outline' | 'graph' | 'stats';

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    Done: '#16a34a',
    Todo: '#2563eb',
    'To Do': '#2563eb',
    'In Progress': '#2563eb',
    Planning: '#7c3aed',
    Pending: '#d97706',
    'On Hold': '#dc2626',
    Review: '#0891b2',
    Backlog: '#64748b',
    Scheduled: '#7c3aed',
    Archived: '#64748b',
  };

  return colors[status || ''] || '#64748b';
};

const getStatusLabel = (status?: string) => {
  if (!status || status === 'Todo') return 'To do';
  return status;
};

const formatDeadline = (deadline?: string) => {
  if (!deadline) return 'Sin fecha';

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (left: Date, right: Date) =>
    left.getDate() === right.getDate() &&
    left.getMonth() === right.getMonth() &&
    left.getFullYear() === right.getFullYear();

  if (isSameDay(date, today)) return 'Hoy';
  if (isSameDay(date, tomorrow)) return 'Mañana';

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const formatEstimate = (minutes?: number) => {
  if (!minutes) return 'Sin estimación';
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
};

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
    linkedTasks,
    onStartFocus,
    activeFocusTaskId,
    onUnlinkTask,
    setShowPalette,
  } = props;

  const theme = useTheme();
  const [activeInsightView, setActiveInsightView] =
    useState<InsightView>('stats');

  const noteTitle =
    currentTitle?.trim() || selectTask?.title || 'Nota sin título';
  const activeIcon = currentEmoji || currentFolder?.emoji;
  const headings = useMemo(
    () => parseHeadings(markdownContent ?? ''),
    [markdownContent],
  );

  const stats = useMemo(() => {
    const raw = markdownContent ?? '';
    const trimmed = raw.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length
      : 0;

    return {
      words,
      chars: raw.length,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
      paragraphs,
      h1Count: headings.filter((heading) => heading.level === 1).length,
      h2Count: headings.filter((heading) => heading.level === 2).length,
      h3Count: headings.filter((heading) => heading.level >= 3).length,
    };
  }, [headings, markdownContent]);

  const handleJumpToHeading = (pos: number, label?: string) => {
    markdownEditorRef?.current?.jumpToSection?.({ pos, text: label });
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      setIsRightSidebarOpen(false);
    }
  };

  const viewTabs: { value: InsightView; label: string; icon: ReactNode }[] = [
    { value: 'outline', label: 'Índice', icon: <TocIcon fontSize="small" /> },
    { value: 'graph', label: 'Grafo', icon: <HubIcon fontSize="small" /> },
    {
      value: 'stats',
      label: 'Detalles',
      icon: <BarChartIcon fontSize="small" />,
    },
  ];

  const metrics = [
    { label: 'Palabras', value: stats.words.toLocaleString('es-MX') },
    { label: 'Caracteres', value: stats.chars.toLocaleString('es-MX') },
    { label: 'Lectura', value: `${stats.readingTimeMinutes} min` },
    { label: 'Encabezados', value: headings.length.toLocaleString('es-MX') },
  ];

  const tasksToList = useMemo(() => {
    if (linkedTasks && linkedTasks.length > 0) return linkedTasks;
    if (selectTask) return [selectTask];
    return [];
  }, [linkedTasks, selectTask]);

  return (
    <>
      <Fade in={isRightSidebarOpen} timeout={180} unmountOnExit>
        <Box
          aria-hidden="true"
          onClick={() => setIsRightSidebarOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: (currentTheme) =>
              currentTheme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.24)'
                : 'rgba(15, 23, 42, 0.1)',
            zIndex: 1200,
          }}
        />
      </Fade>

      <Slide
        direction="left"
        in={isRightSidebarOpen}
        mountOnEnter
        unmountOnExit
        timeout={220}
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
                ? { xs: 'calc(100vw - 16px)', sm: 580, md: 720, lg: 820 }
                : { xs: 'calc(100vw - 16px)', sm: 400, md: 420 },
            maxWidth: '96vw',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: { xs: 2, md: 3 },
            boxShadow: (currentTheme) =>
              currentTheme.palette.mode === 'dark'
                ? '0 16px 44px rgba(0, 0, 0, 0.42)'
                : '0 16px 44px rgba(15, 23, 42, 0.16)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.22s ease',
          }}
        >
          <Box
            sx={{
              minHeight: 56,
              px: 1.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          >
            <Box
              role="tablist"
              aria-label="Vistas del documento"
              sx={{ display: 'flex', alignSelf: 'stretch', gap: 0.25 }}
            >
              {viewTabs.map((tab) => {
                const isActive = activeInsightView === tab.value;

                return (
                  <Button
                    key={tab.value}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveInsightView(tab.value)}
                    startIcon={tab.icon}
                    sx={{
                      minWidth: 0,
                      px: { xs: 0.75, sm: 1 },
                      borderRadius: 0,
                      borderBottom: '2px solid',
                      borderColor: isActive ? 'primary.main' : 'transparent',
                      color: isActive ? 'text.primary' : 'text.secondary',
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      textTransform: 'none',
                      '& .MuiButton-startIcon': { mr: 0.5 },
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: isActive ? 'primary.main' : 'transparent',
                      },
                    }}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </Box>

            <IconButton
              aria-label="Cerrar panel"
              onClick={() => setIsRightSidebarOpen(false)}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {activeInsightView === 'graph' ? (
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
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
                p: 2,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: 4,
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.16)'
                      : 'rgba(15, 23, 42, 0.16)',
                },
              }}
            >
              {activeInsightView === 'outline' && (
                <NoteOutlineList
                  headings={headings}
                  documentTitle={noteTitle}
                  onJump={handleJumpToHeading}
                />
              )}

              {activeInsightView === 'stats' && (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        bgcolor: 'action.hover',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        fontSize: 18,
                      }}
                    >
                      {activeIcon || (
                        <DocumentIcon fontSize="small" color="action" />
                      )}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      {currentFolder?.name && (
                        <Typography
                          noWrap
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            display: 'block',
                            lineHeight: 1.3,
                          }}
                        >
                          {currentFolder.name}
                        </Typography>
                      )}
                      <Typography
                        noWrap
                        sx={{ fontSize: '14px', fontWeight: 700 }}
                      >
                        {noteTitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
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
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                          }}
                        >
                          TAREAS VINCULADAS
                        </Typography>
                        {tasksToList.length > 0 && (
                          <Box
                            sx={{
                              px: 0.75,
                              py: 0.15,
                              borderRadius: '9999px',
                              bgcolor: (t) =>
                                t.palette.mode === 'dark'
                                  ? 'rgba(255, 255, 255, 0.08)'
                                  : 'rgba(0, 0, 0, 0.06)',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: 'text.secondary',
                            }}
                          >
                            {tasksToList.length}
                          </Box>
                        )}
                      </Box>

                      <Button
                        size="small"
                        startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                        onClick={() => setShowPalette?.(true)}
                        sx={{
                          textTransform: 'none',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          py: 0.2,
                          px: 0.75,
                          minWidth: 0,
                          color: 'primary.main',
                        }}
                      >
                        Vincular
                      </Button>
                    </Box>

                    {tasksToList.length > 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {tasksToList.map((task) => {
                          const priority = getPriorityConfig(
                            task.priority_level,
                          );
                          const isFocusActive = Boolean(
                            activeFocusTaskId === task.id,
                          );
                          const statusColor = getStatusColor(task.status);
                          const statusLabel = getStatusLabel(task.status);

                          return (
                            <Box
                              key={task.id}
                              sx={{
                                border: '1px solid',
                                borderColor: isFocusActive
                                  ? 'primary.main'
                                  : 'divider',
                                borderRadius: 2,
                                overflow: 'hidden',
                                bgcolor: (t) =>
                                  isFocusActive
                                    ? t.palette.mode === 'dark'
                                      ? 'rgba(37, 99, 235, 0.08)'
                                      : 'rgba(37, 99, 235, 0.04)'
                                    : 'transparent',
                                transition: 'border-color 0.15s ease',
                              }}
                            >
                              <Box sx={{ p: 1.25 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.75,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: '50%',
                                        bgcolor: statusColor,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        fontSize: '11px',
                                      }}
                                    >
                                      {statusLabel}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      color: priority.color,
                                      fontSize: '11px',
                                      fontWeight: 700,
                                    }}
                                  >
                                    <FlagIcon sx={{ fontSize: 13 }} />
                                    {priority.label}
                                  </Box>
                                </Box>

                                <Typography
                                  sx={{
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    lineHeight: 1.35,
                                  }}
                                >
                                  {task.title}
                                </Typography>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                    mt: 0.75,
                                    color: 'text.secondary',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                    }}
                                  >
                                    <CalendarIcon sx={{ fontSize: 13 }} />
                                    <Typography
                                      variant="caption"
                                      sx={{ fontSize: '11px' }}
                                    >
                                      {formatDeadline(task.deadline)}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                    }}
                                  >
                                    <TimerIcon sx={{ fontSize: 13 }} />
                                    <Typography
                                      variant="caption"
                                      sx={{ fontSize: '11px' }}
                                    >
                                      {formatEstimate(task.estimate_timer)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              <Box
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  borderTop: '1px solid',
                                  borderColor: 'divider',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  bgcolor: (t) =>
                                    t.palette.mode === 'dark'
                                      ? 'rgba(255, 255, 255, 0.02)'
                                      : 'rgba(0, 0, 0, 0.01)',
                                }}
                              >
                                <Button
                                  size="small"
                                  variant={
                                    isFocusActive ? 'contained' : 'outlined'
                                  }
                                  startIcon={<PlayIcon sx={{ fontSize: 15 }} />}
                                  disabled={
                                    !onStartFocus ||
                                    isFocusActive ||
                                    task.status === 'Done'
                                  }
                                  onClick={() => onStartFocus?.(task)}
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '11px',
                                    py: 0.2,
                                    px: 1,
                                    boxShadow: 'none',
                                  }}
                                >
                                  {isFocusActive
                                    ? 'Focus activo'
                                    : 'Iniciar focus'}
                                </Button>

                                {onUnlinkTask && (
                                  <Tooltip title="Desvincular tarea">
                                    <IconButton
                                      aria-label="Desvincular tarea"
                                      size="small"
                                      onClick={() => onUnlinkTask(task)}
                                      sx={{ color: 'text.secondary', p: 0.5 }}
                                    >
                                      <UnlinkIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 1.75,
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', fontSize: '12.5px' }}
                        >
                          Sin tareas vinculadas
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                          onClick={() => setShowPalette?.(true)}
                          sx={{
                            textTransform: 'none',
                            fontSize: '11.5px',
                            flexShrink: 0,
                          }}
                        >
                          Vincular tarea
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                      }}
                    >
                      DOCUMENTO
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.75,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      {metrics.map((metric, index) => (
                        <Box
                          key={metric.label}
                          sx={{
                            p: 1.5,
                            borderRight: index % 2 === 0 ? '1px solid' : 'none',
                            borderBottom: index < 2 ? '1px solid' : 'none',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary' }}
                          >
                            {metric.label}
                          </Typography>
                          <Typography
                            sx={{ mt: 0.25, fontSize: '19px', fontWeight: 700 }}
                          >
                            {metric.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                      }}
                    >
                      ESTRUCTURA
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.75,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {[
                        ['Títulos principales', stats.h1Count],
                        ['Secciones', stats.h2Count],
                        ['Subsecciones', stats.h3Count],
                        ['Párrafos', stats.paragraphs],
                      ].map(([label, value], index) => (
                        <Box
                          key={label}
                          sx={{
                            minHeight: 38,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.75,
                            }}
                          >
                            {index === 3 ? (
                              <ParagraphsIcon
                                sx={{ fontSize: 15, color: 'text.secondary' }}
                              />
                            ) : index === 0 ? (
                              <DocumentIcon
                                sx={{ fontSize: 15, color: 'text.secondary' }}
                              />
                            ) : null}
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary' }}
                            >
                              {label}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Slide>
    </>
  );
};
