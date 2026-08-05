import React from 'react';
import { Button, Tabs, TabList, Tab } from '@heroui/react';
import { useTheme } from '@mui/material';
import {
  FileDownloadOutlined,
  Add,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { surfaceColor } from '@/context';
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
  const theme = useTheme();
  const pillBg = surfaceColor(
    theme,
    'rgba(30, 41, 59, 0.6)',
    'rgba(36, 36, 37, 0.6)',
    '#f1f5f9',
  );
  const selectedTabBg = surfaceColor(theme, '#334155', '#2A2A2C', '#ffffff');

  return (
    <div className="w-full flex flex-col gap-6 mb-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: theme.palette.text.primary }}
          >
            {filter === 'Daily'
              ? 'Daily'
              : filter === 'Weekly'
                ? 'Weekly'
                : filter === 'Monthly'
                  ? 'Monthly'
                  : 'Yearly'}{' '}
            Insights
          </h1>
          <p
            className="text-xs sm:text-sm mt-1"
            style={{ color: theme.palette.text.secondary }}
          >
            Resumen de productividad y analíticas
          </p>
        </div>

        {/* HeroUI Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold px-3 py-2 flex items-center gap-1.5"
            style={{
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
            }}
          >
            <FileDownloadOutlined className="text-base" />
            <span>Exportar</span>
          </Button>

          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-xl text-xs font-semibold px-4 py-2 flex items-center gap-1.5 cursor-pointer">
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
          onSelectionChange={(key) =>
            onFilterChange(String(key) as typeof filter)
          }
          className="w-auto"
        >
          <TabList
            className="flex p-1 rounded-2xl"
            style={{
              backgroundColor: pillBg,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {filters.map((f) => {
              const isSelected = f === filter;
              return (
                <Tab
                  key={f}
                  id={f}
                  className="px-4 py-1.5 text-xs font-semibold rounded-xl cursor-pointer transition-all outline-none"
                  style={{
                    backgroundColor: isSelected ? selectedTabBg : 'transparent',
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    boxShadow: isSelected
                      ? '0 1px 2px rgba(0,0,0,0.08)'
                      : 'none',
                  }}
                >
                  {f}
                </Tab>
              );
            })}
          </TabList>
        </Tabs>

        {filter === 'Monthly' && onNavigate && (
          <div
            className="flex items-center gap-2 rounded-2xl px-2 py-1"
            style={{
              backgroundColor: pillBg,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate('prev')}
              aria-label="Previous month"
              className="p-1 rounded-lg transition-colors cursor-pointer"
              style={{ color: theme.palette.text.secondary }}
            >
              <ChevronLeftIcon className="text-sm" />
            </button>

            <span
              className="text-xs font-semibold min-w-[90px] text-center select-none"
              style={{ color: theme.palette.text.primary }}
            >
              {periodLabel}
            </span>

            <button
              type="button"
              onClick={() => onNavigate('next')}
              aria-label="Next month"
              disabled={!baseDate}
              className="p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              style={{ color: theme.palette.text.secondary }}
            >
              <ChevronRightIcon className="text-sm" />
            </button>

            {baseDate && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-[10px] font-bold hover:underline px-1 ml-1 cursor-pointer"
                style={{ color: theme.palette.primary.main }}
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
