import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { surfaceColor } from '@/context';

export const GridWrapper = styled(Box)(() => ({
  marginTop: '24px',
  paddingBottom: '32px',
}));

// Columns follow the space the grid has (not the window, which also holds
// the sidebar), and every row is as tall as the tallest card, so all cards
// share one size.
export const FoldersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
  gridAutoRows: '1fr',
  gap: '20px',
  [theme.breakpoints.down('sm')]: {
    gap: '14px',
  },
}));

export const DashedCard = styled(Box)(({ theme }) => ({
  border:
    theme.palette.mode === 'dark'
      ? '1.5px dashed rgba(255, 255, 255, 0.15)'
      : '1.5px dashed #D1D5DB',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  minHeight: '235px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: surfaceColor(theme, '#1C1C1E', '#262626', '#FFFFFF'),
  '&:hover': {
    borderColor: '#008767',
    transform: 'translateY(-2px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 8px 20px rgba(0,0,0,0.3)'
        : '0 8px 20px rgba(0, 0, 0, 0.04)',
  },
}));

export const AddCircleIconWrapper = styled(Box)(({ theme }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#1F2937',
}));
