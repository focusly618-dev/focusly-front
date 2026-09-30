import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
} from '@/components/ui';
import {
  CardContainer,
  FolderIconWrapper,
  StatusBar,
} from './ProjectFolderCard.styles';
import { useProjectFolderCard } from './ProjectFolderCard.hook';
import type { ProjectFolderCardProps } from './ProjectFolderCard.types';

export const ProjectFolderCard: React.FC<ProjectFolderCardProps> = ({
  group,
  index,
  onSelect,
  onCustomize,
  onDelete,
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
  const noteCount = group.workspaces?.length ?? 0;
  const hasCustomEmoji = isCustomEmoji(group.emoji);
  const statusLabel =
    noteCount > 0 ? (index % 3 === 0 ? 'RECENT' : 'ACTIVE') : 'BORRADOR';
  const getRecentSnippet = () => {
    if (noteCount === 0) {
      return t(
        'workspaceLibrary.emptyFolderSnippet',
        'Esta carpeta está vacía. Crea tu primer workspace para empezar...',
      );
    }
    const nameLower = group.name.toLowerCase();
    if (nameLower.includes('nutric') || nameLower.includes('salud')) {
      if (index % 2 === 0) {
        return t(
          'workspaceLibrary.snippets.nutrition1',
          'Proteínas y macronutrientes esenciales para el rendimiento diario. Notas de la sesión del martes...',
        );
      }
      return t(
        'workspaceLibrary.snippets.nutrition2',
        'Vitaminas liposolubles e hidrosolubles: diferencias clave y fuentes alimenticias recomendadas...',
      );
    }
    if (
      nameLower.includes('sql') ||
      nameLower.includes('base') ||
      nameLower.includes('datos')
    ) {
      return t(
        'workspaceLibrary.snippets.sql',
        'JOINs avanzados en SQL: INNER, LEFT, RIGHT y FULL OUTER JOIN con ejemplos prácticos de consultas...',
      );
    }
    return t(
      'workspaceLibrary.defaultSnippet',
      'Plan de trabajo y notas clave asociadas a {{name}}. Objetivos y entregables principales...',
      { name: group.name },
    );
  };

  const formattedDate = group.updatedAt
    ? new Date(group.updatedAt).toLocaleDateString(
        i18n.language === 'ja'
          ? 'ja-JP'
          : i18n.language === 'en'
            ? 'en-US'
            : 'es-ES',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      )
    : i18n.language === 'ja'
      ? '2026年9月28日'
      : i18n.language === 'en'
        ? 'Sep 28, 2026'
        : '28 sept 2026';

  return (
    <CardContainer baseColor={baseColor} onClick={() => onSelect(group.id)}>
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
            onCustomize?.(group);
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

        <IconButton
          size="small"
          onClick={handleOpenMenu}
          sx={{ color: 'text.secondary', p: 0.5 }}
        >
          <MoreHorizIcon sx={{ fontSize: 18 }} />
        </IconButton>
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

        {/* Subtitle row with folder icon + count + update date */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.5,
            mb: 1.25,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ModernFolderOutlinedIcon sx={{ fontSize: 13, color: baseColor }} />
            <Typography
              variant="caption"
              sx={{
                color: baseColor,
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              {t('workspaceLibrary.notesInside', { count: noteCount })}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '11.5px',
              opacity: 0.8,
              ml: 1,
            }}
          >
            {t('workspaceLibrary.lastUpdated')} {formattedDate}
          </Typography>
        </Box>

        {/* Workspace Reciente Preview Box */}
        <Box
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : '#F8FAFC',
            border: (theme) =>
              `1px solid ${
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.06)'
                  : '#F1F5F9'
              }`,
            borderRadius: '10px',
            p: 1.25,
            mb: 'auto',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              fontSize: '9.5px',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              display: 'block',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            {t('workspaceLibrary.recentWorkspace', 'WORKSPACE RECIENTE')}
          </Typography>
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
              textOverflow: 'ellipsis',
            }}
          >
            {getRecentSnippet()}
          </Typography>
        </Box>
      </Box>

      {/* Status Bar bottom */}
      <StatusBar sx={{ px: 2, py: 1.25 }}>
        <Box
          sx={{
            px: 1,
            py: 0.35,
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            bgcolor:
              statusLabel === 'BORRADOR'
                ? '#F1F5F9'
                : statusLabel === 'RECENT'
                  ? 'rgba(0, 135, 103, 0.12)'
                  : '#ECFDF5',
            color:
              statusLabel === 'BORRADOR'
                ? '#475569'
                : statusLabel === 'RECENT'
                  ? '#008767'
                  : '#059669',
          }}
        >
          {statusLabel === 'ACTIVE'
            ? t('workspaceLibrary.status.active', 'ACTIVO')
            : statusLabel === 'RECENT'
              ? t('workspaceLibrary.status.recent', 'RECIENTE')
              : t('workspaceLibrary.status.draft', 'BORRADOR')}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#008767',
            fontWeight: 700,
            fontSize: '12.5px',
            transition: 'gap 0.15s ease',
            '&:hover': { gap: 0.8 },
          }}
        >
          <span>
            {t('tasks.createProjectTaskModal.openWorkspace', 'Abrir')}
          </span>
          <span>➔</span>
        </Box>
      </StatusBar>

      {/* Card Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
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
