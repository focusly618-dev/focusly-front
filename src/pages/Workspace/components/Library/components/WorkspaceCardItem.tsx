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
  CheckBox as CheckBoxIcon,
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
  HoverArrowButton,
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
}

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
    return contentStr;
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

  return (
    <WorkspaceCard
      onClick={() => onSelect(workspace)}
      gradient={isBackgroundActive ? gradient : undefined}
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
            ...(isBackgroundActive && {
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.5)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }),
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
                  color: isBackgroundActive
                    ? isLightBg
                      ? '#000'
                      : '#fff'
                    : 'text.primary',
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
              ...(isBackgroundActive && {
                bgcolor: isLightBg
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'rgba(255, 255, 255, 0.15)',
                color: isLightBg ? 'rgba(0, 0, 0, 0.8)' : '#fff',
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
              : 'text.primary',
            textShadow:
              isBackgroundActive && !isLightBg
                ? '0 1px 3px rgba(0,0,0,0.3)'
                : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
      <PropertyGrid
        sx={{
          ...(isBackgroundActive && {
            borderTopColor: isLightBg
              ? 'rgba(0, 0, 0, 0.08)'
              : 'rgba(255, 255, 255, 0.15)',
          }),
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
                : 'text.primary',
              textTransform: 'capitalize',
            }}
          >
            {workspace.task
              ? workspace.task.status.toLowerCase().replace('_', ' ')
              : 'None'}
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
                : 'text.primary',
            }}
          >
            {workspace.task
              ? `${formatDuration(workspace.task.estimate_timer) || '0m'} / ${formatDuration(workspace.task.real_timer) || '0m'}`
              : '—'}
          </PropertyValue>
        </PropertyItem>
      </PropertyGrid>

      {/* Footer Section: Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 'auto',
          pt: 1,
        }}
      >
        {workspace.task ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              color: isBackgroundActive
                ? isLightBg
                  ? 'rgba(0, 0, 0, 0.7)'
                  : 'rgba(255, 255, 255, 0.8)'
                : 'primary.main',
              transition: 'all 0.2s',
              '&:hover': {
                color: 'error.main',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              onUnlinkTask(workspace);
            }}
          >
            <CheckBoxIcon sx={{ fontSize: 18 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '11px',
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Linked: {workspace.task.title}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="caption"
            sx={{
              color: isBackgroundActive
                ? isLightBg
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)'
                : 'text.secondary',
              fontStyle: 'italic',
              fontSize: '11px',
            }}
          >
            No task linked
          </Typography>
        )}
        <HoverArrowButton
          className="arrow-button"
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            color: isBackgroundActive
              ? isLightBg
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(255, 255, 255, 0.8)'
              : 'text.secondary',
          }}
        >
          →
        </HoverArrowButton>
      </Box>
    </WorkspaceCard>
  );
};
