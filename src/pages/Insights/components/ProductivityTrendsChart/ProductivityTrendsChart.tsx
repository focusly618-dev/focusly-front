import React from 'react';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  Tooltip as MuiTooltip,
  Typography,
  useTheme,
  type Theme,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { surfaceColor } from '@/context';
import { brand, byMode } from '@/styles/mui';
import type {
  CustomTooltipProps,
  ProductivityTrendsChartProps,
} from './ProductivityTrendsChart.types';

const formatValue = (value: number) => {
  if (value === 0) return '0h';
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  return `${minutes}m`;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          p: 1.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: '12px',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(12px)',
          bgcolor: surfaceColor(
            theme,
            'rgba(15, 23, 42, 0.95)',
            'rgba(36, 36, 37, 0.95)',
            'rgba(255, 255, 255, 0.95)',
          ),
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 700,
            mb: 0.75,
            color: 'text.primary',
          }}
        >
          {label}
        </Typography>
        {payload.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '12px',
              color: 'text.secondary',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: item.color,
              }}
            />
            <Box component="span" sx={{ flex: 1 }}>
              {item.name === 'actual' ? 'Tiempo Real' : 'Objetivo'}:
            </Box>
            <Box
              component="span"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {formatValue(item.value)}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const axisTickColor = (theme: Theme) =>
  surfaceColor(theme, '#94a3b8', '#9C9CA1', '#94a3b8');

export const ProductivityTrendsChart: React.FC<
  ProductivityTrendsChartProps
> = ({ data }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        p: 3,
        borderRadius: '16px',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography
              component="h3"
              sx={{ fontSize: '18px', fontWeight: 700, color: 'text.primary' }}
            >
              Rendimiento de Enfoque
            </Typography>
            <MuiTooltip
              title="Comparamos tu objetivo (estimado) contra el tiempo real registrado."
              arrow
            >
              <InfoIcon
                sx={{ fontSize: 14, cursor: 'help', color: 'text.disabled' }}
              />
            </MuiTooltip>
          </Box>
          <Typography
            sx={{ fontSize: '12px', mt: 0.25, color: 'text.secondary' }}
          >
            Objetivo Estimado vs. Tiempo Real
          </Typography>
        </Box>

        {/* Legend */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontSize: '12px',
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: byMode(brand.main, brand.dark),
              }}
            />
            <span>Tiempo Real</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 'divider',
              }}
            />
            <span>Objetivo</span>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#008767" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#008767" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: axisTickColor(theme),
                fontSize: 11,
                fontWeight: 600,
              }}
              dy={15}
            />
            <YAxis hide={true} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#008767"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#colorActual)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="planned"
              stroke={axisTickColor(theme)}
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};
