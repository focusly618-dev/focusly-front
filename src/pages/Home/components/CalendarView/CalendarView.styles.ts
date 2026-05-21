import { Box, styled } from '@mui/material';

export const CalendarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDayView',
})<{ isDayView?: boolean }>(({ theme, isDayView }) => {
  const isDark = theme.palette.mode === 'dark';

  // ── Use the SAME colors as the global MUI theme ──
  const bgDefault = theme.palette.background.default; // #1b1b1d (dark) / #f8fafc (light)
  const bgPaper = theme.palette.background.paper; // #23252a (dark) / #ffffff (light)
  const divider = isDark ? 'rgba(255, 255, 255, 0.08)' : theme.palette.divider; // theme divider is 0.05, slightly boosted
  const dividerStrong = isDark
    ? 'rgba(255, 255, 255, 0.14)'
    : 'rgba(0, 0, 0, 0.1)';
  const dividerSubtle = isDark
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(0, 0, 0, 0.03)';
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

  return {
    backgroundColor: bgDefault,
    height: '100%',
    flex: 1,

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
    },
    '& .rbc-day-bg + .rbc-day-bg': {
      borderLeft: `1px solid ${divider}`,
    },
    '& .rbc-day-slot': {
      backgroundColor: `${bgDefault} !important`,
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
      backgroundColor: `${bgDefault} !important`,
      borderBottom: `1px solid ${dividerStrong} !important`,
      minHeight: '56px',
      display: 'flex',
      flexDirection: 'column',
    },
    '& .rbc-time-slot': {
      backgroundColor: `${bgDefault} !important`,
      flex: 1,
      border: 'none !important',
      '&:not(:last-child)': {
        borderBottom: `1px solid ${dividerSubtle} !important`,
      },
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
    },
    '& .rbc-time-gutter .rbc-time-slot': {
      backgroundColor: `${bgPaper} !important`,
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
      backgroundColor: 'transparent',
      padding: 0,
      outline: 'none',
      border: 'none',
      '&:focus': { outline: 'none' },
    },

    // ── Current time indicator ──
    '& .rbc-current-time-indicator': {
      backgroundColor: '#ef4444',
      height: '2px',
      zIndex: 3,
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '-4px',
        top: '-3px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#ef4444',
      },
    },

    // ── Toolbar buttons ──
    '& .rbc-toolbar button': {
      color: textPrimary,
      borderColor: divider,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.rbc-active': {
        backgroundColor: `${theme.palette.primary.main} !important`,
        color: '#ffffff',
        boxShadow: 'none',
      },
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
    },
    '& .rbc-month-row': {
      backgroundColor: `${bgDefault} !important`,
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
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
    },
    '& .rbc-off-range-bg': {
      backgroundColor: isDark
        ? `${theme.palette.background.default} !important`
        : '#f3f4f6 !important',
      opacity: isDark ? 0.6 : 1,
    },
    '& .rbc-month-view .rbc-row-bg': {
      flex: 1,
      backgroundColor: `${bgDefault} !important`,
    },
    '& .rbc-month-view .rbc-row-content': {
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    '& .rbc-month-view .rbc-row-content .rbc-row': {
      minHeight: '22px',
    },
    '& .rbc-month-view .rbc-row-segment': {
      padding: '0 2px 1px 2px',
    },
    '& .rbc-month-view .rbc-show-more': {
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: '11px',
      lineHeight: 1.1,
      padding: '0 4px',
      marginTop: '1px',
      background: 'none',
    },
    '& .rbc-month-view .rbc-date-cell': {
      padding: '4px 8px 2px 0',
      textAlign: 'right',
      '& button': {
        fontSize: '12px',
        fontWeight: 500,
        color: textPrimary,
      },
    },
    '& .rbc-month-view .rbc-date-cell.rbc-now': {
      '& button': {
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff !important',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0',
        padding: '0',
        minWidth: '24px',
        fontWeight: 600,
        fontSize: '12px',
      },
    },
    '& .rbc-month-view .rbc-event': {
      height: '24px !important',
      minHeight: '24px !important',
      maxHeight: '24px !important',
      margin: '1px 0 !important',
      padding: '0 !important',
      backgroundColor: 'transparent !important',
      '& .event-icon-container': { display: 'none' },
      '& .event-card-inner': {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      },
      '& .event-info': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',
        width: '100%',
        overflow: 'hidden',
      },
      '& .event-info > *:last-child': { display: 'none' }, // Hide time range in month view
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  WEEK / DAY VIEW events
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    '& .rbc-time-view .rbc-event': {
      overflow: 'visible',
      width: '100% !important', // Take almost full width
      backgroundColor: 'transparent !important',
      '& .event-card-inner': {
        overflow: 'hidden',
      },
    },
    '& .rbc-time-view .rbc-event[style*="height"]': {
      minHeight: '20px !important',
    },
  };
});
