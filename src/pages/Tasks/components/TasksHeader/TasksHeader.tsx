import { Typography, Box, Select, MenuItem } from '@mui/material';
import {
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  ViewColumn as ViewColumnIcon,
  Balance as BalanceIcon,
} from '@mui/icons-material';
import {
  Header,
  Title,
  ViewToggleGroup,
  ViewToggleButton,
} from '../../Tasks.styles';
import { useTranslation } from 'react-i18next';
import type { DateRangeFilter } from '../../hooks/useTasksFilters.hook';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';

interface TasksHeaderProps {
  filteredTasks: TaskResponse[];
  dateRange: string;
  setDateRange: (range: DateRangeFilter) => void;
  viewMode: 'list' | 'grid' | 'board' | 'workload';
  setViewMode: (mode: 'list' | 'grid' | 'board' | 'workload') => void;
  children?: React.ReactNode;
}

export const TasksHeader = ({
  filteredTasks,
  dateRange,
  setDateRange,
  viewMode,
  setViewMode,
  children,
}: TasksHeaderProps) => {
  const { t } = useTranslation();

  const pendingCount = filteredTasks.filter((t) => t.status !== 'Done').length;
  const completedCount = filteredTasks.filter(
    (t) => t.status === 'Done',
  ).length;

  return (
    <Header>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('Manage and prioritize your work')}
        </Typography>
        <Title>{t('My Tasks')}</Title>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {children}
        <Box
          sx={{
            bgcolor: 'background.paper',
            px: 2,
            py: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {t('{{count}} Pending', { count: pendingCount })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('{{count}} Completed', { count: completedCount })}
          </Typography>
        </Box>

        <Select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRangeFilter)}
          size="small"
          sx={{
            height: 38,
            bgcolor: 'background.paper',
            fontSize: '0.875rem',
            borderRadius: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem value="today">{t('Today')}</MenuItem>
          <MenuItem value="this_week">{t('This Week')}</MenuItem>
          <MenuItem value="this_month">{t('This Month')}</MenuItem>
        </Select>

        <ViewToggleGroup id="joyride-tasks-view-toggle">
          <ViewToggleButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <ViewListIcon fontSize="small" />
          </ViewToggleButton>
          <ViewToggleButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <GridViewIcon fontSize="small" />
          </ViewToggleButton>
          <ViewToggleButton
            active={viewMode === 'board'}
            onClick={() => setViewMode('board')}
          >
            <ViewColumnIcon fontSize="small" />
          </ViewToggleButton>
          <ViewToggleButton
            active={viewMode === 'workload'}
            onClick={() => setViewMode('workload')}
          >
            <BalanceIcon fontSize="small" />
          </ViewToggleButton>
        </ViewToggleGroup>
      </Box>
    </Header>
  );
};
