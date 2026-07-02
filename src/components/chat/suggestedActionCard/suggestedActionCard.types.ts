import type { ReactNode } from 'react';
import type { ParsedLuminaAction } from '@/utils/lumina';

export interface SuggestedActionCardProps {
  action: ParsedLuminaAction;
  onClose?: () => void;
}

export interface UseSuggestedActionCardReturn {
  isCompleted: boolean;
  createdId: string;
  errorMessage: string;
  handleExecute: () => Promise<void>;
  getActionIcon: () => ReactNode;
  getActionTitle: () => string;
  getActionDetails: () => string;
  isLoading: boolean;
}
