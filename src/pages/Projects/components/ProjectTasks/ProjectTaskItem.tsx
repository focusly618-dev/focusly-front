import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
  alpha,
  Collapse,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ProjectTaskSubtasks } from './ProjectTaskSubtasks';
import type {
  ProjectTaskItemData,
  ProjectTaskPriority,
} from './projectTasks.types';

export interface ProjectTaskItemProps {
  task: ProjectTaskItemData;
  onTaskClick?: (task: ProjectTaskItemData) => void;
  onToggleComplete?: (task: ProjectTaskItemData) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, title: string) => void;
  initialExpanded?: boolean;
}

export const ProjectTaskItem: React.FC<ProjectTaskItemProps> = ({
  task,
  onTaskClick,
  onToggleComplete,
  onToggleSubtask,
  onAddSubtask,
  initialExpanded = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasSubtasks = Boolean(task.subtasks && task.subtasks.length > 0);
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(
    initialExpanded ||
      (hasSubtasks && task.subtasks!.some((s) => !s.completed)),
  );

  const completedSubtasksCount =
    task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasksCount = task.subtasks?.length || 0;
  const isDone = task.completed || task.status.toLowerCase() === 'completed';

  // Priority Styles helper
  const renderPriorityBadge = (priority?: ProjectTaskPriority) => {
    if (!priority || priority === 'None') return null;

    let color = '#3b82f6';
    let label = 'Medium';
    let icon: React.ReactNode = <ArrowUpwardIcon sx={{ fontSize: 11 }} />;

    if (priority === 'Critical') {
      color = '#ef4444';
      label = '! Critical';
      icon = null;
    } else if (priority === 'High') {
      color = '#f59e0b';
      label = 'High';
      icon = <ArrowUpwardIcon sx={{ fontSize: 11 }} />;
    } else if (priority === 'Medium') {
      color = '#3b82f6';
      label = 'Medium';
      icon = <ArrowUpwardIcon sx={{ fontSize: 11 }} />;
    } else if (priority === 'Low') {
      color = '#10b981';
      label = 'Low';
      icon = <ArrowDownwardIcon sx={{ fontSize: 11 }} />;
    }

    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          px: '7px',
          py: '2px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 700,
          bgcolor: alpha(color, 0.12),
          color,
          border: `1px solid ${alpha(color, 0.25)}`,
          flexShrink: 0,
        }}
      >
        {icon}
        <span>{label}</span>
      </Box>
    );
  };

  const getAssigneeColor = (name: string, customColor?: string) => {
    if (customColor) return customColor;
    const colors = ['#ea580c', '#0d9488', '#7c3aed', '#2563eb', '#db2777'];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        bgcolor: isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: isDark
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.025)',
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.09)'
            : 'rgba(0, 0, 0, 0.09)',
        },
      }}
    >
      {/* ── Main Task Row ── */}
      <Box
        onClick={() => onTaskClick?.(task)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
          cursor: 'pointer',
          gap: 1.5,
          minWidth: 0,
        }}
      >
        {/* Left Side: Checkbox + Title + Tags */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* Checkbox */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete?.(task);
            }}
            sx={{
              p: 0,
              color: isDone
                ? '#10b981'
                : isDark
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                color: isDone ? '#059669' : '#10b981',
              },
            }}
          >
            {isDone ? (
              <CheckCircleIcon sx={{ fontSize: 18 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>

          {/* Task Title */}
          <Typography
            sx={{
              fontSize: '13.5px',
              fontWeight: 500,
              color: isDone
                ? isDark
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)'
                : isDark
                  ? '#f4f4f5'
                  : '#18181b',
              textDecoration: isDone ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: { xs: '180px', sm: '280px', md: '360px' },
            }}
          >
            {task.title}
          </Typography>

          {/* Module / Tag Pill */}
          {task.tag && (
            <Box
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                alignItems: 'center',
                px: '7px',
                py: '2px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
                color: isDark
                  ? 'rgba(255, 255, 255, 0.65)'
                  : 'rgba(0, 0, 0, 0.65)',
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                flexShrink: 0,
              }}
            >
              {task.tag}
            </Box>
          )}

          {/* Subtasks Progress Badge */}
          {totalSubtasksCount > 0 && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setIsSubtasksExpanded(!isSubtasksExpanded);
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                px: '6px',
                py: '2px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color:
                  completedSubtasksCount > 0
                    ? '#10b981'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'rgba(0, 0, 0, 0.5)',
                bgcolor:
                  completedSubtasksCount > 0
                    ? alpha('#10b981', 0.12)
                    : isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                border: `1px solid ${
                  completedSubtasksCount > 0
                    ? alpha('#10b981', 0.25)
                    : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.08)'
                }`,
                cursor: 'pointer',
                flexShrink: 0,
                '&:hover': {
                  filter: 'brightness(1.15)',
                },
              }}
            >
              <FormatListBulletedIcon sx={{ fontSize: 12 }} />
              <span>
                {completedSubtasksCount}/{totalSubtasksCount} subtasks
              </span>
            </Box>
          )}
        </Box>

        {/* Right Side: Priority + Duration + Due Date + Assignee + Expand Caret */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          {/* Priority */}
          {renderPriorityBadge(task.priority)}

          {/* Duration */}
          {task.duration && (
            <Typography
              sx={{
                display: { xs: 'none', md: 'block' },
                fontSize: '11.5px',
                fontWeight: 500,
                color: isDark
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              }}
            >
              {task.duration}
            </Typography>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <Box
              sx={{
                fontSize: '11px',
                fontWeight: 600,
                px: '7px',
                py: '2px',
                borderRadius: '4px',
                bgcolor:
                  task.dueDateHighlight === 'today' ||
                  task.dueDate.toLowerCase() === 'today'
                    ? alpha('#10b981', 0.15)
                    : isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                color:
                  task.dueDateHighlight === 'today' ||
                  task.dueDate.toLowerCase() === 'today'
                    ? '#34d399'
                    : isDark
                      ? 'rgba(255, 255, 255, 0.6)'
                      : 'rgba(0, 0, 0, 0.6)',
                border: `1px solid ${
                  task.dueDateHighlight === 'today' ||
                  task.dueDate.toLowerCase() === 'today'
                    ? alpha('#10b981', 0.25)
                    : isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.08)'
                }`,
              }}
            >
              {task.dueDate}
            </Box>
          )}

          {/* Assignee Avatar */}
          {task.assignee && (
            <Tooltip title={task.assignee.name}>
              <Avatar
                src={task.assignee.avatarUrl}
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: '10px',
                  fontWeight: 700,
                  bgcolor: getAssigneeColor(
                    task.assignee.name,
                    task.assignee.color,
                  ),
                  color: '#ffffff',
                }}
              >
                {task.assignee.initials}
              </Avatar>
            </Tooltip>
          )}

          {/* Subtask Chevron */}
          {hasSubtasks && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsSubtasksExpanded(!isSubtasksExpanded);
              }}
              sx={{
                p: '2px',
                color: isDark
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
                '&:hover': {
                  color: isDark ? '#ffffff' : '#000000',
                },
              }}
            >
              {isSubtasksExpanded ? (
                <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* ── Subtasks Container (Collapsible) ── */}
      {hasSubtasks && (
        <Collapse in={isSubtasksExpanded} timeout={180} unmountOnExit>
          <ProjectTaskSubtasks
            subtasks={task.subtasks!}
            onToggleSubtask={(subId) => onToggleSubtask?.(task.id, subId)}
            onAddSubtask={(title) => onAddSubtask?.(task.id, title)}
          />
        </Collapse>
      )}
    </Box>
  );
};
