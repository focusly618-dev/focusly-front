export interface LuminaSpeakingWaveProps {
  /** Whether the speaking wave is currently active */
  isSpeaking?: boolean;
  /** Optional custom CSS classes */
  className?: string;
  /** Optional text label to display alongside the waves */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}
