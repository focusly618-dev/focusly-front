import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, useTheme } from '@mui/material';
import {
  TimerContainer,
  TimerCard,
  TimerSeparator,
  ProgressContainer,
  ProgressLabels,
} from '../FocusMode.styles';
import { surfaceColor } from '@/context';

// The cards and their digits shrink with the window's height (up to their
// full size on tall screens), so the controls under them always fit.
const CARD_SIZES = {
  regular: {
    width: 'clamp(130px, 22vh, 220px)',
    height: 'clamp(140px, 24vh, 240px)',
    fontSize: 'clamp(3.5rem, 10vh, 6rem)',
  },
  withHours: {
    width: 'clamp(110px, 18vh, 180px)',
    height: 'clamp(120px, 20vh, 200px)',
    fontSize: 'clamp(3rem, 8.5vh, 5rem)',
  },
};

interface FocusTimerDisplayProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
  progress: number;
}

export const FocusTimerDisplay: React.FC<FocusTimerDisplayProps> = ({
  timeLeft,
  formatTime,
  progress,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isTimeUp = timeLeft <= 0;

  return (
    <>
      <TimerContainer>
        {(() => {
          const timeParts = formatTime(timeLeft).split(':');
          const hasHours = timeParts.length === 3;
          const size = CARD_SIZES[hasHours ? 'withHours' : 'regular'];

          return (
            <>
              {hasHours && (
                <>
                  <TimerCard
                    label="HOURS"
                    sx={{ width: size.width, height: size.height }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: size.fontSize,
                        lineHeight: 1,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {timeParts[0]}
                    </Typography>
                  </TimerCard>
                  <TimerSeparator>:</TimerSeparator>
                </>
              )}
              <TimerCard
                label="MINUTES"
                sx={{ width: size.width, height: size.height }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: size.fontSize,
                    lineHeight: 1,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {hasHours ? timeParts[1] : timeParts[0]}
                </Typography>
              </TimerCard>
              <TimerSeparator>:</TimerSeparator>
              <TimerCard
                label="SECONDS"
                sx={{ width: size.width, height: size.height }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: size.fontSize,
                    lineHeight: 1,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {hasHours ? timeParts[2] : timeParts[1]}
                </Typography>
              </TimerCard>
            </>
          );
        })()}
      </TimerContainer>

      <ProgressContainer>
        <ProgressLabels>
          <Typography
            variant="caption"
            sx={{
              color: isTimeUp ? 'warning.main' : theme.palette.text.secondary,
              fontWeight: 600,
            }}
          >
            {isTimeUp ? t('focusTimer.timeUp') : 'Session Progress'}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}
          >
            {Math.round(progress)}%
          </Typography>
        </ProgressLabels>
        <Box
          sx={{
            height: 6,
            width: '100%',
            bgcolor: surfaceColor(
              theme,
              'rgba(30, 41, 59, 0.5)',
              'rgba(55, 55, 55, 0.5)',
              'rgba(226, 232, 240, 0.5)',
            ),
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${progress}%`,
              bgcolor: '#3b82f6',
              transition: 'width 1s linear',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
            }}
          />
        </Box>
      </ProgressContainer>
    </>
  );
};
