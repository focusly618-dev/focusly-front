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
  console.log(dateRange);
  return (
    <Header>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: { xs: 'none', md: 'block' },
          }}
        >
          Manage and prioritize your work
        </Typography>
        <Title>My Tasks</Title>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
          flexWrap: 'wrap',
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'space-between', md: 'flex-end' },
        }}
      >
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
            {filteredTasks.filter((t) => t.status !== 'Done').length} Pending
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            •
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {filteredTasks.filter((t) => t.status === 'Done').length} Completed
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
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="this_week">This Week</MenuItem>
          <MenuItem value="this_month">This Month</MenuItem>
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
