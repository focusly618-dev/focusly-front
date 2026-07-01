import { Typography, Box } from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import {
  ControlsBar,
  FilterButton,
  SortButton,
  StyledTextField,
} from '../../Tasks.styles';
import { FilterPopover } from '../FilterPopover/FilterPopover';
import { SortPopover } from '../SortPopover/SortPopover';
import type { TasksControlsBarProps } from './TasksControlsBar.types';

export const TasksControlsBar = ({
  viewMode,
  searchTerm,
  setSearchTerm,
  filterAnchorEl,
  sortAnchorEl,
  activeSort,
  activeFilterState,
  tags,
  handleFilterClick,
  handleFilterClose,
  handleApplyFilters,
  handleSortClose,
  handleApplySort,
}: TasksControlsBarProps) => {
  if (viewMode === 'board' || viewMode === 'workload') {
    return <ControlsBar id="joyride-tasks-filters" />;
  }

  return (
    <ControlsBar id="joyride-tasks-filters">
      <StyledTextField
        id="joyride-tasks-search"
        placeholder="Search tasks, tags, or projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          ),
        }}
        size="small"
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FilterButton
          onClick={(e) => handleFilterClick(e, 'filter')}
          active={Boolean(filterAnchorEl)}
        >
          <FilterListIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Filter
          </Typography>
        </FilterButton>
        <FilterPopover
          open={Boolean(filterAnchorEl)}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          tags={tags}
          onApply={handleApplyFilters}
          activeFilterState={activeFilterState}
        />
        <SortButton
          onClick={(e) => handleFilterClick(e, 'sort')}
          active={Boolean(sortAnchorEl)}
        >
          <SortIcon sx={{ fontSize: 20 }} />
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
      </Box>
    </ControlsBar>
  );
};
