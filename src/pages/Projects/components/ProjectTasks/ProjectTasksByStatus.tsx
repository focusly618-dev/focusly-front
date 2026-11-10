import React from 'react';
import { Box } from '@mui/material';
import { ProjectTaskStatusGroup } from './ProjectTaskStatusGroup';
import { ProjectTaskColumns } from './ProjectTaskItem';
import type {
  ProjectTaskItemData,
  ProjectTaskStatusId,
} from './projectTasks.types';
import { tasksInStatus, visibleStatuses } from './projectTaskFilters';

export interface ProjectTasksByStatusProps {
  tasks: ProjectTaskItemData[];
  /** Show the statuses with no tasks too. */
  showEmptyStatuses?: boolean;
  showProject?: boolean;
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onChangeStatus?: (
    task: ProjectTaskItemData,
    status: ProjectTaskStatusId,
  ) => void;
  onDeleteTask?: (task: ProjectTaskItemData) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onAddTask?: (statusId: string, title: string) => void;
  selectionMode?: boolean;
  isSelected?: (taskId: string) => boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
  onToggleSelectAll?: () => void;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
}

export const ProjectTasksByStatus: React.FC<ProjectTasksByStatusProps> = ({
  tasks,
  showEmptyStatuses = false,
  showProject = true,
  selectionMode = false,
  onToggleSelectAll,
  isAllSelected = false,
  isSomeSelected = false,
  ...handlers
}) => (
  <Box
    sx={{
      width: '100%',
      borderRadius: '14px',
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      overflow: 'hidden',
      boxShadow: (theme) =>
        theme.palette.mode === 'dark'
          ? '0 4px 20px rgba(0, 0, 0, 0.22)'
          : '0 2px 12px rgba(15, 23, 42, 0.04)',
      '& > section:last-of-type > div:last-of-type > *:last-child': {
        borderBottom: 'none',
      },
    }}
  >
    <ProjectTaskColumns
      showProject={showProject}
      selectionMode={selectionMode}
      onToggleSelectAll={onToggleSelectAll}
      isAllSelected={isAllSelected}
      isSomeSelected={isSomeSelected}
    />
    {visibleStatuses(tasks, showEmptyStatuses).map((status) => (
      <ProjectTaskStatusGroup
        key={status.id}
        status={status}
        tasks={tasksInStatus(tasks, status)}
        showProject={showProject}
        defaultExpanded={!status.isCompleted}
        selectionMode={selectionMode}
        {...handlers}
      />
    ))}
  </Box>
);
