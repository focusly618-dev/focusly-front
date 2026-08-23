import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  sx?: SxProps<Theme>;
}
