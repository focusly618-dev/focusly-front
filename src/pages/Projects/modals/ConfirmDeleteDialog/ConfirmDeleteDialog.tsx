import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useTranslation } from 'react-i18next';

const MAX_LISTED_ITEMS = 5;

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  itemNames?: string[];
  warning?: React.ReactNode;
  warningNote?: React.ReactNode;
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
  warningNote,
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
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '1.1rem',
          pb: 1,
          color: 'text.primary',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Typography
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark' ? '#E2E8F0' : '#334155',
            fontSize: '14px',
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          {description}
        </Typography>

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

        {(warning || warningNote) && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(239, 68, 68, 0.05)',
              border: (theme) =>
                `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(239, 68, 68, 0.18)'
                }`,
            }}
          >
            <ErrorOutlineRoundedIcon
              sx={{
                fontSize: 18,
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#F87171' : '#DC2626',
                mt: '2px',
                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                flex: 1,
              }}
            >
              {warning && (
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1.45,
                    color: (theme) =>
                      theme.palette.mode === 'dark' ? '#FCA5A5' : '#B91C1C',
                  }}
                >
                  {warning}
                </Typography>
              )}
              {warningNote && (
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: (theme) =>
                      theme.palette.mode === 'dark' ? '#94A3B8' : '#64748B',
                  }}
                >
                  {warningNote}
                </Typography>
              )}
            </Box>
          </Box>
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
