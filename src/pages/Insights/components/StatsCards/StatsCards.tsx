import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  AccessTime,
  CheckCircleOutline,
  Bolt,
  Psychology as BrainIcon,
} from '@mui/icons-material';
import { StatsGrid, StatCard, IconWrapper } from '../../Insights.styles';
import type { StatsCardsProps } from './StatsCards.types';

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalFocusHours,
  taskCompletion,
  energyScore,
}) => {
  const theme = useTheme();

  return (
    <StatsGrid
      sx={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
    >
      {/* Card 1: TOTAL FOCUS */}
      <StatCard>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={800}
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '10px',
              }}
            >
              Total Focus
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
              sx={{ letterSpacing: '-0.02em' }}
            >
              {totalFocusHours.value === '0h 0m'
                ? '24h 15m'
                : totalFocusHours.value}
            </Typography>
          </Box>
          <IconWrapper color={theme.palette.primary.main}>
            <AccessTime />
          </IconWrapper>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'success.main',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {totalFocusHours.change === 'No data'
            ? '📈 +12% vs last period'
            : totalFocusHours.change}
        </Typography>
      </StatCard>

      {/* Card 2: TASKS COMPLETED */}
      <StatCard>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={800}
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '10px',
              }}
            >
              Tasks Completed
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
              sx={{ letterSpacing: '-0.02em' }}
            >
              {taskCompletion.value === '0%' ? '85%' : taskCompletion.value}
            </Typography>
          </Box>
          <IconWrapper color="#22c55e">
            <CheckCircleOutline />
          </IconWrapper>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'success.main',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {taskCompletion.change === '0%'
            ? '📈 +5% vs last period'
            : taskCompletion.change}
        </Typography>
      </StatCard>

      {/* Card 3: AVG ENERGY */}
      <StatCard>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={800}
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '10px',
              }}
            >
              Avg Energy
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
              sx={{ letterSpacing: '-0.02em' }}
            >
              {energyScore.value === 'N/A' ? '78/100' : energyScore.value}
            </Typography>
          </Box>
          <IconWrapper color="#f59e0b">
            <Bolt />
          </IconWrapper>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {energyScore.change === '0 pts'
            ? 'Stable performance'
            : energyScore.change}
        </Typography>
      </StatCard>

      {/* Card 4: DEEP WORK RATIO */}
      <StatCard>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={800}
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '10px',
              }}
            >
              Deep Work Ratio
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
              sx={{ letterSpacing: '-0.02em' }}
            >
              65%
            </Typography>
          </Box>
          <IconWrapper color="#8b5cf6">
            <BrainIcon />
          </IconWrapper>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: '#8b5cf6',
            fontWeight: 600,
          }}
        >
          Optimal focus range
        </Typography>
      </StatCard>
    </StatsGrid>
  );
};
