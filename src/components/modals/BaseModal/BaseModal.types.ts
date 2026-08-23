import type React from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  hideCloseButton?: boolean;
  icon?: React.ReactNode;
  iconBgColor?: string;
  sx?: SxProps<Theme>;
}
