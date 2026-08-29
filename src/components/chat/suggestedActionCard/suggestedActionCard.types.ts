import type { ReactNode } from 'react';
import type { ParsedLuminaAction } from '@/utils';

export interface SuggestedActionCardProps {
  action: ParsedLuminaAction;
  onClose?: () => void;
}

export interface ActionPreviewData {
  /** Task/workspace/group title, or note name */
  title?: string;
  /** Task description (notes_encrypted) */
  description?: string;
  /** Truncated, markdown-stripped preview of note/workspace content */
  contentPreview?: string;
  /** Human-readable date this will land on the calendar, e.g. "Sun, Sep 7" */
  dateLabel?: string;
  /** Human-readable duration, e.g. "2h 30m" */
  durationLabel?: string;
  /** Priority label, e.g. "High" */
  priorityLabel?: string;
  /** Hex color matching the priority, for the chip */
  priorityColor?: string;
}

export interface UseSuggestedActionCardReturn {
  isCompleted: boolean;
  createdId: string;
  errorMessage: string;
  handleExecute: () => Promise<void>;
  getActionIcon: () => ReactNode;
  getActionTitle: () => string;
  getActionPreview: () => ActionPreviewData;
  isLoading: boolean;
}
