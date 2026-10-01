import type { ThemeMode } from '@/context/theme/ColorModeContext';
import type { IconName } from './icons';

// Order the theme button cycles through, and the icon of each theme.
export const THEME_ORDER: ThemeMode[] = ['light', 'dark', 'graydark'];
export const THEME_ICONS: Record<ThemeMode, IconName> = {
  light: 'light_mode',
  dark: 'dark_mode',
  graydark: 'contrast',
};
