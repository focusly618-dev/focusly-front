import { createElement, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  lighten,
  Popover,
  IconButton,
  Checkbox,
} from '@mui/material';
import {
  Link as LinkIcon,
  MoreVert as MoreVertIcon,
  CalendarTodayOutlined as CalendarIcon,
  TimerOutlined as TimerIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CARD_ICON_RISE, WorkspaceCard } from '../WorkspaceLibrary.styles';
import {
  CardDivider,
  FolderIconWrapper,
  FooterItem,
} from '@/pages/Projects/components/ProjectFolders/ProjectFolderCard/ProjectFolderCard.styles';
import {
  colorPaletteMap,
  flatBackgroundColor,
  iconMap,
} from '../constants/library.constants';
import type { WorkspaceTypes } from '../../../workspace.types';
import { formatDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import { UNTITLED_WORKSPACE_TITLE, colorPalette } from '@/utils';
import { surfaceColor } from '@/context';

interface WorkspaceCardItemProps {
  workspace: WorkspaceTypes;
  onSelect: (workspace: WorkspaceTypes) => void;
  onMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    workspace: WorkspaceTypes,
  ) => void;
  onUnlinkTask: (workspace: WorkspaceTypes) => void;
  groupName?: string;
  groupColor?: string;
  compact?: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (workspace: WorkspaceTypes) => void;
}

