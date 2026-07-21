import { createElement } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
  lighten,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Link as LinkIcon,
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
import type { WorkspaceTypes } from '../../../types/workspace.types';
import { formatDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';

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
    ? colorPaletteMap[workspace.background_color]
    : undefined;
  const gradient = paletteEntry?.gradient;
  const isLightBg = paletteEntry?.isLight ?? false;

  const isBackgroundActive =
    workspace.card_show_background &&
    workspace.background_color &&
    workspace.background_color !== 'none';

  const isDark = theme.palette.mode === 'dark';
  const folderName = groupName || 'All Notes';
  const baseColor = groupColor || theme.palette.primary.main;
  const visibleColor = isDark ? lighten(baseColor, 0.3) : baseColor;
  const badgeBgColor = alpha(visibleColor, isDark ? 0.15 : 0.08);

  const snippet = getSnippet(workspace.content);

  // Common emojis and their corresponding soft background colors for avatar circle
  const getAvatarStyles = () => {
    if (isBackgroundActive) {
      return {
        bgcolor: isDark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: isLightBg ? '#000' : '#fff',
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
      {/* Top Row: Avatar (left), Folder Badge & Menu Options (right) */}
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

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, workspace);
            }}
            sx={{
              color: isBackgroundActive
                ? isLightBg
                  ? '#000'
                  : '#fff'
                : 'text.secondary',
              '&:hover': {
                backgroundColor: isBackgroundActive
                  ? isLightBg
                    ? 'rgba(0,0,0,0.05)'
                    : 'rgba(255,255,255,0.1)'
                  : 'action.hover',
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
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
                ? '#000'
                : '#fff'
              : workspace.task
                ? 'primary.main'
                : 'text.primary',
            textShadow:
              isBackgroundActive && !isLightBg
                ? '0 1px 3px rgba(0,0,0,0.3)'
                : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease',
            '.MuiPaper-root:hover &': {
              color: 'primary.main',
            },
          }}
        >
          {workspace.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: '0.85rem',
            color: isBackgroundActive
              ? isLightBg
                ? 'rgba(0, 0, 0, 0.6)'
                : 'rgba(255, 255, 255, 0.7)'
              : 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '38px',
            lineHeight: 1.4,
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
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.15)'
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
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(255, 255, 255, 0.5)'
                  : 'text.secondary',
              }}
            >
              Project
            </PropertyLabel>
            <PropertyValue
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#000'
                    : '#fff'
                  : 'text.primary',
                fontWeight: 700,
              }}
            >
              {folderName}
            </PropertyValue>
          </PropertyItem>

          <PropertyItem>
            <PropertyLabel
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(255, 255, 255, 0.5)'
                  : 'text.secondary',
              }}
            >
              Created
            </PropertyLabel>
            <PropertyValue
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#000'
                    : '#fff'
                  : 'text.primary',
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
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(255, 255, 255, 0.5)'
                  : 'text.secondary',
              }}
            >
              Task Status
            </PropertyLabel>
            <PropertyValue
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#000'
                    : '#fff'
                  : workspace.task
                    ? workspace.task.status.toUpperCase() === 'DONE'
                      ? '#10b981'
                      : 'text.primary'
                    : 'text.secondary',
                textTransform: 'capitalize',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontStyle: !workspace.task ? 'italic' : 'normal',
              }}
            >
              {workspace.task ? (
                <>
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor:
                        workspace.task.status.toUpperCase() === 'DONE'
                          ? '#10b981'
                          : '#fbbf24',
                      display: 'inline-block',
                    }}
                  />
                  {workspace.task.status.toLowerCase().replace('_', ' ')}
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
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(255, 255, 255, 0.5)'
                  : 'text.secondary',
              }}
            >
              Time Est/Act
            </PropertyLabel>
            <PropertyValue
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#000'
                    : '#fff'
                  : workspace.task
                    ? 'primary.main'
                    : 'text.secondary',
                fontWeight: 600,
              }}
            >
              {workspace.task
                ? `${formatDuration(workspace.task.estimate_timer) || '0m'} / ${formatDuration(workspace.task.real_timer) || '0m'}`
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
          {workspace.task ? (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onUnlinkTask(workspace);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                p: '8px 14px',
                borderRadius: '20px',
                bgcolor: isDark
                  ? 'rgba(92, 92, 246, 0.12)'
                  : 'rgba(92, 92, 246, 0.05)',
                border: `1px solid ${isDark ? 'rgba(92, 92, 246, 0.2)' : 'rgba(92, 92, 246, 0.1)'}`,
                color: 'primary.main',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isDark
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(239, 68, 68, 0.05)',
                  borderColor: 'error.main',
                  color: 'error.main',
                  '& .unlink-text': {
                    color: 'error.main',
                  },
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ overflow: 'hidden', flex: 1, mr: 1 }}
              >
                <LinkIcon sx={{ fontSize: 14 }} />
                <Typography
                  variant="caption"
                  className="unlink-text"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: 'primary.main',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {workspace.task.title}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                →
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                opacity: 0.6,
                fontSize: '0.85rem',
                textAlign: 'center',
                py: 0.8,
              }}
            >
              No task linked
            </Typography>
          )}
        </Box>
      )}
    </WorkspaceCard>
  );
};
