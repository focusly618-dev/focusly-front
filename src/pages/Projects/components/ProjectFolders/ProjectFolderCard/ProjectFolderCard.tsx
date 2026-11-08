import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CalendarTodayOutlined as CalendarIcon,
  DescriptionOutlined as DocumentIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
} from '@/components/ui';
import { UNTITLED_WORKSPACE_TITLE } from '@/utils';
import {
  CardContainer,
  CardDivider,
  FolderIconWrapper,
  FooterItem,
} from './ProjectFolderCard.styles';
import { useProjectFolderCard } from './ProjectFolderCard.hook';
import type { ProjectFolderCardProps } from './ProjectFolderCard.types';

const BRAND = '#008767';
/** "Recent" means edited in the last week. */
const RECENT_MS = 7 * 24 * 60 * 60 * 1000;

type Status = 'recent' | 'idle' | 'empty';
const STATUS_COLOR: Record<Status, string> = {
  recent: '#10b981',
  idle: '#f59e0b',
  empty: '#9ca3af',
};

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

/**
 * A project in the projects grid, drawn like the document cards inside a
 * project: icon tile beside the name, the last document edited under it,
 * and a footer of last activity · status · documents.
 */
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
  const status: Status =
    noteCount === 0
      ? 'empty'
      : lastActivity && now - lastActivity.getTime() < RECENT_MS
        ? 'recent'
        : 'idle';
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
          ? { outline: `2px solid ${BRAND}`, outlineOffset: '-1px' }
          : undefined
      }
    >
      {/* Icon · name and last document · menu */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <FolderIconWrapper
          baseColor={baseColor}
          onClick={(e) => {
            e.stopPropagation();
            if (selectionMode) onToggleSelect?.(group);
            else onCustomize?.(group);
          }}
        >
          {hasCustomEmoji ? (
            <Box
              component="span"
              sx={{ fontSize: '1.5rem', lineHeight: 1, userSelect: 'none' }}
            >
              {group.emoji}
            </Box>
          ) : group.emoji === 'outlined' ? (
            <ModernFolderOutlinedIcon sx={{ fontSize: 22 }} />
          ) : (
            <ModernFolderFilledIcon sx={{ fontSize: 22 }} />
          )}
        </FolderIconWrapper>

        <Box sx={{ flex: 1, minWidth: 0, pt: '3px' }}>
          <Typography
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: '17px',
              lineHeight: 1.3,
              color: 'text.primary',
            }}
          >
            {group.name}
          </Typography>
          <Typography
            noWrap
            sx={{
              mt: '6px',
              fontSize: '14px',
              lineHeight: 1.4,
              color: 'text.secondary',
            }}
          >
            {recent
              ? t('projects.card.lastDocument', {
                  title: recent.title || UNTITLED_WORKSPACE_TITLE,
                })
              : t('workspaceLibrary.emptyFolderSnippet')}
          </Typography>
        </Box>

        {selectionMode ? (
          <Checkbox
            size="small"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggleSelect?.(group)}
            sx={{ p: 0.5, mt: '-2px', '&.Mui-checked': { color: BRAND } }}
            inputProps={{ 'aria-label': group.name }}
          />
        ) : (
          <IconButton
            size="small"
            onClick={handleOpenMenu}
            aria-label={t('workspaceLibrary.card.options')}
            sx={{ color: 'text.secondary', p: 0.5, mt: '-2px', mr: '-6px' }}
          >
            <MoreVertIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <CardDivider />

        {/* Last activity · status · documents · open */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 2, sm: 2.5 },
            minWidth: 0,
          }}
        >
          {lastActivity && (
            <FooterItem>
              <CalendarIcon />
              <span>{formatDate(lastActivity)}</span>
            </FooterItem>
          )}
          <FooterItem>
            <Box
              component="span"
              aria-hidden
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                bgcolor: STATUS_COLOR[status],
              }}
            />
            <span>{t(`workspaceLibrary.status.${status}`)}</span>
          </FooterItem>
          <FooterItem sx={{ overflow: 'hidden' }}>
            <DocumentIcon />
            <Box
              component="span"
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {t('projects.card.documents', { count: noteCount })}
            </Box>
          </FooterItem>
          <Box
            className="project-card-arrow"
            aria-hidden
            sx={{
              ml: 'auto',
              display: 'grid',
              color: 'text.secondary',
              transition: 'transform 0.2s ease, color 0.2s ease',
            }}
          >
            <ArrowIcon sx={{ fontSize: 19 }} />
          </Box>
        </Box>
      </Box>

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
