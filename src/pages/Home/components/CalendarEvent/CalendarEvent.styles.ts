import { Box, styled, alpha } from '@mui/material';
import type { Task } from '@/redux/tasks/task.types';

// Priority-based soft pastel color palette — elegant, non-saturated pastels
export const PRIORITY_COLORS: Record<number, { main: string }> = {
  1: { main: '#D1FAE5' }, // Low → Verde salvia pastel
  2: { main: '#DBEAFE' }, // Medium → Azul cielo pastel
  3: { main: '#FEF3C7' }, // High → Ámbar suave pastel
  4: { main: '#FEE2E2' }, // Critical → Rosa suave pastel
};

const GOOGLE_EVENT_COLOR = { main: '#CFFAFE' }; // Cyan pastel for Google events
export const DEFAULT_COLOR = { main: '#E0E7FF' }; // Lavanda suave pastel fallback (no tan saturado)

export const getEventColor = (event: {
  id?: string;
  type?: string;
  resource?: unknown;
}): { main: string; isCustom: boolean } => {
  if (event.type === 'event')
    return { main: GOOGLE_EVENT_COLOR.main, isCustom: false };

  const task = event.resource as (Task & { color?: string }) | undefined;

  // 1. Check for custom color directly on task
  if (task?.color && task.color !== '#1e293b' && task.color !== '') {
    return { main: task.color, isCustom: true };
  }

  // 2. Check for custom color tag in notes_encrypted
  if (task?.notes_encrypted) {
    const colorMatch = task.notes_encrypted.match(/\[COLOR:(.*?)\]/);
    if (
      colorMatch &&
      colorMatch[1] &&
      colorMatch[1] !== '#1e293b' &&
      colorMatch[1] !== ''
    ) {
      return { main: colorMatch[1], isCustom: true };
    }
  }

  // 3. Fallback to priority pastel color (soft, non-saturated pastel)
  if (task?.priority_level && PRIORITY_COLORS[task.priority_level]) {
    return {
      main: PRIORITY_COLORS[task.priority_level].main,
      isCustom: true,
    };
  }

  // 4. Default soft pastel color for any task without color (Lavanda suave)
  return { main: DEFAULT_COLOR.main, isCustom: true };
};

import type { Theme } from '@mui/material';
import type { SemanticTheme } from './calendarSemanticTheme';

