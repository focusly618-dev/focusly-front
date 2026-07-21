import { Box, styled, alpha } from '@mui/material';
import type { Task } from '@/redux/tasks/task.types';

// Priority-based color palette — refined, slightly desaturated for elegance
export const PRIORITY_COLORS: Record<number, { main: string }> = {
  1: { main: '#34D399' }, // Low → Emerald
  2: { main: '#60A5FA' }, // Medium → Sky blue
  3: { main: '#FBBF24' }, // High → Amber
  4: { main: '#F87171' }, // Critical → Coral red
};

const GOOGLE_EVENT_COLOR = { main: '#22D3EE' }; // Cyan for Google events
const DEFAULT_COLOR = { main: '#A78BFA' }; // Lavender fallback (indicates no color assigned)

export const getEventColor = (event: {
  id?: string;
  type?: string;
  resource?: unknown;
}) => {
  if (event.type === 'event') return GOOGLE_EVENT_COLOR;

  const task = event.resource as Task | undefined;

  // 1. Check for custom color tag in notes
  if (task?.notes_encrypted) {
    const colorMatch = task.notes_encrypted.match(/\[COLOR:(.*?)\]/);
    if (colorMatch && colorMatch[1]) {
      return { main: colorMatch[1] };
    }
  }

  // 2. Fallback to priority color
  if (task?.priority_level) {
    return PRIORITY_COLORS[task.priority_level] || DEFAULT_COLOR;
  }

  return DEFAULT_COLOR;
};

export const EventContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'variant' &&
    prop !== 'isMeeting' &&
    prop !== 'overlapIndex' &&
    prop !== 'isDraft',
})<{
  variant: { main: string };
  isMeeting?: boolean;
  overlapIndex?: number;
  isDraft?: boolean;
}>(({ theme, variant, isMeeting, isDraft }) => {
  const isDark = theme.palette.mode === 'dark';

  // ── Draft card (dashed border, pulse animation) ──
  if (isDraft) {
    const borderColor = variant.main;
    return {
      backgroundColor: isDark
        ? alpha(borderColor, 0.1)
        : alpha(borderColor, 0.05),
      color: isDark ? alpha('#ffffff', 0.9) : '#4a5568',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2px 6px',
      overflow: 'hidden',
      cursor: 'pointer',
      zIndex: 1,
      boxShadow: 'none',
      borderRadius: '6px',
      border: `2px dashed ${borderColor}`,
      opacity: 0.75,
      animation: 'draftPulse 2s infinite ease-in-out',
      '@keyframes draftPulse': {
        '0%': { opacity: 0.65 },
        '50%': { opacity: 0.85 },
        '100%': { opacity: 0.65 },
      },
      '&:hover': {
        opacity: 0.95,
        backgroundColor: isDark
          ? alpha(borderColor, 0.25)
          : alpha(borderColor, 0.15),
      },
    };
  }

  // ── Meeting card (dashed border, clean background) ──
  if (isMeeting) {
    const MEETING_COLOR = '#60A5FA';
    return {
      backgroundColor: isDark ? alpha('#1e293b', 0.1) : '#ffffff',
      color: isDark ? '#e2e8f0' : '#1e293b',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2px 8px',
      position: 'relative',
      borderRadius: '6px',
      borderLeft: `3px solid ${MEETING_COLOR}`,
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: 'none',
      zIndex: 1,
      transition: 'all 0.15s ease',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: `1.5px dashed ${alpha(MEETING_COLOR, 0.4)}`,
        borderLeft: 'none',
        borderRadius: 'inherit',
        pointerEvents: 'none',
      },
      '&:hover': {
        backgroundColor: isDark ? alpha('#1e293b', 1) : '#f8fafc',
        boxShadow: 'none',
        zIndex: 50,
      },
    };
  }

  // ── Standard task card — Solid pastel backgrounds ──
  // Use lighten/darken to create solid colors instead of transparent alpha, so grid lines don't show through.
  const isDefaultColor = variant.main === DEFAULT_COLOR.main;

  const textColor = isDark ? alpha('#ffffff', 0.95) : '#6f6f6fff';

  // If no color assigned (DEFAULT_COLOR), use neutral background with black left border
  // If color assigned, use colored background with colored left border
  const finalBgColor = isDefaultColor
    ? isDark
      ? '#1e293b'
      : '#ffffff'
    : isDark
      ? '#1e293b'
      : '#ffffff';

  const finalBgHover = isDefaultColor
    ? isDark
      ? '#2d3748'
      : '#f1f5f9'
    : isDark
      ? '#2d3748'
      : '#f1f5f9';

  const borderColor = variant.main;

  return {
    backgroundColor: finalBgColor,
    color: textColor,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '2px 6px',
    overflow: 'hidden',
    cursor: 'pointer',
    zIndex: 1,
    boxShadow: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '6px',
    border: `1px solid ${theme.palette.divider}`,
    borderLeft: `3px solid ${borderColor}`,
    '&:hover': {
      backgroundColor: finalBgHover,
      boxShadow: 'none',
      zIndex: 200,
      transform: 'none',
      borderLeftColor: alpha(borderColor, 0.8),
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
