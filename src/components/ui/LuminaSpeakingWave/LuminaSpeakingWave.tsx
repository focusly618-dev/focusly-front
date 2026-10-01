import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { brand, byMode, emerald, mergeSx } from '@/styles/mui';
import type { LuminaSpeakingWaveProps } from './LuminaSpeakingWave.types';

const soundWaveBar = keyframes`
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
`;

// Height (px), duration (s) and delay (s) of each bar.
const BARS = [
  { height: 10, duration: 0.8, delay: 0 },
  { height: 14, duration: 1.1, delay: 0.15 },
  { height: 16, duration: 0.9, delay: 0.3 },
  { height: 12, duration: 1.25, delay: 0.1 },
  { height: 8, duration: 0.75, delay: 0.25 },
];

export const LuminaSpeakingWave: React.FC<LuminaSpeakingWaveProps> = ({
  isSpeaking = true,
  sx,
  label,
  size = 'sm',
}) => {
  if (!isSpeaking) return null;

  return (
    <Box
      sx={mergeSx(
        {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.25,
          py: 0.25,
          borderRadius: '999px',
          userSelect: 'none',
          transition: 'all 0.15s ease',
          bgcolor: byMode(`${emerald[500]}1a`, `${emerald[500]}33`),
          color: byMode(emerald[600], emerald[400]),
          border: `1px solid ${emerald[500]}40`,
        },
        sx,
      )}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
          height: size === 'sm' ? 14 : 16,
        }}
      >
        {BARS.map(({ height, duration, delay }) => (
          <Box
            key={`${height}-${delay}`}
            component="span"
            sx={{
              width: '2px',
              height,
              borderRadius: '999px',
              transformOrigin: 'center bottom',
              willChange: 'transform',
              background: byMode(
                `linear-gradient(to top, ${brand.main}, ${emerald[600]})`,
                `linear-gradient(to top, ${brand.dark}, ${emerald[400]})`,
              ),
              animation: `${soundWaveBar} ${duration}s ease-in-out infinite ${delay}s`,
            }}
          />
        ))}
      </Box>
      {label && (
        <Box
          component="span"
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1,
          }}
        >
          {label}
        </Box>
      )}
    </Box>
  );
};