export const darkenHex = (hex: string, factor: number): string => {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3)
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const mult = Math.max(0, Math.min(1, 1 - factor));
  const toHex = (n: number) =>
    Math.round(n * mult)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const lightenHex = (hex: string, factor: number): string => {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3)
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const mult = Math.max(0, Math.min(1, factor));
  const toHex = (n: number) =>
    Math.round(n + (255 - n) * mult)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const blendHex = (
  hex: string,
  bgHex: string,
  weight: number,
): string => {
  const parse = (h: string) => {
    let clean = h.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const num = parseInt(clean, 16);
    return isNaN(num)
      ? [200, 200, 200]
      : [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(bgHex);

  const w = Math.min(Math.max(weight, 0), 1);
  const r = Math.round(w * r1 + (1 - w) * r2);
  const g = Math.round(w * g1 + (1 - w) * g2);
  const b = Math.round(w * b1 + (1 - w) * b2);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const getContrastTextColor = (hex: string) => {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3)
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return {
      primary: '#090d16',
      secondary: '#1e293b',
      chipBg: '#e2e8f0',
      chipBorder: '#cbd5e1',
      chipText: '#090d16',
      isDarkBg: false,
    };
  }
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // Perceived brightness formula (YIQ standard)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  const isLight = yiq >= 140;

  return {
    primary: isLight ? '#090d16' : '#ffffff', // Extremely dark slate/black on light, pure white on dark
    secondary: isLight ? '#1e293b' : '#f1f5f9', // Dark slate on light, soft white on dark
    chipBg: isLight ? darkenHex(hex, 0.1) : lightenHex(hex, 0.18),
    chipBorder: isLight ? darkenHex(hex, 0.22) : lightenHex(hex, 0.35),
    chipText: isLight ? '#090d16' : '#ffffff',
    isDarkBg: !isLight,
  };
};

export const resolveEventColors = (
  theme: Theme,
  semanticTheme?: SemanticTheme,
  fallbackMain?: string,
  isCustomColor?: boolean,
) => {
  const isDark = theme.palette.mode === 'dark';
  const isGray = (theme as { appMode?: string }).appMode === 'graydark';

  // If the task has a custom/default color assigned:
  // Dynamically calculate high-contrast text and chips so all text is 100% visible and sharp
  if (isCustomColor && fallbackMain) {
    const hex = fallbackMain;
    const contrast = getContrastTextColor(hex);

    return {
      bg: hex, // Exact solid pastel color
      border: contrast.isDarkBg ? lightenHex(hex, 0.2) : darkenHex(hex, 0.14),
      hover: contrast.isDarkBg ? lightenHex(hex, 0.08) : darkenHex(hex, 0.04),
      tagBg: contrast.chipBg,
      tagBorder: contrast.chipBorder,
      tagColor: contrast.chipText,
      textColor: contrast.primary,
      secondaryColor: contrast.secondary,
    };
  }

  if (semanticTheme) {
    const bg = isGray
      ? semanticTheme.bgGray
      : isDark
        ? semanticTheme.bgDark
        : semanticTheme.bgLight;

    const border = isGray
      ? semanticTheme.borderGray
      : isDark
        ? semanticTheme.borderDark
        : semanticTheme.borderLight;

    const hover = isGray
      ? semanticTheme.hoverGray
      : isDark
        ? semanticTheme.hoverDark
        : semanticTheme.hoverLight;

    return {
      bg,
      border,
      hover,
      tagBg: isDark ? semanticTheme.tagBgDark : semanticTheme.tagBgLight,
      tagBorder: isDark
        ? semanticTheme.tagBorderDark
        : semanticTheme.tagBorderLight,
      tagColor: isDark
        ? semanticTheme.tagColorDark
        : semanticTheme.tagColorLight,
      textColor: isDark
        ? semanticTheme.textColorDark
        : semanticTheme.textColorLight,
    };
  }

  // Fallback when no semanticTheme
  const main = fallbackMain || '#94a3b8';
  if (isDark) {
    const surface = isGray ? '#19191A' : '#0F0F10';
    return {
      bg: isGray ? '#1f242b' : '#141820',
      border: blendHex(main, surface, 0.32),
      hover: isGray ? '#252b34' : '#1b212c',
      tagBg: isGray ? '#282f3a' : '#1c222c',
      tagBorder: isGray ? '#3b4759' : '#2b3648',
      tagColor: '#cbd5e1',
      textColor: '#f1f5f9',
    };
  }
  return {
    bg: '#ffffff',
    border: blendHex(main, '#ffffff', 0.4),
    hover: '#f8fafc',
    tagBg: '#f1f5f9',
    tagBorder: '#e2e8f0',
    tagColor: '#475569',
    textColor: '#0f172a',
  };
};

export const EventContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'variant' &&
    prop !== 'isMeeting' &&
    prop !== 'overlapIndex' &&
    prop !== 'isDraft' &&
    prop !== 'semanticTheme' &&
    prop !== 'isCustomColor',
})<{
  variant: { main: string; isCustom?: boolean };
  isMeeting?: boolean;
  overlapIndex?: number;
  isDraft?: boolean;
  semanticTheme?: SemanticTheme;
  isCustomColor?: boolean;
}>(({ theme, variant, isMeeting, isDraft, semanticTheme, isCustomColor }) => {
  const isDark = theme.palette.mode === 'dark';
  const isGray = (theme as { appMode?: string }).appMode === 'graydark';
  const colors = resolveEventColors(
    theme,
    semanticTheme,
    variant.main,
    isCustomColor,
  );

  // ── Draft card (dashed outline) ──
  if (isDraft) {
    const textColor = isDark ? '#f1f5f9' : '#1e293b';

    return {
      backgroundColor: colors.bg,
      color: textColor,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: '6px 10px',
      overflow: 'hidden',
      cursor: 'pointer',
      zIndex: 1,
      borderRadius: '8px',
      border: `1.5px dashed ${colors.border}`,
      boxShadow: 'none',
      transition: 'background-color 0.15s ease, border-color 0.15s ease',
      boxSizing: 'border-box',
      '&:hover': {
        zIndex: 20,
        backgroundColor: colors.hover,
        borderColor: colors.border,
      },
    };
  }

  // ── Meeting card (dashed border, solid muted surface) ──
  if (isMeeting) {
    const meetingBorder = isDark ? (isGray ? '#333e4d' : '#273240') : '#cbd5e1';
    const meetingBg = isDark ? (isGray ? '#1d2228' : '#12161d') : '#f8fafc';
    const meetingHover = isDark ? (isGray ? '#232931' : '#191f27') : '#f1f5f9';

    return {
      backgroundColor: meetingBg,
      color: isDark ? '#e2e8f0' : '#1e293b',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: '6px 10px',
      position: 'relative',
      borderRadius: '8px',
      border: `1.5px dashed ${meetingBorder}`,
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: 'none',
      zIndex: 1,
      transition: 'background-color 0.15s ease, border-color 0.15s ease',
      boxSizing: 'border-box',
      '&:hover': {
        backgroundColor: meetingHover,
        borderColor: isDark ? (isGray ? '#47566a' : '#39485b') : '#94a3b8',
        zIndex: 20,
      },
    };
  }

  // ── Semantic & Custom Solid Card ──
  const textColor = isDark ? '#f1f5f9' : '#0f172a';

  return {
    backgroundColor: colors.bg,
    color: textColor,
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '6px 10px',
    overflow: 'hidden',
    cursor: 'pointer',
    zIndex: 1,
    boxShadow: isDark
      ? '0 1px 3px rgba(0, 0, 0, 0.2)'
      : '0 1px 2px rgba(0, 0, 0, 0.03)',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: colors.hover,
      borderColor: colors.border,
      boxShadow: isDark
        ? '0 2px 6px rgba(0, 0, 0, 0.3)'
        : '0 2px 6px rgba(0, 0, 0, 0.06)',
      zIndex: 20,
    },
    '&[data-expanded="true"]': {
      height: 'auto !important',
      minHeight: '100% !important',
      overflow: 'visible !important',
      zIndex: '100 !important',
      boxShadow: isDark
        ? '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) !important'
        : '0 12px 32px -4px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.1) !important',
    },
  };
});

export const priorityCircleSx = (color: string, isSelected: boolean) => ({
  width: 18,
  height: 18,
  borderRadius: '50%',
  backgroundColor: color,
  border: isSelected ? '2px solid' : '2px solid transparent',
  borderColor: isSelected ? 'text.primary' : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.2)',
    boxShadow: `0 0 10px ${alpha(color, 0.4)}`,
  },
});

export const contextMenuSx = {
  '& .MuiPaper-root': {
    borderRadius: '12px',
    minWidth: '180px',
    padding: '4px 0',
    boxShadow:
      '0px 10px 25px -5px rgba(0,0,0,0.2), 0px 8px 10px -6px rgba(0,0,0,0.1)',
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
    backgroundImage: 'none',
    backdropFilter: 'blur(20px)',
  },
  '& .MuiMenuItem-root': {
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 12px',
    margin: '2px 8px',
    borderRadius: '8px',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: 'action.hover',
      color: 'primary.main',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '18px',
      opacity: 0.8,
    },
  },
  '& .MuiDivider-root': {
    margin: '4px 0',
    opacity: 0.6,
  },
};
