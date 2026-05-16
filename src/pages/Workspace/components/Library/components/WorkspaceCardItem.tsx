import { createElement } from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import {
  Folder as FolderIcon,
  MoreVert as MoreVertIcon,
  CheckBox as CheckBoxIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import {
  WorkspaceCard,
  TaskPill,
  TaskPillLabel,
  TaskPillTitle,
  HoverArrowButton,
} from '../WorkspaceLibrary.styles';
import { colorPaletteMap, iconMap } from '../constants/library.constants';
import type { WorkspaceTypes } from '../../../types/workspace.types';

interface WorkspaceCardItemProps {
  workspace: WorkspaceTypes;
  onSelect: (workspace: WorkspaceTypes) => void;
  onMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    workspace: WorkspaceTypes,
  ) => void;
  onUnlinkTask: (workspace: WorkspaceTypes) => void;
}

export const WorkspaceCardItem = ({
  workspace,
  onSelect,
  onMenuOpen,
  onUnlinkTask,
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

  return (
    <WorkspaceCard
      onClick={() => onSelect(workspace)}
      gradient={isBackgroundActive ? gradient : undefined}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            mt: 0.5,
            bgcolor: isBackgroundActive
              ? isLightBg
                ? 'rgba(255, 255, 255, 0.8)'
                : 'rgba(0, 0, 0, 0.4)'
              : theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)',
            backdropFilter: 'blur(12px)',
            px: 1.5,
            py: 0.4,
            borderRadius: '20px',
            border: '1px solid',
            borderColor: isBackgroundActive
              ? isLightBg
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.15)'
              : 'transparent',
          }}
        >
          <FolderIcon
            sx={{
              fontSize: 14,
              color:
                workspace.folder?.color ||
                (theme.palette.mode === 'dark' ? '#fff' : 'primary.main'),
              opacity: 0.8,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '0.68rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: isBackgroundActive
                ? isLightBg
                  ? 'rgba(0, 0, 0, 0.8)'
                  : '#fff'
                : 'text.primary',
              opacity: 0.9,
              maxWidth: '120px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {workspace.folder?.name?.length > 40
              ? `${workspace.folder.name.substring(0, 40)}...`
              : workspace.folder?.name || 'All Notes'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
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
                backgroundColor: 'action.hover',
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {workspace.emoji && iconMap[workspace.emoji] && (
        <Box
          sx={{
            mb: 1,
            mt: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            padding: '5px',
            borderRadius: '12px',
            bgcolor: isBackgroundActive
              ? theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.4)'
              : 'action.hover',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: isBackgroundActive
              ? 'rgba(255, 255, 255, 0.15)'
              : 'divider',
            boxShadow: isBackgroundActive
              ? '0 4px 15px rgba(0,0,0,0.1)'
              : 'none',
          }}
        >
          {createElement(iconMap[workspace.emoji], {
            sx: {
              fontSize: 20,
              color: isBackgroundActive
                ? theme.palette.mode === 'dark'
                  ? '#fff'
                  : '#000'
                : 'text.primary',
              opacity: 0.9,
            },
          })}
        </Box>
      )}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: '1.25rem',
          lineHeight: 1.2,
          mb: 'auto',
          color: isBackgroundActive
            ? isLightBg
              ? '#000'
              : '#fff'
            : 'text.primary',
          textShadow:
            isBackgroundActive && !isLightBg
              ? '0 2px 4px rgba(0,0,0,0.3)'
              : 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {workspace.title.length > 40
          ? `${workspace.title.substring(0, 40)}...`
          : workspace.title}
      </Typography>

      <Box mt="auto" width="100%">
        <Typography
          variant="caption"
          sx={{
            color: isBackgroundActive
              ? isLightBg
                ? 'rgba(0, 0, 0, 0.5)'
                : 'rgba(255, 255, 255, 0.6)'
              : 'text.secondary',
            display: 'block',
            mb: workspace.task ? 1.5 : 0,
          }}
        >
          {formatDistanceToNow(new Date(workspace.updatedAt), {
            addSuffix: true,
          })}
        </Typography>

        {workspace.task && (
          <TaskPill
            sx={{
              ...(isBackgroundActive && {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.4)'
                    : 'rgba(255, 255, 255, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }),
            }}
          >
            <Box
              sx={{
                color: isBackgroundActive
                  ? isLightBg
                    ? '#000'
                    : '#fff'
                  : 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                cursor: 'pointer',
                '&:hover': {
                  color: 'error.main',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onUnlinkTask(workspace);
              }}
            >
              <CheckBoxIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box display="flex" flexDirection="column">
              <TaskPillLabel
                sx={{
                  color: isBackgroundActive
                    ? isLightBg
                      ? 'rgba(0, 0, 0, 0.5)'
                      : 'rgba(255, 255, 255, 0.7)'
                    : 'primary.main',
                }}
              >
                ASSIGNED TASK
              </TaskPillLabel>
              <TaskPillTitle
                sx={{
                  color: isBackgroundActive
                    ? isLightBg
                      ? '#000'
                      : '#fff'
                    : 'text.primary',
                  textShadow:
                    isBackgroundActive && !isLightBg
                      ? '0 1px 2px rgba(0,0,0,0.2)'
                      : 'none',
                }}
              >
                {workspace.task.title}
              </TaskPillTitle>
            </Box>
            <HoverArrowButton className="arrow-button">
              <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </HoverArrowButton>
          </TaskPill>
        )}
      </Box>
    </WorkspaceCard>
  );
};
