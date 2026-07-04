import type { ElementType } from 'react';
import {
  styled,
  Box,
  Typography,
  Button,
  Paper,
  TableContainer,
  TableCell,
} from '@mui/material';

export const PricingSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(12, 0, 8, 0),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0, 6, 0),
  },
}));

export const SectionHeader = styled(Box)({
  textAlign: 'center',
  maxWidth: 800,
  margin: '0 auto 64px',
  position: 'relative',
  zIndex: 1,
});

export const PricingTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '3.5rem', // ~56px
  letterSpacing: '-0.025em',
  marginBottom: theme.spacing(2.5),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

export const PricingCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'featured',
})<{ featured?: boolean }>(({ theme, featured }) => ({
  position: 'relative',
  padding: theme.spacing(5, 4),
  borderRadius: 16,
  border: featured
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: featured
    ? theme.palette.mode === 'dark'
      ? '0 25px 50px -12px rgba(59, 130, 246, 0.4)'
      : '0 25px 50px -12px rgba(59, 130, 246, 0.12)'
    : 'none',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  transition: 'all 0.25s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 25px 50px -12px rgba(0,0,0,0.5)'
        : '0 25px 50px -12px rgba(0,0,0,0.02)',
  },
}));

export const CardBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -12,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '4px 14px',
  borderRadius: '9999px',
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

export const PricingButton = styled(Button)<{
  component?: ElementType;
  to?: string;
}>(({ theme, variant }) => ({
  padding: theme.spacing(1.25, 4),
  borderRadius: '9999px', // Pill button
  fontWeight: 600,
  fontSize: '0.9375rem',
  textTransform: 'none',
  width: '100%',
  transition: 'all 0.2s',
  ...(variant === 'outlined'
    ? {
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.mode === 'dark' ? '#202024' : '#FFFFFF',
        '&:hover': {
          borderColor: theme.palette.text.primary,
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2D2D30' : '#FAFAFA',
        },
      }
    : {
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.background.default,
        boxShadow: 'none',
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#E4E4E7' : '#1F2937',
        },
      }),
}));

// --- Comparison Table ---
export const CompareSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
}));

export const CompareTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(6),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  overflow: 'hidden',
}));

export const CompareHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1rem',
  padding: theme.spacing(2.5, 3),
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

export const CompareCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.9375rem',
  padding: theme.spacing(2.5, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
