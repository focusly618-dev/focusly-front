import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Fade,
  IconButton,
  Menu,
  MenuItem,
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
  HubOutlined as HubIcon,
  LinkOffOutlined as UnlinkIcon,
  NotesOutlined as ParagraphsIcon,
  FlashOn as FlashOnIcon,
  TocOutlined as TocIcon,
  TimerOutlined as TimerIcon,
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import {
  PriorityBadge,
  PRIORITY_OPTIONS,
  getPriorityConfig,
} from '@/components/ui';
const EDITOR_TASK_STATUSES = [
  'Todo',
  'Planning',
  'Review',
  'Pending',
  'Done',
] as const;

import {
  getPriorityLevel,
  type PriorityType,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { TaskSearchItems } from '@/pages/Workspace/workspace.types';
import type { EditorSidebarProps } from './EditorSidebar.type';
import { parseHeadings, NoteGraphView, NoteOutlineList } from './GraphSidebar';

type InsightView = 'outline' | 'graph' | 'stats';

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    Done: '#10b981',
    Todo: '#008767',
    'To Do': '#008767',
    Backlog: '#008767',
    Planning: '#3b82f6',
    Scheduled: '#3b82f6',
    Review: '#06b6d4',
    'In Review': '#06b6d4',
    Pending: '#f59e0b',
    'On Hold': '#f59e0b',
    'In Progress': '#f59e0b',
    in_progress: '#f59e0b',
  };

  return colors[status || ''] || '#008767';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatusLabel = (status?: string, t?: any) => {
  if (!status || status === 'Todo' || status === 'Backlog') {
    return t ? t('tasks.status.todo', 'Por hacer') : 'Por hacer';
  }
  if (status === 'Planning' || status === 'Scheduled') {
    return t ? t('tasks.status.planning', 'Planificado') : 'Planificado';
  }
  if (status === 'Review' || status === 'in_review') {
    return t ? t('tasks.status.review', 'En revisión') : 'En revisión';
  }
  if (
    status === 'Pending' ||
    status === 'On Hold' ||
    status === 'in_progress' ||
    status === 'In Progress'
  ) {
    return t ? t('tasks.status.pending', 'Pendiente') : 'Pendiente';
  }
  if (status === 'Done' || status === 'completed') {
    return t ? t('tasks.status.done', 'Completada') : 'Completada';
  }
  return status;
};

