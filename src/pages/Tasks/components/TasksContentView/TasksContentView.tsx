import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  CheckBox as CheckBoxIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { AnimatedContainer, GridTaskContainer } from '../../Tasks.styles';
import { EmptyState } from '@/components/ui';
import { BoardView } from '../BoardView/BoardView';
import { WorkloadDashboard } from '../WorkloadDashboard/WorkloadDashboard';
import { ListViewTask } from '../ListViewTask/ListViewTask';
import { GridViewTask } from '../GridViewTask/GridViewTask';
import { TasksSkeletons } from '../TasksSkeletons/TasksSkeletons';
import {
  TableWrapper,
  TableHeader,
  TableHeaderCell,
  TableBodyContainer,
} from '../ListViewTask/ListViewTask.styles';

import type { TasksContentViewProps } from './TasksContentView.types';
import { useTasksContentView } from './useTasksContentView.hook';
import {
  FloatingActionBar,
  StatusTabsContainer,
  StatusTabButton,
  TabCountBadge,
} from './TasksContentView.styles';

export const TasksContentView = ({
  viewMode,
  isLoading,
  tasks,
  filteredTasks,
  handleTaskClick,
  updateTask,
  deleteTasks,
  setSearchTerm,
  isAIScheduleEnabled,
  onStartFocus,
}: TasksContentViewProps) => {
  const {
    selectedTaskIds,
    isConfirmOpen,
    isDeleting,
    selectedStatus,
    setSelectedStatus,
    limit,
    setLimit,
    isListView,
    handleToggleSelect,
    tabs,
    tabCounts,
    activeTab,
    displayedTasks,
    isAllSelected,
    isSomeSelected,
    handleToggleSelectAll,
    handleDeleteSelectedClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleClearSelection,
    handleScroll,
  } = useTasksContentView({
    filteredTasks,
    viewMode,
    deleteTasks,
  });

  // Loading skeletons
  if (isLoading && filteredTasks.length === 0) {
    return (
      <AnimatedContainer
        id="joyride-tasks-list"
        key={viewMode}
        sx={
          isListView
            ? {
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : {
                padding: '16px 24px',
              }
        }
      >
        <TasksSkeletons viewMode={viewMode} />
      </AnimatedContainer>
    );
  }

  // No tasks at all
  if (tasks.length === 0) {
    return (
      <AnimatedContainer
        id="joyride-tasks-list"
        key={viewMode}
        sx={
          isListView
            ? {
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : {
                padding: '16px 24px',
              }
        }
      >
        <EmptyState
          icon={<CheckBoxIcon />}
          title="No tasks yet"
          description="Plan your day and boost your productivity. Create your first task to see it here."
        />
      </AnimatedContainer>
    );
  }

  // No tasks match filters
  if (filteredTasks.length === 0) {
    if (isListView) {
      return (
        <AnimatedContainer
          id="joyride-tasks-list"
          key={viewMode}
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            paddingTop: 0,
            minHeight: 0,
          }}
        >
          <TableWrapper>
            <TableHeader>
              <TableHeaderCell sx={{ justifyContent: 'center' }}>
                <Checkbox disabled size="small" sx={{ padding: 0 }} />
              </TableHeaderCell>
              <TableHeaderCell>Task Name</TableHeaderCell>
              <TableHeaderCell>Priority</TableHeaderCell>
              <TableHeaderCell>Due Date</TableHeaderCell>
              <TableHeaderCell className="col-estimated">
                Estimated
              </TableHeaderCell>
              <TableHeaderCell className="col-actual">Actual</TableHeaderCell>
              <TableHeaderCell className="col-ai">AI Schedule</TableHeaderCell>
              <TableHeaderCell sx={{ justifyContent: 'center' }}>
                Actions
              </TableHeaderCell>
            </TableHeader>
            <TableBodyContainer
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
              }}
            >
              <EmptyState
                title="No tasks match your search"
                description="Try a different keyword or filter to find what you're looking for, or create a new task above."
                actionText="Clear all filters"
                onAction={() => setSearchTerm('')}
              />
            </TableBodyContainer>
          </TableWrapper>
        </AnimatedContainer>
      );
    }

    return (
      <AnimatedContainer
        id="joyride-tasks-list"
        key={viewMode}
        sx={
          isListView
            ? {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : {
                padding: '16px 24px',
              }
        }
      >
        <EmptyState
          title="No tasks match your search"
          description="Try a different keyword or filter to find what you're looking for, or create a new task above."
          actionText="Clear all filters"
          onAction={() => setSearchTerm('')}
        />
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer
      id="joyride-tasks-list"
      key={viewMode}
      sx={
        isListView
          ? {
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              paddingTop: 0,
              minHeight: 0,
            }
          : {
              padding: '16px 24px',
            }
      }
    >
      {viewMode === 'workload' ? (
        <WorkloadDashboard filteredTasks={filteredTasks} />
      ) : viewMode === 'board' ? (
        <BoardView
          tasks={filteredTasks}
          updateTask={updateTask}
          onTaskClick={handleTaskClick}
        />
      ) : viewMode === 'grid' ? (
        <GridTaskContainer>
          {filteredTasks.map((task) => (
            <GridViewTask
              key={task.id}
              task={task}
              onTaskClick={handleTaskClick}
              isAIScheduleEnabled={isAIScheduleEnabled}
            />
          ))}
        </GridTaskContainer>
      ) : (
        <TableWrapper>
          <StatusTabsContainer>
            {tabs.map((tab) => {
              const count = tabCounts[tab.id] || 0;
              return (
                <StatusTabButton
                  key={tab.id}
                  active={selectedStatus === tab.id}
                  tabColor={tab.color}
                  onClick={() => {
                    setSelectedStatus(tab.id);
                    setLimit(24);
                  }}
                >
                  {tab.label}
                  <TabCountBadge
                    active={selectedStatus === tab.id}
                    tabColor={tab.color}
                  >
                    {count}
                  </TabCountBadge>
                </StatusTabButton>
              );
            })}
          </StatusTabsContainer>
          <TableHeader>
            <TableHeaderCell sx={{ justifyContent: 'center' }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onChange={handleToggleSelectAll}
                size="small"
                sx={{
                  padding: 0,
                  color: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.25)',
                  '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                    color: 'primary.main',
                  },
                }}
              />
            </TableHeaderCell>
            <TableHeaderCell>Task Name</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Due Date</TableHeaderCell>
            <TableHeaderCell className="col-estimated">
              Estimated
            </TableHeaderCell>
            <TableHeaderCell className="col-actual">Actual</TableHeaderCell>
            <TableHeaderCell className="col-ai">AI Schedule</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>
          <TableBodyContainer onScroll={handleScroll}>
            {displayedTasks.slice(0, limit).map((task) => (
              <ListViewTask
                key={task.id}
                task={task}
                onTaskClick={handleTaskClick}
                updateTask={updateTask}
                isAIScheduleEnabled={isAIScheduleEnabled}
                onStartFocus={onStartFocus}
                isSelected={selectedTaskIds.has(task.id)}
                onToggleSelect={() => handleToggleSelect(task.id)}
              />
            ))}
            {displayedTasks.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  width: '100%',
                }}
              >
                <EmptyState
                  title={`No tasks in ${activeTab.label}`}
                  description="Move a task here or change tabs to see tasks."
                />
              </Box>
            )}
            {displayedTasks.length > limit && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: 'transparent',
                }}
              >
                <Button
                  size="small"
                  onClick={() => setLimit((prev) => prev + 24)}
                  sx={{
                    textTransform: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: activeTab.color,
                    backgroundColor: `${activeTab.color}0a`,
                    borderRadius: '8px',
                    px: 3,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: `${activeTab.color}15`,
                    },
                  }}
                >
                  Show More ({displayedTasks.length - limit} remaining)
                </Button>
              </Box>
            )}
          </TableBodyContainer>
        </TableWrapper>
      )}

      {isListView && selectedTaskIds.size > 0 && (
        <FloatingActionBar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {selectedTaskIds.size}{' '}
              {selectedTaskIds.size === 1 ? 'task' : 'tasks'} selected
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="text"
              size="small"
              onClick={handleClearSelection}
              startIcon={<CloseIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={(e) => handleDeleteSelectedClick(e)}
              startIcon={<DeleteIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 2,
              }}
            >
              Delete Selected
            </Button>
          </Box>
        </FloatingActionBar>
      )}

      {/* Modern Confirmation Dialog */}
      <Dialog
        open={isConfirmOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
            maxWidth: '400px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1e2025' : '#ffffff',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, px: 2, py: 1 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            Are you sure you want to delete {selectedTaskIds.size} selected{' '}
            {selectedTaskIds.size === 1 ? 'task' : 'tasks'}? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            disabled={isDeleting}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => handleConfirmDelete(e)}
            variant="contained"
            color="error"
            disabled={isDeleting}
            autoFocus
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              minWidth: '90px',
            }}
          >
            {isDeleting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
};
