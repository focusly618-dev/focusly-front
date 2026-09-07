import type { SxProps, Theme } from '@mui/material';

export type LuminaOrbState = 'idle' | 'thinking';

export interface LuminaOrbProps {
  /**
   * Current animation state of the orb.
   * - 'idle': gentle floating & breathing motion.
   * - 'thinking': energetic liquid flow & dynamic chromatic waves.
   * @default 'thinking'
   */
  state?: LuminaOrbState;
  /**
   * Width and height of the orb in pixels.
   * @default 48
   */
  size?: number;
  /**
   * Optional custom CSS class name.
   */
  className?: string;
  /**
   * Optional MUI sx style overrides.
   */
  sx?: SxProps<Theme>;
  /**
   * Fallback color passed to LuminaAnimatedFace if WebGPU is unsupported.
   */
  primaryColor?: string;
  /**
   * Secondary color passed to LuminaAnimatedFace fallback.
   */
  secondaryColor?: string;
}
