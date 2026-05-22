import {
  Box,
  Typography,
  Collapse,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Link as LinkIcon,
  AutoAwesome as AutoAwesomeIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

import {
  TaskRow,
  TaskTitle,
  InteractiveMetaItem,
  LinkMetaItem,
  SubtaskToggleBtn,
  SubtaskArrow,
  MetaText,
  StatusBadge,
  CategoryChip,
  PriorityIndicator,
  ProgressBarWrapper,
  ProgressText,
  TaskProgressBar,
  FocusIconButton,
  AIBadge,
  AIText,
  SubtasksContainer,
  SubtaskRow,
  SubtaskTitle,
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
  expandedTaskIds,
  toggleTaskExpansion,
  handleOpenSubtaskModal,
  onTaskClick,
  updateTask,
  isAIScheduleEnabled,
  onStartFocus,
}: ListViewTaskProps) => {

  const {statusAnchor, setStatusAnchor, getStatusColor, priorityAnchor, setPriorityAnchor, dateAnchor, setDateAnchor, handlePrioritySelect, handleDateSelect, handleStatusSelect, statusColor, priorityColor} = useListViewTask({task, updateTask});
  
  const estimateMin = task.estimate_timer || task.estimate_minutes || 0;
  const realMin = task.real_timer || 0;
  const progressValue = estimateMin > 0
    ? Math.min(100, (realMin / estimateMin) * 100)
    : 0;
  const isOverLimit = estimateMin > 0 && realMin > estimateMin;
  const showProgress = estimateMin > 0;

  return (
    <>
      <TaskRow
        onClick={() => onTaskClick(task)}
        statusColor={statusColor}
      >
        {/* Cell 1: Status Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StatusBadge
            statusColor={statusColor}
            onClick={(e) => {
              e.stopPropagation();
              setStatusAnchor(e.currentTarget);
            }}
          />
        </Box>

        {/* Cell 2: Title */}
        <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <TaskTitle variant="body1" title={task.title}>
            {task.title}
          </TaskTitle>
        </Box>

        {/* Cell 3: Category */}
        <Box className="cell-category" sx={{ display: 'flex', alignItems: 'center' }}>
          {task.category ? (
            <CategoryChip>
              {task.category}
            </CategoryChip>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.3 }}>-</Typography>
          )}
        </Box>

        {/* Cell 4: Priority */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InteractiveMetaItem
            onClick={(e) => {
              e.stopPropagation();
              setPriorityAnchor(e.currentTarget);
            }}
          >
            <PriorityIndicator priorityColor={priorityColor} />
            <MetaText variant="caption">
              {task.priority_level >= 3
                ? 'High'
                : task.priority_level === 2
                  ? 'Med'
                  : task.priority_level === 1
                    ? 'Low'
                    : 'None'}
            </MetaText>
          </InteractiveMetaItem>
        </Box>

        {/* Cell 5: Due Date */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(task.deadline || task.status === 'Done') ? (
            <InteractiveMetaItem
              onClick={(e) => {
                e.stopPropagation();
                setDateAnchor(e.currentTarget);
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 13, opacity: 0.7 }} />
              <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600 }}>
                {task.status === 'Done'
                  ? formatTimeSinceCompletion(task.updated_at)
                  : new Date(task.deadline!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
              </Typography>
            </InteractiveMetaItem>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.3 }}>-</Typography>
          )}
        </Box>

        {/* Cell 6: Subtasks Toggle */}
        <Box className="cell-subtasks" sx={{ display: 'flex', alignItems: 'center' }}>
          <SubtaskToggleBtn
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskExpansion(task.id);
            }}
            hasSubtasks={Boolean(task.subtasks?.length)}
          >
            <SubtaskArrow isExpanded={expandedTaskIds.has(task.id)} />
            <MetaText variant="caption">
              {task.subtasks?.length || 0}
            </MetaText>
          </SubtaskToggleBtn>
        </Box>

        {/* Cell 7: Links */}
        <Box className="cell-links" sx={{ display: 'flex', alignItems: 'center' }}>
          {task.links && task.links.length > 0 ? (
            <LinkMetaItem>
              <LinkIcon sx={{ fontSize: 13 }} />
              <MetaText variant="caption">
                {task.links.length}
              </MetaText>
            </LinkMetaItem>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.3 }}>-</Typography>
          )}
        </Box>

        {/* Cell 8: Progress / Estimate */}
        <Box className="cell-progress" sx={{ display: 'flex', alignItems: 'center' }}>
          {showProgress ? (
            <ProgressBarWrapper>
              <ProgressText
                variant="caption"
                overLimit={isOverLimit}
              >
                {formatDuration(realMin) || '0m'}
                <span style={{ opacity: 0.5, margin: '0 2px' }}>/</span>
                {formatDuration(estimateMin)}
              </ProgressText>
              <TaskProgressBar
                variant="determinate"
                value={progressValue}
                overLimit={isOverLimit}
              />
            </ProgressBarWrapper>
          ) : (
            <Typography variant="caption" sx={{ opacity: 0.3 }}>-</Typography>
          )}
        </Box>

        {/* Cell 9: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              <AIText>
                AI
              </AIText>
            </AIBadge>
          )}
        </Box>
      </TaskRow>

      <Collapse in={expandedTaskIds.has(task.id)} timeout="auto" unmountOnExit>
        <SubtasksContainer>
          {task.subtasks?.map((subtask, index) => {
            if (typeof subtask === 'string') return null;
            return (
              <SubtaskRow key={index}>
                <StatusBadge
                  statusColor={getStatusColor(subtask.status || 'Todo')}
                />
                <SubtaskTitle
                  variant="body2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenSubtaskModal(task, index);
                  }}
                  completed={subtask.completed}
                >
                  {subtask.title}
                </SubtaskTitle>
              </SubtaskRow>
            );
          })}
        </SubtasksContainer>
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
