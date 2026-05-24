import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  CheckBox as CheckBoxIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { styled as muiStyled } from '@mui/material/styles';
import { AnimatedContainer, GridTaskContainer } from '../../Tasks.styles';
import { EmptyState } from '@/utils/EmptyState';
import { BoardView } from '../BoardView/BoardView';
import { WorkloadDashboard } from '../WorkloadDashboard/WorkloadDashboard';
import { ListViewTask } from '../ListViewTask/ListViewTask';
import { GridViewTask } from '../GridViewTask/GridViewTask';
import { TasksSkeletons } from '../TasksSkeletons/TasksSkeletons';
import {
  TableWrapper,
  TableHeader,
  TableHeaderCell,
  TableStatusGroupRow,
  TableBodyContainer,
  CustomUncheckedIcon,
  CustomCheckedIcon,
  CustomIndeterminateIcon,
} from '../ListViewTask/ListViewTask.styles';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { TasksContentViewProps } from './TasksContentView.types';
import type { Task } from '@/redux/tasks/task.types';

const FloatingActionBar = muiStyled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '24px',
  padding: '12px 24px',
  borderRadius: '16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(35, 37, 42, 0.85)'
      : 'rgba(255, 255, 255, 0.85)',
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 40px 0 rgba(0, 0, 0, 0.25)',
  zIndex: 1000,
  minWidth: '380px',
  animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',

  '@keyframes slideUp': {
    '0%': {
      transform: 'translate(-50%, 100px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translate(-50%, 0)',
      opacity: 1,
    },
  },
}));

const STATUS_SECTIONS = [
  {
    id: 'Todo',
    label: 'To Do',
    color: '#64748b',
    filter: (t: TaskResponse) => t.status === 'Todo' || !t.status,
  },
  {
    id: 'Planning',
    label: 'Planning',
    color: '#3b82f6',
    filter: (t: TaskResponse) => t.status === 'Planning',
  },
  {
    id: 'Scheduled',
    label: 'Scheduled',
    color: '#8b5cf6',
    filter: (t: TaskResponse) => t.status === 'Scheduled',
  },
  {
    id: 'Review',
    label: 'Review',
    color: '#06b6d4',
    filter: (t: TaskResponse) => t.status === 'Review',
  },
  {
    id: 'Pending',
    label: 'Pending',
    color: '#f59e0b',
    filter: (t: TaskResponse) => t.status === 'Pending',
  },
  {
    id: 'On Hold',
    label: 'On Hold',
    color: '#ef4444',
    filter: (t: TaskResponse) => t.status === 'On Hold',
  },
  {
    id: 'Done',
    label: 'Done',
    color: '#10b981',
    filter: (t: TaskResponse) => t.status === 'Done',
  },
  {
    id: 'Backlog',
    label: 'Backlog',
    color: '#94a3b8',
    filter: (t: TaskResponse) => t.status === 'Backlog',
  },
  {
    id: 'Archived',
    label: 'Archived',
    color: '#4b5563',
    filter: (t: TaskResponse) => t.status === 'Archived',
  },
];

