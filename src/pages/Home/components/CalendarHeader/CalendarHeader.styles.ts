import { Box, Typography, styled } from '@mui/material';

export const HeaderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 0',
  height: '52px', // Matches the new header height in CalendarView.styles.ts
});

export const DayName = styled(Typography)(({ theme }) => ({
  fontSize: '10px',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '2px',
}));

export const DayNumber = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: active ? '#ffffff' : theme.palette.text.primary,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
}));
