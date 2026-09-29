import { useState } from 'react';
import { Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import {
  CalendarTodayOutlined as CalendarTodayIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Header, Title } from '../../Tasks.styles';
import type { DateRangeFilter } from '../../hooks/useTasksFilters.hook';

interface TasksHeaderProps {
  title?: string;
  eyebrow?: string;
  pendingCount?: number;
  completedCount?: number;
  dateRange?: DateRangeFilter;
  setDateRange?: (range: DateRangeFilter) => void;
  periodLabel?: string;
  addButtonLabel?: string;
  onAddTaskClick?: () => void;
  children?: React.ReactNode;
}

const DATE_OPTIONS: { id: DateRangeFilter; label: string }[] = [
  { id: 'all', label: 'Todas las Tareas' },
  { id: 'today', label: 'Hoy' },
  { id: 'this_week', label: 'Esta Semana' },
  { id: 'this_month', label: 'Este Mes' },
];

export const TasksHeader = ({
  title,
  eyebrow,
  pendingCount = 0,
  completedCount = 0,
  dateRange,
  setDateRange,
  periodLabel,
  addButtonLabel,
  onAddTaskClick,
  children,
}: TasksHeaderProps) => {
  const [dateMenuAnchor, setDateMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const displayPeriodLabel = (() => {
    if (dateRange === 'today') return 'Hoy';
    if (dateRange === 'this_week') return 'Esta Semana';
    if (dateRange === 'this_month') return 'Este Mes';
    if (dateRange === 'all') return 'Todas las Tareas';
    return periodLabel || 'Este Mes';
  })();

  const currentSectionName = eyebrow || title || 'Próximas Tareas';

  return (
    <Header
      sx={{
        padding: '24px 0 20px 0',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        {/* Breadcrumb matching screenshot */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.5 }}>
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Agenda
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography
            sx={{
              color: '#008767',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            {currentSectionName}
          </Typography>
        </Box>

        {/* Page Title */}
        <Title
          sx={{
            fontWeight: 800,
            fontSize: '28px',
            color: 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {title || 'Próximas Tareas'}
        </Title>
      </Box>

      {/* Top right actions: Stats capsule + Date range + Add Task */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Stats Capsule */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(30, 58, 138, 0.2)'
                : '#eff6ff',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(59, 130, 246, 0.3)'
                : '#bfdbfe',
            borderRadius: '99px',
            px: 2,
            height: 38,
            boxSizing: 'border-box',
          }}
        >
          <Typography
            sx={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#93c5fd' : '#1d4ed8',
            }}
          >
            {pendingCount} Pendientes
          </Typography>
          <Box
            sx={{
              width: '1px',
              height: 14,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(147, 197, 253, 0.4)'
                  : '#bfdbfe',
            }}
          />
          <Typography
            sx={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#93c5fd' : '#1d4ed8',
            }}
          >
            {completedCount} Completadas
          </Typography>
        </Box>

        {/* Date Selector Dropdown Button */}
        {setDateRange && (
          <>
            <Button
              onClick={(e) => setDateMenuAnchor(e.currentTarget)}
              startIcon={
                <CalendarTodayIcon
                  sx={{ fontSize: 16, color: 'text.secondary' }}
                />
              }
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{ fontSize: 18, color: 'text.secondary' }}
                />
              }
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                color: 'text.primary',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : '#ffffff',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : '#e5e7eb',
                borderRadius: '8px',
                height: 38,
                px: 1.75,
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.08)'
                      : '#f9fafb',
                },
              }}
            >
              {displayPeriodLabel}
            </Button>
            <Menu
              anchorEl={dateMenuAnchor}
              open={Boolean(dateMenuAnchor)}
              onClose={() => setDateMenuAnchor(null)}
              PaperProps={{
                sx: {
                  borderRadius: '10px',
                  minWidth: '160px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  p: 0.5,
                },
              }}
            >
              {DATE_OPTIONS.map((opt) => (
                <MenuItem
                  key={opt.id}
                  onClick={() => {
                    setDateRange(opt.id);
                    setDateMenuAnchor(null);
                  }}
                  selected={dateRange === opt.id}
                  sx={{
                    py: 1,
                    px: 1.5,
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: dateRange === opt.id ? 700 : 500,
                  }}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        {/* Optional children (e.g. AI Organize button) */}
        {children}

        {/* Primary Add Task Button */}
        {onAddTaskClick && (
          <Button
            id="tasks-add-new-task-btn"
            variant="contained"
            onClick={onAddTaskClick}
            startIcon={<AddIcon sx={{ color: '#ffffff', fontSize: 18 }} />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              height: 38,
              bgcolor: '#008767',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#007357',
                boxShadow: 'none',
              },
              fontSize: '13px',
              px: 2,
            }}
          >
            {addButtonLabel || 'Nueva Tarea Próxima'}
          </Button>
        )}
      </Box>
    </Header>
  );
};