const StatusTableGroup = ({
  section,
  tasks,
  expandedTaskIds,
  toggleTaskExpansion,
  handleSubtaskToggle,
  handleOpenSubtaskModal,
  handleTaskClick,
  updateTask,
  isAIScheduleEnabled,
  onStartFocus,
  selectedTaskIds,
  onToggleSelect,
}: {
  section: (typeof STATUS_SECTIONS)[number];
  tasks: TaskResponse[];
  expandedTaskIds: Set<string>;
  toggleTaskExpansion: (taskId: string) => void;
  handleSubtaskToggle: (task: TaskResponse, index: number) => void;
  handleOpenSubtaskModal: (task: TaskResponse, index?: number) => void;
  handleTaskClick: (task: TaskResponse) => void;
  updateTask: (taskId: string, updates: TaskResponse) => Promise<void>;
  isAIScheduleEnabled?: boolean;
  onStartFocus?: (task: Task) => void;
  selectedTaskIds: Set<string>;
  onToggleSelect: (taskId: string) => void;
}) => {
  const [limit, setLimit] = useState(24);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const displayedTasks = useMemo(() => {
    return tasks.filter(section.filter);
  }, [tasks, section.filter]);

  const paginatedTasks = useMemo(() => {
    return displayedTasks.slice(0, limit);
  }, [displayedTasks, limit]);

  const totalCount = displayedTasks.length;

  if (totalCount === 0) {
    return null;
  }

  return (
    <Box>
      <TableStatusGroupRow
        statusColor={section.color}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronRightIcon
          sx={{
            fontSize: '14px',
            color: section.color,
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            mr: '2px',
          }}
        />
        <Box
          sx={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: section.color,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: section.color,
          }}
        >
          {section.label}
        </Typography>
        <Box
          component="span"
          sx={{
            fontSize: '10px',
            backgroundColor: `${section.color}1a`,
            color: section.color,
            padding: '2px 8px',
            borderRadius: '10px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '18px',
          }}
        >
          {totalCount}
        </Box>
      </TableStatusGroupRow>
      {!isCollapsed &&
        paginatedTasks.map((task) => (
          <ListViewTask
            key={task.id}
            task={task}
            expandedTaskIds={expandedTaskIds}
            toggleTaskExpansion={toggleTaskExpansion}
            handleSubtaskToggle={handleSubtaskToggle}
            handleOpenSubtaskModal={handleOpenSubtaskModal}
            onTaskClick={handleTaskClick}
            updateTask={updateTask}
            isAIScheduleEnabled={isAIScheduleEnabled}
            onStartFocus={onStartFocus}
            isSelected={selectedTaskIds.has(task.id)}
            onToggleSelect={() => onToggleSelect(task.id)}
          />
        ))}
      {!isCollapsed && totalCount > paginatedTasks.length && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            size="small"
            onClick={() => setLimit((prev) => prev + 24)}
            sx={{
              textTransform: 'none',
              fontSize: '11px',
              fontWeight: 700,
              color: section.color,
              backgroundColor: `${section.color}0a`,
              borderRadius: '8px',
              px: 3,
              py: 0.5,
              '&:hover': {
                backgroundColor: `${section.color}15`,
              },
            }}
          >
            Show More ({totalCount - paginatedTasks.length} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
};

export const TasksContentView = ({
  viewMode,
  isLoading,
  tasks,
  filteredTasks,
  expandedTaskIds,
  toggleTaskExpansion,
  handleSubtaskToggle,
  handleOpenSubtaskModal,
  handleTaskClick,
  updateTask,
  deleteTasks,
  setSearchTerm,
  isAIScheduleEnabled,
  onStartFocus,
}: TasksContentViewProps) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set(),
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [prevViewMode, setPrevViewMode] = useState(viewMode);

  if (viewMode !== prevViewMode) {
    setPrevViewMode(viewMode);
    setSelectedTaskIds(new Set());
    setIsConfirmOpen(false);
  }

  const isListView =
    viewMode !== 'grid' && viewMode !== 'board' && viewMode !== 'workload';

  const handleToggleSelect = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    const allFilteredIds = filteredTasks.map((t) => t.id);
    const allSelected = allFilteredIds.every((id) => selectedTaskIds.has(id));
    if (allSelected) {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedTaskIds((prev) => {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleDeleteSelectedClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    if (deleteTasks) {
      await deleteTasks(Array.from(selectedTaskIds));
      setSelectedTaskIds(new Set());
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedTaskIds(new Set());
  };

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
                <Checkbox
                  disabled
                  size="small"
                  icon={<CustomUncheckedIcon />}
                  checkedIcon={<CustomCheckedIcon />}
                  sx={{ padding: 0 }}
                />
              </TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Task Name</TableHeaderCell>
              <TableHeaderCell className="col-category">
                Category
              </TableHeaderCell>
              <TableHeaderCell>Priority</TableHeaderCell>
              <TableHeaderCell>Due Date</TableHeaderCell>
              <TableHeaderCell className="col-subtasks">
                Subtasks
              </TableHeaderCell>
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
          <TableHeader>
            <TableHeaderCell sx={{ justifyContent: 'center' }}>
              <Checkbox
                indeterminate={
                  selectedTaskIds.size > 0 &&
                  selectedTaskIds.size < filteredTasks.length
                }
                checked={
                  filteredTasks.length > 0 &&
                  selectedTaskIds.size === filteredTasks.length
                }
                onChange={handleToggleAll}
                size="small"
                icon={<CustomUncheckedIcon />}
                checkedIcon={<CustomCheckedIcon />}
                indeterminateIcon={<CustomIndeterminateIcon />}
                sx={{
                  padding: 0,
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            </TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Task Name</TableHeaderCell>
            <TableHeaderCell className="col-category">Category</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Due Date</TableHeaderCell>
            <TableHeaderCell className="col-subtasks">Subtasks</TableHeaderCell>
            <TableHeaderCell className="col-estimated">
              Estimated
            </TableHeaderCell>
            <TableHeaderCell className="col-actual">Actual</TableHeaderCell>
            <TableHeaderCell className="col-ai">AI Schedule</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>
          <TableBodyContainer>
            {STATUS_SECTIONS.map((section) => (
              <StatusTableGroup
                key={section.id}
                section={section}
                tasks={filteredTasks}
                expandedTaskIds={expandedTaskIds}
                toggleTaskExpansion={toggleTaskExpansion}
                handleSubtaskToggle={handleSubtaskToggle}
                handleOpenSubtaskModal={handleOpenSubtaskModal}
                handleTaskClick={handleTaskClick}
                updateTask={updateTask}
                isAIScheduleEnabled={isAIScheduleEnabled}
                onStartFocus={onStartFocus}
                selectedTaskIds={selectedTaskIds}
                onToggleSelect={handleToggleSelect}
              />
            ))}
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
              onClick={handleDeleteSelectedClick}
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
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            autoFocus
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AnimatedContainer>
  );
};
