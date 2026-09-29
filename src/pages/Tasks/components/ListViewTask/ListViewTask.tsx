import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Checkbox,
  IconButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import {
  CalendarTodayOutlined as CalendarTodayIcon,
  AutoAwesome as AutoAwesomeIcon,
  PlayArrowRounded as PlayIcon,
  Check as CheckIcon,
  EditOutlined as EditIcon,
  DeleteOutlineRounded as DeleteIcon,
  FlagOutlined as FlagIcon,
  CheckCircleOutline as CompletedIcon,
} from '@mui/icons-material';

import {
  TaskRow,
  TaskTitle,
  AIBadge,
  AIText,
  PriorityChip,
  DateChip,
} from './ListViewTask.styles';
import type { Task } from '@/redux/tasks/task.types';
import type { ListViewTaskProps } from './ListViewTask.types';
import { useListViewTask } from './ListViewTask.hook';
import { formatDuration } from '../TaskDetailModal/TaskDetailModal.utils';

export const ListViewTask = ({
  task,
  onTaskClick,
  updateTask,
  deleteTasks,
  isAIScheduleEnabled,
  onStartFocus,
  isSelected,
  onToggleSelect,
}: ListViewTaskProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const isReadOnly = useMemo(() => {
    if (!task) return false;
    if (task.is_owner !== undefined) return !task.is_owner;
    if (!user) return false;

    if (task.task_type === 'GoogleTask' || task.google_event_id) {
      const organizerEmail = (task as unknown as { organizer_email?: string })
        .organizer_email;
      if (organizerEmail && user.email) {
        return organizerEmail.toLowerCase() !== user.email?.toLowerCase();
      }
    }

    if (task.user_id && user.id && task.user_id !== user.id) {
      return true;
    }

    return false;
  }, [task, user]);

  const {
    priorityAnchor,
    setPriorityAnchor,
    dateAnchor,
    setDateAnchor,
    handlePrioritySelect,
    handleDateSelect,
    handleStatusSelect,
    statusColor,
  } = useListViewTask({ task, updateTask });

  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  const estimateMin = task.estimate_timer || task.estimate_minutes || 0;
  const realMin = task.real_timer || 0;

  const subtasksTotal = task.subtasks?.length || 0;
  const subtasksDone = task.subtasks?.filter((s) => s.completed).length || 0;
  const isDone = task.status === 'Done';

  const priorityLabelMap: Record<number, string> = {
    4: 'Alta',
    3: 'Alta',
    2: 'Media',
    1: 'Baja',
    0: 'Baja',
  };
  const priorityLabel = priorityLabelMap[task.priority_level ?? 2] || 'Media';

  const formattedDate = useMemo(() => {
    if (!task.deadline) return '-';
    try {
      const date = new Date(task.deadline);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  }, [task.deadline]);

  return (
    <>
      <TaskRow
        onClick={() => onTaskClick(task)}
        statusColor={statusColor}
        className="task-row-item"
        isDone={isDone}
        isSelected={isSelected}
      >
        {/* Cell 1: Checkbox */}
        <Box
          className="checkbox-cell"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.(e);
          }}
        >
          <Checkbox
            checked={Boolean(isSelected)}
            size="small"
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect?.(e as unknown as React.MouseEvent);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            icon={
              <Box
                sx={{
                  width: 17,
                  height: 17,
                  borderRadius: '4px',
                  border: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '1.5px solid #3a3d48'
                      : '1.5px solid #d1d5db',
                  bgcolor: 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#008767',
                  },
                }}
              />
            }
            checkedIcon={
              <Box
                sx={{
                  width: 17,
                  height: 17,
                  borderRadius: '4px',
                  bgcolor: '#008767',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon sx={{ fontSize: 13, color: '#ffffff' }} />
              </Box>
            }
            sx={{
              padding: 0,
            }}
          />
        </Box>

        {/* Cell 2: Title */}
        <Box
          sx={{
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TaskTitle
            variant="body1"
            title={task.title}
            sx={{
              fontWeight: 600,
              fontSize: '13.5px',
              color: isDone ? 'text.secondary' : 'text.primary',
              textDecoration: isDone ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.title}
          </TaskTitle>
          {(isAIScheduleEnabled || task.use_ai) && (
            <AIBadge>
              <AutoAwesomeIcon sx={{ fontSize: 12 }} />
              <AIText>AI</AIText>
            </AIBadge>
          )}
        </Box>

        {/* Cell 3: Subtareas (Mini Progress Bar + Count matching screenshot) */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {subtasksTotal > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 38,
                  height: 5,
                  borderRadius: 3,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? '#2a2c36' : '#e5e7eb',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${Math.round((subtasksDone / subtasksTotal) * 100)}%`,
                    height: '100%',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? '#2dd4bf' : '#008767',
                    borderRadius: 3,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '11.5px',
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#8a8f98' : '#6b7280',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {subtasksDone}/{subtasksTotal}
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ opacity: 0.3, fontSize: '13px' }}>-</Typography>
          )}
        </Box>

        {/* Cell 4: Prioridad */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PriorityChip
            priorityLevel={task.priority_level}
            onClick={(e) => {
              e.stopPropagation();
              if (!isReadOnly) {
                setPriorityAnchor(e.currentTarget);
              }
            }}
            sx={{
              pointerEvents: isReadOnly ? 'none' : 'auto',
              cursor: isReadOnly ? 'default' : 'pointer',
            }}
          >
            {priorityLabel}
          </PriorityChip>
        </Box>

        {/* Cell 5: Fecha Límite */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            }}
          >
            <CalendarTodayIcon
              sx={{
                fontSize: 13,
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#717684' : '#6b7280',
              }}
            />
            <span>{formattedDate}</span>
          </DateChip>
        </Box>

        {/* Cell 6: Estimado */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: '12.5px',
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {estimateMin > 0 ? formatDuration(estimateMin) : '-'}
          </Typography>
        </Box>

        {/* Cell 7: Real */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: '12.5px',
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            {realMin > 0 ? formatDuration(realMin) : '0m'}
          </Typography>
        </Box>

        {/* Cell 8: Acciones (3 Vertical Bars Menu) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setActionAnchor(e.currentTarget);
            }}
            sx={{
              width: 28,
              height: 28,
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#717684' : '#6b7280',
              borderRadius: '6px',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.06)'
                    : '#f3f4f6',
                color: 'text.primary',
              },
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="2.5"
                height="12"
                rx="1.25"
                fill="currentColor"
              />
              <rect
                x="6.75"
                y="2"
                width="2.5"
                height="12"
                rx="1.25"
                fill="currentColor"
              />
              <rect
                x="11.5"
                y="2"
                width="2.5"
                height="12"
                rx="1.25"
                fill="currentColor"
              />
            </svg>
          </IconButton>
        </Box>
      </TaskRow>

      {/* Contextual Action Menu */}
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={() => setActionAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            minWidth: '180px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            p: 0.5,
          },
        }}
      >
        {onStartFocus && (
          <MenuItem
            onClick={() => {
              setActionAnchor(null);
              onStartFocus(task as unknown as Task);
            }}
            sx={{ gap: 1.2, py: 0.8, borderRadius: '6px' }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: '#008767' }}>
              <PlayIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Iniciar Enfoque"
              primaryTypographyProps={{ fontSize: '13px', fontWeight: 600 }}
            />
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            setActionAnchor(null);
            onTaskClick(task);
          }}
          sx={{ gap: 1.2, py: 0.8, borderRadius: '6px' }}
        >
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Editar Tarea"
            primaryTypographyProps={{ fontSize: '13px' }}
          />
        </MenuItem>

        <MenuItem
          onClick={async () => {
            setActionAnchor(null);
            await handleStatusSelect(isDone ? 'Todo' : 'Done');
          }}
          sx={{ gap: 1.2, py: 0.8, borderRadius: '6px' }}
        >
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <CompletedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              isDone ? 'Marcar como Por Hacer' : 'Marcar como Completada'
            }
            primaryTypographyProps={{ fontSize: '13px' }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {deleteTasks && (
          <MenuItem
            onClick={async () => {
              setActionAnchor(null);
              await deleteTasks([task.id]);
            }}
            sx={{ gap: 1.2, py: 0.8, borderRadius: '6px', color: '#dc2626' }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: '#dc2626' }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Eliminar Tarea"
              primaryTypographyProps={{ fontSize: '13px', fontWeight: 600 }}
            />
          </MenuItem>
        )}
      </Menu>

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
          { level: 3, label: 'Alta', color: '#dc2626' },
          { level: 2, label: 'Media', color: '#d97706' },
          { level: 1, label: 'Baja', color: '#16a34a' },
        ].map((p) => (
          <MenuItem
            key={p.level}
            onClick={() => handlePrioritySelect(p.level)}
            sx={{ gap: 1.2, py: 0.8, px: 1.5, borderRadius: '6px' }}
          >
            <FlagIcon sx={{ fontSize: 16, color: p.color }} />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: p.color }}
            >
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
          Hoy
        </MenuItem>
        <MenuItem onClick={() => handleDateSelect(1)} sx={{ py: 1 }}>
          Mañana
        </MenuItem>
        <MenuItem onClick={() => handleDateSelect(3)} sx={{ py: 1 }}>
          En 3 días
        </MenuItem>
        <MenuItem onClick={() => handleDateSelect(7)} sx={{ py: 1 }}>
          Próxima semana
        </MenuItem>
      </Menu>
    </>
  );
};
