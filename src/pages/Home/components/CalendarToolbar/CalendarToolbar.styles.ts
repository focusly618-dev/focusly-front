import { Box, ButtonGroup, Typography, styled } from '@mui/material';

export const ToolbarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '10px',
  padding: '10px 36px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
  },
}));

export const DateHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const MainDate = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: '1.2',
}));

export const SubDate = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
  marginTop: '4px',
}));

export const ViewToggle = styled(ButtonGroup)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(0,0,0,0.03)',
  borderRadius: '8px',
  padding: '3px',
  display: 'flex',
  gap: '4px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '& .MuiButton-root': {
    border: 'none !important',
    color: theme.palette.text.secondary,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '12px',
    padding: '4px 12px',
    minWidth: 'auto',
    borderRadius: '6px !important',
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
      color: theme.palette.text.primary,
    },
    '&.active': {
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#ffffff',
      color: theme.palette.primary.main,
      boxShadow:
        theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
    },
  },
}));

export const NavigationButtons = styled(Box)({
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
});

export const NavButton = styled(Box)(({ theme }) => ({
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(0,0,0,0.05)',
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.secondary,
  },
}));
