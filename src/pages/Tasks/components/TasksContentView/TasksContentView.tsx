import { Box } from '@mui/material';
import { CheckBox as CheckBoxIcon } from '@mui/icons-material';
import {
  AnimatedContainer,
  SectionTitle,
  GridTaskContainer,
} from '../../Tasks.styles';
import { EmptyState } from '@/utils/EmptyState';
import { BoardView } from '../BoardView/BoardView';
import { WorkloadDashboard } from '../WorkloadDashboard/WorkloadDashboard';
import { ListViewTask } from '../ListViewTask/ListViewTask';
import { GridViewTask } from '../GridViewTask/GridViewTask';
import { TasksSkeletons } from '../TasksSkeletons/TasksSkeletons';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { TasksContentViewProps } from './TasksContentView.types';

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
}: TasksContentViewProps) => {
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
      <AnimatedContainer id="joyride-tasks-list" key={viewMode}>
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
      <AnimatedContainer id="joyride-tasks-list" key={viewMode}>
        <EmptyState
          title="No tasks match your search"
          description="Try a different keyword or filter to find what you're looking for, or create a new task above."
          actionText="Clear all filters"
          onAction={() => setSearchTerm('')}
        />
      </AnimatedContainer>
    );
  }

  // Render the active view
  return (
    <AnimatedContainer id="joyride-tasks-list" key={viewMode}>
      {viewMode === 'workload' ? (
        <WorkloadDashboard />
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
          {STATUS_SECTIONS.map((section) => {
            const sectionTasks = filteredTasks.filter(section.filter);
            if (sectionTasks.length === 0) return null;

            return (
              <Box key={section.id} sx={{ mb: 4 }}>
                <SectionTitle colorIndicator={section.color}>
                  {section.label}
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      fontSize: '11px',
                      backgroundColor: `${section.color}1f`,
                      color: section.color,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '20px',
                      fontWeight: 700,
                    }}
                  >
                    {sectionTasks.length}
                  </Box>
                </SectionTitle>
                <Box sx={{ paddingTop: 1 }}>
                  {sectionTasks.map((task) => (
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
                </Box>
              </Box>
            );
          })}
        </>
      )}
    </AnimatedContainer>
  );
};
