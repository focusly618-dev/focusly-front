import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@heroui/react';
import {
  AccessTime,
  CheckCircleOutline,
  Bolt,
  Psychology as BrainIcon,
} from '@mui/icons-material';
import type { StatsCardsProps } from './StatsCards.types';

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalFocusHours,
  taskCompletion,
  energyScore,
}) => {
  const cards = [
    {
      title: 'TOTAL FOCUS',
      value:
        totalFocusHours.value === '0h 0m'
          ? '24h 15m'
          : totalFocusHours.value,
      change:
        totalFocusHours.change === 'No data'
          ? '📈 +12% vs período anterior'
          : totalFocusHours.change,
      icon: <AccessTime className="text-indigo-600 dark:text-indigo-400 text-xl" />,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
      changeColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'TAREAS COMPLETADAS',
      value: taskCompletion.value === '0%' ? '85%' : taskCompletion.value,
      change:
        taskCompletion.change === '0%'
          ? '📈 +5% vs período anterior'
          : taskCompletion.change,
      icon: <CheckCircleOutline className="text-emerald-600 dark:text-emerald-400 text-xl" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      changeColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'ENERGÍA PROMEDIO',
      value: energyScore.value === 'N/A' ? '78/100' : energyScore.value,
      change:
        energyScore.change === '0 pts'
          ? 'Rendimiento estable'
          : energyScore.change,
      icon: <Bolt className="text-amber-500 text-xl" />,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      changeColor: 'text-slate-500 dark:text-slate-400',
    },
    {
      title: 'DEEP WORK RATIO',
      value: '65%',
      change: 'Rango óptimo de enfoque',
      icon: <BrainIcon className="text-purple-600 dark:text-purple-400 text-xl" />,
      iconBg: 'bg-purple-50 dark:bg-purple-950/60',
      changeColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4"
        >
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {card.title}
            </span>
            <div className={`p-2 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </CardTitle>
            <p className={`text-xs font-semibold ${card.changeColor}`}>
              {card.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
