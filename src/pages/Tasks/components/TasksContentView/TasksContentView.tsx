import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useAppSelector } from '@/redux/hooks';
import moment from 'moment';
import { Box, Typography, Button } from '@mui/material';
import { CheckBox as CheckBoxIcon } from '@mui/icons-material';
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
} from '../ListViewTask/ListViewTask.styles';
import { GET_TASKS_PAGINATED } from '@/pages/Tasks/components/TaskDetailModal/tasks.graphql';
import type {
  TaskResponse,
  TaskFilterInput,
  TaskSortInput,
} from '@/api/Tasks/apiTaskTypes';
import type { TasksContentViewProps } from './TasksContentView.types';
import type { Task } from '@/redux/tasks/task.types';

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
  userId,
  activeFilters,
  activeSort,
  expandedTaskIds,
  toggleTaskExpansion,
  handleSubtaskToggle,
  handleOpenSubtaskModal,
  handleTaskClick,
  updateTask,
  isAIScheduleEnabled,
  onStartFocus,
  searchTerm,
  dateRange,
}: {
  section: (typeof STATUS_SECTIONS)[number];
  userId: string;
  activeFilters?: TaskFilterInput;
  activeSort?: TaskSortInput;
  expandedTaskIds: Set<string>;
  toggleTaskExpansion: (taskId: string) => void;
  handleSubtaskToggle: (task: TaskResponse, index: number) => void;
  handleOpenSubtaskModal: (task: TaskResponse, index?: number) => void;
  handleTaskClick: (task: TaskResponse) => void;
  updateTask: (taskId: string, updates: TaskResponse) => Promise<void>;
  isAIScheduleEnabled?: boolean;
  onStartFocus?: (task: Task) => void;
  searchTerm?: string;
  dateRange?: string;
}) => {
  const [limit, setLimit] = useState(24);

  const queryFilters = useMemo(() => {
    const f = activeFilters ? { ...activeFilters } : {};
    if (activeFilters?.status && activeFilters.status.length > 0) {
      if (
        !activeFilters.status.includes(section.id as TaskResponse['status'])
      ) {
        return null;
      }
    }
    f.status = [section.id as TaskResponse['status']];

    if (searchTerm) {
      f.searchTerm = searchTerm;
    }

    if (dateRange && dateRange !== 'all') {
      if (dateRange === 'today') {
        const todayStart = moment().startOf('day').toISOString();
        const todayEnd = moment().endOf('day').toISOString();
        f.startDate = todayStart;
        f.endDate = todayEnd;
      } else if (dateRange === 'last7') {
        f.startDate = moment().subtract(7, 'days').startOf('day').toISOString();
      } else if (dateRange === 'last30') {
        f.startDate = moment()
          .subtract(30, 'days')
          .startOf('day')
          .toISOString();
      }
    }

    return f;
  }, [activeFilters, section.id, searchTerm, dateRange]);

  const skipQuery = !userId || queryFilters === null;

  const { data, loading } = useQuery(GET_TASKS_PAGINATED, {
    skip: skipQuery,
    variables: {
      userId,
      filters: queryFilters || {},
      sort: activeSort || null,
      offset: 0,
      limit,
    },
    fetchPolicy: 'cache-and-network',
  });

  if (skipQuery) return null;

  const displayedTasks: TaskResponse[] = data?.result?.tasks || [];
  const totalCount = data?.result?.totalCount || 0;

  if (!loading && displayedTasks.length === 0) {
    return null;
  }

  return (
    <Box>
      <TableStatusGroupRow statusColor={section.color}>
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
      {displayedTasks.map((task) => (
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
        />
      ))}
      {totalCount > displayedTasks.length && (
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
            Show More ({totalCount - displayedTasks.length} remaining)
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
  setSearchTerm,
  isAIScheduleEnabled,
  onStartFocus,
  activeFilters,
  activeSort,
  searchTerm,
  dateRange,
}: TasksContentViewProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id || '';

  // Loading skeletons
  if (isLoading && filteredTasks.length === 0) {
    return (
      <AnimatedContainer id="joyride-tasks-list" key={viewMode}>
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
          viewMode !== 'grid' && viewMode !== 'board' && viewMode !== 'workload'
            ? {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : undefined
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
    return (
      <AnimatedContainer
        id="joyride-tasks-list"
        key={viewMode}
        sx={
          viewMode !== 'grid' && viewMode !== 'board' && viewMode !== 'workload'
            ? {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                paddingTop: 0,
                minHeight: 0,
              }
            : undefined
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

  const isListView =
    viewMode !== 'grid' && viewMode !== 'board' && viewMode !== 'workload';

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
          : undefined
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
            <TableHeaderCell /> {/* Status Checkbox */}
            <TableHeaderCell>Task Name</TableHeaderCell>
            <TableHeaderCell className="col-category">Category</TableHeaderCell>
            <TableHeaderCell>Priority</TableHeaderCell>
            <TableHeaderCell>Due Date</TableHeaderCell>
            <TableHeaderCell className="col-subtasks">Subtasks</TableHeaderCell>
            <TableHeaderCell className="col-links">Links</TableHeaderCell>
            <TableHeaderCell className="col-progress">Progress</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeader>
          <TableBodyContainer>
            {STATUS_SECTIONS.map((section) => (
              <StatusTableGroup
                key={section.id}
                section={section}
                userId={userId}
                activeFilters={activeFilters}
                activeSort={activeSort}
                expandedTaskIds={expandedTaskIds}
                toggleTaskExpansion={toggleTaskExpansion}
                handleSubtaskToggle={handleSubtaskToggle}
                handleOpenSubtaskModal={handleOpenSubtaskModal}
                handleTaskClick={handleTaskClick}
                updateTask={updateTask}
                isAIScheduleEnabled={isAIScheduleEnabled}
                onStartFocus={onStartFocus}
                searchTerm={searchTerm}
                dateRange={dateRange}
              />
            ))}
          </TableBodyContainer>
        </TableWrapper>
      )}
    </AnimatedContainer>
  );
};
