import type { Theme } from '@mui/material/styles';

// Resolves a surface color across light/dark/graydark: "graydark" swaps
// near-black dark surfaces for neutral grays while light and regular dark
// keep their existing look.
export const surfaceColor = (
  theme: Theme,
  dark: string,
  gray: string,
  light: string,
) =>
  theme.palette.mode !== 'dark'
    ? light
    : theme.appMode === 'graydark'
      ? gray
      : dark;
