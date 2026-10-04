import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
} from '@/components/ui';
import { alpha } from '@mui/material/styles';
import { UNTITLED_WORKSPACE_TITLE } from '@/utils';
import {
  CardContainer,
  FolderIconWrapper,
  StatusBar,
  WorkspacePreviewBox,
} from './ProjectFolderCard.styles';
import { useProjectFolderCard } from './ProjectFolderCard.hook';
import type { ProjectFolderCardProps } from './ProjectFolderCard.types';

const BRAND = '#008767';
/** "Recent" means edited in the last week. */
const RECENT_MS = 7 * 24 * 60 * 60 * 1000;
/** Two caption lines: keeps every card's preview the same height. */
const PREVIEW_LINES_HEIGHT = 34;

type GroupWorkspace = NonNullable<
  ProjectFolderCardProps['group']['workspaces']
>[number];

const toDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** The document edited last. */
const latestWorkspace = (workspaces?: GroupWorkspace[]) =>
  (workspaces ?? []).reduce<GroupWorkspace | null>((best, ws) => {
    const date = toDate(ws.updatedAt);
    const bestDate = toDate(best?.updatedAt);
    return date && (!bestDate || date > bestDate) ? ws : best;
  }, null);

const latestDate = (...values: (string | null | undefined)[]) =>
  values
    .map(toDate)
    .reduce<Date | null>((a, b) => (b && (!a || b > a) ? b : a), null);

