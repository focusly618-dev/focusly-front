import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Checkbox,
  Switch,
} from '@mui/material';
import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import {
  CalendarToday as CalendarTodayIcon,
  AutoAwesome as AutoAwesomeIcon,
  PlayArrow as PlayIcon,
  Flag as FlagIcon,
  RadioButtonUnchecked as UncheckedIcon,
  CheckCircle as CheckedIcon,
} from '@mui/icons-material';

import {
  TaskRow,
  TaskTitle,
  StatusBadge,
  FocusIconButton,
  AIBadge,
  AIText,
  PriorityChip,
  DateChip,
  TimeChip,
} from './ListViewTask.styles';
import {
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import type { Task } from '@/redux/tasks/task.types';
import type { ListViewTaskProps } from './ListViewTask.types';
import { useListViewTask } from './ListViewTask.hook';
import { formatDuration } from '../TaskDetailModal/TaskDetailModal.utils';
import { getPriorityIconColor } from '@/pages/Home/components/CreateTaskModal/components/TaskIcons';

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

const STATUS_MENU_ICON: Record<string, React.ReactNode> = {
  Todo: <StatusBadge statusColor="#3b82f6" />,
  Planning: <StatusBadge statusColor="#8b5cf6" />,
  Pending: <StatusBadge statusColor="#f59e0b" />,
  'On Hold': <StatusBadge statusColor="#ef4444" />,
  Review: <StatusBadge statusColor="#06b6d4" />,
  Done: <StatusBadge statusColor="#22c55e" />,
  Backlog: <StatusBadge statusColor="#6b7280" />,
  Scheduled: <StatusBadge statusColor="#8b5cf6" />,
  Archived: <StatusBadge statusColor="#4b5563" />,
};

export const ListViewTask = ({
  task,
  onTaskClick,
  updateTask,
  isAIScheduleEnabled,
  onStartFocus,
  isSelected,
  onToggleSelect,
}: ListViewTaskProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const isReadOnly = useMemo(() => {
    if (!task) return false;
    if (!user) return true;

    // Check Google Calendar event ownership
    if (task.task_type === 'GoogleTask' || task.google_event_id) {
      const organizerEmail = (task as unknown as { organizer_email?: string })
        .organizer_email;
      if (organizerEmail) {
        return organizerEmail.toLowerCase() !== user.email?.toLowerCase();
      }
    }

    // Check Focusly task ownership
    if (task.user_id && task.user_id !== user.id) {
      return true;
    }

    return false;
  }, [task, user]);

  const {
    statusAnchor,
    setStatusAnchor,
    priorityAnchor,
    setPriorityAnchor,
    dateAnchor,
    setDateAnchor,
    handlePrioritySelect,
    handleDateSelect,
    handleStatusSelect,
    statusColor,
    priorityColor,
  } = useListViewTask({ task, updateTask });

  const estimateMin = task.estimate_timer || task.estimate_minutes || 0;
  const realMin = task.real_timer || 0;
  const isOverLimit = estimateMin > 0 && realMin > estimateMin;

  return (
    <>
      <TaskRow
        onClick={() => onTaskClick(task)}
        statusColor={statusColor}
        className="task-row-item"
      >
        <Box
          className="checkbox-cell"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isReadOnly ? 0.35 : isSelected ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: isReadOnly ? 'none' : 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isReadOnly) {
              onToggleSelect?.(e);
            }
          }}
        >
          <Checkbox
            checked={isSelected || false}
            disabled={isReadOnly}
            size="small"
            icon={
              <UncheckedIcon
                sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.6 }}
              />
            }
            checkedIcon={
              <CheckedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            }
            sx={{
              padding: 0,
            }}
          />
        </Box>

        {/* Cell 3: Title */}
        <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <TaskTitle variant="body1" title={task.title}>
            {task.title}
          </TaskTitle>
        </Box>

        {/* Cell 3: Priority */}
        <Box
          className="cell-priority"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <PriorityChip
            priorityColor={priorityColor}
            onClick={(e) => {
              e.stopPropagation();
              if (!isReadOnly) {
                setPriorityAnchor(e.currentTarget);
              }
            }}
            sx={{
              pointerEvents: isReadOnly ? 'none' : 'auto',
              cursor: isReadOnly ? 'default' : 'pointer',
              opacity: isReadOnly ? 0.8 : 1,
            }}
          >
            <FlagIcon
              sx={{
                fontSize: 11,
                flexShrink: 0,
                color:
                  task.priority_level >= 3
                    ? getPriorityIconColor('High')
                    : task.priority_level === 2
                      ? getPriorityIconColor('Med')
                      : task.priority_level === 1
                        ? getPriorityIconColor('Low')
                        : getPriorityIconColor(null),
              }}
            />
            {task.priority_level >= 3
              ? 'High'
              : task.priority_level === 2
                ? 'Med'
                : task.priority_level === 1
                  ? 'Low'
                  : 'None'}
          </PriorityChip>
        </Box>

        {/* Cell 4: Due Date */}
        <Box
          className="cell-date"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {task.deadline || task.status === 'Done' ? (
            <DateChip
              onClick={(e) => {
                e.stopPropagation();
                if (!isReadOnly) {
                  setDateAnchor(e.currentTarget);
                }
              }}
              sx={{
                pointerEvents: isReadOnly ? 'none' : 'auto',
                cursor: isReadOnly ? 'default' : 'pointer',
                opacity: isReadOnly ? 0.8 : 1,
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 11, opacity: 0.7 }} />
              <span>
                {task.status === 'Done'
                  ? formatTimeSinceCompletion(task.updated_at)
                  : new Date(task.deadline!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
              </span>
            </DateChip>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.3 }}>
              -
            </Typography>
          )}
        </Box>

        {/* Cell 5: Estimated */}
        <Box
          className="cell-estimated"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {estimateMin > 0 ? (
            <TimeChip variant="estimated">
              {formatDuration(estimateMin)}
            </TimeChip>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.3 }}>
              -
            </Typography>
          )}
        </Box>

        {/* Cell 6: Actual */}
        <Box
          className="cell-actual"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {realMin > 0 ? (
            <TimeChip variant={isOverLimit ? 'actual-over' : 'actual'}>
              {formatDuration(realMin)}
            </TimeChip>
          ) : estimateMin > 0 ? (
            <TimeChip variant="estimated">0m</TimeChip>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.3 }}>
              -
            </Typography>
          )}
        </Box>

        {/* Cell 7: AI Switch */}
        <Box
          className="cell-ai"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '6px',
          }}
        >
          <AutoAwesomeIcon
            sx={{
              fontSize: 14,
              color: task.use_ai ? '#7c3aed' : 'text.secondary',
              opacity: task.use_ai ? 1 : 0.35,
              transition: 'all 0.3s ease',
            }}
          />
          <Switch
            size="small"
            checked={task.use_ai || false}
            disabled={isReadOnly}
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (isReadOnly) return;
              if (updateTask) {
                await updateTask(task.id, {
                  ...task,
                  use_ai: e.target.checked,
                });
              }
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#7c3aed' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#7c3aed',
              },
            }}
          />
        </Box>

        {/* Cell 8: Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {onStartFocus && (
            <Tooltip title="Start Focus Mode">
              <FocusIconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartFocus(task as unknown as Task);
                }}
              >
                <PlayIcon sx={{ fontSize: 20 }} />
              </FocusIconButton>
            </Tooltip>
          )}
          {isAIScheduleEnabled && (
            <AIBadge>
              <AutoAwesomeIcon sx={{ fontSize: 14 }} />
              <AIText>AI</AIText>
            </AIBadge>
          )}
        </Box>
      </TaskRow>

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
          { level: 3, label: 'High', color: '#ef4444' },
          { level: 2, label: 'Med', color: '#f59e0b' },
          { level: 1, label: 'Low', color: '#22c55e' },
          { level: 0, label: '', color: 'text.secondary' },
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
          'Scheduled',
          'Pending',
          'On Hold',
          'Review',
          'Done',
          'Backlog',
          'Archived',
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
