import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AccessTime,
  CheckCircleOutline,
  Bolt,
  Psychology as BrainIcon,
} from '@mui/icons-material';
import { amber, brand, byMode, emerald, purple } from '@/styles/mui';
import type { StatValue } from '../../useInsights.types';
import type { StatsCardsProps } from './StatsCards.types';

const iconSx = { fontSize: 20 } as const;
const EMPTY_VALUE = '—';

// What the page holds before the numbers arrive: not worth showing
const NO_CHANGE = new Set(['', 'No data', '0%', '0 pts']);
const changeOf = (stat: StatValue) =>
  NO_CHANGE.has(stat.change) ? '' : stat.change;

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalFocusHours,
  taskCompletion,
  energyScore,
  timeDistribution,
}) => {
  const { t } = useTranslation();
  const noData = t('insightsStats.noData');

  // Of the time worked, how much was deep work (breaks aren't work)
  const worked = timeDistribution.filter((e) => e.name !== 'Rest/Breaks');
  const workedMinutes = worked.reduce((sum, e) => sum + e.value, 0);
  const deepMinutes = worked.find((e) => e.name === 'Deep Work')?.value ?? 0;

  const cards = [
    {
      title: t('ui.insights.totalFocus'),
      value: totalFocusHours.value,
      change:
        totalFocusHours.value === '0h 0m' ? noData : changeOf(totalFocusHours),
      icon: (
        <AccessTime sx={{ ...iconSx, color: byMode(brand.main, brand.dark) }} />
      ),
      iconBg: byMode(emerald[50], `${emerald[950]}99`),
      changeColor: byMode(emerald[600], emerald[400]),
    },
    {
      title: t('ui.insights.tasksDone'),
      value: taskCompletion.value,
      change: changeOf(taskCompletion),
      icon: (
        <CheckCircleOutline
          sx={{ ...iconSx, color: byMode(emerald[600], emerald[400]) }}
        />
      ),
      iconBg: byMode(emerald[50], `${emerald[950]}99`),
      changeColor: byMode(emerald[600], emerald[400]),
    },
    {
      title: t('ui.insights.energy'),
      value: energyScore.value === 'N/A' ? EMPTY_VALUE : energyScore.value,
      change: energyScore.value === 'N/A' ? noData : changeOf(energyScore),
      icon: <Bolt sx={{ ...iconSx, color: amber[500] }} />,
      iconBg: byMode(amber[50], `${amber[950]}99`),
      changeColor: null,
    },
    {
      title: t('ui.insights.deepWork'),
      value:
        workedMinutes > 0
          ? `${Math.round((deepMinutes / workedMinutes) * 100)}%`
          : EMPTY_VALUE,
      change: workedMinutes > 0 ? t('insightsStats.ofTrackedTime') : noData,
      icon: (
        <BrainIcon
          sx={{ ...iconSx, color: byMode(purple[600], purple[400]) }}
        />
      ),
      iconBg: byMode(purple[50], `${purple[950]}99`),
      changeColor: byMode(purple[600], purple[400]),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {cards.map((card, idx) => (
        <Card
          key={idx}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'box-shadow 0.2s ease',
            '&:hover': {
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'text.secondary',
              }}
            >
              {card.title}
            </Typography>
            <Box
              sx={{
                p: 1,
                borderRadius: '12px',
                bgcolor: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {card.icon}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              component="h3"
              sx={{
                m: 0,
                fontSize: { xs: '24px', sm: '30px' },
                lineHeight: { xs: '32px', sm: '36px' },
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: 'text.primary',
              }}
            >
              {card.value}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: card.changeColor ?? 'text.secondary',
              }}
            >
              {card.change}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};
