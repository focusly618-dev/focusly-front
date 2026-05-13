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
    background: theme.palette.divider,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.text.secondary,
  },
}));

export const TasksContainer = styled(Box)(({ theme }) => ({
  padding: '16px 24px',
  backgroundColor: theme.palette.background.default,
  height: '100vh',
  overflow: 'hidden',
  color: theme.palette.text.primary,
  display: 'flex',
  gap: '20px',
}));

export const MainContent = styled(Box)({
  flex: 3,
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

export const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

export const Title = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '24px',
});

export const ControlsBar = styled(Box)({
  display: 'flex',
  gap: '16px',
  marginBottom: '32px',
});

export const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
  },
}));

export const FilterButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '8px 16px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  color: theme.palette.text.primary,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));

export const SortButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '8px 16px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  color: theme.palette.text.primary,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));

export const CompletedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '8px 16px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  color: theme.palette.text.primary,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
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
  backgroundColor: theme.palette.background.paper,
  padding: '12px 16px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
  color: theme.palette.text.secondary,
  cursor: 'text',
  border: `1px solid ${theme.palette.divider}`,
}));

export const SidebarCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '20px',
}));

export const InsightScore = styled(Typography)(({ theme }) => ({
  fontSize: '48px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

export const ViewToggleGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  height: 'fit-content',
}));

export const ViewToggleButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: '6px 10px',
  cursor: 'pointer',
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: active
      ? theme.palette.action.selected
      : theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

export const GridTaskContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '16px',
  paddingTop: '16px',
  paddingBottom: '32px',
});

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
      : theme.palette.background.paper,
    border: '1px solid',
    borderColor: active ? priorityColor : theme.palette.divider,
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

export const AISwitchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '6px 16px',
  borderRadius: '30px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#7c3aed',
    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
    transform: 'translateY(-1px)',
  },
}));

import { Switch } from '@mui/material';

export const StyledAISwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M12 2L14.5 9L21.5 11.5L14.5 14L12 21L9.5 14L2.5 11.5L9.5 9L12 2Z" /></svg>')`,
      },
      '& + .MuiSwitch-track': {
        backgroundColor: '#7c3aed',
        opacity: 1,
        border: 0,
        backgroundImage: 'linear-gradient(45deg, #7c3aed 30%, #9c63ff 90%)',
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#7c3aed',
      )}" d="M12 2L14.5 9L21.5 11.5L14.5 14L12 21L9.5 14L2.5 11.5L9.5 9L12 2Z" /></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
