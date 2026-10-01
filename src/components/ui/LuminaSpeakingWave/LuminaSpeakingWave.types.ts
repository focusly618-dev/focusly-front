import type { SxProps, Theme } from '@mui/material';

export interface LuminaSpeakingWaveProps {
  /** Whether the speaking wave is currently active */
  isSpeaking?: boolean;
  /** Optional style overrides */
  sx?: SxProps<Theme>;
  /** Optional text label to display alongside the waves */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}
