import React from 'react';
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  PaletteOutlined as PaletteIcon,
  FormatColorResetOutlined as FormatColorResetIcon,
  DeleteForever as DeleteForeverIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { colorPaletteMap } from '../../../Workspace/components/Library/constants/library.constants';
import type { ProjectDocCardMenuProps } from './ProjectDocCardMenu.types';

export const ProjectDocCardMenu: React.FC<ProjectDocCardMenuProps> = ({
  anchorEl,
  selectedWorkspace,
  showPaletteInMenu,
  onClose,
  onTogglePalette,
  onSetBackground,
  onRemoveBackground,
  onDeleteWorkspace,
}) => {
  const { t } = useTranslation();

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          mt: 1,
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          minWidth: 180,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          p: 0,
        },
      }}
    >
      {!showPaletteInMenu ? (
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onTogglePalette(true);
          }}
          sx={{ fontSize: '13px', py: 1 }}
        >
          <PaletteIcon
            sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }}
          />
          {t('workspaceLibrary.changeCover')}
        </MenuItem>
      ) : (
        <Box sx={{ p: 1.5, width: 220 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1.5,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePalette(false);
              }}
              sx={{ p: 0.5 }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {t('workspaceLibrary.chooseColor')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1,
              mb: 1.5,
            }}
          >
            {Object.entries(colorPaletteMap).map(([name, { gradient }]) => (
              <Box
                key={name}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetBackground(name);
                }}
                sx={{
                  height: 32,
                  borderRadius: '6px',
                  background: gradient,
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'transform 0.15s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            ))}
          </Box>
          <Divider sx={{ my: 1 }} />
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRemoveBackground();
            }}
            sx={{
              fontSize: '12px',
              py: 0.8,
              px: 1,
              borderRadius: '6px',
              color: 'text.secondary',
            }}
          >
            <FormatColorResetIcon sx={{ fontSize: 16, mr: 1 }} />
            {t('workspaceLibrary.removeCover')}
          </MenuItem>
        </Box>
      )}

      <Divider sx={{ my: 0.5 }} />

      <MenuItem
        onClick={() => {
          if (selectedWorkspace) {
            onDeleteWorkspace(selectedWorkspace.id);
            onClose();
          }
        }}
        sx={{
          fontSize: '13px',
          py: 1.5,
          fontWeight: 500,
          color: 'error.main',
          '&:hover': {
            bgcolor: 'error.lighter',
          },
        }}
      >
        <DeleteForeverIcon
          sx={{ fontSize: 18, mr: 1.5, color: 'error.main' }}
        />
        {t('workspaceLibrary.deleteWorkspace')}
      </MenuItem>
    </Menu>
  );
};
