import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@heroui/react';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { Tooltip as MuiTooltip } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 p-3 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
          {label}
        </p>
        {payload.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1">
              {item.name === 'actual' ? 'Tiempo Real' : 'Objetivo'}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ProductivityTrendsChart: React.FC<ProductivityTrendsChartProps> = ({ data }) => {
  return (
    <Card className="shadow-sm border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-0 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Rendimiento de Enfoque
            </CardTitle>
            <MuiTooltip
              title="Comparamos tu objetivo (estimado) contra el tiempo real registrado."
              arrow
            >
              <InfoIcon className="text-slate-400 text-sm cursor-help" />
            </MuiTooltip>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Objetivo Estimado vs. Tiempo Real
          </CardDescription>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            <span>Tiempo Real</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
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
                className="stroke-slate-200 dark:stroke-slate-800"
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
                stroke="#6366f1"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#colorActual)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="#94a3b8"
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