const formatDeadline = (
  deadline?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t?: any,
  lang = 'es-MX',
) => {
  if (!deadline) return t ? t('tasks.noDueDate', 'Sin fecha') : 'Sin fecha';

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime()))
    return t ? t('tasks.noDueDate', 'Sin fecha') : 'Sin fecha';

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (left: Date, right: Date) =>
    left.getDate() === right.getDate() &&
    left.getMonth() === right.getMonth() &&
    left.getFullYear() === right.getFullYear();

  if (isSameDay(date, today)) return t ? t('tasks.dates.today', 'Hoy') : 'Hoy';
  if (isSameDay(date, tomorrow))
    return t ? t('tasks.dates.tomorrow', 'Mañana') : 'Mañana';

  return new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'short',
  }).format(date);
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
    handleUpdateTask,
    onStartFocus,
    activeFocusTaskId,
    onUnlinkTask,
    setShowPalette,
  } = props;

  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [activeInsightView, setActiveInsightView] =
    useState<InsightView>('stats');

  const [statusMenu, setStatusMenu] = useState<{
    anchorEl: HTMLElement;
    task: TaskSearchItems;
  } | null>(null);

  const [priorityMenu, setPriorityMenu] = useState<{
    anchorEl: HTMLElement;
    task: TaskSearchItems;
  } | null>(null);

  const [taskOverrides, setTaskOverrides] = useState<
    Record<string, Partial<TaskSearchItems>>
  >({});

  const handleUpdateTaskStatus = async (
    task: TaskSearchItems,
    newStatus: string,
  ) => {
    setStatusMenu(null);
    setTaskOverrides((prev) => ({
      ...prev,
      [task.id]: {
        ...prev[task.id],
        status: newStatus as TaskSearchItems['status'],
      },
    }));
    try {
      await handleUpdateTask?.(task.id, {
        status: newStatus as TaskSearchItems['status'],
      });
    } catch (error) {
      console.error('Failed to update task status in sidebar', error);
    }
  };

  const handleUpdateTaskPriority = async (
    task: TaskSearchItems,
    newLevel: number,
  ) => {
    setPriorityMenu(null);
    setTaskOverrides((prev) => ({
      ...prev,
      [task.id]: {
        ...prev[task.id],
        priority_level: newLevel,
      },
    }));
    try {
      await handleUpdateTask?.(task.id, { priority_level: newLevel });
    } catch (error) {
      console.error('Failed to update task priority in sidebar', error);
    }
  };

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
    {
      value: 'outline',
      label: t('workspaceEditor.sidebar.outline', 'Índice'),
      icon: <TocIcon fontSize="small" />,
    },
    {
      value: 'graph',
      label: t('workspaceEditor.sidebar.graph', 'Grafo'),
      icon: <HubIcon fontSize="small" />,
    },
    {
      value: 'stats',
      label: t('workspaceEditor.sidebar.details', 'Detalles'),
      icon: <BarChartIcon fontSize="small" />,
    },
  ];

  const metrics = [
    {
      label: t('workspaceEditor.sidebar.words', 'Palabras'),
      value: stats.words.toLocaleString(i18n.language),
    },
    {
      label: t('workspaceEditor.sidebar.characters', 'Caracteres'),
      value: stats.chars.toLocaleString(i18n.language),
    },
    {
      label: t('workspaceEditor.sidebar.readingTime', 'Lectura'),
      value: `${stats.readingTimeMinutes} min`,
    },
    {
      label: t('workspaceEditor.sidebar.headings', 'Encabezados'),
      value: headings.length.toLocaleString(i18n.language),
    },
  ];

  const tasksToList = useMemo(() => {
    const rawList =
      linkedTasks && linkedTasks.length > 0
        ? linkedTasks
        : selectTask
          ? [selectTask]
          : [];

    return rawList.map((t) => {
      const override = taskOverrides[t.id];
      return override ? { ...t, ...override } : t;
    });
  }, [linkedTasks, selectTask, taskOverrides]);

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
            borderRadius: { xs: 1, md: 1 },
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
              aria-label={t('workspaceEditor.closeSidebar', 'Cerrar panel')}
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
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
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
                          {t(
                            'workspaceEditor.sidebar.linkedTasks',
                            'TAREAS VINCULADAS',
                          )}
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
                        {t('workspaceEditor.sidebar.link', 'Vincular')}
                      </Button>
                    </Box>

                    {tasksToList.length > 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.75,
                          maxHeight: 190,
                          overflowY: 'auto',
                          pr: 0.5,
                          '&::-webkit-scrollbar': { width: 4 },
                          '&::-webkit-scrollbar-thumb': {
                            borderRadius: 4,
                            bgcolor: (t) =>
                              t.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.16)'
                                : 'rgba(15, 23, 42, 0.16)',
                          },
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
                          const statusLabel = getStatusLabel(task.status, t);
                          const durationLabel = task.estimate_timer
                            ? `${task.estimate_timer}m`
                            : '25m';

                          return (
                            <Box
                              key={task.id}
                              sx={{
                                border: '1px solid',
                                borderColor: isFocusActive
                                  ? 'primary.main'
                                  : 'divider',
                                borderRadius: '8px',
                                p: '7px 10px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.65,
                                bgcolor: (t) =>
                                  isFocusActive
                                    ? t.palette.mode === 'dark'
                                      ? 'rgba(37, 99, 235, 0.1)'
                                      : 'rgba(37, 99, 235, 0.05)'
                                    : t.palette.mode === 'dark'
                                      ? 'rgba(255, 255, 255, 0.02)'
                                      : 'rgba(0, 0, 0, 0.01)',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                  borderColor: isFocusActive
                                    ? 'primary.main'
                                    : 'divider',
                                  bgcolor: (t) =>
                                    isFocusActive
                                      ? t.palette.mode === 'dark'
                                        ? 'rgba(37, 99, 235, 0.15)'
                                        : 'rgba(37, 99, 235, 0.08)'
                                      : 'action.hover',
                                },
                              }}
                            >
                              {/* Row 1: Title + Action buttons (Focus + Unlink) */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 0.75,
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  noWrap
                                  title={task.title}
                                  sx={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    lineHeight: 1.25,
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  {task.title}
                                </Typography>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.35,
                                    flexShrink: 0,
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      isFocusActive
                                        ? 'Focus activo'
                                        : `Iniciar Focus Mode (${durationLabel})`
                                    }
                                  >
                                    <span>
                                      <Button
                                        size="small"
                                        variant={
                                          isFocusActive
                                            ? 'contained'
                                            : 'outlined'
                                        }
                                        startIcon={
                                          <FlashOnIcon
                                            sx={{
                                              fontSize: 13,
                                              color: isFocusActive
                                                ? '#ffffff'
                                                : '#f59e0b',
                                            }}
                                          />
                                        }
                                        disabled={
                                          !onStartFocus ||
                                          isFocusActive ||
                                          task.status === 'Done'
                                        }
                                        onClick={() => onStartFocus?.(task)}
                                        sx={{
                                          textTransform: 'none',
                                          fontSize: '10.5px',
                                          fontWeight: 700,
                                          py: 0.2,
                                          px: 0.75,
                                          height: 24,
                                          minWidth: 0,
                                          whiteSpace: 'nowrap',
                                          borderColor: isFocusActive
                                            ? 'primary.main'
                                            : 'rgba(245, 158, 11, 0.4)',
                                          color: isFocusActive
                                            ? '#ffffff'
                                            : 'text.primary',
                                          boxShadow: 'none',
                                          '&:hover': {
                                            borderColor: '#f59e0b',
                                            bgcolor: isFocusActive
                                              ? 'primary.dark'
                                              : 'rgba(245, 158, 11, 0.08)',
                                          },
                                        }}
                                      >
                                        {isFocusActive
                                          ? 'Focus'
                                          : `Focus (${durationLabel})`}
                                      </Button>
                                    </span>
                                  </Tooltip>

                                  {onUnlinkTask && (
                                    <Tooltip
                                      title={t(
                                        'workspaceEditor.sidebar.unlinkTask',
                                        'Desvincular tarea',
                                      )}
                                    >
                                      <IconButton
                                        aria-label={t(
                                          'workspaceEditor.sidebar.unlinkTask',
                                          'Desvincular tarea',
                                        )}
                                        size="small"
                                        onClick={() => onUnlinkTask(task)}
                                        sx={{
                                          color: 'text.secondary',
                                          p: 0.3,
                                          width: 24,
                                          height: 24,
                                          '&:hover': {
                                            color: 'error.main',
                                            bgcolor: 'error.lighter',
                                          },
                                        }}
                                      >
                                        <UnlinkIcon sx={{ fontSize: 14 }} />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              </Box>

                              {/* Row 2: Status Dropdown + Priority Dropdown + Timer + Deadline */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.6,
                                  flexWrap: 'wrap',
                                  color: 'text.secondary',
                                }}
                              >
                                {/* Status Dropdown Pill */}
                                <Tooltip
                                  title={t(
                                    'tasks.changeStatus',
                                    'Cambiar estado',
                                  )}
                                >
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setStatusMenu({
                                        anchorEl: e.currentTarget,
                                        task,
                                      });
                                    }}
                                    sx={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.45,
                                      px: 0.6,
                                      py: 0.2,
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      bgcolor: (t) =>
                                        t.palette.mode === 'dark'
                                          ? 'rgba(255, 255, 255, 0.05)'
                                          : 'rgba(0, 0, 0, 0.04)',
                                      border: '1px solid',
                                      borderColor: (t) =>
                                        t.palette.mode === 'dark'
                                          ? 'rgba(255, 255, 255, 0.08)'
                                          : 'rgba(0, 0, 0, 0.06)',
                                      '&:hover': {
                                        bgcolor: (t) =>
                                          t.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.12)'
                                            : 'rgba(0, 0, 0, 0.08)',
                                        borderColor: 'divider',
                                      },
                                      transition: 'all 0.15s',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        bgcolor: statusColor,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {statusLabel}
                                    </Typography>
                                    <KeyboardArrowDownIcon
                                      sx={{
                                        fontSize: 11,
                                        color: 'text.secondary',
                                        ml: -0.2,
                                      }}
                                    />
                                  </Box>
                                </Tooltip>

                                {/* Priority Dropdown Pill */}
                                <Tooltip
                                  title={t(
                                    'tasks.changePriority',
                                    'Cambiar prioridad',
                                  )}
                                >
                                  <Box
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPriorityMenu({
                                        anchorEl: e.currentTarget,
                                        task,
                                      });
                                    }}
                                    sx={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 0.35,
                                      px: 0.6,
                                      py: 0.2,
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      bgcolor: (t) =>
                                        t.palette.mode === 'dark'
                                          ? 'rgba(255, 255, 255, 0.05)'
                                          : 'rgba(0, 0, 0, 0.04)',
                                      border: '1px solid',
                                      borderColor: (t) =>
                                        t.palette.mode === 'dark'
                                          ? 'rgba(255, 255, 255, 0.08)'
                                          : 'rgba(0, 0, 0, 0.06)',
                                      '&:hover': {
                                        bgcolor: (t) =>
                                          t.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.12)'
                                            : 'rgba(0, 0, 0, 0.08)',
                                        borderColor: 'divider',
                                      },
                                      transition: 'all 0.15s',
                                    }}
                                  >
                                    <PriorityBadge
                                      priority={task.priority_level}
                                      size={13}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        color: priority.color,
                                        lineHeight: 1,
                                      }}
                                    >
                                      {t(
                                        `tasks.priorities.${priority.id}`,
                                        priority.label,
                                      )}
                                    </Typography>
                                    <KeyboardArrowDownIcon
                                      sx={{
                                        fontSize: 11,
                                        color: 'text.secondary',
                                        ml: -0.2,
                                      }}
                                    />
                                  </Box>
                                </Tooltip>

                                {/* Duration */}
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.3,
                                    ml: 'auto',
                                  }}
                                >
                                  <TimerIcon sx={{ fontSize: 11 }} />
                                  <Typography
                                    variant="caption"
                                    sx={{ fontSize: '10px' }}
                                  >
                                    {durationLabel}
                                    {task.real_timer && task.real_timer > 0
                                      ? ` (${Math.round(task.real_timer)}m)`
                                      : ''}
                                  </Typography>
                                </Box>

                                {/* Deadline */}
                                {task.deadline && (
                                  <Box
                                    sx={{
                                      display: {
                                        xs: 'none',
                                        sm: 'inline-flex',
                                      },
                                      alignItems: 'center',
                                      gap: 0.3,
                                    }}
                                  >
                                    <CalendarIcon sx={{ fontSize: 11 }} />
                                    <Typography
                                      variant="caption"
                                      sx={{ fontSize: '10px' }}
                                    >
                                      {formatDeadline(
                                        task.deadline,
                                        t,
                                        i18n.language,
                                      )}
                                    </Typography>
                                  </Box>
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
                          {t(
                            'workspaceEditor.sidebar.noLinkedTasks',
                            'Sin tareas vinculadas',
                          )}
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
                          {t(
                            'workspaceEditor.sidebar.linkTask',
                            'Vincular tarea',
                          )}
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
                      {t('workspaceEditor.sidebar.document', 'DOCUMENTO')}
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
                      {t('workspaceEditor.sidebar.structure', 'ESTRUCTURA')}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.75,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {[
                        [
                          t(
                            'workspaceEditor.sidebar.mainHeadings',
                            'Títulos principales',
                          ),
                          stats.h1Count,
                        ],
                        [
                          t('workspaceEditor.sidebar.sections', 'Secciones'),
                          stats.h2Count,
                        ],
                        [
                          t(
                            'workspaceEditor.sidebar.subsections',
                            'Subsecciones',
                          ),
                          stats.h3Count,
                        ],
                        [
                          t('workspaceEditor.sidebar.paragraphs', 'Párrafos'),
                          stats.paragraphs,
                        ],
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

      {/* Status Menu */}
      <Menu
        anchorEl={statusMenu?.anchorEl}
        open={Boolean(statusMenu)}
        onClose={() => setStatusMenu(null)}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            minWidth: 150,
            borderRadius: '8px',
            p: 0.5,
          },
        }}
      >
        {EDITOR_TASK_STATUSES.map((statusName) => {
          const isSelected = statusMenu?.task.status === statusName;
          const sColor = getStatusColor(statusName);

          return (
            <MenuItem
              key={statusName}
              selected={isSelected}
              onClick={() => {
                if (statusMenu) {
                  void handleUpdateTaskStatus(statusMenu.task, statusName);
                }
              }}
              sx={{
                gap: 1.25,
                py: 0.6,
                px: 1.25,
                borderRadius: '6px',
                my: 0.2,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: sColor,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'text.primary' : 'text.secondary',
                }}
              >
                {getStatusLabel(statusName, t)}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Priority Menu */}
      <Menu
        anchorEl={priorityMenu?.anchorEl}
        open={Boolean(priorityMenu)}
        onClose={() => setPriorityMenu(null)}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            minWidth: 150,
            borderRadius: '8px',
            p: 0.5,
          },
        }}
      >
        {PRIORITY_OPTIONS.map((pOpt) => {
          const level = getPriorityLevel(pOpt.id as PriorityType);
          const isSelected =
            getPriorityConfig(priorityMenu?.task.priority_level).id === pOpt.id;

          return (
            <MenuItem
              key={pOpt.id}
              selected={isSelected}
              onClick={() => {
                if (priorityMenu) {
                  void handleUpdateTaskPriority(priorityMenu.task, level);
                }
              }}
              sx={{
                gap: 1.25,
                py: 0.6,
                px: 1.25,
                borderRadius: '6px',
                my: 0.2,
              }}
            >
              <PriorityBadge priority={pOpt.id} size={18} />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'text.primary' : 'text.secondary',
                }}
              >
                {t(`tasks.priorities.${pOpt.id}`, pOpt.label)}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
