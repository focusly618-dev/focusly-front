import { styled, Box, Typography, Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

export const sparklesIconSx: SxProps<Theme> = { fontSize: 28 };

export const arrowIconSx: SxProps<Theme> = { fontSize: 18 };

export const acceptButtonWrapperSx: SxProps<Theme> = {
  width: '100%',
  mt: 1,
  p: '4px',
  border: '1px solid rgba(59, 130, 246, 0.4)',
  borderRadius: '16px',
};

export const lightningIconSx: SxProps<Theme> = {
  color: '#4ade80',
  fontSize: 16,
};

export const syncIconSx: SxProps<Theme> = { color: '#60a5fa', fontSize: 16 };

export const ModalContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#0f1115' : '#ffffff',
  borderRadius: '24px',
  padding: theme.spacing(4, 3, 3, 3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  margin: '0 auto',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 25px 50px -12px rgba(0,0,0,0.5)'
      : '0px 25px 50px -12px rgba(0,0,0,0.1)',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255,255,255,0.05)'
      : '1px solid rgba(0,0,0,0.05)',
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(59, 130, 246, 0.1)',
  borderRadius: '16px',
  width: 56,
  height: 56,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '24px',
  color: theme.palette.mode === 'dark' ? '#60a5fa' : '#3b82f6',
}));

export const Title = styled(Typography)({
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '16px',
  textAlign: 'center',
  letterSpacing: '-0.02em',
});

export const DividerLine = styled(Box)({
  width: '32px',
  height: '3px',
  backgroundColor: '#3b82f6',
  borderRadius: '2px',
  marginBottom: '20px',
});

export const Description = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
  textAlign: 'center',
  lineHeight: 1.5,
  marginBottom: '24px',
}));

export const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(0,0,0,0.02)',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255,255,255,0.05)'
      : '1px solid rgba(0,0,0,0.05)',
  borderRadius: '12px',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  marginBottom: '12px',
}));

export const FeatureText = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#334155',
}));

export const AcceptButton = styled(Button)({
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '12px',
  width: '100%',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 600,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    backgroundColor: '#2563eb',
  },
});
