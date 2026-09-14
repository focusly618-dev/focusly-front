import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';

export const GridWrapper = styled(Box)(() => ({
  marginTop: '24px',
  paddingBottom: '32px',
}));

export const FoldersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

export const DashedCard = styled(Box)(({ theme }) => ({
  border: `1.5px dashed ${theme.palette.divider}`,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  height: '190px',
  transition: 'all 0.2s ease-in-out',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.01)'
      : 'rgba(0, 0, 0, 0.01)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: 'translateY(-2px)',
  },
}));

export const AddCircleIconWrapper = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(96, 165, 250, 0.12)'
      : 'rgba(59, 130, 246, 0.08)',
  color: theme.palette.primary.main,
}));