export const ProjectFolderCard: React.FC<ProjectFolderCardProps> = ({
  group,
  onSelect,
  onCustomize,
  onDelete,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}) => {
  const { t, i18n } = useTranslation();
  const {
    menuAnchorEl,
    isMenuOpen,
    handleOpenMenu,
    handleCloseMenu,
    handleCustomizeClick,
    handleDeleteClick,
  } = useProjectFolderCard({ group, onCustomize, onDelete });

  const baseColor = group.color || '#10b981';
  const noteCount = group.workspaceCount ?? group.workspaces?.length ?? 0;
  const hasCustomEmoji = isCustomEmoji(group.emoji);
  // When the card mounted: "recent" doesn't need to tick live.
  const [now] = useState(Date.now);
  const recent = latestWorkspace(group.workspaces);
  const lastActivity = latestDate(group.updatedAt, recent?.updatedAt);
  const status: 'empty' | 'recent' | null =
    noteCount === 0
      ? 'empty'
      : lastActivity && now - lastActivity.getTime() < RECENT_MS
        ? 'recent'
        : null;
  const formatDate = (date: Date) =>
    date.toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <CardContainer
      baseColor={baseColor}
      onClick={() =>
        selectionMode ? onToggleSelect?.(group) : onSelect(group.id)
      }
      sx={
        selected
          ? { outline: '2px solid #008767', outlineOffset: '-1px' }
          : undefined
      }
    >
      {/* Top Bar: Icon + Actions Button */}
      <Box
        sx={{
          p: 2,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FolderIconWrapper
          baseColor={baseColor}
          onClick={(e) => {
            e.stopPropagation();
            if (selectionMode) {
              onToggleSelect?.(group);
            } else {
              onCustomize?.(group);
            }
          }}
        >
          {hasCustomEmoji ? (
            <Box
              component="span"
              sx={{ fontSize: '1.25rem', lineHeight: 1, userSelect: 'none' }}
            >
              {group.emoji}
            </Box>
          ) : group.emoji === 'outlined' ? (
            <ModernFolderOutlinedIcon sx={{ fontSize: 18 }} />
          ) : (
            <ModernFolderFilledIcon sx={{ fontSize: 18 }} />
          )}
        </FolderIconWrapper>

        {selectionMode ? (
          <Checkbox
            size="small"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect?.(group)}
            sx={{ p: 0.5, '&.Mui-checked': { color: '#008767' } }}
            inputProps={{ 'aria-label': group.name }}
          />
        ) : (
          <IconButton
            size="small"
            onClick={handleOpenMenu}
            sx={{ color: 'text.secondary', p: 0.5 }}
          >
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Body: Title + Count + Updated date + Preview Box */}
      <Box
        sx={{ px: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            fontSize: '15.5px',
            lineHeight: 1.25,
            mb: 0.5,
          }}
          noWrap
        >
          {group.name}
        </Typography>

        {/* Subtitle: document count + last activity, always one line */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.25,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
            }}
          >
            <ModernFolderOutlinedIcon sx={{ fontSize: 13, color: baseColor }} />
            <Typography
              variant="caption"
              sx={{ color: baseColor, fontWeight: 700, fontSize: '12px' }}
            >
              {t('workspaceLibrary.notesInside', { count: noteCount })}
            </Typography>
          </Box>
          {lastActivity && (
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: 'text.secondary',
                fontSize: '11.5px',
                opacity: 0.8,
                minWidth: 0,
              }}
            >
              {t('workspaceLibrary.lastUpdated')} {formatDate(lastActivity)}
            </Typography>
          )}
        </Box>

        {/* The last document edited in the project (fixed height) */}
        <WorkspacePreviewBox>
          <Typography
            variant="caption"
            noWrap
            sx={{
              fontWeight: 800,
              fontSize: '9.5px',
              letterSpacing: '0.05em',
              color: 'text.secondary',
              display: 'block',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            {t('workspaceLibrary.recentWorkspace')}
          </Typography>
          <Box
            sx={{
              minHeight: PREVIEW_LINES_HEIGHT,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {recent ? (
              <>
                <Typography
                  noWrap
                  sx={{
                    fontSize: '12.5px',
                    fontWeight: 650,
                    lineHeight: 1.4,
                    color: 'text.primary',
                  }}
                >
                  {recent.title || UNTITLED_WORKSPACE_TITLE}
                </Typography>
                {recent.updatedAt && (
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: 'text.secondary',
                      fontSize: '11px',
                      lineHeight: 1.45,
                    }}
                  >
                    {t('workspaceLibrary.editedOn', {
                      date: formatDate(new Date(recent.updatedAt)),
                    })}
                  </Typography>
                )}
              </>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '11.5px',
                  lineHeight: 1.45,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {t('workspaceLibrary.emptyFolderSnippet')}
              </Typography>
            )}
          </Box>
        </WorkspacePreviewBox>
      </Box>

      {/* Status Bar bottom */}
      <StatusBar sx={{ px: 2, py: 1.25 }}>
        {status ? (
          <Box
            sx={{
              px: 1,
              py: 0.35,
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              bgcolor: (theme) =>
                status === 'recent'
                  ? alpha(BRAND, 0.12)
                  : theme.palette.action.hover,
              color: status === 'recent' ? BRAND : 'text.secondary',
            }}
          >
            {t(`workspaceLibrary.status.${status}`)}
          </Box>
        ) : (
          <span />
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: BRAND,
            fontWeight: 700,
            fontSize: '12.5px',
            transition: 'gap 0.15s ease',
            '&:hover': { gap: 0.8 },
          }}
        >
          <span>
            {t('tasks.createProjectTaskModal.openWorkspace', 'Abrir')}
          </span>
          <span aria-hidden>➔</span>
        </Box>
      </StatusBar>

      {/* Card Context Menu. Clicks inside the menu portal still bubble through
          the React tree to CardContainer, which would open the folder and
          unmount the grid (and its delete dialog), so stop them here. */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            mt: 0.5,
            boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
            minWidth: 160,
            bgcolor: 'background.paper',
            p: 0.5,
          },
        }}
      >
        <MenuItem
          onClick={handleCustomizeClick}
          sx={{ fontSize: '13px', py: 1, borderRadius: '6px' }}
        >
          {t('workspaceLibrary.renameFolder')}
        </MenuItem>
        <MenuItem
          onClick={handleCustomizeClick}
          sx={{ fontSize: '13px', py: 1, borderRadius: '6px' }}
        >
          {t('workspaceLibrary.customizeStyle')}
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            fontSize: '13px',
            py: 1,
            borderRadius: '6px',
            color: 'error.main',
          }}
        >
          {t('common.delete')}
        </MenuItem>
      </Menu>
    </CardContainer>
  );
};
