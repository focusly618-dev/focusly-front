import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  Popover,
  Stack,
  MenuItem,
  List,
  ListItemText,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  RadioButtonUnchecked as TodoIcon,
  InfoOutlined as PriorityIcon,
  FolderOutlined as CategoryIcon,
  LocalOfferOutlined as TagsIcon,
  CalendarTodayOutlined as CalendarIcon,
  AccessTimeRounded as TimeIcon,
  PlayCircleOutlineRounded as TrackedIcon,
  KeyboardArrowDownRounded as ChevronDownIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Groups as GroupsIcon,
  Assignment as AssignmentIcon,
  Brush as BrushIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AutoFixHigh as AutoFixHighIcon,
  CalendarToday as PlannedIcon,
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { PRIORITY_OPTIONS } from '@/components/ui';
import {
  tagChipSx,
  addTagInputSx,
  datePickerPopperSx,
  datePickerPaperSx,
  timePickerPopperSx,
  timePickerPaperSx,
  timePickerLayoutSx,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.styles';
import {
  getTagColors,
  PASTEL_COLORS,
  getColorName,
  formatDuration,
  parseDuration,
  isTaskCustomColor,
  isColorDark,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { TaskStatus } from '@/redux/tasks/task.types';
import {
  propertiesContainerSx,
  propertiesCardSx,
  propertyRowSx,
  propertyLabelSx,
  propertyPillSx,
  scheduleGridSx,
  scheduleBoxSx,
  timeSlotBannerSx,
  popoverPaperSx,
  timerPopoverPaperSx,
  timeLogPopoverPaperSx,
  colorPopoverPaperSx,
  colorGridSx,
} from './TaskProperties.styles';
import {
  triggerDurationError,
  sanitizeDurationValue,
} from './TaskProperties.utils';
import type { PriorityType } from '../../TaskDetailModal.utils';

interface TaskPropertiesProps {
  status: TaskStatus;
  setStatus: (s: TaskStatus) => void;
  priority: string;
  setPriority: (p: PriorityType) => void;
  category: string;
  setCategory: (c: string) => void;
  color: string;
  setColor: (c: string) => void;
  colorAnchor: HTMLElement | null;
  setColorAnchor: (el: HTMLElement | null) => void;
  currentDate: Date | null;
  setCurrentDate: (d: Date | null) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  newTag: string;
  setNewTag: (t: string) => void;
  isAddingTag: boolean;
  setIsAddingTag: (b: boolean) => void;
  handleAddTag: () => void;
  duration: string;
  setDuration: (d: string) => void;
  realTime: string;
  setRealTime: (t: string) => void;
  isPureGoogleTask: boolean;
  timeSlotDisplay: string;
  handleTimerChange: (
    value: string,
    setter: (v: string) => void,
    setSuggestions: (s: string[]) => void,
    setAnchor: (el: HTMLDivElement | null) => void,
    target: HTMLDivElement,
  ) => void;
  timeLogs: { date: string; minutes: number }[];
  handleAddTimeLog: (date: string, minutes: number) => void;
  handleRemoveTimeLog: (index: number) => void;
  isOwner?: boolean;
  createdAt?: string;
  deadline?: string;
  isLoadingDetail?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; dotColor: string }> = {
  Todo: { label: 'Por hacer', dotColor: '#008767' },
  Planning: { label: 'Planificación', dotColor: '#0284c7' },
  Scheduled: { label: 'Agendada', dotColor: '#8b5cf6' },
  Review: { label: 'En revisión', dotColor: '#f59e0b' },
  Pending: { label: 'Pendiente', dotColor: '#eab308' },
  'On Hold': { label: 'En espera', dotColor: '#ec4899' },
  Done: { label: 'Completada', dotColor: '#10b981' },
  Backlog: { label: 'Backlog', dotColor: '#64748b' },
  Archived: { label: 'Archivada', dotColor: '#475569' },
};

const PRIORITY_CONFIG: Record<
  string,
  { label: string; dotColor: string; bg: string; text: string; border: string }
> = {
  High: {
    label: 'Alta',
    dotColor: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    text: '#ef4444',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  Med: {
    label: 'Media',
    dotColor: '#d97706',
    bg: 'rgba(245, 158, 11, 0.12)',
    text: '#d97706',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  Low: {
    label: 'Baja',
    dotColor: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    text: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  'No priority': {
    label: 'Sin prioridad',
    dotColor: '#64748b',
    bg: 'rgba(100, 116, 139, 0.12)',
    text: '#64748b',
    border: 'rgba(100, 116, 139, 0.25)',
  },
};

export const TaskProperties = ({
  status,
  setStatus,
  priority,
  setPriority,
  category,
  setCategory,
  color,
  setColor,
  colorAnchor,
  setColorAnchor,
  currentDate,
  setCurrentDate,
  tags,
  setTags,
  newTag,
  setNewTag,
  isAddingTag,
  setIsAddingTag,
  handleAddTag,
  duration,
  setDuration,
  realTime,
  timeSlotDisplay,
  handleTimerChange,
  timeLogs,
  handleAddTimeLog,
  handleRemoveTimeLog,
  isOwner,
  createdAt,
  deadline,
  isLoadingDetail,
}: TaskPropertiesProps) => {
  const { t } = useTranslation();
  const [statusAnchor, setStatusAnchor] = useState<HTMLElement | null>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [categoryAnchor, setCategoryAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<{
    value: string;
    name: string;
  } | null>(null);
  const [colorCategoryFilter, setColorCategoryFilter] = useState<
    'all' | 'pastel' | 'solid'
  >('all');

  const [durationSuggestions, setDurationSuggestions] = useState<string[]>([]);
  const [durationAnchor, setDurationAnchor] = useState<HTMLDivElement | null>(
    null,
  );
  const [durationInputError, setDurationInputError] = useState<string | null>(
    null,
  );
  const [dTimeout, setDTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [timeLogAnchor, setTimeLogAnchor] = useState<HTMLDivElement | null>(
    null,
  );
  const [newLogDate, setNewLogDate] = useState<Date | null>(new Date());
  const [newLogDatePickerOpen, setNewLogDatePickerOpen] = useState(false);
  const [newLogDuration, setNewLogDuration] = useState('');

  const deadlineDate =
    deadline && !isNaN(new Date(deadline).getTime())
      ? new Date(deadline)
      : null;
  const hasDifferentDueDate =
    deadlineDate && currentDate && !isSameDay(deadlineDate, currentDate);

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'Todo':
        return t('tasks.status.todo', 'Por hacer');
      case 'Planning':
        return t('tasks.status.planning', 'Planificación');
      case 'Scheduled':
        return t('tasks.status.scheduled', 'Agendada');
      case 'Review':
        return t('tasks.status.review', 'En revisión');
      case 'Pending':
        return t('tasks.status.pending', 'Pendiente');
      case 'On Hold':
        return t('tasks.status.onHold', 'En espera');
      case 'Done':
        return t('tasks.status.done', 'Completada');
      case 'Backlog':
        return t('tasks.status.backlog', 'Backlog');
      case 'Archived':
        return t('tasks.status.archived', 'Archivada');
      default:
        return s || t('tasks.status.todo', 'Por hacer');
    }
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'High':
        return t('tasks.priority.high', 'Alta');
      case 'Med':
      case 'Medium':
        return t('tasks.priority.medium', 'Media');
      case 'Low':
        return t('tasks.priority.low', 'Baja');
      case 'No priority':
        return t('tasks.priority.none', 'Sin prioridad');
      default:
        return p || t('tasks.priority.medium', 'Media');
    }
  };

  const currentStatusConfig = STATUS_CONFIG[status] || {
    label: status || 'Por hacer',
    dotColor: '#008767',
  };
  const currentPriorityConfig =
    PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Med'];

  return (
    <Box sx={propertiesContainerSx}>
      {/* Grouped Properties Card */}
      <Box sx={propertiesCardSx}>
        {/* Row 1: Estado */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <TodoIcon />
            <Typography>{t('tasks.properties.status', 'Estado')}</Typography>
          </Box>
          <Box
            onClick={(e) => isOwner && setStatusAnchor(e.currentTarget)}
            sx={propertyPillSx}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: currentStatusConfig.dotColor,
              }}
            />
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
              {getStatusLabel(status)}
            </Typography>
            <ChevronDownIcon
              sx={{ fontSize: 16, color: 'text.secondary', ml: -0.25 }}
            />
          </Box>
        </Box>

        {/* Row 2: Prioridad */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <PriorityIcon />
            <Typography>
              {t('tasks.properties.priority', 'Prioridad')}
            </Typography>
          </Box>
          <Box
            onClick={(e) => isOwner && setPriorityAnchor(e.currentTarget)}
            sx={{
              ...propertyPillSx,
              bgcolor: currentPriorityConfig.bg,
              borderColor: currentPriorityConfig.border,
              color: currentPriorityConfig.text,
              '&:hover': {
                bgcolor: currentPriorityConfig.bg,
                borderColor: currentPriorityConfig.text,
              },
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: currentPriorityConfig.dotColor,
              }}
            />
            <Typography
              sx={{ fontSize: '13px', fontWeight: 600, color: 'inherit' }}
            >
              {getPriorityLabel(priority)}
            </Typography>
            <ChevronDownIcon
              sx={{ fontSize: 16, color: 'inherit', ml: -0.25 }}
            />
          </Box>
        </Box>

        {/* Row 3: Categoría */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <CategoryIcon />
            <Typography>
              {t('tasks.properties.category', 'Categoría')}
            </Typography>
          </Box>
          <Box
            onClick={(e) => isOwner && setCategoryAnchor(e.currentTarget)}
            sx={propertyPillSx}
          >
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
              {category || 'General'}
            </Typography>
            <ChevronDownIcon
              sx={{ fontSize: 16, color: 'text.secondary', ml: -0.25 }}
            />
          </Box>
        </Box>

        {/* Row 4: Etiquetas */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <TagsIcon />
            <Typography>{t('tasks.properties.tags', 'Etiquetas')}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {tags.map((tag) => {
                const colors = getTagColors(tag);
                return (
                  <Box
                    key={tag}
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Chip
                      label={tag}
                      onDelete={
                        !isOwner || isLoadingDetail
                          ? undefined
                          : () => setTags(tags.filter((t) => t !== tag))
                      }
                      sx={{
                        ...tagChipSx,
                        bgcolor: colors.bgcolor,
                        color: colors.color,
                        border: '1px solid',
                        borderColor: colors.borderColor,
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        height: '26px',
                        '& .MuiChip-deleteIcon': {
                          color: colors.color,
                          fontSize: '14px',
                          opacity: 0.7,
                          '&:hover': { opacity: 1 },
                        },
                      }}
                    />
                  </Box>
                );
              })}
              {isOwner &&
                (isAddingTag ? (
                  <Box
                    key="add-tag-input"
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <TextField
                      autoFocus
                      value={newTag}
                      disabled={isLoadingDetail}
                      onChange={(e) => setNewTag(e.target.value)}
                      onBlur={() => !isLoadingDetail && handleAddTag()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (!isLoadingDetail) handleAddTag();
                        } else if (e.key === 'Escape') {
                          setIsAddingTag(false);
                        }
                      }}
                      size="small"
                      sx={addTagInputSx}
                      placeholder={t(
                        'tasks.properties.tagPlaceholder',
                        '#etiqueta',
                      )}
                    />
                  </Box>
                ) : (
                  <Box
                    key="add-tag-button"
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Chip
                      icon={<AddIcon sx={{ fontSize: 13 }} />}
                      label={t('tasks.properties.addTag', 'Añadir')}
                      onClick={
                        isLoadingDetail ? undefined : () => setIsAddingTag(true)
                      }
                      disabled={isLoadingDetail}
                      sx={{
                        height: 26,
                        fontSize: 12,
                        fontWeight: 600,
                        bgcolor: 'transparent',
                        color: 'text.secondary',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    />
                  </Box>
                ))}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* PLANIFICACIÓN Y TIEMPOS */}
      <Box sx={{ mt: 1 }}>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            mb: 1.25,
          }}
        >
          {t('tasks.properties.scheduleAndTimes', 'Planificación y Tiempos')}
        </Typography>

        <Box sx={scheduleGridSx}>
          {/* Row 1, Col 1: Fecha Planificada */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '12px',
                fontWeight: 600,
                mb: 0.5,
                display: 'block',
              }}
            >
              {t('tasks.properties.plannedDate', 'Fecha Planificada')}
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Box
                onClick={() => isOwner && setDatePickerOpen(true)}
                sx={scheduleBoxSx}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ fontSize: 16, color: '#008767' }} />
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {currentDate
                      ? format(currentDate, "d 'de' MMM, yyyy", { locale: es })
                      : t('tasks.dates.noDateInbox', 'Sin fecha (Inbox)')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {currentDate && isOwner && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentDate(null);
                      }}
                      sx={{ p: 0.25, color: 'text.secondary' }}
                    >
                      <CloseIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  )}
                  <ChevronDownIcon
                    sx={{ fontSize: 18, color: 'text.secondary' }}
                  />
                </Box>
              </Box>
              <DatePicker
                open={datePickerOpen}
                onClose={() => setDatePickerOpen(false)}
                value={currentDate}
                onChange={(newValue) => {
                  setCurrentDate(newValue);
                  setDatePickerOpen(false);
                }}
                slotProps={{
                  textField: {
                    sx: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      pointerEvents: 'none',
                    },
                  },
                  popper: { sx: datePickerPopperSx, placement: 'bottom-start' },
                  desktopPaper: { sx: datePickerPaperSx },
                }}
              />
            </Box>
            {hasDifferentDueDate && deadlineDate && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  fontSize: '11px',
                  color: 'text.secondary',
                }}
              >
                Vence {format(deadlineDate, 'PPP')}
              </Typography>
            )}
          </Box>

          {/* Row 1, Col 2: Duración Estimada */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '12px',
                fontWeight: 600,
                mb: 0.5,
                display: 'block',
              }}
            >
              {t('tasks.properties.estimatedDuration', 'Duración Estimada')}
            </Typography>
            <Box
              sx={{
                ...scheduleBoxSx,
                cursor: 'text',
                borderColor: durationInputError ? 'error.main' : undefined,
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}
              >
                <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <TextField
                  variant="standard"
                  value={duration}
                  disabled={!isOwner}
                  onChange={(e) => {
                    if (/[^0-9hHmMsS\s]/g.test(e.target.value)) {
                      triggerDurationError(
                        dTimeout,
                        setDurationInputError,
                        setDTimeout,
                      );
                    }
                    const sanitizedValue = sanitizeDurationValue(
                      e.target.value,
                    );
                    e.target.value = sanitizedValue;
                    handleTimerChange(
                      sanitizedValue,
                      setDuration,
                      setDurationSuggestions,
                      setDurationAnchor,
                      e.currentTarget.parentElement as HTMLDivElement,
                    );
                  }}
                  onBlur={() => setTimeout(() => setDurationAnchor(null), 200)}
                  placeholder={t(
                    'tasks.properties.durationPlaceholder',
                    '4 horas (o 2h 30m)',
                  )}
                  InputProps={{
                    disableUnderline: true,
                    readOnly: !isOwner,
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-input': {
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'text.primary',
                      padding: 0,
                    },
                  }}
                />
              </Box>
              <Popover
                open={Boolean(durationAnchor)}
                anchorEl={durationAnchor}
                onClose={() => setDurationAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                disableAutoFocus
                disableEnforceFocus
                slotProps={{ paper: { sx: timerPopoverPaperSx } }}
              >
                <List dense sx={{ py: 0 }}>
                  {durationSuggestions.map((s) => (
                    <MenuItem
                      key={s}
                      onClick={() => {
                        setDuration(s);
                        setDurationAnchor(null);
                      }}
                    >
                      <ListItemText
                        primary={s}
                        primaryTypographyProps={{
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                      />
                    </MenuItem>
                  ))}
                </List>
              </Popover>
            </Box>
            {durationInputError && (
              <Typography
                variant="caption"
                sx={{ color: 'error.main', fontSize: '10px', ml: 0.5 }}
              >
                {durationInputError}
              </Typography>
            )}
          </Box>

          {/* Row 2, Col 1: Hora de Inicio */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '12px',
                fontWeight: 600,
                mb: 0.5,
                display: 'block',
              }}
            >
              {t('tasks.properties.startTime', 'Hora de Inicio')}
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Box
                onClick={() => isOwner && setTimePickerOpen(true)}
                sx={scheduleBoxSx}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {currentDate ? format(currentDate, 'hh:mm a') : '10:00 AM'}
                  </Typography>
                </Box>
                <ChevronDownIcon
                  sx={{ fontSize: 18, color: 'text.secondary' }}
                />
              </Box>
              <TimePicker
                open={timePickerOpen}
                onClose={() => setTimePickerOpen(false)}
                value={currentDate}
                onChange={(newValue) => {
                  setCurrentDate(newValue);
                  setTimePickerOpen(false);
                }}
                slotProps={{
                  textField: {
                    sx: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      pointerEvents: 'none',
                    },
                  },
                  popper: { sx: timePickerPopperSx, placement: 'bottom-start' },
                  desktopPaper: { sx: timePickerPaperSx },
                  layout: { sx: timePickerLayoutSx },
                }}
              />
            </Box>
          </Box>

          {/* Row 2, Col 2: Duración Real (Tracked) */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '12px',
                fontWeight: 600,
                mb: 0.5,
                display: 'block',
              }}
            >
              {t('tasks.properties.trackedDuration', 'Duración Real (Tracked)')}
            </Typography>
            <Box
              onClick={(e) => {
                if (!isOwner) return;
                setTimeLogAnchor((prev) => (prev ? null : e.currentTarget));
              }}
              sx={scheduleBoxSx}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrackedIcon sx={{ fontSize: 16, color: '#008767' }} />
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {realTime || '0m'}
                </Typography>
              </Box>
              <Chip
                label="LOGGED"
                size="small"
                sx={{
                  height: 20,
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(0, 135, 103, 0.2)'
                      : 'rgba(0, 135, 103, 0.12)',
                  color: '#008767',
                  borderRadius: '4px',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Highlight Banner Capsule (Ventana Planificada de Tarea) */}
        <Box sx={timeSlotBannerSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon sx={{ fontSize: 16, color: '#008767' }} />
            <Typography
              sx={{ fontSize: '13px', fontWeight: 600, color: '#008767' }}
            >
              {t(
                'tasks.properties.plannedWindow',
                'Ventana Planificada de Tarea',
              )}
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: '13px', fontWeight: 700, color: '#008767' }}
          >
            {timeSlotDisplay ||
              (currentDate
                ? format(currentDate, 'hh:mm a')
                : '10:15 AM - 2:15 PM')}
          </Typography>
        </Box>
      </Box>

      {/* Embedded Created At if editing */}
      {createdAt && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '11px',
              fontStyle: 'italic',
            }}
          >
            {t('tasks.properties.createdAt', 'Creado el')}{' '}
            {new Date(createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
      )}

      {/* Popovers */}
      {/* Status Popover */}
      <Popover
        open={Boolean(statusAnchor)}
        anchorEl={statusAnchor}
        onClose={() => setStatusAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: popoverPaperSx }}
      >
        <Stack sx={{ p: 1, minWidth: '180px' }}>
          {[
            'Todo',
            'Planning',
            'Scheduled',
            'Review',
            'Pending',
            'On Hold',
            'Done',
            'Backlog',
            'Archived',
          ].map((s) => {
            const conf = STATUS_CONFIG[s] || { label: s, dotColor: '#008767' };
            return (
              <MenuItem
                key={s}
                onClick={() => {
                  setStatus(s as TaskStatus);
                  setStatusAnchor(null);
                }}
                sx={{ borderRadius: '8px', py: 1 }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: conf.dotColor,
                    }}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    {conf.label}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Stack>
      </Popover>

      {/* Priority Popover */}
      <Popover
        open={Boolean(priorityAnchor)}
        anchorEl={priorityAnchor}
        onClose={() => setPriorityAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: popoverPaperSx }}
      >
        <Stack sx={{ p: 1, minWidth: '160px' }}>
          {PRIORITY_OPTIONS.map((pOpt) => {
            const conf = PRIORITY_CONFIG[pOpt.id] || PRIORITY_CONFIG['Med'];
            return (
              <MenuItem
                key={pOpt.id}
                onClick={() => {
                  setPriority(pOpt.id as PriorityType);
                  setPriorityAnchor(null);
                }}
                sx={{ borderRadius: '8px', py: 1 }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: conf.dotColor,
                    }}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    {conf.label}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })}
        </Stack>
      </Popover>

      {/* Category Popover */}
      <Popover
        open={Boolean(categoryAnchor)}
        anchorEl={categoryAnchor}
        onClose={() => setCategoryAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: popoverPaperSx }}
      >
        <Stack sx={{ p: 1, minWidth: '180px' }}>
          {[
            'General',
            'Deep Work',
            'Meeting',
            'Admin',
            'Design',
            'Development',
            'Marketing',
            'Planning',
            'Research',
            'Learning',
            'Personal',
          ].map((c) => (
            <MenuItem
              key={c}
              onClick={() => {
                setCategory(c);
                setCategoryAnchor(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {c === 'General' && (
                  <CategoryIcon
                    sx={{ fontSize: 18, color: 'text.secondary' }}
                  />
                )}
                {c === 'Deep Work' && (
                  <AutoFixHighIcon
                    sx={{ fontSize: 18, color: 'secondary.main' }}
                  />
                )}
                {c === 'Meeting' && (
                  <GroupsIcon sx={{ fontSize: 18, color: 'info.main' }} />
                )}
                {c === 'Admin' && (
                  <AssignmentIcon
                    sx={{ fontSize: 18, color: 'text.secondary' }}
                  />
                )}
                {c === 'Design' && (
                  <BrushIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                )}
                {c === 'Development' && (
                  <CodeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                )}
                {c === 'Marketing' && (
                  <TrendingUpIcon sx={{ fontSize: 18, color: 'error.main' }} />
                )}
                {c === 'Planning' && (
                  <EventNoteIcon sx={{ fontSize: 18, color: 'info.main' }} />
                )}
                {c === 'Research' && (
                  <PsychologyIcon
                    sx={{ fontSize: 18, color: 'secondary.main' }}
                  />
                )}
                {c === 'Learning' && (
                  <SchoolIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                )}
                {c === 'Personal' && (
                  <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                )}
                <Typography variant="body2" fontWeight={500}>
                  {c}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Popover>

      {/* Color Popover */}
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => {
          setColorAnchor(null);
          setHoveredColor(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          sx: {
            ...colorPopoverPaperSx,
            p: 1.75,
            minWidth: 260,
            maxWidth: 290,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
            px: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('tasks.properties.backgroundColor', 'Color de fondo')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isTaskCustomColor(color) && (
              <Typography
                onClick={() => {
                  setColor('');
                  setColorAnchor(null);
                  setHoveredColor(null);
                }}
                sx={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ef4444',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {t('tasks.properties.removeBackground', 'Quitar fondo')}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor:
                    hoveredColor?.value ||
                    (isTaskCustomColor(color) ? color : 'transparent'),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Typography
                sx={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {hoveredColor?.name ||
                  (isTaskCustomColor(color)
                    ? getColorName(color) ||
                      t('tasks.properties.custom', 'Personalizado')
                    : t('tasks.properties.noBackground', 'Sin fondo'))}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Category Classification Chips */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            mb: 1.5,
            px: 0.5,
          }}
        >
          {[
            {
              id: 'all' as const,
              label: 'Todos',
              count: 45,
              dot: 'linear-gradient(135deg, #BAE6FD, #FBCFE8, #A7F3D0)',
            },
            {
              id: 'pastel' as const,
              label: 'Pasteles',
              count: 25,
              dot: '#BAE6FD',
            },
            {
              id: 'solid' as const,
              label: 'Sólidos',
              count: 20,
              dot: '#1D4ED8',
            },
          ].map((cat) => {
            const isActive = colorCategoryFilter === cat.id;
            return (
              <Box
                key={cat.id}
                onClick={() => setColorCategoryFilter(cat.id)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.6,
                  px: 1,
                  py: 0.4,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  bgcolor: (theme) =>
                    isActive
                      ? alpha(theme.palette.primary.main, 0.12)
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.04)'
                        : 'rgba(0,0,0,0.03)',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: (theme) =>
                      isActive
                        ? alpha(theme.palette.primary.main, 0.18)
                        : theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.06)',
                    color: 'text.primary',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cat.dot,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }}
                />
                {cat.label} ({cat.count})
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            maxHeight: 330,
            overflowY: 'auto',
            pr: 0.5,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.15)',
              borderRadius: '4px',
            },
          }}
        >
          {/* Pasteles Section */}
          {(colorCategoryFilter === 'all' ||
            colorCategoryFilter === 'pastel') && (
            <>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: 1,
                  px: 0.5,
                }}
              >
                Tonos Pasteles
              </Typography>
              <Box sx={{ ...colorGridSx, mb: 2 }}>
                {PASTEL_COLORS.filter((c) => c.category === 'pastel').map(
                  (item) => {
                    const isSelected =
                      color?.toUpperCase() === item.value.toUpperCase();
                    return (
                      <Tooltip
                        key={item.value}
                        title={item.name}
                        arrow
                        placement="top"
                      >
                        <Box
                          onClick={() => {
                            setColor(item.value);
                            setColorAnchor(null);
                            setHoveredColor(null);
                          }}
                          onMouseEnter={() => setHoveredColor(item)}
                          onMouseLeave={() => setHoveredColor(null)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: item.value,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isSelected
                              ? '2px solid'
                              : '1.5px solid rgba(0,0,0,0.1)',
                            borderColor: isSelected
                              ? 'text.primary'
                              : 'rgba(0,0,0,0.1)',
                            boxShadow: isSelected
                              ? '0 0 0 2px rgba(0,0,0,0.15)'
                              : '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                            },
                          }}
                        >
                          {isSelected && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: isColorDark(item.value)
                                  ? '#ffffff'
                                  : '#0f172a',
                                opacity: 0.9,
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  },
                )}
              </Box>
            </>
          )}

          {/* Sólidos Section */}
          {(colorCategoryFilter === 'all' ||
            colorCategoryFilter === 'solid') && (
            <>
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: 1,
                  px: 0.5,
                }}
              >
                Tonos Sólidos
              </Typography>
              <Box sx={{ ...colorGridSx, pb: 0.5 }}>
                {PASTEL_COLORS.filter((c) => c.category === 'solid').map(
                  (item) => {
                    const isSelected =
                      color?.toUpperCase() === item.value.toUpperCase();
                    return (
                      <Tooltip
                        key={item.value}
                        title={item.name}
                        arrow
                        placement="top"
                      >
                        <Box
                          onClick={() => {
                            setColor(item.value);
                            setColorAnchor(null);
                            setHoveredColor(null);
                          }}
                          onMouseEnter={() => setHoveredColor(item)}
                          onMouseLeave={() => setHoveredColor(null)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: item.value,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isSelected
                              ? '2px solid'
                              : '1.5px solid rgba(0,0,0,0.1)',
                            borderColor: isSelected
                              ? 'text.primary'
                              : 'rgba(0,0,0,0.1)',
                            boxShadow: isSelected
                              ? '0 0 0 2px rgba(0,0,0,0.15)'
                              : '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              transform: 'scale(1.15)',
                            },
                          }}
                        >
                          {isSelected && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: isColorDark(item.value)
                                  ? '#ffffff'
                                  : '#0f172a',
                                opacity: 0.9,
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  },
                )}
              </Box>
            </>
          )}
        </Box>

        {isTaskCustomColor(color) && (
          <Box
            onClick={() => {
              setColor('');
              setColorAnchor(null);
              setHoveredColor(null);
            }}
            sx={{
              mt: 1.5,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.6,
              py: 0.6,
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'text.secondary',
              fontSize: '11.5px',
              fontWeight: 600,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
            {t(
              'tasks.properties.removeBackgroundColor',
              'Quitar color de fondo',
            )}
          </Box>
        )}
      </Popover>

      {/* Time Log Popover */}
      <Popover
        open={Boolean(timeLogAnchor)}
        anchorEl={timeLogAnchor}
        onClose={() => setTimeLogAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: timeLogPopoverPaperSx } }}
      >
        <Box onClick={(e) => e.stopPropagation()}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'text.secondary',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {t('tasks.properties.logTime', 'Registrar tiempo')}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setTimeLogAnchor(null)}
              sx={{
                p: 0.25,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.75, mt: 1 }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <Box
                onClick={() => setNewLogDatePickerOpen(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '13px',
                  fontWeight: 500,
                  py: 0.75,
                  px: 1,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <PlannedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                {newLogDate ? format(newLogDate, 'MMM d') : 'Date'}
              </Box>
              <DatePicker
                open={newLogDatePickerOpen}
                onClose={() => setNewLogDatePickerOpen(false)}
                value={newLogDate}
                onChange={(newValue) => {
                  setNewLogDate(newValue);
                  setNewLogDatePickerOpen(false);
                }}
                slotProps={{
                  textField: {
                    sx: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      pointerEvents: 'none',
                    },
                  },
                  popper: {
                    sx: datePickerPopperSx,
                    placement: 'bottom-start',
                  },
                  desktopPaper: {
                    sx: datePickerPaperSx,
                  },
                }}
              />
            </Box>
            <TextField
              variant="outlined"
              size="small"
              disabled={isLoadingDetail}
              value={newLogDuration}
              onChange={(e) =>
                setNewLogDuration(sanitizeDurationValue(e.target.value))
              }
              placeholder="2h"
              sx={{
                width: 64,
                '& .MuiInputBase-input': {
                  fontSize: '13px',
                  fontWeight: 600,
                  py: 0.85,
                  px: 1,
                },
              }}
            />
            <IconButton
              size="small"
              disabled={isLoadingDetail}
              onClick={() => {
                const minutes = parseDuration(newLogDuration);
                if (minutes > 0 && newLogDate) {
                  handleAddTimeLog(format(newLogDate, 'yyyy-MM-dd'), minutes);
                  setNewLogDuration('');
                }
              }}
              sx={{
                bgcolor: '#008767',
                color: '#fff',
                borderRadius: '8px',
                '&:hover': { bgcolor: '#007357' },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {timeLogs.length > 0 ? (
            <List
              dense
              sx={{ py: 0, mt: 1, maxHeight: 200, overflowY: 'auto' }}
            >
              {timeLogs
                .map((entry, index) => ({ entry, index }))
                .sort((a, b) => b.entry.date.localeCompare(a.entry.date))
                .map(({ entry, index }) => (
                  <MenuItem
                    key={`${entry.date}-${index}`}
                    disableRipple
                    sx={{ px: 0.5, cursor: 'default' }}
                  >
                    <ListItemText
                      primary={format(
                        new Date(`${entry.date}T00:00:00`),
                        'EEE, MMM d',
                      )}
                      secondary={formatDuration(entry.minutes)}
                      primaryTypographyProps={{
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    />
                    {isOwner && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveTimeLog(index)}
                        disabled={isLoadingDetail}
                        sx={{ p: 0.3 }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </MenuItem>
                ))}
            </List>
          ) : (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1.5,
                mb: 0.5,
                color: 'text.disabled',
                fontStyle: 'italic',
              }}
            >
              {t(
                'tasks.properties.noTimeLogged',
                'No hay tiempo registrado aún.',
              )}
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};
