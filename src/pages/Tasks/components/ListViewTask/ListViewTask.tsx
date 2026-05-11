import { useState } from 'react';
import { Box, Typography, Collapse, Menu, MenuItem } from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  AccessTime as AccessTimeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

import {
  TaskCard,
  CardLeft,
  TaskMetaItem,
  StatusBadge,
  CategoryChip,
  PriorityIndicator,
} from './ListViewTask.styles';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import {
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
// import { formatDuration } from '../../../Tasks/components/TaskDetailModal/TaskDetailModal.utils';

const formatTimeSinceCompletion = (dateString: string | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours}h ago`;

  const days = differenceInDays(now, date);
  if (days < 7) return `${days}d ago`;

  const weeks = differenceInWeeks(now, date);
  if (weeks < 4) return `${weeks}w ago`;

  const months = differenceInMonths(now, date);
  if (months < 12) return `${months}mo ago`;

  const years = differenceInYears(now, date);
  return `${years}y ago`;
};

interface ListViewTaskProps {
  task: TaskResponse;
  expandedTaskIds: Set<string>;
  toggleTaskExpansion: (taskId: string) => void;
  handleSubtaskToggle: (task: TaskResponse, index: number) => void;
  handleOpenSubtaskModal: (task: TaskResponse, index?: number) => void;
  onTaskClick: (task: TaskResponse) => void;
  updateTask?: (taskId: string, updates: TaskResponse) => Promise<void>;
}

const STATUS_MENU_ICON: Record<string, React.ReactNode> = {
  Todo: (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }}
    />
  ),
  Planning: (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#8b5cf6' }}
    />
  ),
  Pending: (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }}
    />
  ),
  OnHold: (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }}
    />
  ),
  Review: (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#06b6d4' }}
    />
  ),
  Done: (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e' }}
    />
  ),
  Backlog: (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6b7280' }}
    />
  ),
};

export const ListViewTask = ({
  task,
  expandedTaskIds,
  toggleTaskExpansion,
  handleOpenSubtaskModal,
  onTaskClick,
  updateTask,
}: ListViewTaskProps) => {
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  const handlePrioritySelect = async (level: number) => {
    setPriorityAnchor(null);
    if (updateTask && task.priority_level !== level) {
      await updateTask(task.id, { ...task, priority_level: level });
    }
  };

  const handleDateSelect = async (daysToAdd: number) => {
    setDateAnchor(null);
    if (updateTask) {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + daysToAdd);
      await updateTask(task.id, { ...task, deadline: newDate.toISOString() });
    }
  };

  const handleStatusSelect = async (status: string) => {
    setStatusAnchor(null);
    if (updateTask && task.status !== status) {
      await updateTask(task.id, {
        ...task,
        status: status as TaskResponse['status'],
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Done: '#22c55e',
      Todo: '#3b82f6',
      Planning: '#8b5cf6',
      Pending: '#f59e0b',
      OnHold: '#ef4444',
      Review: '#06b6d4',
      Backlog: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (level: number) => {
    if (level >= 3) return '#ef4444';
    if (level === 2) return '#f59e0b';
    return '#22c55e';
  };

  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority_level);

  return (
    <>
      <TaskCard
        onClick={() => onTaskClick(task)}
        sx={{
          cursor: 'pointer',
          borderLeft: `3px solid ${statusColor}`,
        }}
      >
        <CardLeft sx={{ alignItems: 'center', gap: '12px' }}>
          <StatusBadge
            statusColor={statusColor}
            onClick={(e) => {
              e.stopPropagation();
              setStatusAnchor(e.currentTarget);
            }}
            sx={{
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.2)' },
              transition: 'transform 0.2s',
            }}
          />

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minWidth: 0,
            }}
          >
            {/* Title & Category */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: 0,
                flexShrink: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'text.primary',
                  lineHeight: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.title}
              </Typography>
              {task.category && (
                <CategoryChip sx={{ flexShrink: 0 }}>
                  {task.category}
                </CategoryChip>
              )}
            </Box>

            {/* Metadata Section - Single Row */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                color: 'text.secondary',
                flexShrink: 0,
              }}
            >
              <TaskMetaItem
                onClick={(e) => {
                  e.stopPropagation();
                  setPriorityAnchor(e.currentTarget);
                }}
                sx={{
                  cursor: 'pointer',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: '4px',
                  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                }}
              >
                <PriorityIndicator priorityColor={priorityColor} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: '11px', fontWeight: 600 }}
                >
                  {task.priority_level >= 4
                    ? 'Urgent'
                    : task.priority_level === 3
                      ? 'High'
                      : task.priority_level === 2
                        ? 'Med'
                        : 'Low'}
                </Typography>
              </TaskMetaItem>

              {(task.deadline || task.status === 'Done') && (
                <TaskMetaItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateAnchor(e.currentTarget);
                  }}
                  sx={{
                    cursor: 'pointer',
                    px: 0.5,
                    py: 0.25,
                    borderRadius: '4px',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'text.primary',
                    },
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 13, opacity: 0.7 }} />
                  <Typography variant="caption" sx={{ fontSize: '11px' }}>
                    {task.status === 'Done'
                      ? formatTimeSinceCompletion(task.updated_at)
                      : new Date(task.deadline!).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                  </Typography>
                </TaskMetaItem>
              )}

              {task.estimate_minutes > 0 && (
                <TaskMetaItem>
                  <AccessTimeIcon sx={{ fontSize: 13, opacity: 0.7 }} />
                  <Typography variant="caption" sx={{ fontSize: '11px' }}>
                    {task.estimate_minutes}m
                  </Typography>
                </TaskMetaItem>
              )}

              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskExpansion(task.id);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  bgcolor: task.subtasks?.length
                    ? 'action.hover'
                    : 'transparent',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <SubdirectoryArrowRightIcon
                  sx={{
                    fontSize: 13,
                    opacity: 0.7,
                    transform: expandedTaskIds.has(task.id)
                      ? 'rotate(90deg)'
                      : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontSize: '11px', fontWeight: 600 }}
                >
                  {task.subtasks?.length || 0}
                </Typography>
              </Box>

              {task.links && task.links.length > 0 && (
                <TaskMetaItem sx={{ color: 'primary.main' }}>
                  <LinkIcon sx={{ fontSize: 13 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '11px', fontWeight: 600 }}
                  >
                    {task.links.length}
                  </Typography>
                </TaskMetaItem>
              )}
            </Box>
          </Box>
        </CardLeft>
      </TaskCard>

      <Collapse in={expandedTaskIds.has(task.id)} timeout="auto" unmountOnExit>
        <Box
          sx={{ ml: 6, mb: 2, borderLeft: '1px solid', borderColor: 'divider' }}
        >
          {task.subtasks?.map((subtask, index) => {
            if (typeof subtask === 'string') return null;
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.5,
                  px: 2,
                  borderRadius: '8px',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <StatusBadge
                  statusColor={getStatusColor(subtask.status || 'Todo')}
                />
                <Typography
                  variant="body2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenSubtaskModal(task, index);
                  }}
                  sx={{
                    color: subtask.completed
                      ? 'text.secondary'
                      : 'text.primary',
                    flexGrow: 1,
                    fontSize: '13px',
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {subtask.title}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Collapse>

      {/* Priority Quick Select */}
      <Menu
        anchorEl={priorityAnchor}
        open={Boolean(priorityAnchor)}
        onClose={() => setPriorityAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            minWidth: '140px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        {[
          { level: 4, label: 'Urgent', color: '#ef4444' },
          { level: 3, label: 'High', color: '#f59e0b' },
          { level: 2, label: 'Medium', color: '#3b82f6' },
          { level: 1, label: 'Low', color: '#22c55e' },
        ].map((p) => (
          <MenuItem
            key={p.level}
            onClick={() => handlePrioritySelect(p.level)}
            sx={{ gap: 1.5, py: 1 }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '2px',
                bgcolor: p.color,
              }}
            />
            <Typography variant="body2" fontWeight={600}>
              {p.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Date Quick Select */}
      <Menu
        anchorEl={dateAnchor}
        open={Boolean(dateAnchor)}
        onClose={() => setDateAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            minWidth: '160px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        <MenuItem onClick={() => handleDateSelect(0)} sx={{ py: 1 }}>
          Today
        </MenuItem>
        <MenuItem onClick={() => handleDateSelect(1)} sx={{ py: 1 }}>
          Tomorrow
        </MenuItem>
        <MenuItem onClick={() => handleDateSelect(3)} sx={{ py: 1 }}>
          In 3 days
        </MenuItem>
        <MenuItem onClick={() => handleDateSelect(7)} sx={{ py: 1 }}>
          Next week
        </MenuItem>
      </Menu>

      {/* Status Quick Select */}
      <Menu
        anchorEl={statusAnchor}
        open={Boolean(statusAnchor)}
        onClose={() => setStatusAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '180px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          },
        }}
      >
        {[
          'Todo',
          'Planning',
          'Pending',
          'OnHold',
          'Review',
          'Done',
          'Backlog',
        ].map((s) => (
          <MenuItem
            key={s}
            onClick={() => handleStatusSelect(s)}
            sx={{ gap: 1.5 }}
          >
            {STATUS_MENU_ICON[s]}
            <Typography variant="body2">{s}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
