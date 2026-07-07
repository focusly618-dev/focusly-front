import { Typography, Box, Button } from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Add as AddIcon,
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
  tagSearchTerm,
  setTagSearchTerm,
  handleFilterClick,
  handleFilterClose,
  handleApplyFilters,
  handleSortClose,
  handleApplySort,
  onAddTaskClick,
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
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
        }}
      >
        <FilterButton
          onClick={(e) => handleFilterClick(e, 'filter')}
          active={Boolean(filterAnchorEl)}
          sx={{ flex: { xs: 1, sm: 'none' } }}
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
          tagSearchTerm={tagSearchTerm}
          onTagSearchChange={setTagSearchTerm}
          onApply={handleApplyFilters}
          activeFilterState={activeFilterState}
        />
        <SortButton
          onClick={(e) => handleFilterClick(e, 'sort')}
          active={Boolean(sortAnchorEl)}
          sx={{ flex: { xs: 1, sm: 'none' } }}
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
        <Button
          variant="contained"
          onClick={onAddTaskClick}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            px: 1.5,
            py: 0.75,
            minWidth: 'auto',
            flex: { xs: 1.5, sm: 'none' },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Add New Task
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Add Task
          </Box>
        </Button>
      </Box>
    </ControlsBar>
  );
};
