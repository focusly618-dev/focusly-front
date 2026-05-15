import React, { createContext, useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Typography,
  Box
} from '@mui/material';
import { Warning as WarningIcon, Error as ErrorIcon, Info as InfoIcon } from '@mui/icons-material';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((confirmOptions: ConfirmOptions) => {
    setOptions(confirmOptions);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveCallback(() => resolve);
    });
  }, []);

  const handleCancel = () => {
    setOpen(false);
    if (resolveCallback) resolveCallback(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    if (resolveCallback) resolveCallback(true);
  };

  const severity = options?.severity || 'warning';
  const color = severity === 'error' ? '#ef4444' : severity === 'warning' ? '#f59e0b' : '#3b82f6';
  const Icon = severity === 'error' ? ErrorIcon : severity === 'warning' ? WarningIcon : InfoIcon;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog 
        open={open} 
        onClose={handleCancel}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '12px',
            maxWidth: '400px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.05)'
          }
        }}
      >
        {options && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: `${color}15`,
                color: color
              }}>
                <Icon fontSize="medium" />
              </Box>
              <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
                {options.title}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
              <DialogContentText sx={{ color: 'text.secondary', fontSize: '15px', lineHeight: 1.6 }}>
                {options.description}
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
              <Button 
                onClick={handleCancel} 
                fullWidth
                sx={{ 
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  py: 1.2,
                  borderRadius: '12px',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                {options.cancelText || 'Cancel'}
              </Button>
              <Button 
                onClick={handleConfirm} 
                variant="contained"
                fullWidth
                autoFocus
                sx={{ 
                  bgcolor: color,
                  '&:hover': { bgcolor: color, opacity: 0.9 },
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  py: 1.2,
                  borderRadius: '12px',
                  boxShadow: `0 8px 20px ${color}30`,
                }}
              >
                {options.confirmText || 'Accept'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ConfirmContext.Provider>
  );
};
