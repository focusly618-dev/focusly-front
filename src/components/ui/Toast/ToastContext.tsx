import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Box, Typography, IconButton, Paper, styled } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon, 
  Info as InfoIcon, 
  Warning as WarningIcon,
  Close as CloseIcon 
} from '@mui/icons-material';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (props: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastContainer = styled(Box)({
  position: 'fixed',
  bottom: 110, // Moved up to avoid AI chat overlap
  right: 24,
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  pointerEvents: 'none',
});

const ToastCard = styled(motion(Paper))(({ theme }) => ({
  pointerEvents: 'auto',
  minWidth: 320,
  maxWidth: 420,
  padding: '16px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 10px 40px rgba(0,0,0,0.6)' 
    : '0 10px 40px rgba(0,0,0,0.12)',
  border: '1px solid',
  overflow: 'hidden',
  backdropFilter: 'blur(12px)',
}));

const TOAST_CONFIG = {
  success: {
    icon: <CheckCircleIcon sx={{ color: '#22c55e' }} />,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    bgColor: 'rgba(255, 255, 255, 0.95)',
    darkBgColor: 'rgba(20, 30, 20, 0.95)',
  },
  error: {
    icon: <ErrorIcon sx={{ color: '#ef4444' }} />,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    bgColor: 'rgba(255, 255, 255, 0.95)',
    darkBgColor: 'rgba(30, 20, 20, 0.95)',
  },
  info: {
    icon: <InfoIcon sx={{ color: '#3b82f6' }} />,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    bgColor: 'rgba(255, 255, 255, 0.95)',
    darkBgColor: 'rgba(20, 25, 35, 0.95)',
  },
  warning: {
    icon: <WarningIcon sx={{ color: '#f59e0b' }} />,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    bgColor: 'rgba(255, 255, 255, 0.95)',
    darkBgColor: 'rgba(30, 25, 15, 0.95)',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((title: string, description?: string) => showToast({ title, description, type: 'success' }), [showToast]);
  const error = useCallback((title: string, description?: string) => showToast({ title, description, type: 'error' }), [showToast]);
  const info = useCallback((title: string, description?: string) => showToast({ title, description, type: 'info' }), [showToast]);
  const warning = useCallback((title: string, description?: string) => showToast({ title, description, type: 'warning' }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastCard
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              sx={(theme) => ({
                borderColor: TOAST_CONFIG[toast.type].borderColor,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? TOAST_CONFIG[toast.type].darkBgColor 
                  : TOAST_CONFIG[toast.type].bgColor,
              })}
            >
              <Box sx={{ mt: 0.25 }}>{TOAST_CONFIG[toast.type].icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                  {toast.title}
                </Typography>
                {toast.description && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                    {toast.description}
                  </Typography>
                )}
              </Box>
              <IconButton 
                size="small" 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </ToastCard>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
