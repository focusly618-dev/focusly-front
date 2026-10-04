import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const MAX_LISTED_ITEMS = 5;

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  itemNames?: string[];
  warning?: string;
  confirmText?: string;
  onConfirm: () => Promise<unknown> | void;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  title,
  description,
  itemNames = [],
  warning,
  confirmText,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const listedNames = itemNames.slice(0, MAX_LISTED_ITEMS);
  const hiddenCount = itemNames.length - listedNames.length;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // The caller already reports the error; keep the dialog open to retry.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      onClick={(e) => e.stopPropagation()}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 1.5,
          maxWidth: '440px',
          width: '100%',
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
          {description}
        </DialogContentText>

        {itemNames.length > 1 && (
          <Box component="ul" sx={{ mt: 1.5, mb: 0, pl: 2.5 }}>
            {listedNames.map((name, index) => (
              <Typography
                key={`${name}-${index}`}
                component="li"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '13px',
                }}
              >
                {name}
              </Typography>
            ))}
            {hiddenCount > 0 && (
              <Typography
                component="li"
                variant="body2"
                sx={{ color: 'text.secondary', fontSize: '13px' }}
              >
                {t('deleteConfirm.andMore', { count: hiddenCount })}
              </Typography>
            )}
          </Box>
        )}

        {warning && (
          <Alert
            severity="warning"
            sx={{ mt: 2, borderRadius: '10px', fontSize: '13px' }}
          >
            {warning}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={handleConfirm}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: 'none',
          }}
        >
          {confirmText || t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
