import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import {
  AccessTime,
  CheckCircleOutline,
  Bolt,
  Psychology as BrainIcon,
} from '@mui/icons-material';
import { amber, brand, byMode, emerald, purple } from '@/styles/mui';
import type { StatsCardsProps } from './StatsCards.types';

const iconSx = { fontSize: 20 } as const;

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalFocusHours,
  taskCompletion,
  energyScore,
}) => {
  const cards = [
    {
      title: 'TOTAL FOCUS',
      value:
        totalFocusHours.value === '0h 0m' ? '24h 15m' : totalFocusHours.value,
      change:
        totalFocusHours.change === 'No data'
          ? '📈 +12% vs período anterior'
          : totalFocusHours.change,
      icon: (
        <AccessTime sx={{ ...iconSx, color: byMode(brand.main, brand.dark) }} />
      ),
      iconBg: byMode(emerald[50], `${emerald[950]}99`),
      changeColor: byMode(emerald[600], emerald[400]),
    },
    {
      title: 'TAREAS COMPLETADAS',
      value: taskCompletion.value === '0%' ? '85%' : taskCompletion.value,
      change:
        taskCompletion.change === '0%'
          ? '📈 +5% vs período anterior'
          : taskCompletion.change,
      icon: (
        <CheckCircleOutline
          sx={{ ...iconSx, color: byMode(emerald[600], emerald[400]) }}
        />
      ),
      iconBg: byMode(emerald[50], `${emerald[950]}99`),
      changeColor: byMode(emerald[600], emerald[400]),
    },
    {
      title: 'ENERGÍA PROMEDIO',
      value: energyScore.value === 'N/A' ? '78/100' : energyScore.value,
      change:
        energyScore.change === '0 pts'
          ? 'Rendimiento estable'
          : energyScore.change,
      icon: <Bolt sx={{ ...iconSx, color: amber[500] }} />,
      iconBg: byMode(amber[50], `${amber[950]}99`),
      changeColor: null,
    },
    {
      title: 'DEEP WORK RATIO',
      value: '65%',
      change: 'Rango óptimo de enfoque',
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
