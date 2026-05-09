import { useState } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';

interface BackgroundColorOption {
  name: string;
  dark: string;
  light: string;
}

const BACKGROUND_COLORS: BackgroundColorOption[] = [
  { name: 'default', dark: 'transparent', light: 'transparent' },
  {
    name: 'gray',
    dark: 'rgba(30, 41, 59, 0.5)',
    light: 'rgba(243, 244, 246, 0.5)',
  },
  {
    name: 'blue',
    dark: 'rgba(30, 58, 138, 0.4)',
    light: 'rgba(219, 234, 254, 0.5)',
  },
  {
    name: 'green',
    dark: 'rgba(20, 83, 45, 0.4)',
    light: 'rgba(220, 252, 231, 0.5)',
  },
  {
    name: 'yellow',
    dark: 'rgba(113, 63, 18, 0.4)',
    light: 'rgba(254, 249, 195, 0.5)',
  },
  {
    name: 'orange',
    dark: 'rgba(124, 45, 18, 0.4)',
    light: 'rgba(255, 237, 213, 0.5)',
  },
  {
    name: 'red',
    dark: 'rgba(127, 29, 29, 0.4)',
    light: 'rgba(254, 226, 226, 0.5)',
  },
  {
    name: 'purple',
    dark: 'rgba(88, 28, 135, 0.4)',
    light: 'rgba(243, 232, 255, 0.5)',
  },
  {
    name: 'pink',
    dark: 'rgba(131, 24, 67, 0.4)',
    light: 'rgba(252, 231, 243, 0.5)',
  },
];

interface BackgroundColorPickerProps {
  currentColor?: string;
  onColorSelect: (color: string) => void;
}

export const BackgroundColorPicker = ({
  currentColor,
  onColorSelect,
}: BackgroundColorPickerProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorClick = (colorOption: BackgroundColorOption) => {
    onColorSelect(colorOption.name);
    handleClose();
  };

  const getCurrentColorDisplay = () => {
    if (!currentColor || currentColor === 'default') {
      return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    }
    const colorOption = BACKGROUND_COLORS.find((c) => c.name === currentColor);
    return colorOption
      ? isDark
        ? colorOption.dark
        : colorOption.light
      : 'transparent';
  };

  return (
    <>
      <Tooltip title="Page Background">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            p: 0.5,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '4px',
              backgroundColor: getCurrentColorDisplay(),
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PaletteIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
          </Box>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
          }}
        >
          {BACKGROUND_COLORS.map((colorOption) => (
            <Box
              key={colorOption.name}
              onClick={() => handleColorClick(colorOption)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '6px',
                backgroundColor: isDark ? colorOption.dark : colorOption.light,
                border:
                  currentColor === colorOption.name
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.15)}`,
                },
              }}
            />
          ))}
        </Box>
      </Popover>
    </>
  );
};
