import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Tooltip as MuiTooltip,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from '../../Insights.styles';
import type {
  CustomTooltipProps,
  ProductivityTrendsChartProps,
} from './ProductivityTrendsChart.types';

const formatValue = (value: number) => {
  if (value === 0) return '0h';
  // Value is in hours from backend (e.g. 1.5 = 1h 30m)
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  return `${minutes}m`;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          {label}
        </Typography>
        {payload.map((item) => (
          <Box
            key={item.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: item.color,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', flex: 1 }}
            >
              {item.name === 'actual' ? 'Actual Time' : 'Target'}:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {formatValue(item.value)}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

export const ProductivityTrendsChart: React.FC<
  ProductivityTrendsChartProps
> = ({ data }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <ChartCard sx={{ height: 'auto', p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: '18px', color: 'text.primary' }}
            >
              Focus Performance
            </Typography>
            <MuiTooltip
              title="We compare your Target (estimated times) against your Actual Time (focus timer recordings)."
              arrow
            >
              <InfoIcon
                sx={{ fontSize: 16, color: 'text.disabled', cursor: 'help' }}
              />
            </MuiTooltip>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '12px' }}
          >
            Estimated Goal vs. Actual Time
          </Typography>
        </Box>
        <Box display="flex" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
              }}
            />
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              Actual Time
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'text.disabled',
                opacity: 0.5,
              }}
            />
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
            >
              Target
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              dy={15}
            />
            <YAxis hide={true} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="actual"
              stroke={theme.palette.primary.main}
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#colorActual)"
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="planned"
              stroke={theme.palette.text.disabled}
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </ChartCard>
  );
};
