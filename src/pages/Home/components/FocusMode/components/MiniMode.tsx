import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Close as CloseIcon,
  OpenInFull as OpenInFullIcon,
} from '@mui/icons-material';
import {
  MiniModeContainer,
  RippleDot,
  MiniTimerBox,
  MiniInfoBox,
  MiniControlsBox,
  MiniPlayButton,
  MiniExpandButton,
} from '../FocusMode.styles';

interface MiniModeProps {
  position: { x: number; y: number } | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  formatTime: (seconds: number) => string;
  secondsPassed: number;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  activeItem: { title?: string } | null;
  progress: number;
  isOvertime: boolean;
  handleCloseRequest: () => void;
  setViewMode: (mode: 'full' | 'mini') => void;
}

export const MiniMode: React.FC<MiniModeProps> = ({
  position,
  handleMouseDown,
  formatTime,
  secondsPassed,
  isActive,
  setIsActive,
  activeItem,
  progress,
  isOvertime,
  handleCloseRequest,
  setViewMode,
}) => {
  const theme = useTheme();

  const progressColor = isOvertime
    ? theme.palette.error.main
    : theme.palette.primary.main;
  const textColor = isOvertime
    ? theme.palette.error.main
    : theme.palette.text.primary;

  return (
    <MiniModeContainer
      onMouseDown={handleMouseDown}
      sx={{
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
        transform: `translate3d(${position?.x || 0}px, ${position?.y || 0}px, 0)`,
        left: 0,
        top: 0,
      }}
    >
      <RippleDot sx={{ bgcolor: progressColor }} />
      <Box
        sx={{
          borderRadius: '14px',
          padding: '2px',
          background: `conic-gradient(${progressColor} ${Math.min(progress, 100)}%, transparent ${Math.min(progress, 100)}%)`,
          display: 'flex',
        }}
      >
        <MiniTimerBox sx={{ border: 'none', width: '96px', m: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              lineHeight: 1,
              color: textColor,
            }}
          >
            {formatTime(secondsPassed)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: isOvertime
                ? theme.palette.error.main
                : theme.palette.text.secondary,
              fontSize: '10px',
              fontWeight: 700,
            }}
          >
            {isOvertime ? 'OVER' : 'ELAPSED'}
          </Typography>
        </MiniTimerBox>
      </Box>
      <MiniInfoBox>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 0.5, color: textColor }}
        >
          {activeItem?.title || 'Focus Session'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: isOvertime
                ? theme.palette.error.main
                : theme.palette.text.secondary,
              fontWeight: 600,
            }}
          >
            {isOvertime ? 'Time exceeded' : 'Focusing...'}
          </Typography>
        </Box>
      </MiniInfoBox>
      <MiniControlsBox>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <MiniPlayButton
            size="small"
            onClick={() => setIsActive(!isActive)}
            sx={{ color: progressColor }}
          >
            {isActive ? (
              <PauseIcon fontSize="small" />
            ) : (
              <PlayArrowIcon fontSize="small" />
            )}
          </MiniPlayButton>

          <IconButton
            size="small"
            sx={{ color: '#ef4444' }}
            onClick={handleCloseRequest}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <MiniExpandButton size="small" onClick={() => setViewMode('full')}>
          <OpenInFullIcon fontSize="small" />
        </MiniExpandButton>
      </MiniControlsBox>
    </MiniModeContainer>
  );
};
