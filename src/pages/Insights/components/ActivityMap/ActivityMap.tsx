import { useMemo, useState, useCallback, useRef, type MouseEvent } from 'react';
import { Box, Typography, Tooltip, Popover } from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { ChartCard, HeatmapGrid, HeatmapCell } from '../../Insights.styles';
import { ActivityMapPopover } from './ActivityMapPopover';
import type { ActivityMapProps, HeatmapCellData } from './ActivityMap.types';

const buildEmptyCells = (filter: string): HeatmapCellData[] => {
  if (filter === 'Daily') {
    return Array.from({ length: 24 }, (_, i) => ({
      key: String(i),
      label: `${i}:00`,
      intensity: 0,
      count: 0,
      tasks: [],
    }));
  }

  if (filter === 'Monthly') {
    return Array.from({ length: 30 }, (_, i) => {
      const now = new Date();
      const target = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      return {
        key: target.toISOString().split('T')[0],
        label: target.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        intensity: 0,
        count: 0,
        tasks: [],
      };
    });
  }

  if (filter === 'Yearly') {
    const now = new Date();
    const startDay = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000);
    const dayOfWeek = startDay.getDay();
    const alignedStart = new Date(
      startDay.getTime() - dayOfWeek * 24 * 60 * 60 * 1000,
    );

    return Array.from({ length: 53 * 7 }, (_, i) => {
      const target = new Date(alignedStart.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        key: target.toISOString().split('T')[0],
        label: target.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        intensity: 0,
        count: 0,
        tasks: [],
      };
    });
  }

  return Array.from({ length: 7 }, (_, i) => ({
    key: String(i),
    label: `Day ${i + 1}`,
    intensity: 0,
    count: 0,
    tasks: [],
  }));
};

export const ActivityMap = ({
  cells,
  heatmapLabels = [],
  filter,
  baseDate,
  loading,
}: ActivityMapProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCell, setActiveCell] = useState<HeatmapCellData | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayCells = useMemo(
    () => (cells.length > 0 ? cells : buildEmptyCells(filter)),
    [cells, filter],
  );

  const cols = displayCells.length > 24 ? 14 : displayCells.length || 7;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleCellEnter = useCallback(
    (event: MouseEvent<HTMLElement>, cell: HeatmapCellData) => {
      clearCloseTimer();
      setAnchorEl(event.currentTarget);
      setActiveCell(cell);
    },
    [],
  );

  const handleCellLeave = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setAnchorEl(null);
      setActiveCell(null);
    }, 120);
  }, []);

  const handlePopoverEnter = useCallback(() => {
    clearCloseTimer();
  }, []);

  const handlePopoverLeave = useCallback(() => {
    setAnchorEl(null);
    setActiveCell(null);
  }, []);

  return (
    <ChartCard sx={{ height: 'auto', minHeight: '300px' }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="h6" fontWeight="bold">
            Activity Map
          </Typography>
          <Tooltip
            title="Shows completed tasks per hour (Daily), day of week (Weekly), or calendar day (Monthly). Hover a cell to see what you finished."
            arrow
          >
            <InfoIcon
              sx={{ fontSize: 16, color: 'text.disabled', cursor: 'help' }}
            />
          </Tooltip>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Less
          </Typography>
          <Box display="flex" gap={0.5}>
            {[0, 1, 2, 3, 4].map((i) => (
              <HeatmapCell
                key={i}
                intensity={i}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '1.5px',
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            More
          </Typography>
        </Box>
      </Box>

      <HeatmapGrid
        sx={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          opacity: loading && baseDate ? 0.4 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        {displayCells.map((cell) => (
          <HeatmapCell
            key={cell.key}
            intensity={cell.intensity}
            onMouseEnter={(e) => handleCellEnter(e, cell)}
            onMouseLeave={handleCellLeave}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              '&:hover': {
                transform: 'scale(1.08)',
              },
            }}
          />
        ))}
      </HeatmapGrid>

      <Box display="flex" justifyContent="space-between" mt={1}>
        {heatmapLabels.map((label) => (
          <Typography key={label} variant="caption" color="text.secondary">
            {label}
          </Typography>
        ))}
      </Box>

      <Popover
        open={Boolean(anchorEl && activeCell)}
        anchorEl={anchorEl}
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            onMouseEnter: handlePopoverEnter,
            onMouseLeave: handlePopoverLeave,
            sx: {
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0,0,0,0.5)'
                  : '0 8px 32px rgba(0,0,0,0.12)',
              pointerEvents: 'auto',
            },
          },
        }}
        sx={{ pointerEvents: 'none' }}
      >
        {activeCell && <ActivityMapPopover cell={activeCell} filter={filter} />}
      </Popover>
    </ChartCard>
  );
};
