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
  RadioButtonUnchecked as UncheckedIcon,
  CheckCircle as CheckedIcon,
  RemoveCircle as IndeterminateIcon,
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
import { TaskPaginator } from '../TaskPaginator';

import type { TasksContentViewProps } from './TasksContentView.types';
import { useTasksContentView } from './useTasksContentView.hook';
import { surfaceColor } from '@/context';
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
    page,
    setPage,
    pageSize,
    totalPages,
    paginatedTasks,
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
  } = useTasksContentView({
    filteredTasks,
    viewMode,
    deleteTasks,
  });

  const showEmptyStateTasks = tasks.length === 0;
  const showEmptyStateFiltered = filteredTasks.length === 0;

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
      {!isListView && isLoading && filteredTasks.length === 0 ? (
        <TasksSkeletons viewMode={viewMode} />
      ) : !isListView && showEmptyStateTasks ? (
        <EmptyState
          icon={<CheckBoxIcon />}
          title="No tasks yet"
          description="Plan your day and boost your productivity. Create your first task to see it here."
        />
      ) : !isListView && showEmptyStateFiltered ? (
        <EmptyState
          title="No tasks match your search"
          description="Try a different keyword or filter to find what you're looking for, or create a new task above."
          actionText="Clear all filters"
          onAction={() => setSearchTerm('')}
        />
      ) : viewMode === 'workload' ? (
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
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: (theme) =>
                `1px solid ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : '#e2e8f0'
                }`,
              mb: 2,
              gap: 2,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            <StatusTabsContainer
              sx={{
                flex: 1,
                minWidth: 0,
                borderBottom: 'none',
                mb: 0,
              }}
            >
              {tabs.map((tab) => {
                const count = tabCounts[tab.id] || 0;
                return (
                  <StatusTabButton
                    key={tab.id}
                    active={selectedStatus === tab.id}
                    tabColor={tab.color}
                    onClick={() => {
                      setSelectedStatus(tab.id);
                      setPage(1);
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

            <TaskPaginator
              currentPage={page}
              totalPages={totalPages}
              totalItems={displayedTasks.length}
              pageSize={pageSize}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </Box>

          <TableWrapper>
            {isLoading && filteredTasks.length === 0 ? (
              <TasksSkeletons viewMode={viewMode} />
            ) : showEmptyStateTasks ? (
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
                  icon={<CheckBoxIcon />}
                  title="No tasks yet"
                  description="Plan your day and boost your productivity. Create your first task to see it here."
                />
              </Box>
            ) : showEmptyStateFiltered ? (
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
                  title="No tasks match your search"
                  description="Try a different keyword or filter to find what you're looking for, or create a new task above."
                  actionText="Clear all filters"
                  onAction={() => setSearchTerm('')}
                />
              </Box>
            ) : (
              <>
                <TableHeader>
                  <TableHeaderCell sx={{ justifyContent: 'center' }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isSomeSelected}
                      onChange={handleToggleSelectAll}
                      size="small"
                      icon={
                        <UncheckedIcon
                          sx={{
                            fontSize: 18,
                            color: 'text.secondary',
                            opacity: 0.6,
                          }}
                        />
                      }
                      checkedIcon={
                        <CheckedIcon
                          sx={{ fontSize: 18, color: 'primary.main' }}
                        />
                      }
                      indeterminateIcon={
                        <IndeterminateIcon
                          sx={{ fontSize: 18, color: 'primary.main' }}
                        />
                      }
                      sx={{
                        padding: 0,
                      }}
                    />
                  </TableHeaderCell>
                  <TableHeaderCell>Task Name</TableHeaderCell>
                  <TableHeaderCell className="col-priority">
                    Priority
                  </TableHeaderCell>
                  <TableHeaderCell className="col-date">
                    Due Date
                  </TableHeaderCell>
                  <TableHeaderCell className="col-estimated">
                    Estimated
                  </TableHeaderCell>
                  <TableHeaderCell className="col-actual">
                    Actual
                  </TableHeaderCell>
                  <TableHeaderCell className="col-ai">AI</TableHeaderCell>
                  <TableHeaderCell sx={{ justifyContent: 'center' }}>
                    Actions
                  </TableHeaderCell>
                </TableHeader>
                <TableBodyContainer>
                  {paginatedTasks.map((task) => (
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
                </TableBodyContainer>
              </>
            )}
          </TableWrapper>
        </>
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
              surfaceColor(theme, '#1e2025', '#242425', '#ffffff'),
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
