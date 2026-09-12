import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import {
  Folder as FolderFilledIcon,
  FolderOutlined as FolderOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const {
    menuAnchorEl,
    isMenuOpen,
    handleOpenMenu,
    handleCloseMenu,
    handleCustomizeClick,
    handleDeleteClick,
  } = useProjectFolderCard({ group, onCustomize, onDelete });

  const baseColor = group.color || '#7c3aed';
  const noteCount = group.workspaces?.length ?? 0;
  const statusLabel =
    noteCount > 0 ? (index % 3 === 0 ? 'RECENT' : 'ACTIVE') : 'DRAFT';

  return (
    <CardContainer onClick={() => onSelect(group.id)}>
      {/* Top Bar: Icon + Actions Button */}
      <Box
        sx={{
          p: 2,
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <FolderIconWrapper
          baseColor={baseColor}
          onClick={(e) => {
            e.stopPropagation();
            onCustomize?.(group);
          }}
        >
          {group.emoji === 'outlined' ? (
            <FolderOutlinedIcon sx={{ fontSize: 20 }} />
          ) : (
            <FolderFilledIcon sx={{ fontSize: 20 }} />
          )}
        </FolderIconWrapper>

        <IconButton
          size="small"
          onClick={handleOpenMenu}
          sx={{ color: 'text.secondary' }}
        >
          <MoreHorizIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Body: Title + Count + Updated date */}
      <Box sx={{ px: 2, flexGrow: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          {group.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            display: 'block',
          }}
        >
          {t('workspaceLibrary.notesInside', { count: noteCount })}
        </Typography>
        {group.updatedAt && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              opacity: 0.8,
              fontSize: '0.72rem',
              display: 'block',
              mt: 0.25,
            }}
          >
            {t('workspaceLibrary.lastUpdated')}
            {new Date(group.updatedAt).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Typography>
        )}
      </Box>

      {/* Status Bar bottom */}
      <StatusBar>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            fontSize: '0.65rem',
            letterSpacing: '0.05em',
            color:
              statusLabel === 'ACTIVE'
                ? 'success.main'
                : statusLabel === 'RECENT'
                  ? 'primary.main'
                  : 'text.secondary',
          }}
        >
          {statusLabel === 'ACTIVE'
            ? t('common.active').toUpperCase()
            : statusLabel === 'RECENT'
              ? t('workspaceLibrary.status.recent').toUpperCase()
              : t('workspaceLibrary.status.draft').toUpperCase()}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontWeight: 700 }}
        >
          &rarr;
        </Typography>
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
