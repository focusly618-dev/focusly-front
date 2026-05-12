import { styled } from '@mui/material/styles';
import { Box, Switch } from '@mui/material';
import { GeminiIcon } from './GeminiIcon';

export const GeminiSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 18,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(18px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 3,
    '&.Mui-checked': {
      transform: 'translateX(18px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#9B72CB',
      },
      '& .MuiSwitch-thumb': {
        backgroundColor: '#fff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#9B72CB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: 'rgba(155, 114, 203, 0.2)',
    boxSizing: 'border-box',
  },
}));

interface Props {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'small' | 'medium';
}

export const GeminiAIToggle = ({ checked, onChange, size = 'small' }: Props) => {
  return (
    <GeminiSwitch
      size={size}
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      icon={
        <Box sx={{ 
          display: 'grid', 
          placeItems: 'center', 
          width: 18, 
          height: 18,
          backgroundColor: '#fff',
          borderRadius: '50%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}>
          <GeminiIcon sx={{ fontSize: 13, display: 'block' }} />
        </Box>
      }
      checkedIcon={
        <Box sx={{ 
          display: 'grid', 
          placeItems: 'center', 
          width: 18, 
          height: 18,
          backgroundColor: '#9B72CB',
          borderRadius: '50%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          <GeminiIcon sx={{ fontSize: 13, filter: 'brightness(0) invert(1)', display: 'block' }} />
        </Box>
      }
    />
  );
};
