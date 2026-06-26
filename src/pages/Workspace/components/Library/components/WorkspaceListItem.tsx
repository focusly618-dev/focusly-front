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
  CheckBoxOutlined as CheckBoxIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { CardAvatarCircle, BadgeChip } from '../WorkspaceLibrary.styles';
import { iconMap } from '../constants/library.constants';
import type { WorkspaceTypes } from '../../../types/workspace.types';

interface WorkspaceListItemProps {
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

export const WorkspaceListItem = ({
  workspace,
  onSelect,
  onMenuOpen,
  onUnlinkTask,
  groupName,
  groupColor,
}: WorkspaceListItemProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const folderName = groupName || 'All Notes';
  const baseColor = groupColor || theme.palette.primary.main;
  const visibleColor = isDark ? lighten(baseColor, 0.3) : baseColor;
  const badgeBgColor = alpha(visibleColor, isDark ? 0.15 : 0.08);

  const snippet = getSnippet(workspace.content);

  return (
    <Box
      onClick={() => onSelect(workspace)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: '10px 16px',
        borderRadius: '8px',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
        bgcolor: isDark ? 'rgba(26, 31, 43, 0.4)' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        gap: 2,
        '&:hover': {
          transform: 'translateY(-1px)',
          bgcolor: isDark ? 'rgba(26, 31, 43, 0.7)' : '#f9f9fa',
          borderColor: isDark
            ? 'rgba(99, 102, 241, 0.3)'
            : 'rgba(0, 0, 0, 0.12)',
          boxShadow: isDark
            ? '0 4px 12px rgba(0,0,0,0.2)'
            : '0 2px 6px rgba(0,0,0,0.03)',
        },
      }}
    >
      {/* Icon & Title */}
      <Box
        display="flex"
        alignItems="center"
        gap={1.5}
        sx={{ minWidth: 200, flex: '1 1 0%' }}
      >
        <CardAvatarCircle
          sx={{ width: 34, height: 34, fontSize: '16px', m: 0 }}
        >
          {workspace.emoji && !iconMap[workspace.emoji] ? (
            <span style={{ fontSize: '16px', lineHeight: 1 }}>
              {workspace.emoji}
            </span>
          ) : (
            createElement(
              (workspace.emoji && iconMap[workspace.emoji]) || iconMap.Article,
              { sx: { fontSize: 16, color: 'text.primary', opacity: 0.9 } },
            )
          )}
        </CardAvatarCircle>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            fontSize: '0.9rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.primary',
          }}
        >
          {workspace.title}
        </Typography>
      </Box>

      {/* Snippet Preview */}
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.8rem',
          color: 'text.secondary',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: '2 2 0%',
          display: { xs: 'none', md: 'block' },
        }}
      >
        {snippet}
      </Typography>

      {/* Badge / Group */}
      <Box sx={{ minWidth: 100, display: { xs: 'none', sm: 'block' } }}>
        <BadgeChip color={visibleColor} bgColor={badgeBgColor}>
          {folderName}
        </BadgeChip>
      </Box>

      {/* Task Link info */}
      <Box sx={{ minWidth: 140, display: { xs: 'none', lg: 'block' } }}>
        {workspace.task ? (
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            sx={{
              color: 'primary.main',
              '&:hover': { color: 'error.main' },
              transition: 'color 0.2s',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onUnlinkTask(workspace);
            }}
          >
            <CheckBoxIcon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '11px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 120,
              }}
            >
              {workspace.task.title}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: 'italic', fontSize: '11px' }}
          >
            No task linked
          </Typography>
        )}
      </Box>

      {/* Date */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: '11px',
          fontWeight: 500,
          minWidth: 80,
          textAlign: 'right',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {format(new Date(workspace.createdAt), 'MMM dd, yyyy')}
      </Typography>

      {/* Options Menu Button */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onMenuOpen(e, workspace);
        }}
        sx={{ color: 'text.secondary', p: 0.5 }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
