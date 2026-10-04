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
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onAddTask?: (statusId: string, title: string) => void;
  selectionMode?: boolean;
  isSelected?: (taskId: string) => boolean;
  onToggleSelect?: (task: ProjectTaskItemData) => void;
}

export const ProjectTasksByStatus: React.FC<ProjectTasksByStatusProps> = ({
  tasks,
  showEmptyStatuses = false,
  showProject = true,
  ...handlers
}) => (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
    <ProjectTaskColumns showProject={showProject} />
    {visibleStatuses(tasks, showEmptyStatuses).map((status) => (
      <ProjectTaskStatusGroup
        key={status.id}
        status={status}
        tasks={tasksInStatus(tasks, status)}
        showProject={showProject}
        defaultExpanded={!status.isCompleted}
        {...handlers}
      />
    ))}
  </Box>
);
