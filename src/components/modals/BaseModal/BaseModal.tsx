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
  maxWidth = 750,
  fullWidth = true,
  hideCloseButton = false,
  icon,
  iconBgColor,
  sx,
}) => {
  const isNumericMaxWidth = typeof maxWidth === 'number';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // A numeric maxWidth isn't one of MUI's breakpoint keys — Dialog can't
      // size to it directly, so we disable Dialog's own constraint and size
      // the Paper ourselves via dialogPaperSx instead.
      maxWidth={isNumericMaxWidth ? false : maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: dialogPaperSx(sx, isNumericMaxWidth ? maxWidth : undefined),
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
