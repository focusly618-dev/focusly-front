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
const DEFAULT_COLOR = { main: '#A78BFA' }; // Lavender fallback

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
    prop !== 'variant' && prop !== 'isMeeting' && prop !== 'overlapIndex',
})<{ variant: { main: string }; isMeeting?: boolean; overlapIndex?: number }>(({
  theme,
  variant,
  isMeeting,
  overlapIndex = 0,
}) => {
  const isDark = theme.palette.mode === 'dark';

  // Overlap adjustments
  const hueRotation = overlapIndex > 0 ? (overlapIndex * 40) % 360 : 0;
  const brightnessIdx = overlapIndex > 0 ? 1 - overlapIndex * 0.08 : 1;

  // ── Meeting card (dashed border, clean background) ──
  if (isMeeting) {
    const MEETING_COLOR = '#60A5FA';
    return {
      backgroundColor: isDark ? alpha('#1e293b', 0.9) : '#ffffff',
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
      filter:
        overlapIndex > 0
          ? `hue-rotate(${hueRotation}deg) brightness(${brightnessIdx})`
          : 'none',
      zIndex: overlapIndex + 1,
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

  // ── Standard task card — Opaque backgrounds with subtle tint ──
  const bgColor = isDark
    ? '#1e1e21' // Solid dark, matches app background
    : '#ffffff'; // Solid white

  const bgHover = isDark ? '#2a2a2e' : '#f1f5f9';

  const textColor = isDark ? alpha('#ffffff', 0.95) : alpha('#0f172a', 0.9);

  return {
    backgroundColor: bgColor,
    color: textColor,
    height: '100%',
    width: `calc(100% - ${overlapIndex * 32}px)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '4px 6px',
    borderRadius: '4px',
    overflow: 'hidden',
    cursor: 'pointer',
    zIndex: overlapIndex + 1,
    boxShadow: 'none',
    filter: overlapIndex > 0 ? `brightness(${brightnessIdx})` : 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
    borderLeft: `4px solid ${variant.main}`,

    // ── Staircase Stacking (32px offset for title visibility) ──
    transform: `translateX(${overlapIndex * 32}px)`,

    '&:hover': {
      backgroundColor: bgHover,
      boxShadow: 'none',
      zIndex: 200,
      transform: `translateX(${overlapIndex * 32}px) scale(1.02) translateZ(0)`,
      borderColor: alpha(variant.main, 0.6),
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
