import { Box, styled, alpha } from '@mui/material';

export const NextTaskContainer = styled(Box)(({ theme }) => ({
  padding: '12px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
  borderRadius: '6px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.4)'
      : 'rgba(255, 255, 255, 0.5)',
  marginBottom: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(30, 41, 59, 0.6)'
        : 'rgba(255, 255, 255, 0.8)',
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.1)',
  },
}));

export const TaskTimeBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 8px',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  borderRadius: '4px',
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  alignSelf: 'flex-start',
}));

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  padding: '16px 12px',
  border: `1px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
  borderRadius: '6px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.2)'
      : 'rgba(255, 255, 255, 0.3)',
  marginBottom: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
}));
