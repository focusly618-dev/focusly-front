import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography, TextField, Button } from '@mui/material';

const fadeInSlideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AnimatedContainer = styled(Box)(({ theme }) => ({
  animation: `${fadeInSlideUp} 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
  flex: 1,
  width: '100%',
  overflowY: 'auto',
  paddingTop: '16px',
  minHeight: 0,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : theme.palette.divider,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : theme.palette.text.secondary,
  },
}));

export const TasksContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100vh',
  overflow: 'hidden',
  color: theme.palette.text.primary,
  display: 'flex',
  gap: '20px',
  width: '100%',
  boxSizing: 'border-box',
}));

export const MainContent = styled(Box)({
  flex: 1,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export const Sidebar = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  padding: '16px 24px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px',
  },
}));

export const Title = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '24px',
});

export const ControlsBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  marginBottom: '32px',
  padding: '16px 24px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '16px',
    marginBottom: '16px',
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  maxWidth: '380px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1F2B' : '#ffffff',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'none',
  },
  transition: 'all 0.2s ease-in-out',
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)',
    },
    '&:hover fieldset': {
      borderColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.15)'
          : 'rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      boxShadow:
        theme.palette.mode === 'dark'
          ? '0 0 0 3px rgba(99, 102, 241, 0.15)'
          : '0 0 0 3px rgba(59, 130, 246, 0.08)',
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark' ? '#6366f1' : '#2563eb',
        borderWidth: '1px',
      },
    },
  },
}));

export const FilterButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.15)'
      : 'rgba(59, 130, 246, 0.08)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : '#ffffff',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#818cf8'
      : '#2563eb'
    : theme.palette.text.primary,
  border: active
    ? theme.palette.mode === 'dark'
      ? '1px solid rgba(99, 102, 241, 0.3)'
      : '1px solid rgba(59, 130, 246, 0.2)'
    : theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  padding: '8px 16px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  textTransform: 'none',
  boxShadow:
    active && theme.palette.mode !== 'dark'
      ? '0 1px 2px rgba(59, 130, 246, 0.05)'
      : 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.2)'
        : 'rgba(59, 130, 246, 0.12)'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.025)',
    borderColor: active
      ? theme.palette.mode === 'dark'
        ? '#818cf8'
        : '#2563eb'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)',
  },
  '& .MuiSvgIcon-root': {
    color: 'inherit',
  },
}));

export const SortButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.15)'
      : 'rgba(59, 130, 246, 0.08)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : '#ffffff',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#818cf8'
      : '#2563eb'
    : theme.palette.text.primary,
  border: active
    ? theme.palette.mode === 'dark'
      ? '1px solid rgba(99, 102, 241, 0.3)'
      : '1px solid rgba(59, 130, 246, 0.2)'
    : theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  padding: '8px 16px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  textTransform: 'none',
  boxShadow:
    active && theme.palette.mode !== 'dark'
      ? '0 1px 2px rgba(59, 130, 246, 0.05)'
      : 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.2)'
        : 'rgba(59, 130, 246, 0.12)'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.025)',
    borderColor: active
      ? theme.palette.mode === 'dark'
        ? '#818cf8'
        : '#2563eb'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)',
  },
  '& .MuiSvgIcon-root': {
    color: 'inherit',
  },
}));

export const CompletedButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(34, 197, 94, 0.15)'
      : 'rgba(34, 197, 94, 0.08)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : '#ffffff',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#4ade80'
      : '#16a34a'
    : theme.palette.text.primary,
  border: active
    ? theme.palette.mode === 'dark'
      ? '1px solid rgba(34, 197, 94, 0.3)'
      : '1px solid rgba(34, 197, 94, 0.2)'
    : theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
  padding: '8px 16px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  textTransform: 'none',
  boxShadow:
    active && theme.palette.mode !== 'dark'
      ? '0 1px 2px rgba(34, 197, 94, 0.05)'
      : 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? 'rgba(34, 197, 94, 0.2)'
        : 'rgba(34, 197, 94, 0.12)'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.025)',
    borderColor: active
      ? theme.palette.mode === 'dark'
        ? '#4ade80'
        : '#16a34a'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)',
  },
  '& .MuiSvgIcon-root': {
    color: 'inherit',
  },
}));

export const SectionTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'colorIndicator',
})<{ colorIndicator?: string }>(({ theme, colorIndicator }) => ({
  fontSize: '12px',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  marginBottom: '8px',
  marginTop: '20px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',

  '&::before': {
    content: '""',
    display: 'block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: colorIndicator || theme.palette.text.secondary,
  },
}));

export const AddTaskInput = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(26, 31, 43, 0.65)'
      : theme.palette.background.paper,
  padding: '12px 16px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
  color: theme.palette.text.secondary,
  cursor: 'text',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.4)'
        : theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 0 12px rgba(99, 102, 241, 0.1)'
        : 'none',
  },
}));

export const SidebarCard = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(17, 24, 39, 0.65)'
      : theme.palette.background.paper,
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '20px',
  backdropFilter: theme.palette.mode === 'dark' ? 'blur(12px)' : 'none',
  boxShadow:
    theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.2)' : 'none',
}));

export const InsightScore = styled(Typography)(({ theme }) => ({
  fontSize: '48px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

export const ViewToggleGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor:
    theme.palette.mode === 'dark' ? '#1A1F2B' : theme.palette.background.paper,
  borderRadius: '8px',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  height: 'fit-content',
}));

export const ViewToggleButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: '6px 10px',
  cursor: 'pointer',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.18)'
      : theme.palette.action.selected
    : 'transparent',
  color: active
    ? theme.palette.mode === 'dark'
      ? '#818cf8'
      : theme.palette.text.primary
    : theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.25)'
        : theme.palette.action.selected
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

export const GridTaskContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '16px',
  paddingTop: '16px',
  paddingBottom: '32px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const PriorityCardsContainer = styled(Box)({
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
});

export const PriorityCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'priorityColor',
})<{ active?: boolean; priorityColor: string }>(
  ({ theme, active, priorityColor }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '6px 16px',
    borderRadius: '24px',
    backgroundColor: active
      ? `${priorityColor}15`
      : theme.palette.mode === 'dark'
        ? '#1A1F2B'
        : theme.palette.background.paper,
    border: '1px solid',
    borderColor: active
      ? priorityColor
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : theme.palette.divider,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    gap: '8px',
    position: 'relative',
    boxShadow: active ? `0 2px 8px ${priorityColor}33` : 'none',
    minWidth: 'fit-content',

    '&:hover': {
      borderColor: priorityColor,
      backgroundColor: `${priorityColor}10`,
      transform: 'translateY(-1px)',
    },

    '& .MuiTypography-root': {
      transition: 'color 0.2s',
    },
  }),
);
