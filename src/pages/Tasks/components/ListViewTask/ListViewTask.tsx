import { useState } from 'react';
import {
  Box,
  Typography,
  Collapse,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  AccessTime as AccessTimeIcon,
  Link as LinkIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { GeminiAIToggle } from '@/components/ui/GeminiSwitch';

import {
  TaskCard,
  CardLeft,
  TaskMetaItem,
  CategoryChip,
  PriorityIndicator,
} from './ListViewTask.styles';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';

interface ListViewTaskProps {
  task: TaskResponse;
  updateTask: (taskId: string, updates: Partial<TaskResponse>) => Promise<void>;
  onClick?: () => void;
  onTaskClick?: (task: TaskResponse) => void;
  expandedTaskIds?: Set<string>;
  toggleTaskExpansion?: (taskId: string) => void;
  handleSubtaskToggle?: (task: TaskResponse, index: number) => void;
  handleOpenSubtaskModal?: (task: TaskResponse, index?: number) => void;
}

type TaskStatusType = TaskResponse['status'];

const PRIORITY_COLORS: Record<number, string> = {
  1: '#3b82f6',
  2: '#f59e0b',
  3: '#ef4444',
  4: '#ef4444',
};

const STATUS_COLORS: Record<TaskStatusType, string> = {
  Backlog: '#94a3b8',
  Todo: '#3b82f6',
  Planning: '#818cf8',
  Pending: '#f59e0b',
  OnHold: '#6b7280',
  Review: '#8b5cf6',
  Done: '#22c55e',
  Scheduled: '#06b6d4',
  Archived: '#64748b',
};

export const ListViewTask = ({
  task,
  updateTask,
  onClick,
  onTaskClick,
  expandedTaskIds: externalExpanded,
  toggleTaskExpansion,
  handleSubtaskToggle,
  handleOpenSubtaskModal,
}: ListViewTaskProps) => {
  const [localExpanded, setLocalExpanded] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateMenuAnchor, setDateMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);

  const expandedTaskIds = externalExpanded ?? localExpanded;

  const handleClick = () => {
    if (onClick) onClick();
    else if (onTaskClick) onTaskClick(task);
  };

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleTaskExpansion) {
      toggleTaskExpansion(task.id);
    } else {
      setLocalExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(task.id)) next.delete(task.id);
        else next.add(task.id);
        return next;
      });
    }
  };

  const handleMoreClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleStatusChange = async (newStatus: TaskStatusType) => {
    await updateTask(task.id, { status: newStatus });
    setStatusMenuAnchor(null);
  };

  const handleDateSelect = async (days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    await updateTask(task.id, { deadline: newDate.toISOString() });
    setDateMenuAnchor(null);
  };

  const priorityColor = PRIORITY_COLORS[task.priority_level] || '#94a3b8';
  const priorityLabel =
    task.priority_level >= 3 ? 'High' : task.priority_level === 1 ? 'Low' : 'Medium';

  return (
    <Box sx={{ mb: 1.5 }}>
      <TaskCard
        onClick={handleClick}
        sx={{
          opacity: task.status === 'Done' ? 0.7 : 1,
          borderLeft: `4px solid ${STATUS_COLORS[task.status] || '#cbd5e1'}`,
        }}
      >
        <CardLeft>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* Status circle */}
            <Box
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleStatusChange(task.status === 'Done' ? 'Todo' : 'Done');
              }}
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${STATUS_COLORS[task.status] || '#cbd5e1'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
                bgcolor: task.status === 'Done' ? STATUS_COLORS[task.status] : 'transparent',
              }}
            >
              {task.status === 'Done' && (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
              )}
            </Box>

            {/* Task info */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                    color: task.status === 'Done' ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {task.title}
                </Typography>
                <GeminiAIToggle
                  checked={task.use_ai || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateTask(task.id, { use_ai: e.target.checked });
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                <CategoryChip>{task.category || 'General'}</CategoryChip>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PriorityIndicator priorityColor={priorityColor} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: priorityColor }}>
                    {priorityLabel}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Meta items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <TaskMetaItem>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : 'No date'}
              </Typography>
            </TaskMetaItem>

            {task.estimate_timer > 0 && (
              <TaskMetaItem>
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">
                  {Math.round(task.estimate_timer / 60)}h
                </Typography>
              </TaskMetaItem>
            )}

            {task.links && task.links.length > 0 && (
              <TaskMetaItem>
                <LinkIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{task.links.length}</Typography>
              </TaskMetaItem>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <TaskMetaItem
                onClick={handleExpandToggle}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
              >
                <SubdirectoryArrowRightIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{task.subtasks.length}</Typography>
              </TaskMetaItem>
            )}

            <IconButton
              size="small"
              onClick={handleMoreClick}
              sx={{ color: 'text.secondary' }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardLeft>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onStartFocus && (
            <Tooltip title="Start Focus Mode">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartFocus(task as unknown as Task);
                }}
                sx={{
                  color: 'primary.main',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s',
                  width: 32,
                  height: 32,
                }}
              >
                <PlayIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
          {isAIScheduleEnabled && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#7c3aed',
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                boxShadow: '0 0 10px rgba(124, 58, 237, 0.2)',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 14 }} />
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                AI
              </Typography>
            </Box>
          )}
        </Box>
      </TaskCard>

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <Collapse in={expandedTaskIds.has(task.id)} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 4, mt: 0.5 }}>
            {task.subtasks.map((subtask, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.5,
                  cursor: handleSubtaskToggle ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (handleSubtaskToggle) handleSubtaskToggle(task, index);
                  else if (handleOpenSubtaskModal) handleOpenSubtaskModal(task, index);
                }}
              >
                <SubdirectoryArrowRightIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: subtask.completed ? 'text.disabled' : 'text.primary',
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                  }}
                >
                  {subtask.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      )}

      {/* Context menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
        }}
      >
        <MenuItem onClick={(e) => { e.stopPropagation(); setStatusMenuAnchor(e.currentTarget); handleClose(); }}>
          Change Status
        </MenuItem>
        <MenuItem onClick={(e) => { e.stopPropagation(); setDateMenuAnchor(e.currentTarget); handleClose(); }}>
          Change Date
        </MenuItem>
        {task.subtasks && task.subtasks.length > 0 && (
          <MenuItem onClick={handleExpandToggle}>
            {expandedTaskIds.has(task.id) ? 'Hide' : 'Show'} Subtasks
          </MenuItem>
        )}
      </Menu>

      {/* Status submenu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={() => setStatusMenuAnchor(null)}
      >
        {(Object.keys(STATUS_COLORS) as TaskStatusType[]).map((s) => (
          <MenuItem key={s} onClick={() => handleStatusChange(s)}>
            <Typography variant="body2">{s}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Date submenu */}
      <Menu
        anchorEl={dateMenuAnchor}
        open={Boolean(dateMenuAnchor)}
        onClose={() => setDateMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleDateSelect(0)}>Today</MenuItem>
        <MenuItem onClick={() => handleDateSelect(1)}>Tomorrow</MenuItem>
        <MenuItem onClick={() => handleDateSelect(3)}>In 3 days</MenuItem>
        <MenuItem onClick={() => handleDateSelect(7)}>In a week</MenuItem>
      </Menu>
    </Box>
  );
};
