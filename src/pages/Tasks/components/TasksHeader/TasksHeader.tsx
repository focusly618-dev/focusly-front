import { useState } from 'react';
import { Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [dateMenuAnchor, setDateMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const dateOptions: { id: DateRangeFilter; label: string }[] = [
    { id: 'all', label: t('tasks.dates.all', 'Todas las Tareas') },
    { id: 'today', label: t('tasks.dates.today', 'Hoy') },
    { id: 'this_week', label: t('tasks.dates.thisWeek', 'Esta Semana') },
    { id: 'this_month', label: t('tasks.dates.thisMonth', 'Este Mes') },
  ];

  const displayPeriodLabel = (() => {
    if (dateRange === 'today') return t('tasks.dates.today', 'Hoy');
    if (dateRange === 'this_week')
      return t('tasks.dates.thisWeek', 'Esta Semana');
    if (dateRange === 'this_month')
      return t('tasks.dates.thisMonth', 'Este Mes');
    if (dateRange === 'all') return t('tasks.dates.all', 'Todas las Tareas');
    return periodLabel || t('tasks.dates.thisMonth', 'Este Mes');
  })();

  const currentSectionName =
    eyebrow || title || t('tasks.header.upcomingTitle', 'Próximas Tareas');

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
            {t('nav.agenda', 'Agenda')}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#2dd4bf' : '#008767',
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
          {title || t('tasks.header.upcomingTitle', 'Próximas Tareas')}
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
        {/* Stats Capsule matching screenshot */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#111c2e' : '#eff6ff',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1e3557' : '#bfdbfe',
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
                theme.palette.mode === 'dark' ? '#60a5fa' : '#1d4ed8',
            }}
          >
            {pendingCount} {t('tasks.header.pending', 'Pendientes')}
          </Typography>
          <Box
            sx={{
              width: '1px',
              height: 14,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#1e3557' : '#bfdbfe',
            }}
          />
          <Typography
            sx={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#60a5fa' : '#1d4ed8',
            }}
          >
            {completedCount} {t('tasks.header.completed', 'Completadas')}
          </Typography>
        </Box>

        {/* Date Selector Dropdown Button */}
        {setDateRange && (
          <>
            <Button
              onClick={(e) => setDateMenuAnchor(e.currentTarget)}
              startIcon={
                <CalendarTodayIcon
                  sx={{
                    fontSize: 16,
                    color: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '#717684'
                        : 'text.secondary',
                  }}
                />
              }
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 18,
                    color: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '#717684'
                        : 'text.secondary',
                  }}
                />
              }
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#d1d5db' : 'text.primary',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#1e2025' : '#ffffff',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#2e3037' : '#e5e7eb',
                borderRadius: '8px',
                height: 38,
                px: 1.75,
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? '#25272e' : '#f9fafb',
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
              {dateOptions.map((opt) => (
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
            {addButtonLabel ||
              t('tasks.header.newUpcomingTask', 'Nueva Tarea Próxima')}
          </Button>
        )}
      </Box>
    </Header>
  );
};
