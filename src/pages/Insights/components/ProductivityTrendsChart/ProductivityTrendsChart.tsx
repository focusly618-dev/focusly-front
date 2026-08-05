import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@heroui/react';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { Tooltip as MuiTooltip, useTheme, type Theme } from '@mui/material';
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
      <div
        className="p-3 border rounded-xl shadow-xl backdrop-blur-md"
        style={{
          backgroundColor: surfaceColor(
            theme,
            'rgba(15, 23, 42, 0.95)',
            'rgba(36, 36, 37, 0.95)',
            'rgba(255, 255, 255, 0.95)',
          ),
          borderColor: theme.palette.divider,
        }}
      >
        <p
          className="text-xs font-bold mb-1.5"
          style={{ color: theme.palette.text.primary }}
        >
          {label}
        </p>
        {payload.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-xs"
            style={{ color: theme.palette.text.secondary }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1">
              {item.name === 'actual' ? 'Tiempo Real' : 'Objetivo'}:
            </span>
            <span
              className="font-bold"
              style={{ color: theme.palette.text.primary }}
            >
              {formatValue(item.value)}
            </span>
          </div>
        ))}
      </div>
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
      className="shadow-sm backdrop-blur-sm rounded-2xl p-6 w-full"
      style={{
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-0 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <CardTitle
              className="text-lg font-bold"
              style={{ color: theme.palette.text.primary }}
            >
              Rendimiento de Enfoque
            </CardTitle>
            <MuiTooltip
              title="Comparamos tu objetivo (estimado) contra el tiempo real registrado."
              arrow
            >
              <InfoIcon
                className="text-sm cursor-help"
                sx={{ color: 'text.disabled' }}
              />
            </MuiTooltip>
          </div>
          <CardDescription
            className="text-xs mt-0.5"
            style={{ color: theme.palette.text.secondary }}
          >
            Objetivo Estimado vs. Tiempo Real
          </CardDescription>
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-4 text-xs font-semibold"
          style={{ color: theme.palette.text.secondary }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span>Tiempo Real</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.palette.divider }}
            />
            <span>Objetivo</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                stroke="#6366f1"
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
        </div>
      </CardContent>
    </Card>
  );
};
