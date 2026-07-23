import React from 'react';
import { Button, Tabs, TabList, Tab } from '@heroui/react';
import {
  FileDownloadOutlined,
  Add,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import type { InsightsHeaderProps } from './InsightsHeader.types';

export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  filter,
  filters,
  onFilterChange,
  baseDate,
  onNavigate,
  onReset,
  periodLabel,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 mb-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {filter === 'Daily'
              ? 'Daily'
              : filter === 'Weekly'
                ? 'Weekly'
                : filter === 'Monthly'
                  ? 'Monthly'
                  : 'Yearly'}{' '}
            Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resumen de productividad y analíticas
          </p>
        </div>

        {/* HeroUI Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold px-3 py-2 flex items-center gap-1.5"
          >
            <FileDownloadOutlined className="text-base" />
            <span>Exportar</span>
          </Button>

          <Button
            color="primary"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-xl text-xs font-semibold px-4 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <Add className="text-base" />
            <span>Crear Reporte</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Date Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* HeroUI Filter Tabs */}
        <Tabs
          selectedKey={filter}
          onSelectionChange={(key) => onFilterChange(String(key) as typeof filter)}
          className="w-auto"
        >
          <TabList className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            {filters.map((f) => (
              <Tab
                key={f}
                id={f}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl cursor-pointer transition-all outline-none data-[selected]:bg-white dark:data-[selected]:bg-slate-700 data-[selected]:text-indigo-600 dark:data-[selected]:text-indigo-400 data-[selected]:shadow-sm text-slate-600 dark:text-slate-400"
              >
                {f}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {filter === 'Monthly' && onNavigate && (
          <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl px-2 py-1">
            <button
              type="button"
              onClick={() => onNavigate('prev')}
              aria-label="Previous month"
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeftIcon className="text-sm" />
            </button>

            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 min-w-[90px] text-center select-none">
              {periodLabel}
            </span>

            <button
              type="button"
              onClick={() => onNavigate('next')}
              aria-label="Next month"
              disabled={!baseDate}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
            >
              <ChevronRightIcon className="text-sm" />
            </button>

            {baseDate && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-1 ml-1 cursor-pointer"
              >
                Hoy
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
