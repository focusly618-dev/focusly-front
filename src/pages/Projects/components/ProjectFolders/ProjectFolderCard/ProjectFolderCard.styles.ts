import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';

export const CardContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  height: '190px',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 8px 24px rgba(0,0,0,0.3)'
        : '0 8px 24px rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
  },
}));

export const FolderIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'baseColor',
})<{ baseColor?: string }>(({ baseColor = '#7c3aed' }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(baseColor, 0.12),
  color: baseColor,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

export const StatusBar = styled(Box)(({ theme }) => ({
  padding: '10px 16px',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.01)'
      : 'rgba(0,0,0,0.01)',
}));
