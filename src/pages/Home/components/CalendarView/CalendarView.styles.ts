import { Box, styled, alpha } from '@mui/material';

export const CalendarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDayView',
})<{ isDayView?: boolean }>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: 'auto',
  minHeight: '100%',
  flex: 1,
  // Override React Big Calendar styles for Dark Mode
  // Make the calendar fill all available height
  '& .rbc-calendar': {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flex: 1,
  },

  '& .rbc-month-row .rbc-row-bg > div': {
    borderLeft: `1px solid ${theme.palette.divider} !important`,
    borderRight: `1px solid ${theme.palette.divider} !important`,
  },
  // Force all react-big-calendar borders to use theme divider - Notion style thinner borders
  '& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view, & .rbc-month-row, & .rbc-day-bg, & .rbc-time-content, & .rbc-timeslot-group, & .rbc-time-slot, & .rbc-header, & .rbc-time-header-content, & .rbc-time-header, & .rbc-time-gutter':
    {
      borderColor: `${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'} !important`,
    },

  '& .rbc-event-label': {
    display: 'none',
  },
  '& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view': {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },

  // Month view: fill all available height
  '& .rbc-month-view': {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
  },

  '& .rbc-off-range-bg': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.default, 0.5)
        : theme.palette.grey[100],
  },

  '& .rbc-month-row + .rbc-month-row': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },

  '& .rbc-time-view .rbc-allday-cell': {
    display: 'none',
  },
  '& .rbc-day-bg + .rbc-day-bg': {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  '& .rbc-day-bg': {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  '& .rbc-time-content': {
    borderTop: `1px solid ${theme.palette.divider}`,
    scrollbarWidth: 'thin',
    msOverflowStyle: 'none',
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    height: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(0, 0, 0, 0.2)',
      borderRadius: '3px',
    },
  },
  '& .rbc-time-view': {
    minHeight: 'calc(30 * 80px)', // Ensure enough height for 30 hours at 80px per hour
  },
  '& .rbc-time-content > * + * > *': {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  // Perfect Scrollbar Customizations
  '& .ps__rail-y': {
    zIndex: 10,
    backgroundColor: 'transparent !important',
    width: '8px !important',
  },
  '& .ps__thumb-y': {
    backgroundColor: `${theme.palette.divider} !important`,
    width: '4px !important',
    borderRadius: '4px !important',
  },
  '& .ps__rail-y:hover .ps__thumb-y, & .ps__rail-y.ps--clicking .ps__thumb-y': {
    backgroundColor: `${theme.palette.text.secondary} !important`,
  },
  '& .rbc-timeslot-group': {
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}`,
    minHeight: '80px', // Increased hour height for better visibility
    display: 'flex',
    flexDirection: 'column',
  },
  '& .rbc-time-slot': {
    minHeight: '15px', // Each 15-min slot height
    flex: 1,
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'}`,
    },
  },
  '& .rbc-today': {
    backgroundColor: 'transparent !important',
  },
  '& .rbc-event': {
    backgroundColor: 'transparent', // Custom component handles bg
    padding: 0,
    outline: 'none',
    border: 'none',
    '&:focus': { outline: 'none' },
  },
  '& .rbc-header + .rbc-header': {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  '& .rbc-header.rbc-today': {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '& .rbc-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
    fontWeight: 500,
    padding: '10px 0',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
    fontSize: '13px',
  },
  '& .rbc-time-header-content': {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  '& .rbc-time-header.rbc-overflowing': {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  // Fix for Week view header height
  '& .rbc-time-header-cell': {
    minHeight: '60px', // Force enough height for stacked header
  },
  '& .rbc-toolbar button': {
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.rbc-active': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#ffffff',
      boxShadow: 'none',
    },
  },
  '& .rbc-time-gutter': {
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
  },

  '& .rbc-label': {
    color: theme.palette.text.secondary,
    fontSize: '12px',
    fontWeight: 400,
  },
  '& .rbc-current-time-indicator': {
    backgroundColor: '#ef4444', // Red line
    height: '1px',
  },
  '& .rbc-show-more': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '11px',
    padding: '2px 4px',
    cursor: 'pointer',
    background: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Month rows: flex to fill available height instead of fixed 104px
  '& .rbc-month-view .rbc-month-row': {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  '& .rbc-month-view .rbc-row-bg': {
    flex: 1,
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
    padding: '6px 10px 2px 0',
    textAlign: 'right',
    '& button': {
      fontSize: '13px',
      fontWeight: 400,
      color: theme.palette.text.primary,
    },
  },

  '& .rbc-month-view .rbc-date-cell.rbc-now': {
    '& button': {
      backgroundColor: theme.palette.primary.main,
      color: '#ffffff !important',
      width: '26px',
      height: '26px',
      borderRadius: '4px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0',
      padding: '0',
      minWidth: '26px',
      fontWeight: 500,
      fontSize: '13px',
    },
  },

  '& .rbc-month-view .rbc-event': {
    height: '24px !important',
    minHeight: '24px !important',
    maxHeight: '24px !important',
    margin: '2px 3px !important',
    padding: '0 !important',
    backgroundColor: 'transparent !important',
    '& .event-icon-container': { display: 'none' },
    '& .event-card-inner': {
      padding: '3px 8px !important',
      gap: '0 !important',
    },
    '& .event-info': { flexDirection: 'row', alignItems: 'center', gap: '6px' },
    '& .event-info span:last-child': { display: 'none' },
  },

  // Week / Day view event overrides
  '& .rbc-time-view .rbc-event': {
    overflow: 'visible',
    '& .event-card-inner': {
      overflow: 'hidden',
    },
  },
  // Short events in week/day view (30 min or less)
  '& .rbc-time-view .rbc-event[style*="height"]': {
    minHeight: '20px !important',
  },
}));
