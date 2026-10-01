import { useTheme } from '@mui/material';
import type { ThemeMode } from '@/context/theme/ColorModeContext';

// Color tokens of the public site (landing and marketing pages), one set per
// app theme. Values come from the site design; the app's own theme keeps
// driving the dashboard.
const TOKENS = {
  light: {
    bg: '#ffffff',
    bg2: '#f6f7f8',
    surface: '#ffffff',
    surface2: '#f1f3f5',
    border: '#e4e6ea',
    text: '#111215',
    muted: '#565b65',
    brand: '#008767',
    onBrand: '#ffffff',
    brandSoft: 'rgba(0,135,103,.09)',
    brandText: '#007559',
    navBg: 'rgba(255,255,255,.78)',
    event: '#e9ebef',
    eventText: '#353942',
    stripe: 'rgba(17,18,21,.05)',
    shadow: '0 1px 2px rgba(17,18,21,.05),0 6px 20px rgba(17,18,21,.05)',
    shadowH: '0 2px 6px rgba(17,18,21,.07),0 18px 40px rgba(17,18,21,.11)',
    lumBg: '#111215',
    lumSurface: '#18191e',
    lumBorder: '#25272e',
  },
  dark: {
    bg: '#111215',
    bg2: '#141519',
    surface: '#18191e',
    surface2: '#1f2127',
    border: '#25272e',
    text: '#ecedf0',
    muted: '#9da1ab',
    brand: '#10B981',
    onBrand: '#04281d',
    brandSoft: 'rgba(16,185,129,.13)',
    brandText: '#34d399',
    navBg: 'rgba(17,18,21,.72)',
    event: '#262830',
    eventText: '#c9ccd3',
    stripe: 'rgba(255,255,255,.04)',
    shadow: '0 1px 2px rgba(0,0,0,.4),0 6px 20px rgba(0,0,0,.25)',
    shadowH: '0 2px 6px rgba(0,0,0,.5),0 18px 40px rgba(0,0,0,.45)',
    lumBg: '#0b0c0f',
    lumSurface: '#15161a',
    lumBorder: '#25272e',
  },
  graydark: {
    bg: '#1e2024',
    bg2: '#222428',
    surface: '#272a2f',
    surface2: '#2e3137',
    border: '#383b42',
    text: '#eceef1',
    muted: '#a7abb4',
    brand: '#10B981',
    onBrand: '#04281d',
    brandSoft: 'rgba(16,185,129,.13)',
    brandText: '#34d399',
    navBg: 'rgba(30,32,36,.74)',
    event: '#33363d',
    eventText: '#d0d3d9',
    stripe: 'rgba(255,255,255,.04)',
    shadow: '0 1px 2px rgba(0,0,0,.3),0 6px 20px rgba(0,0,0,.2)',
    shadowH: '0 2px 6px rgba(0,0,0,.4),0 18px 40px rgba(0,0,0,.35)',
    lumBg: '#141518',
    lumSurface: '#1c1d22',
    lumBorder: '#2e3037',
  },
} satisfies Record<ThemeMode, Record<string, string>>;

export type SiteTokens = (typeof TOKENS)['light'];

// Lumina section: always dark, whatever the theme.
export const LUMINA = {
  text: '#ecedf0',
  heading: '#f4f5f7',
  muted: '#a9adb6',
  faint: '#80848d',
  accent: '#34d399',
  brand: '#10B981',
  onBrand: '#04281d',
  accentSoft: 'rgba(16,185,129,.14)',
} as const;

export const FONT_HEADING = 'Outfit, sans-serif';
export const FONT_BODY = 'Inter, system-ui, sans-serif';
export const FONT_MONO = 'ui-monospace, Menlo, monospace';

export const useSiteTokens = (): SiteTokens => {
  const theme = useTheme();
  return TOKENS[
    theme.appMode ?? (theme.palette.mode === 'dark' ? 'dark' : 'light')
  ];
};

/** Striped background used by media placeholders. */
export const stripes = (t: SiteTokens, size = 10) =>
  `repeating-linear-gradient(135deg,${t.stripe} 0 ${size}px,transparent ${size}px ${size * 2}px),${t.surface}`;
