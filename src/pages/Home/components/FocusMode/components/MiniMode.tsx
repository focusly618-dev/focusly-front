import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Close as CloseIcon,
  OpenInFull as OpenInFullIcon,
} from '@mui/icons-material';
import {
  MiniModeContainer,
  RippleDot,
  MiniIconButton,
} from '../FocusMode.styles';
import { MINI_MODE_SIZE } from '../hooks/useFocusModeUI.hook';

interface MiniModeProps {
  position: { x: number; y: number } | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  formatTime: (seconds: number) => string;
  timeLeft: number;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  activeItem: { title?: string } | null;
  progress: number;
  handleCloseRequest: () => void;
  setViewMode: (mode: 'full' | 'mini') => void;
}

/** The focus session shrunk to a pill: time left, the task (cut short; the
 * whole title on hover), and play/expand/close. Dragged from anywhere but its
 * buttons. */
export const MiniMode: React.FC<MiniModeProps> = ({
  position,
  handleMouseDown,
  formatTime,
  timeLeft,
  isActive,
  setIsActive,
  activeItem,
  progress,
  handleCloseRequest,
  setViewMode,
}) => {
  const title = activeItem?.title || 'Focus Session';

  return (
    <MiniModeContainer
      onMouseDown={handleMouseDown}
      role="group"
      aria-label="Focus timer"
      sx={{
        width: MINI_MODE_SIZE.width,
        height: MINI_MODE_SIZE.height,
        transform: `translate3d(${position?.x || 0}px, ${position?.y || 0}px, 0)`,
        left: 0,
        top: 0,
      }}
    >
      {/* Pulses while the timer runs */}
      <Box sx={{ width: 6, flexShrink: 0, display: 'flex' }}>
        {isActive && <RippleDot />}
      </Box>

      <Typography
        component="span"
        sx={{
          flexShrink: 0,
          fontSize: '15px',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {formatTime(timeLeft)}
      </Typography>

      <Tooltip title={title} placement="top" enterDelay={400}>
        <Typography
          component="span"
          noWrap
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: '12px',
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {title}
        </Typography>
      </Tooltip>

      <MiniIconButton
        onClick={() => setIsActive(!isActive)}
        aria-label={isActive ? 'Pause' : 'Resume'}
      >
        {isActive ? <PauseIcon /> : <PlayArrowIcon />}
      </MiniIconButton>
      <MiniIconButton
        onClick={() => setViewMode('full')}
        aria-label="Expand focus mode"
      >
        <OpenInFullIcon sx={{ fontSize: '15px !important' }} />
      </MiniIconButton>
      <MiniIconButton
        onClick={handleCloseRequest}
        aria-label="End session"
        sx={{ '&:hover': { color: 'error.main' } }}
      >
        <CloseIcon />
      </MiniIconButton>

      {/* Session progress along the bottom edge */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 2,
          width: `${progress}%`,
          bgcolor: 'primary.main',
          transition: 'width 1s linear',
        }}
      />
    </MiniModeContainer>
  );
};
