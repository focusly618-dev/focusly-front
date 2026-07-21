import { Typography, Box, Select, MenuItem } from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  ViewColumn as ViewColumnIcon,
  Balance as BalanceIcon,
} from '@mui/icons-material';
import {
  ControlsBar,
  FilterButton,
  SortButton,
  StyledTextField,
  ViewToggleGroup,
  ViewToggleButton,
} from '../../Tasks.styles';
import { FilterPopover } from '../FilterPopover/FilterPopover';
import { SortPopover } from '../SortPopover/SortPopover';
import type { TasksControlsBarProps } from './TasksControlsBar.types';
import type { DateRangeFilter } from '../../hooks/useTasksFilters.hook';

export const TasksControlsBar = ({
  viewMode,
  searchTerm,
  setSearchTerm,
  filterAnchorEl,
  sortAnchorEl,
  activeSort,
  activeFilterState,
  tags,
  tagSearchTerm,
  setTagSearchTerm,
  handleFilterClick,
  handleFilterClose,
  handleApplyFilters,
  handleSortClose,
  handleApplySort,
  filteredTasks,
  dateRange,
  setDateRange,
  setViewMode,
}: TasksControlsBarProps) => {
  const pendingCount = filteredTasks
    ? filteredTasks.filter((t) => t.status !== 'Done').length
    : 0;
  const completedCount = filteredTasks
    ? filteredTasks.filter((t) => t.status === 'Done').length
    : 0;

  return (
    <ControlsBar
      id="joyride-tasks-filters"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        marginBottom: '0px',
        width: '100%',
        flexWrap: 'wrap',
        gap: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flex: 1,
          minWidth: '280px',
        }}
      >
        {/* Search Input styled matching screenshot */}
        <StyledTextField
          id="joyride-tasks-search"
          placeholder="Search tasks, tags, or projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }}
              />
            ),
            endAdornment: (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : '#e2e8f0',
                  borderRadius: '4px',
                  px: 0.75,
                  py: 0.25,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : '#f8fafc',
                  color: 'text.secondary',
                  fontSize: '10px',
                  fontWeight: 600,
                  pointerEvents: 'none',
                }}
              >
                ⌘K
              </Box>
            ),
          }}
          size="small"
          sx={{
            flex: 1,
            maxWidth: '360px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.02)'
                  : '#f8fafc',
              '& fieldset': {
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.08)'
                    : '#e2e8f0',
              },
            },
          }}
        />

        {/* Filter Button */}
        <FilterButton
          onClick={(e) => handleFilterClick(e, 'filter')}
          active={Boolean(filterAnchorEl)}
          sx={{
            borderRadius: '24px',
            height: '36px',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.02)'
                : '#ffffff',
            px: 2,
          }}
        >
          <FilterListIcon sx={{ fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Filter
          </Typography>
        </FilterButton>
        <FilterPopover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          tags={tags}
          tagSearchTerm={tagSearchTerm}
          onTagSearchChange={setTagSearchTerm}
          onApply={handleApplyFilters}
          activeFilterState={activeFilterState}
        />

        {/* Sort Button */}
        <SortButton
          onClick={(e) => handleFilterClick(e, 'sort')}
          active={Boolean(sortAnchorEl)}
          sx={{
            borderRadius: '24px',
            height: '36px',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.02)'
                : '#ffffff',
            px: 2,
          }}
        >
          <SortIcon sx={{ fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Sort
          </Typography>
        </SortButton>
        <SortPopover
          open={Boolean(sortAnchorEl)}
          anchorEl={sortAnchorEl}
          onClose={handleSortClose}
          onApply={handleApplySort}
          activeSort={activeSort ?? undefined}
        />

        {/* Combined Stats & Date Selector Pill */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#1c1f26' : '#eff6ff',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.08)'
                : '#bfdbfe',
            borderRadius: '99px',
            px: 2.2,
            height: '36px',
            boxSizing: 'border-box',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#a5b4fc' : '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{pendingCount} Pending</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{completedCount} Completed</span>
          </Typography>

          <Box
            sx={{
              width: '1px',
              height: '18px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.15)'
                  : '#bfdbfe',
              mx: 2,
            }}
          />

          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangeFilter)}
            size="small"
            variant="standard"
            disableUnderline
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#a5b4fc' : '#2563eb',
              '& .MuiSelect-select': {
                py: 0,
                pr: '20px !important',
              },
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="this_week">This Week</MenuItem>
            <MenuItem value="this_month">This Month</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Right Side: View Mode Switcher */}
      <ViewToggleGroup
        id="joyride-tasks-view-toggle"
        sx={{
          borderRadius: '24px',
          border: (theme) =>
            `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.02)'
              : '#ffffff',
          overflow: 'hidden',
          p: '2px',
        }}
      >
        <ViewToggleButton
          active={viewMode === 'list'}
          onClick={() => setViewMode('list')}
          sx={{ borderRadius: '24px', width: 34, height: 30, p: 0 }}
        >
          <ViewListIcon fontSize="small" />
        </ViewToggleButton>
        <ViewToggleButton
          active={viewMode === 'grid'}
          onClick={() => setViewMode('grid')}
          sx={{ borderRadius: '24px', width: 34, height: 30, p: 0 }}
        >
          <GridViewIcon fontSize="small" />
        </ViewToggleButton>
        <ViewToggleButton
          active={viewMode === 'board'}
          onClick={() => setViewMode('board')}
          sx={{ borderRadius: '24px', width: 34, height: 30, p: 0 }}
        >
          <ViewColumnIcon fontSize="small" />
        </ViewToggleButton>
        <ViewToggleButton
          active={viewMode === 'workload'}
          onClick={() => setViewMode('workload')}
          sx={{ borderRadius: '24px', width: 34, height: 30, p: 0 }}
        >
          <BalanceIcon fontSize="small" />
        </ViewToggleButton>
      </ViewToggleGroup>
    </ControlsBar>
  );
};
