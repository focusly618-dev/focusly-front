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
import { enUS, es, fr, pt, de, it } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const localeMap: Record<string, typeof enUS> = {
  'en-US': enUS,
  en: enUS,
  es: es,
  fr: fr,
  pt: pt,
  de: de,
  it: it,
};
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
}: WorkspaceCardItemProps) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const currentLocale = localeMap[i18n.language] || enUS;

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
  const folderName = workspace.project?.name || t('All Notes');
  const baseColor = workspace.project?.color || theme.palette.primary.main;
  const visibleColor = isDark ? lighten(baseColor, 0.3) : baseColor;
  const badgeBgColor = alpha(visibleColor, isDark ? 0.15 : 0.08);

  const snippetRaw = getSnippet(workspace.content);
  const snippet =
    snippetRaw === 'No content yet' ? t('No content yet') : snippetRaw;

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
          mb: 1.25,
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
            <span style={{ fontSize: '16px', lineHeight: 1 }}>
              {workspace.emoji}
            </span>
          ) : (
            createElement(
              (workspace.emoji && iconMap[workspace.emoji]) || iconMap.Article,
              {
                sx: {
                  fontSize: 16,
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
      <Box sx={{ mb: 0.75 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            lineHeight: 1.3,
            mb: 0.25,
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
            fontSize: '0.8rem',
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
            minHeight: '34px',
            lineHeight: 1.35,
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
            {t('Folder')}
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
            {t('Created')}
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
            {format(new Date(workspace.createdAt), 'MMM dd, yyyy', {
              locale: currentLocale,
            })}
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
            {t('Task Status')}
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
              ? t(
                  workspace.task.status === 'Todo'
                    ? 'To Do'
                    : workspace.task.status,
                )
              : t('None')}
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
            {t('Time Est/Act')}
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
          pt: 0.75,
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
            <CheckBoxIcon sx={{ fontSize: 16 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '10px',
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {t('Linked')}: {workspace.task.title}
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
              fontSize: '10px',
            }}
          >
            {t('No task linked')}
          </Typography>
        )}
        <HoverArrowButton
          className="arrow-button"
          sx={{
            fontSize: '14px',
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