const cleanMarkdown = (md: string): string => {
  let text = md;
  // 1. Remove table lines (any lines with vertical bars)
  text = text
    .split('\n')
    .filter((line) => !line.includes('|'))
    .join('\n');

  // 2. Remove headers (# heading -> heading)
  text = text.replace(/#+\s+/g, '');

  // 3. Remove task list / bullet list markers
  text = text.replace(/-\s*\[[ xX]\]\s+/g, ''); // checklists
  text = text.replace(/[-*]\s+/g, ''); // bullets
  text = text.replace(/^\d+\.\s+/gm, ''); // numbered lists

  // 4. Remove bold/italic markup
  text = text.replace(/[*_]{1,3}/g, '');

  // 5. Remove quotes and HTML comments
  text = text.replace(/^>\s+/gm, '');
  text = text.replace(/<!--.*?-->/gs, '');

  // 6. Replace multiple spaces/newlines with a single space
  return text.replace(/\s+/g, ' ').trim();
};

// Safely parse the document content to get a plain text preview snippet
// ('' when there's nothing to show).
const getSnippet = (contentStr?: string): string => {
  if (!contentStr) return '';
  try {
    const parsed = JSON.parse(contentStr);
    if (Array.isArray(parsed)) {
      for (const block of parsed) {
        if (block.content) {
          if (typeof block.content === 'string') {
            return block.content;
          }
          if (Array.isArray(block.content)) {
            const text = block.content
              .map((c: { text?: string }) => c.text || '')
              .join('');
            if (text.trim()) return text;
          }
        }
      }
    }
  } catch {
    if (contentStr.startsWith('[') || contentStr.startsWith('{')) {
      return '';
    }
    return cleanMarkdown(contentStr);
  }
  return '';
};

// Backend task status → the Tasks board's labels.
const STATUS_KEYS: Record<string, string> = {
  todo: 'todo',
  pending: 'pending',
  planning: 'planning',
  scheduled: 'scheduled',
  review: 'review',
  'on hold': 'onHold',
  done: 'done',
  backlog: 'backlog',
  archived: 'archived',
};

export const WorkspaceCardItem = ({
  workspace,
  onSelect,
  onMenuOpen,
  onUnlinkTask,
  groupName,
  groupColor,
  compact,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}: WorkspaceCardItemProps) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const statusLabel = (status?: string) => {
    const key = STATUS_KEYS[(status ?? '').toLowerCase()];
    return key ? t(`tasks.status.${key}`) : status || t('tasks.status.backlog');
  };

  const paletteEntry = workspace.background_color
    ? colorPaletteMap[workspace.background_color] ||
      colorPalette.find((c) => c.color === workspace.background_color)
    : undefined;
  const gradient =
    paletteEntry?.gradient ||
    (workspace.background_color &&
    workspace.background_color !== 'none' &&
    (workspace.background_color.includes('gradient') ||
      workspace.background_color.startsWith('#') ||
      workspace.background_color.startsWith('rgb'))
      ? workspace.background_color
      : undefined);

  const isBackgroundActive = Boolean(
    workspace.background_color &&
    workspace.background_color !== 'none' &&
    gradient &&
    gradient !== 'none',
  );

  const isDark = theme.palette.mode === 'dark';
  const folderName = groupName || null;
  const baseColor = groupColor || theme.palette.primary.main;
  const visibleColor = isDark ? lighten(baseColor, 0.3) : baseColor;

  const snippet =
    getSnippet(workspace.content) || t('workspaceLibrary.card.noContent');

  const linkedTasksList = useMemo(() => {
    if (workspace.tasks && workspace.tasks.length > 0) {
      return workspace.tasks;
    }
    if (workspace.task) {
      return [workspace.task];
    }
    return [];
  }, [workspace.tasks, workspace.task]);

  const [tasksAnchorEl, setTasksAnchorEl] = useState<HTMLElement | null>(null);
  const isTasksPopoverOpen = Boolean(tasksAnchorEl);

  const emojiColors: Record<string, string> = {
    '😁': '#fbbf24',
    '😊': '#fbbf24',
    '😈': '#a78bfa',
    '🔥': '#f87171',
    '💡': '#fbbf24',
    '🚀': '#60a5fa',
    '⭐': '#fbbf24',
    '❤️': '#f87171',
  };
  const tileColor =
    (workspace.emoji && emojiColors[workspace.emoji]) || visibleColor;

  const doneTasks = linkedTasksList.filter(
    (task) => task.status?.toUpperCase() === 'DONE',
  ).length;
  const allTasksDone =
    linkedTasksList.length > 0 && doneTasks === linkedTasksList.length;
  const timeSpent = (field: 'estimate_timer' | 'real_timer') =>
    formatDuration(
      linkedTasksList.reduce((acc, task) => acc + (task[field] || 0), 0),
    ) || '0m';

  return (
    <WorkspaceCard
      onClick={() =>
        selectionMode ? onToggleSelect?.(workspace) : onSelect(workspace)
      }
      cover={
        isBackgroundActive && gradient
          ? flatBackgroundColor(gradient)
          : undefined
      }
      compact={compact}
      sx={
        selected
          ? { outline: '2px solid #008767', outlineOffset: '-1px' }
          : undefined
      }
    >
      {/* Icon · project, name and snippet · menu */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <FolderIconWrapper
          baseColor={tileColor}
          sx={{
            // A narrow card gives the whole width to the text under the icon
            ...(compact
              ? { position: 'absolute', left: 0, top: `-${CARD_ICON_RISE}px` }
              : { mt: `-${CARD_ICON_RISE}px` }),
            background: surfaceColor(theme, '#1C1C1E', '#262626', '#FFFFFF'),
            borderColor: theme.palette.divider,
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
          }}
        >
          {workspace.emoji && !iconMap[workspace.emoji] ? (
            <Box
              component="span"
              sx={{ fontSize: '1.5rem', lineHeight: 1, userSelect: 'none' }}
            >
              {workspace.emoji}
            </Box>
          ) : (
            createElement(
              (workspace.emoji && iconMap[workspace.emoji]) || iconMap.Article,
              { sx: { fontSize: 22 } },
            )
          )}
        </FolderIconWrapper>

        <Box sx={{ flex: 1, minWidth: 0, pt: compact ? '18px' : 0 }}>
          {folderName && (
            <Typography
              noWrap
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1.3,
                color: visibleColor,
              }}
            >
              {folderName}
            </Typography>
          )}
          <Typography
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: '17px',
              lineHeight: 1.3,
              color: 'text.primary',
            }}
          >
            {workspace.title || UNTITLED_WORKSPACE_TITLE}
          </Typography>
          <Typography
            sx={{
              mt: '4px',
              fontSize: '14px',
              lineHeight: 1.4,
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: compact ? 2 : 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {snippet}
          </Typography>
        </Box>

        {selectionMode ? (
          <Checkbox
            size="small"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect?.(workspace)}
            sx={{
              p: 0.5,
              mt: '-2px',
              flexShrink: 0,
              '&.Mui-checked': { color: '#008767' },
            }}
            inputProps={{
              'aria-label': workspace.title || UNTITLED_WORKSPACE_TITLE,
            }}
          />
        ) : (
          onMenuOpen && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMenuOpen(e, workspace);
              }}
              aria-label={t('workspaceLibrary.card.options')}
              sx={{
                color: 'text.secondary',
                p: 0.5,
                mt: '-2px',
                mr: '-6px',
                flexShrink: 0,
              }}
            >
              <MoreVertIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )
        )}
      </Box>

      {!compact && (
        <Box sx={{ mt: 'auto' }}>
          <CardDivider />

          {/* Created · task status · time */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 2.5 },
              minWidth: 0,
            }}
          >
            <FooterItem title={t('workspaceLibrary.card.created')}>
              <CalendarIcon />
              <span>
                {new Date(workspace.createdAt).toLocaleDateString(
                  i18n.language,
                  { day: 'numeric', month: 'short', year: 'numeric' },
                )}
              </span>
            </FooterItem>
            <FooterItem
              title={t('workspaceLibrary.card.taskStatus')}
              sx={{ overflow: 'hidden' }}
            >
              <Box
                component="span"
                aria-hidden
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  flexShrink: 0,
                  bgcolor:
                    linkedTasksList.length === 0
                      ? '#9ca3af'
                      : allTasksDone
                        ? '#10b981'
                        : '#fbbf24',
                }}
              />
              <Box
                component="span"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {linkedTasksList.length > 1
                  ? t('workspaceLibrary.card.doneCount', {
                      done: doneTasks,
                      total: linkedTasksList.length,
                    })
                  : linkedTasksList.length === 1
                    ? statusLabel(linkedTasksList[0].status)
                    : t('workspaceLibrary.card.noTask')}
              </Box>
            </FooterItem>
            {linkedTasksList.length > 0 && (
              <FooterItem title={t('workspaceLibrary.card.time')}>
                <TimerIcon />
                <span>
                  {timeSpent('estimate_timer')} / {timeSpent('real_timer')}
                </span>
              </FooterItem>
            )}
          </Box>

          {/* Linked tasks: unlink the first, list the rest */}
          {linkedTasksList.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1.5,
                p: '5px 10px',
                borderRadius: '8px',
                bgcolor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.14 : 0.06,
                ),
                color: 'primary.main',
              }}
            >
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  onUnlinkTask(workspace);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  overflow: 'hidden',
                  flex: 1,
                  mr: 1,
                  cursor: 'pointer',
                  '&:hover .unlink-text': { color: 'error.main' },
                }}
              >
                <LinkIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                <Typography
                  noWrap
                  className="unlink-text"
                  sx={{
                    fontWeight: 600,
                    fontSize: '12.5px',
                    color: 'primary.main',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {linkedTasksList[0].title}
                </Typography>
              </Box>

              {linkedTasksList.length > 1 && (
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    setTasksAnchorEl(e.currentTarget);
                  }}
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    flexShrink: 0,
                    bgcolor: alpha(
                      theme.palette.primary.main,
                      isDark ? 0.25 : 0.14,
                    ),
                    '&:hover': { bgcolor: 'primary.main', color: '#ffffff' },
                  }}
                >
                  {t('workspaceLibrary.card.more', {
                    count: linkedTasksList.length - 1,
                  })}
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Popover showing all linked tasks */}
      <Popover
        open={isTasksPopoverOpen}
        anchorEl={tasksAnchorEl}
        onClose={(e: unknown) => {
          if (
            e &&
            typeof e === 'object' &&
            'stopPropagation' in e &&
            typeof (e as { stopPropagation: unknown }).stopPropagation ===
              'function'
          ) {
            (e as { stopPropagation: () => void }).stopPropagation();
          }
          setTasksAnchorEl(null);
        }}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            p: 1.5,
            width: 260,
            maxHeight: 280,
            overflowY: 'auto',
            borderRadius: '12px',
            bgcolor: surfaceColor(theme, '#1e293b', '#373737', '#ffffff'),
            boxShadow: isDark
              ? '0 10px 25px -5px rgba(0,0,0,0.6), 0 8px 10px -6px rgba(0,0,0,0.6)'
              : '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          },
        }}
      >
        <Box
          sx={{
            mb: 1,
            px: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'text.secondary',
            }}
          >
            {t('workspaceLibrary.card.linkedTasks', {
              count: linkedTasksList.length,
            })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {linkedTasksList.map((task) => (
            <Box
              key={task.id}
              sx={{
                p: '6px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                '&:hover': {
                  bgcolor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor:
                      task.status?.toUpperCase() === 'DONE'
                        ? '#10b981'
                        : '#fbbf24',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isDark ? '#ffffff' : '#0f172a',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {task.title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Popover>
    </WorkspaceCard>
  );
};
