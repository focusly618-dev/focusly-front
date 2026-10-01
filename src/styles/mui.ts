import type { SxProps } from '@mui/material';
import { keyframes, type Theme } from '@mui/material/styles';

// Neutral and accent scales used across the AI and marketing components
// (same values the former utility classes resolved to).
export const zinc = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
} as const;

export const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
} as const;

export const emerald = {
  50: '#ecfdf5',
  100: '#d1fae5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  500: '#10b981',
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
  950: '#022c22',
} as const;

export const amber = {
  50: '#fffbeb',
  500: '#f59e0b',
  950: '#451a03',
} as const;

export const purple = {
  50: '#faf5ff',
  400: '#c084fc',
  600: '#9333ea',
  950: '#3b0764',
} as const;

export const rose = {
  400: '#fb7185',
  500: '#f43f5e',
  600: '#e11d48',
} as const;

// Focusly brand green (light / dark variants).
export const brand = {
  main: '#008767',
  hover: '#007357',
  dark: '#10B981',
} as const;

/** sx value that resolves to `light` or `dark` depending on the theme mode. */
export const byMode =
  <T>(light: T, dark: T) =>
  (theme: Theme): T =>
    theme.palette.mode === 'dark' ? dark : light;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const blink = keyframes`
  50% { opacity: 0; }
`;

/** Typing-dots pulse: dim, bright at 40%, dim again. */
export const dotPulse = keyframes`
  0%, 80%, 100% { opacity: .25; }
  40% { opacity: 1; }
`;

export const pulse = keyframes`
  50% { opacity: 0.5; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/** Single-line text that ends with an ellipsis. */
export const truncateSx = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

/** Visually hidden but readable by screen readers. */
export const visuallyHiddenSx = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;

/** Combines a component's base sx with the sx passed by its caller. */
export const mergeSx = (
  ...styles: (SxProps<Theme> | undefined)[]
): SxProps<Theme> =>
  styles.flatMap((style) =>
    Array.isArray(style) ? style : style ? [style] : [],
  ) as SxProps<Theme>;
