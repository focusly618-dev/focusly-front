import React, { useState } from 'react';
import { Box } from '@mui/material';
import { ProjectTaskStatusGroup } from './ProjectTaskStatusGroup';
import {
  DEFAULT_PROJECT_STATUSES,
  type ProjectStatusConfig,
  type ProjectTaskItemData,
} from './projectTasks.types';
import { MOCK_PROJECT_TASKS } from './projectTasks.mock';

export interface ProjectTasksByStatusProps {
  tasks?: ProjectTaskItemData[];
  statuses?: ProjectStatusConfig[];
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  onAddTask?: (statusId: string, title: string) => void;
}

export const ProjectTasksByStatus: React.FC<ProjectTasksByStatusProps> = ({
  tasks: propTasks,
  statuses = DEFAULT_PROJECT_STATUSES,
  onTaskClick,
  onToggleComplete: propOnToggleComplete,
  onToggleSubtask: propOnToggleSubtask,
  onAddSubtask: propOnAddSubtask,
  onAddTask: propOnAddTask,
}) => {
  const [internalTasks, setInternalTasks] = useState<ProjectTaskItemData[]>(
    propTasks || MOCK_PROJECT_TASKS,
  );

  const activeTasks = propTasks || internalTasks;

  // Local state handlers if user doesn't pass external handlers
  const handleToggleComplete = (task: ProjectTaskItemData) => {
    if (propOnToggleComplete) {
      propOnToggleComplete(task);
      return;
    }
    setInternalTasks((prev) =>
      prev.map((t) => {
        if (t.id === task.id) {
          const isDone = !t.completed;
          return {
            ...t,
            completed: isDone,
            status: isDone ? 'completed' : 'in_progress',
          };
        }
        return t;
      }),
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    if (propOnToggleSubtask) {
      propOnToggleSubtask(taskId, subtaskId);
      return;
    }
    setInternalTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st,
            ),
          };
        }
        return t;
      }),
    );
  };

  const handleAddSubtask = (taskId: string, title: string) => {
    if (propOnAddSubtask) {
      propOnAddSubtask(taskId, title);
      return;
    }
    const newSubtask = {
      id: `sub-${Date.now()}`,
      title,
      completed: false,
      dueBadge: 'Today',
      duration: '15m',
    };
    setInternalTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: [...(t.subtasks || []), newSubtask],
          };
        }
        return t;
      }),
    );
  };

  const handleAddTask = (statusId: string, title: string) => {
    if (propOnAddTask) {
      propOnAddTask(statusId, title);
      return;
    }
    const newTask: ProjectTaskItemData = {
      id: `task-${Date.now()}`,
      title,
      status: statusId,
      priority: 'Medium',
      dueDate: 'Today',
      dueDateHighlight: 'today',
      duration: '30m',
      assignee: {
        name: 'Sotelo U.',
        initials: 'SU',
        color: '#ea580c',
      },
    };
    setInternalTasks((prev) => [...prev, newTask]);
  };

  // Filter statuses to those present or common ones
  const visibleStatuses = statuses.filter(
    (status) =>
      ['in_progress', 'todo', 'completed'].includes(status.id) ||
      activeTasks.some(
        (t) => t.status.toLowerCase() === status.id.toLowerCase(),
      ),
  );

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {visibleStatuses.map((status) => {
        const groupTasks = activeTasks.filter(
          (t) => t.status.toLowerCase() === status.id.toLowerCase(),
        );

        return (
          <ProjectTaskStatusGroup
            key={status.id}
            status={status}
            tasks={groupTasks}
            onTaskClick={onTaskClick}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onAddSubtask={handleAddSubtask}
            onAddTask={handleAddTask}
            defaultExpanded={status.id !== 'completed'}
          />
        );
      })}
    </Box>
  );
};
