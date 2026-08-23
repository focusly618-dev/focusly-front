import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { BaseModalProps } from './BaseModal.types';
import {
  dialogPaperSx,
  titleRowSx,
  titleLeftSx,
  iconBoxSx,
  subtitleSx,
  closeButtonSx,
  contentSx,
  actionsSx,
} from './BaseModal.styles';

export const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'xs',
  fullWidth = true,
  hideCloseButton = false,
  icon,
  iconBgColor,
  sx,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: dialogPaperSx(sx),
      }}
    >
      {(title || !hideCloseButton) && (
        <DialogTitle sx={titleRowSx}>
          <Box sx={titleLeftSx}>
            {icon && <Box sx={iconBoxSx(iconBgColor)}>{icon}</Box>}
            <Box>
              {title && <Typography variant="inherit">{title}</Typography>}
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={subtitleSx}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {!hideCloseButton && (
            <IconButton onClick={onClose} sx={closeButtonSx}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent sx={contentSx(Boolean(actions))}>
        {children}
      </DialogContent>
      {actions && <DialogActions sx={actionsSx}>{actions}</DialogActions>}
    </Dialog>
  );
};
