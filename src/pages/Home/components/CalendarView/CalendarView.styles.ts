import { Box, styled } from '@mui/material';
import { surfaceColor } from '@/context';

export const CalendarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDayView',
})<{ isDayView?: boolean }>(({ theme, isDayView }) => {
  const isDark = theme.palette.mode === 'dark';

  // ── Use the SAME colors as the global MUI theme ──
  const bgDefault = surfaceColor(theme, '#121318', '#19191A', '#fafbfd');
  const bgPaper = theme.palette.background.paper; // #23252a (dark) / #ffffff (light)
  const divider = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
  const dividerStrong = isDark
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.08)';
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

  return {
    backgroundColor: bgDefault,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  BASE CALENDAR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-calendar': {
      fontFamily: theme.typography.fontFamily,
      color: textPrimary,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flex: 1,
      backgroundColor: `${bgDefault} !important`,
    },

    // ── Main views ──
    '& .rbc-time-view, & .rbc-month-view, & .rbc-agenda-view': {
      backgroundColor: `${bgDefault} !important`,
      border: `1px solid ${divider}`,
    },
    '& .rbc-time-view': {
      [theme.breakpoints.down('sm')]: {
        minWidth: isDayView ? '100%' : '640px',
      },
    },

    // ── Time content (scrollable area with events) ──
    '& .rbc-time-content': {
      backgroundColor: `${bgDefault} !important`,
      borderTop: `1px solid ${divider}`,
      scrollbarWidth: 'thin',
      scrollbarColor: `${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'} transparent`,
      '&::-webkit-scrollbar': { width: '6px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': {
        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        borderRadius: '3px',
      },
    },
    '& .rbc-time-content > * + * > *': {
      borderLeft: `1px solid ${divider}`,
    },

    // ── Day columns ──
    '& .rbc-day-bg': {
      backgroundColor: `${bgDefault} !important`,
      borderLeft: `1px solid ${divider}`,
      transition: 'background-color 0.8s ease-out',
    },
    '& .rbc-day-bg + .rbc-day-bg': {
      borderLeft: `1px solid ${divider}`,
    },
    '& .rbc-day-bg.flash-highlight-column': {
      backgroundColor: `${isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.22)'} !important`,
      transition: 'none !important',
    },
    '& .rbc-day-bg.selected-day-column': {
      backgroundColor: `${isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.06)'} !important`,
    },
    '& .rbc-day-slot': {
      backgroundColor: 'transparent !important',
    },
    '& .rbc-day-slot .rbc-events-container': {
      marginRight: '0px',
    },
    '& .rbc-time-column': {
      backgroundColor: `${bgDefault} !important`,
    },
    '& .rbc-row-bg': {
      backgroundColor: `${bgDefault} !important`,
    },
    '& .rbc-row-content': {
      backgroundColor: 'transparent !important',
    },
    '& .rbc-overlay': {
      backgroundColor: `${bgPaper} !important`,
      border: `1px solid ${divider}`,
      borderRadius: '8px',
      boxShadow: isDark
        ? '0 8px 30px rgba(0,0,0,0.5)'
        : '0 8px 30px rgba(0,0,0,0.1)',
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  TIME SLOTS (the grid lines)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-timeslot-group': {
      backgroundColor: 'transparent !important',
      borderBottom: `1px solid ${dividerStrong} !important`,
      minHeight: '84px',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        minHeight: '64px',
      },
    },
    '& .rbc-time-slot': {
      backgroundColor: 'transparent !important',
      flex: 1,
      border: 'none !important',
      '&:not(:last-child)': {
        borderBottom: '1px solid transparent !important',
      },
    },
    '& .rbc-time-slot.non-working-hour-slot': {
      backgroundColor: `${isDark ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0.035)'} !important`,
    },
    // ── Hide all-day row ──
    '& .rbc-time-view .rbc-allday-cell': {
      display: 'none',
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  HEADERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-time-header': {
      display: isDayView ? 'none' : 'flex',
      backgroundColor: `${bgPaper} !important`,
    },
    '& .rbc-time-header-content': {
      backgroundColor: `${bgPaper} !important`,
      borderLeft: `1px solid ${divider}`,
    },
    '& .rbc-time-header.rbc-overflowing': {
      borderRight: `1px solid ${divider}`,
    },
    '& .rbc-time-header-cell': {
      minHeight: '52px',
      backgroundColor: `${bgPaper} !important`,
    },
    '& .rbc-time-header-gutter': {
      backgroundColor: `${bgPaper} !important`,
    },
    '& .rbc-header': {
      backgroundColor: `${bgPaper} !important`,
      borderBottom: `1px solid ${divider}`,
      borderTop: `1px solid ${divider}`,
      fontWeight: 600,
      fontSize: '12px',
      letterSpacing: '0.02em',
      padding: '8px 0',
      height: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: textPrimary,
      [theme.breakpoints.down('sm')]: {
        fontSize: '10px',
        padding: '6px 0',
      },
    },
    '& .rbc-header + .rbc-header': {
      borderLeft: `1px solid ${divider}`,
    },
    '& .rbc-header.rbc-today': {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },

    // ── Today highlight ──
    '& .rbc-today': {
      backgroundColor: isDark
        ? 'rgba(19, 127, 236, 0.06) !important'
        : 'rgba(19, 127, 236, 0.03) !important',
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  TIME GUTTER (left column with hours)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-time-gutter': {
      backgroundColor: `${bgPaper} !important`,
      borderRight: `1px solid ${divider}`,
    },
    '& .rbc-time-gutter .rbc-timeslot-group': {
      backgroundColor: `${bgPaper} !important`,
      border: 'none !important',
      borderBottom: 'none !important',
      borderTop: 'none !important',
    },
    '& .rbc-time-gutter .rbc-time-slot': {
      backgroundColor: `${bgPaper} !important`,
      border: 'none !important',
      borderBottom: 'none !important',
      borderTop: 'none !important',
    },
    '& .rbc-label': {
      color: textSecondary,
      fontSize: '10px',
      fontWeight: 500,
      fontFamily: '"Inter", "Roboto Mono", monospace',
      letterSpacing: '0.03em',
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  EVENTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-event-label': { display: 'none' },
    '& .rbc-event': {
      padding: '0 !important',
      outline: 'none',
      border: 'none',
      backgroundColor: 'transparent !important',
      boxSizing: 'border-box',
      '&:focus': { outline: 'none' },
    },
    '& .rbc-event:has([data-highlighted="true"])': {
      zIndex: '1000 !important' as unknown as number,
    },
    '& .rbc-event:has([data-expanded="true"])': {
      zIndex: '50 !important' as unknown as number,
      overflow: 'visible !important',
      height: 'auto !important',
    },
    '& .rbc-event:has([data-expanded="true"]) .rbc-event-content': {
      overflow: 'visible !important',
      height: 'auto !important',
    },
    '& .rbc-event:has([data-active-expanded="true"])': {
      zIndex: '300 !important' as unknown as number,
      overflow: 'visible !important',
      height: 'auto !important',
    },
    '& .rbc-event:has([data-active-expanded="true"]) .rbc-event-content': {
      overflow: 'visible !important',
      height: 'auto !important',
    },

    // ── Current time indicator (Active Timeline Line & Badge) ──
    '& .rbc-current-time-indicator': {
      backgroundColor: '#2563eb', // Prominent blue line
      height: '2px',
      zIndex: 20,
      pointerEvents: 'none',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '-5px',
        top: '-4px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.3)',
        zIndex: 22,
      },
    },
    // ── Floating time badge (rendered via JS into the gutter) ──
    '& .rbc-time-badge': {
      position: 'absolute',
      right: '-17px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
      whiteSpace: 'nowrap',
      fontFamily: '"Inter", sans-serif',
      zIndex: 23,
      pointerEvents: 'none',
      lineHeight: 1.4,
      transform: 'translateY(-50%)',
    },

    // ── Show more link ──
    '& .rbc-show-more': {
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: '11px',
      padding: '2px 4px',
      cursor: 'pointer',
      background: 'none',
      '&:hover': { textDecoration: 'underline' },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  MONTH VIEW
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-month-view': {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: `${bgDefault} !important`,
      [theme.breakpoints.down('sm')]: {
        minWidth: '750px',
      },
    },
    '& .rbc-month-row': {
      backgroundColor: `${bgDefault} !important`,
      flex: 1,
      minHeight: '130px',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
    },
    '& .rbc-month-row + .rbc-month-row': {
      borderTop: `1px solid ${divider}`,
    },
    '& .rbc-month-row .rbc-row-bg > div': {
      borderLeft: `1px solid ${divider} !important`,
      borderRight: `1px solid ${divider} !important`,
      backgroundColor: `${bgDefault} !important`,
      transition: 'background-color 0.8s ease-out',
    },
    '& .rbc-month-row .rbc-row-bg > div.flash-highlight-column': {
      backgroundColor: `${isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.22)'} !important`,
      transition: 'none !important',
    },
    '& .rbc-month-row .rbc-row-bg > div.selected-day-column': {
      backgroundColor: `${isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.06)'} !important`,
    },
    '& .rbc-off-range-bg': {
      backgroundColor: isDark
        ? `${theme.palette.background.default} !important`
        : '#f3f4f6 !important',
      opacity: isDark ? 0.4 : 0.6,
    },
    '& .rbc-month-view .rbc-row-bg': {
      flex: 1,
      backgroundColor: `${bgDefault} !important`,
    },
    '& .rbc-month-view .rbc-row-content': {
      flex: 1,
      minHeight: 0,
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
    },
    '& .rbc-month-view .rbc-row-content .rbc-row': {
      minHeight: '22px',
    },
    '& .rbc-month-view .rbc-row-segment': {
      padding: '0 3px 2px 3px',
    },
    '& .rbc-month-view .rbc-date-cell': {
      padding: '4px 8px 2px 0',
      textAlign: 'right',
      '& button': {
        fontSize: '12px',
        fontWeight: 600,
        color: textPrimary,
      },
    },
    '& .rbc-month-view .rbc-date-cell.rbc-now': {
      '& button': {
        color: textPrimary,
        fontWeight: 700,
        fontSize: '13px',
      },
    },
    '& .rbc-month-view .rbc-event': {
      height: 'auto !important',
      minHeight: '20px !important',
      maxHeight: 'none !important',
      margin: '1px 0 !important',
      padding: '0 !important',
      borderRadius: '4px',
      backgroundColor: 'transparent !important',
      border: 'none !important',
      '&:hover': {
        zIndex: 10,
      },
    },

    // Show more button visible and styled
    '& .rbc-month-view .rbc-show-more': {
      display: 'block !important',
      visibility: 'visible !important',
      overflow: 'visible !important',

      position: 'relative',
      '&:hover': { textDecoration: 'underline' },
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  WEEK / DAY VIEW events
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-time-view .rbc-event': {
      overflow: 'visible',
      boxSizing: 'border-box',
      zIndex: 2,
      '&:hover': {
        zIndex: 25,
      },
    },
    '& .rbc-time-view .rbc-event-content': {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    '& .rbc-time-view .rbc-event[style*="height"]': {
      minHeight: '26px !important',
    },
  };
});

export const DraftActionBar = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(1.25, 2.75),
    borderRadius: '9999px',
    backgroundColor: isDark
      ? 'rgba(28, 28, 30, 0.94)'
      : 'rgba(255, 255, 255, 0.96)',
    border: '1px solid',
    borderColor: isDark
      ? 'rgba(168, 85, 247, 0.35)'
      : 'rgba(124, 58, 237, 0.22)',
    backdropFilter: 'blur(20px)',
    boxShadow: isDark
      ? '0 12px 32px -4px rgba(0, 0, 0, 0.65), 0 0 16px 1px rgba(168, 85, 247, 0.18)'
      : '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 0 16px 1px rgba(124, 58, 237, 0.1)',
    animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    '@keyframes slideDown': {
      '0%': { transform: 'translate(-50%, -20px)', opacity: 0 },
      '100%': { transform: 'translate(-50%, 0)', opacity: 1 },
    },
  };
});

export const CalendarTopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px 12px 24px',
  gap: '16px',
  flexWrap: 'wrap',
  borderBottom: `1px solid ${
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0'
  }`,
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  width: '100%',
  flexShrink: 0,
}));
