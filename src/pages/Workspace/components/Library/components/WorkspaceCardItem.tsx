import { createElement, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  alpha,
  lighten,
  Popover,
  IconButton,
} from '@mui/material';
import {
  Link as LinkIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import {
  WorkspaceCard,
  CardAvatarCircle,
  BadgeChip,
  PropertyGrid,
  PropertyItem,
  PropertyLabel,
  PropertyValue,
} from '../WorkspaceLibrary.styles';
import { colorPaletteMap, iconMap } from '../constants/library.constants';
import type { WorkspaceTypes } from '../../../workspace.types';
import { formatDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import { UNTITLED_WORKSPACE_TITLE, colorPalette, isColorDark } from '@/utils';

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
  return text.replace(/\s+/g, ' ').trim() || 'No content yet';
};

// Safely parse the document content to get a plain text preview snippet
const getSnippet = (contentStr?: string): string => {
  if (!contentStr) return 'No content yet';
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
      return 'No content yet';
    }
    return cleanMarkdown(contentStr);
  }
  return 'No content yet';
};

export const WorkspaceCardItem = ({
  workspace,
  onSelect,
  onMenuOpen,
  onUnlinkTask,
  groupName,
  groupColor,
  compact,
}: WorkspaceCardItemProps) => {
  const theme = useTheme();

  const paletteEntry = workspace.background_color
    ? colorPaletteMap[workspace.background_color] ||
      colorPalette.find((c) => c.color === workspace.background_color)
    : undefined;
  const colorChipName =
    colorPalette.find((c) => c.color === workspace.background_color)?.label ||
    'Color';
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

  const isDarkBg = isBackgroundActive
    ? isColorDark(gradient || workspace.background_color)
    : false;
  const isLightBg = isBackgroundActive
    ? !isDarkBg
    : theme.palette.mode === 'light';

  const isDark = theme.palette.mode === 'dark';
  const folderName = groupName || null;
  const baseColor = groupColor || theme.palette.primary.main;
  const visibleColor = isDark ? lighten(baseColor, 0.3) : baseColor;
  const badgeBgColor = alpha(visibleColor, isDark ? 0.15 : 0.08);

  const snippet = getSnippet(workspace.content);

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

  // Common emojis and their corresponding soft background colors for avatar circle
  const getAvatarStyles = () => {
    if (isBackgroundActive) {
      return {
        bgcolor: isLightBg
          ? 'rgba(0, 0, 0, 0.06)'
          : 'rgba(255, 255, 255, 0.18)',
        borderColor: isLightBg
          ? 'rgba(0, 0, 0, 0.12)'
          : 'rgba(255, 255, 255, 0.25)',
        color: isLightBg ? '#0f172a' : '#ffffff',
      };
    }
    const emoji = workspace.emoji;
    const emojiColors: Record<string, string> = {
      '😁': '#fbbf24', // yellow
      '😊': '#fbbf24',
      '😈': '#a78bfa', // purple
      '🔥': '#f87171', // red
      '💡': '#fbbf24',
      '🚀': '#60a5fa', // blue
      '⭐': '#fbbf24',
      '❤️': '#f87171',
    };
    const matchedColor = emoji ? emojiColors[emoji] : undefined;
    if (matchedColor) {
      return {
        bgcolor: isDark ? alpha(matchedColor, 0.15) : alpha(matchedColor, 0.08),
        borderColor: isDark
          ? alpha(matchedColor, 0.25)
          : alpha(matchedColor, 0.12),
        color: matchedColor,
      };
    }
    // Fallback to project/group color
    return {
      bgcolor: isDark ? alpha(baseColor, 0.15) : alpha(baseColor, 0.08),
      borderColor: isDark ? alpha(baseColor, 0.25) : alpha(baseColor, 0.12),
      color: visibleColor,
    };
  };

  const avatarStyles = getAvatarStyles();

  return (
    <WorkspaceCard
      onClick={() => onSelect(workspace)}
      gradient={isBackgroundActive ? gradient : undefined}
      compact={compact}
    >
      {/* Top Row: Avatar (left), Folder / Color Badge & Menu Options (right) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <CardAvatarCircle
          sx={{
            bgcolor: avatarStyles.bgcolor,
            borderColor: avatarStyles.borderColor,
            color: avatarStyles.color,
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
        >
          {workspace.emoji && !iconMap[workspace.emoji] ? (
            <span style={{ fontSize: '20px', lineHeight: 1 }}>
              {workspace.emoji}
            </span>
          ) : (
            createElement(
              (workspace.emoji && iconMap[workspace.emoji]) || iconMap.Article,
              {
                sx: {
                  fontSize: 20,
                  color: avatarStyles.color,
                  opacity: 0.9,
                },
              },
            )
          )}
        </CardAvatarCircle>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {folderName && (
            <BadgeChip
              color={visibleColor}
              bgColor={badgeBgColor}
              sx={{
                borderRadius: '20px',
                px: 1.5,
                py: 0.4,
                fontSize: '11px',
                fontWeight: 600,
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`,
                ...(isBackgroundActive && {
                  bgcolor: isLightBg
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'rgba(255, 255, 255, 0.15)',
                  color: isLightBg ? 'rgba(0, 0, 0, 0.8)' : '#fff',
                  borderColor: 'transparent',
                }),
              }}
            >
              {folderName}
            </BadgeChip>
          )}

          {/* Visual chip for custom cover/color */}
          {workspace.background_color &&
            workspace.background_color !== 'none' && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.6,
                  px: 1,
                  py: 0.3,
                  borderRadius: '12px',
                  bgcolor: isBackgroundActive
                    ? isLightBg
                      ? 'rgba(0, 0, 0, 0.08)'
                      : 'rgba(255, 255, 255, 0.18)'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.04)',
                  border: `1px solid ${
                    isBackgroundActive
                      ? isLightBg
                        ? 'rgba(0, 0, 0, 0.12)'
                        : 'rgba(255, 255, 255, 0.22)'
                      : isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.08)'
                  }`,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background:
                      workspace.background_color.startsWith(
                        'linear-gradient',
                      ) || gradient
                        ? gradient || workspace.background_color
                        : workspace.background_color,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: isBackgroundActive
                      ? isLightBg
                        ? '#0f172a'
                        : '#ffffff'
                      : 'text.secondary',
                  }}
                >
                  {colorChipName}
                </Typography>
              </Box>
            )}

          {onMenuOpen && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMenuOpen(e, workspace);
              }}
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#0f172a'
                    : '#ffffff'
                  : 'text.secondary',
                p: 0.5,
                '&:hover': {
                  backgroundColor: isBackgroundActive
                    ? isLightBg
                      ? 'rgba(0,0,0,0.08)'
                      : 'rgba(255,255,255,0.15)'
                    : 'action.hover',
                },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Middle Section: Workspace Title and Snippet Description */}
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.05rem',
            lineHeight: 1.3,
            mb: 0.5,
            color: isBackgroundActive
              ? isLightBg
                ? '#0f172a'
                : '#ffffff'
              : linkedTasksList.length > 0
                ? 'primary.main'
                : 'text.primary',
            textShadow:
              isBackgroundActive && !isLightBg
                ? '0 1px 3px rgba(0,0,0,0.4)'
                : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease',
            '.MuiPaper-root:hover &': {
              color: isBackgroundActive
                ? isLightBg
                  ? '#020617'
                  : '#ffffff'
                : isDark
                  ? '#ffffff'
                  : theme.palette.primary.main,
            },
          }}
        >
          {workspace.title || UNTITLED_WORKSPACE_TITLE}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: '0.85rem',
            color: isBackgroundActive
              ? isLightBg
                ? 'rgba(15, 23, 42, 0.82)'
                : 'rgba(255, 255, 255, 0.9)'
              : 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '38px',
            lineHeight: 1.4,
            transition: 'color 0.2s ease',
            '.MuiPaper-root:hover &': {
              color: isBackgroundActive
                ? isLightBg
                  ? '#0f172a'
                  : '#ffffff'
                : isDark
                  ? 'rgba(255, 255, 255, 0.95)'
                  : 'rgba(15, 23, 42, 0.9)',
            },
          }}
        >
          {snippet}
        </Typography>
      </Box>

      {/* Properties Section: 2x2 Grid */}
      {!compact && (
        <PropertyGrid
          sx={{
            borderTopColor: isBackgroundActive
              ? isLightBg
                ? 'rgba(0, 0, 0, 0.1)'
                : 'rgba(255, 255, 255, 0.18)'
              : theme.palette.divider,
            pt: 1.5,
            mt: 1.5,
          }}
        >
          <PropertyItem>
            <PropertyLabel
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? 'rgba(15, 23, 42, 0.65)'
                    : 'rgba(255, 255, 255, 0.75)'
                  : isDark
                    ? 'rgba(255, 255, 255, 0.65)'
                    : 'rgba(15, 23, 42, 0.65)',
                transition: 'color 0.2s ease',
                '.MuiPaper-root:hover &': {
                  color: isBackgroundActive
                    ? isLightBg
                      ? 'rgba(15, 23, 42, 0.85)'
                      : 'rgba(255, 255, 255, 0.95)'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.85)'
                      : 'rgba(15, 23, 42, 0.85)',
                },
              }}
            >
              Created
            </PropertyLabel>
            <PropertyValue
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#0f172a'
                    : '#ffffff'
                  : 'text.primary',
                transition: 'color 0.2s ease',
                '.MuiPaper-root:hover &': {
                  color: isBackgroundActive
                    ? isLightBg
                      ? '#020617'
                      : '#ffffff'
                    : isDark
                      ? '#ffffff'
                      : '#0f172a',
                },
              }}
            >
              {format(new Date(workspace.createdAt), 'MMM dd, yyyy')}
            </PropertyValue>
          </PropertyItem>

          <PropertyItem>
            <PropertyLabel
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? 'rgba(15, 23, 42, 0.65)'
                    : 'rgba(255, 255, 255, 0.75)'
                  : isDark
                    ? 'rgba(255, 255, 255, 0.65)'
                    : 'rgba(15, 23, 42, 0.65)',
                transition: 'color 0.2s ease',
                '.MuiPaper-root:hover &': {
                  color: isBackgroundActive
                    ? isLightBg
                      ? 'rgba(15, 23, 42, 0.85)'
                      : 'rgba(255, 255, 255, 0.95)'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.85)'
                      : 'rgba(15, 23, 42, 0.85)',
                },
              }}
            >
              Task Status
            </PropertyLabel>
            <PropertyValue
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#0f172a'
                    : '#ffffff'
                  : linkedTasksList.length > 0
                    ? linkedTasksList.every(
                        (t) => t.status?.toUpperCase() === 'DONE',
                      )
                      ? '#10b981'
                      : 'text.primary'
                    : 'text.secondary',
                textTransform: 'capitalize',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontStyle: linkedTasksList.length === 0 ? 'italic' : 'normal',
                transition: 'color 0.2s ease',
                '.MuiPaper-root:hover &': {
                  color: isBackgroundActive
                    ? isLightBg
                      ? '#020617'
                      : '#ffffff'
                    : isDark
                      ? '#ffffff'
                      : '#0f172a',
                },
              }}
            >
              {linkedTasksList.length > 1 ? (
                <>
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: linkedTasksList.every(
                        (t) => t.status?.toUpperCase() === 'DONE',
                      )
                        ? '#10b981'
                        : '#fbbf24',
                      display: 'inline-block',
                    }}
                  />
                  {
                    linkedTasksList.filter(
                      (t) => t.status?.toUpperCase() === 'DONE',
                    ).length
                  }
                  /{linkedTasksList.length} done
                </>
              ) : linkedTasksList.length === 1 ? (
                <>
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor:
                        linkedTasksList[0].status?.toUpperCase() === 'DONE'
                          ? '#10b981'
                          : '#fbbf24',
                      display: 'inline-block',
                    }}
                  />
                  {linkedTasksList[0].status?.toLowerCase().replace('_', ' ') ||
                    'Backlog'}
                </>
              ) : (
                'None'
              )}
            </PropertyValue>
          </PropertyItem>

          <PropertyItem>
            <PropertyLabel
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? 'rgba(15, 23, 42, 0.65)'
                    : 'rgba(255, 255, 255, 0.75)'
                  : isDark
                    ? 'rgba(255, 255, 255, 0.65)'
                    : 'rgba(15, 23, 42, 0.65)',
                transition: 'color 0.2s ease',
                '.MuiPaper-root:hover &': {
                  color: isBackgroundActive
                    ? isLightBg
                      ? 'rgba(15, 23, 42, 0.85)'
                      : 'rgba(255, 255, 255, 0.95)'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.85)'
                      : 'rgba(15, 23, 42, 0.85)',
                },
              }}
            >
              Time Est/Act
            </PropertyLabel>
            <PropertyValue
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#0f172a'
                    : '#ffffff'
                  : linkedTasksList.length > 0
                    ? 'primary.main'
                    : 'text.secondary',
                fontWeight: 600,
                transition: 'color 0.2s ease',
                '.MuiPaper-root:hover &': {
                  color: isBackgroundActive
                    ? isLightBg
                      ? '#020617'
                      : '#ffffff'
                    : isDark
                      ? '#ffffff'
                      : 'primary.main',
                },
              }}
            >
              {linkedTasksList.length > 0
                ? `${
                    formatDuration(
                      linkedTasksList.reduce(
                        (acc, t) => acc + (t.estimate_timer || 0),
                        0,
                      ),
                    ) || '0m'
                  } / ${
                    formatDuration(
                      linkedTasksList.reduce(
                        (acc, t) => acc + (t.real_timer || 0),
                        0,
                      ),
                    ) || '0m'
                  }`
                : '—'}
            </PropertyValue>
          </PropertyItem>
        </PropertyGrid>
      )}

      {/* Footer Section: Action Buttons */}
      {!compact && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 'auto',
            width: '100%',
          }}
        >
          {linkedTasksList.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                p: '6px 10px 6px 12px',
                borderRadius: '20px',
                bgcolor: isBackgroundActive
                  ? isLightBg
                    ? 'rgba(0, 0, 0, 0.06)'
                    : 'rgba(255, 255, 255, 0.15)'
                  : isDark
                    ? 'rgba(92, 92, 246, 0.12)'
                    : 'rgba(92, 92, 246, 0.05)',
                border: `1px solid ${
                  isBackgroundActive
                    ? isLightBg
                      ? 'rgba(0, 0, 0, 0.12)'
                      : 'rgba(255, 255, 255, 0.25)'
                    : isDark
                      ? 'rgba(92, 92, 246, 0.2)'
                      : 'rgba(92, 92, 246, 0.1)'
                }`,
                color: isBackgroundActive
                  ? isLightBg
                    ? '#0f172a'
                    : '#ffffff'
                  : 'primary.main',
                transition: 'all 0.2s ease',
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
                  '&:hover .unlink-text': {
                    color: 'error.main',
                  },
                }}
              >
                <LinkIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                <Typography
                  variant="caption"
                  className="unlink-text"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: isBackgroundActive
                      ? isLightBg
                        ? '#0f172a'
                        : '#ffffff'
                      : 'primary.main',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {linkedTasksList[0].title}
                </Typography>
              </Box>

              {linkedTasksList.length > 1 ? (
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                    setTasksAnchorEl(e.currentTarget);
                  }}
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '12px',
                    bgcolor: isBackgroundActive
                      ? isLightBg
                        ? 'rgba(0, 0, 0, 0.12)'
                        : 'rgba(255, 255, 255, 0.25)'
                      : isDark
                        ? 'rgba(92, 92, 246, 0.25)'
                        : 'rgba(92, 92, 246, 0.15)',
                    color: isBackgroundActive
                      ? isLightBg
                        ? '#0f172a'
                        : '#ffffff'
                      : 'primary.main',
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      bgcolor: isBackgroundActive
                        ? isLightBg
                          ? 'rgba(0, 0, 0, 0.2)'
                          : 'rgba(255, 255, 255, 0.35)'
                        : 'primary.main',
                      color: '#ffffff',
                    },
                  }}
                >
                  +{linkedTasksList.length - 1} more
                </Box>
              ) : (
                <Typography
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnlinkTask(workspace);
                  }}
                  sx={{
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { color: 'error.main' },
                  }}
                >
                  →
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                width: '100%',
                p: '8px 14px',
                borderRadius: '20px',
                bgcolor: isBackgroundActive
                  ? isLightBg
                    ? 'rgba(0, 0, 0, 0.05)'
                    : 'rgba(255, 255, 255, 0.12)'
                  : isDark
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(0, 0, 0, 0.03)',
                border: `1px dashed ${
                  isBackgroundActive
                    ? isLightBg
                      ? 'rgba(0, 0, 0, 0.18)'
                      : 'rgba(255, 255, 255, 0.28)'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.12)'
                }`,
                color: isBackgroundActive
                  ? isLightBg
                    ? '#1e293b'
                    : '#f8fafc'
                  : 'text.secondary',
                transition: 'all 0.2s ease',
                '.MuiPaper-root:hover &': {
                  borderColor: isBackgroundActive
                    ? isLightBg
                      ? 'rgba(0, 0, 0, 0.3)'
                      : 'rgba(255, 255, 255, 0.45)'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'rgba(0, 0, 0, 0.25)',
                  color: isBackgroundActive
                    ? isLightBg
                      ? '#0f172a'
                      : '#ffffff'
                    : isDark
                      ? '#ffffff'
                      : '#0f172a',
                },
              }}
            >
              <LinkIcon sx={{ fontSize: 13, opacity: 0.6 }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.2px',
                  color: 'inherit',
                }}
              >
                No task linked
              </Typography>
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
            bgcolor: isDark ? '#1e293b' : '#ffffff',
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
            Tareas vinculadas ({linkedTasksList.length})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {linkedTasksList.map((t) => (
            <Box
              key={t.id}
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
                      t.status?.toUpperCase() === 'DONE'
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
                  {t.title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Popover>
    </WorkspaceCard>
  );
};
