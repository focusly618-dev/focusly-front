import { useState } from 'react';
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
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Groups as GroupsIcon,
  Category as CategoryIcon,
  RadioButtonUnchecked as TodoIcon,
  CalendarToday as PlannedIcon,
  Visibility as VisibilityIcon,
  PauseCircleOutline as OnHoldIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  Timer as TimerIcon,
  AutoFixHigh as AutoFixHighIcon,
  Assignment as AssignmentIcon,
  Brush as BrushIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import {
  propertyRowSx,
  propertyLabelSx,
  propertyValueSx,
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
  TASK_COLORS,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { TaskStatus } from '@/redux/tasks/task.types';
import {
  propertiesContainerSx,
  metadataRowSx,
  metadataChipSx,
  popoverPaperSx,
  timerPopoverPaperSx,
  colorPopoverPaperSx,
  colorGridSx,
} from './TaskProperties.styles';

interface TaskPropertiesProps {
  status: TaskStatus;
  setStatus: (s: TaskStatus) => void;
  priority: string;
  setPriority: (p: 'High' | 'Med' | 'Low' | 'No priority') => void;
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
  isOwner?: boolean;
  createdAt?: string;
}

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
  setRealTime,
  timeSlotDisplay,
  handleTimerChange,
  isOwner,
  createdAt,
}: TaskPropertiesProps) => {
  const [statusAnchor, setStatusAnchor] = useState<HTMLElement | null>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [categoryAnchor, setCategoryAnchor] = useState<HTMLElement | null>(
    null,
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const [durationSuggestions, setDurationSuggestions] = useState<string[]>([]);
  const [realTimeSuggestions, setRealTimeSuggestions] = useState<string[]>([]);
  const [durationAnchor, setDurationAnchor] = useState<HTMLDivElement | null>(
    null,
  );
  const [realTimeAnchor, setRealTimeAnchor] = useState<HTMLDivElement | null>(
    null,
  );

  const [durationInputError, setDurationInputError] = useState<string | null>(
    null,
  );
  const [realTimeInputError, setRealTimeInputError] = useState<string | null>(
    null,
  );
  const [dTimeout, setDTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [rTimeout, setRTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const triggerDurationError = () => {
    setDurationInputError('Solo se permiten números y las letras h, m, s');
    if (dTimeout) clearTimeout(dTimeout);
    const t = setTimeout(() => setDurationInputError(null), 3000);
    setDTimeout(t);
  };

  const triggerRealTimeError = () => {
    setRealTimeInputError('Solo se permiten números y las letras h, m, s');
    if (rTimeout) clearTimeout(rTimeout);
    const t = setTimeout(() => setRealTimeInputError(null), 3000);
    setRTimeout(t);
  };

  const sanitizeDurationValue = (value: string) =>
    value.replace(/[^0-9hHmMsS\s]/g, '');

  const getPriorityColor = (p: string) => {
    if (p === 'High') return '#ef4444';
    if (p === 'Med') return '#f59e0b';
    if (p === 'Low') return '#22c55e';
    return '#6b7280';
  };

  return (
    <Box sx={propertiesContainerSx}>
      {/* Schedule & Time Tracking Card */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.08)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(26, 31, 43, 0.4) 0%, rgba(15, 23, 42, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.5) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Card Header */}
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '0.05em',
            }}
          >
            Schedule & Time Tracking
          </Typography>
        </Box>

        {/* Card Body Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          {/* Column 1: Scheduling */}
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Date */}
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Date
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Box
                  onClick={() => isOwner && setDatePickerOpen(true)}
                  sx={{
                    cursor: !isOwner ? 'default' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'text.primary',
                    py: 1,
                    px: 1.5,
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '#1A1F2B'
                        : 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: !isOwner ? 'divider' : 'primary.main',
                      bgcolor: !isOwner ? 'transparent' : 'action.hover',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    pointerEvents: !isOwner ? 'none' : 'auto',
                  }}
                >
                  <PlannedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                  {currentDate ? format(currentDate, 'PPP') : 'Pick a date'}
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
            </Box>

            {/* Start Time */}
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Start Time
              </Typography>
              <Box sx={{ position: 'relative' }}>
                <Box
                  onClick={() => isOwner && setTimePickerOpen(true)}
                  sx={{
                    cursor: !isOwner ? 'default' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'text.primary',
                    py: 1,
                    px: 1.5,
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '#1A1F2B'
                        : 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: !isOwner ? 'divider' : 'primary.main',
                      bgcolor: !isOwner ? 'transparent' : 'action.hover',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    pointerEvents: !isOwner ? 'none' : 'auto',
                  }}
                >
                  <AccessTimeIcon
                    sx={{ fontSize: 16, color: 'text.disabled' }}
                  />
                  {currentDate ? format(currentDate, 'hh:mm a') : 'Pick a time'}
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
                    popper: {
                      sx: timePickerPopperSx,
                      placement: 'bottom-start',
                    },
                    desktopPaper: {
                      sx: timePickerPaperSx,
                    },
                    layout: {
                      sx: timePickerLayoutSx,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Column 2: Durations */}
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Estimated Duration */}
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Estimated Duration
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  px: 1.5,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: durationInputError ? 'error.main' : 'divider',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '#1A1F2B'
                      : 'background.paper',
                  minHeight: '43px',
                }}
              >
                <TimerIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <TextField
                  variant="standard"
                  value={duration}
                  disabled={!isOwner}
                  onChange={(e) => {
                    if (/[^0-9hHmMsS\s]/g.test(e.target.value)) {
                      triggerDurationError();
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
                  placeholder="2h 00m"
                  InputProps={{
                    disableUnderline: true,
                    readOnly: !isOwner,
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'text.primary',
                      padding: 0,
                    },
                  }}
                />
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
                  sx={{
                    color: 'error.main',
                    fontSize: '10px',
                    ml: 0.5,
                  }}
                >
                  {durationInputError}
                </Typography>
              )}
            </Box>

            {/* Real Duration */}
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Real Duration (Tracked)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  px: 1.5,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: realTimeInputError ? 'error.main' : 'divider',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '#1A1F2B'
                      : 'background.paper',
                  minHeight: '43px',
                }}
              >
                <HistoryIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                <TextField
                  variant="standard"
                  value={realTime}
                  disabled={!isOwner}
                  onChange={(e) => {
                    if (/[^0-9hHmMsS\s]/g.test(e.target.value)) {
                      triggerRealTimeError();
                    }
                    const sanitizedValue = sanitizeDurationValue(
                      e.target.value,
                    );
                    e.target.value = sanitizedValue;
                    handleTimerChange(
                      sanitizedValue,
                      setRealTime,
                      setRealTimeSuggestions,
                      setRealTimeAnchor,
                      e.currentTarget.parentElement as HTMLDivElement,
                    );
                  }}
                  onBlur={() => setTimeout(() => setRealTimeAnchor(null), 200)}
                  placeholder="1h 30m"
                  InputProps={{
                    disableUnderline: true,
                    readOnly: !isOwner,
                  }}
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'text.primary',
                      padding: 0,
                    },
                  }}
                />
                <Popover
                  open={Boolean(realTimeAnchor)}
                  anchorEl={realTimeAnchor}
                  onClose={() => setRealTimeAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  disableAutoFocus
                  disableEnforceFocus
                  slotProps={{ paper: { sx: timerPopoverPaperSx } }}
                >
                  <List dense sx={{ py: 0 }}>
                    {realTimeSuggestions.map((s) => (
                      <MenuItem
                        key={s}
                        onClick={() => {
                          setRealTime(s);
                          setRealTimeAnchor(null);
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
              {realTimeInputError && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'error.main',
                    fontSize: '10px',
                    ml: 0.5,
                  }}
                >
                  {realTimeInputError}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Visual Timeline Badge */}
        {timeSlotDisplay && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: '10px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(99, 102, 241, 0.08)'
                  : 'rgba(99, 102, 241, 0.04)',
              border: '1px dashed',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(99, 102, 241, 0.3)'
                  : 'rgba(99, 102, 241, 0.2)',
              mt: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <TimerIcon sx={{ fontSize: 14 }} /> Scheduled Window
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '0.02em',
              }}
            >
              {timeSlotDisplay}
            </Typography>
          </Box>
        )}

        {/* Embedded Created At */}
        {createdAt && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 1,
              pt: 1.5,
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
              Created on{' '}
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
      </Box>

      {/* Metadata & Tags at the bottom */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={metadataRowSx}>
          {/* Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={
                <>
                  {status === 'Todo' && <TodoIcon sx={{ fontSize: 16 }} />}
                  {status === 'Planning' && (
                    <PlannedIcon sx={{ fontSize: 16 }} />
                  )}
                  {status === 'Scheduled' && (
                    <PlannedIcon sx={{ fontSize: 16 }} />
                  )}
                  {status === 'Pending' && (
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                  )}
                  {status === 'On Hold' && <OnHoldIcon sx={{ fontSize: 16 }} />}
                  {status === 'Review' && (
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  )}
                  {status === 'Done' && (
                    <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                  )}
                  {status === 'Backlog' && (
                    <HistoryIcon sx={{ fontSize: 16 }} />
                  )}
                  {status === 'Archived' && (
                    <HistoryIcon sx={{ fontSize: 16 }} />
                  )}
                </>
              }
              label={status}
              onClick={(e) => setStatusAnchor(e.currentTarget)}
              sx={{
                ...metadataChipSx(false),
                pointerEvents: !isOwner ? 'none' : 'auto',
              }}
            />
          </Box>

          {/* Priority */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<FlagIcon sx={{ fontSize: 16 }} />}
              label={priority === 'No priority' ? 'No priority' : priority}
              onClick={(e) => setPriorityAnchor(e.currentTarget)}
              sx={{
                ...metadataChipSx(priority === 'High'),
                pointerEvents: !isOwner ? 'none' : 'auto',
              }}
            />
          </Box>

          {/* Category */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={
                <>
                  {category === 'General' && (
                    <CategoryIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Deep Work' && (
                    <AutoFixHighIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Meeting' && (
                    <GroupsIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Admin' && (
                    <AssignmentIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Design' && <BrushIcon sx={{ fontSize: 16 }} />}
                  {category === 'Development' && (
                    <CodeIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Marketing' && (
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Planning' && (
                    <EventNoteIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Research' && (
                    <PsychologyIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Learning' && (
                    <SchoolIcon sx={{ fontSize: 16 }} />
                  )}
                  {category === 'Personal' && (
                    <PersonIcon sx={{ fontSize: 16 }} />
                  )}
                </>
              }
              label={category || 'General'}
              onClick={(e) => setCategoryAnchor(e.currentTarget)}
              sx={{
                ...metadataChipSx(false),
                pointerEvents: !isOwner ? 'none' : 'auto',
              }}
            />
          </Box>
        </Box>

        {/* Tags Property */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <DescriptionIcon
              sx={{
                fontSize: 16,
                color: 'text.disabled',
                transform: 'rotate(180deg)',
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: '14px', fontWeight: 500 }}
            >
              Tags
            </Typography>
          </Box>
          <Box
            sx={{
              ...propertyValueSx,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
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
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    }}
                  >
                    <Chip
                      label={tag}
                      onDelete={
                        !isOwner
                          ? undefined
                          : () => setTags(tags.filter((t) => t !== tag))
                      }
                      sx={{
                        ...tagChipSx,
                        bgcolor: colors.bgcolor,
                        color: colors.color,
                        border: '1px solid',
                        borderColor: colors.borderColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                        height: '24px',
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
                      onChange={(e) => setNewTag(e.target.value)}
                      onBlur={() => handleAddTag()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTag();
                        else if (e.key === 'Escape') setIsAddingTag(false);
                      }}
                      size="small"
                      sx={addTagInputSx}
                      placeholder="#"
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
                      icon={<AddIcon sx={{ fontSize: 14 }} />}
                      label="Add Tag"
                      onClick={() => setIsAddingTag(true)}
                      sx={{
                        height: 28,
                        fontSize: 12,
                        bgcolor: 'transparent',
                        color: 'text.secondary',
                        border: '1px dashed',
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    />
                  </Box>
                ))}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* Popovers */}
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
          ].map((s) => (
            <MenuItem
              key={s}
              onClick={() => {
                setStatus(s as TaskStatus);
                setStatusAnchor(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                {s === 'Todo' && (
                  <TodoIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                )}
                {s === 'Planning' && (
                  <PlannedIcon sx={{ fontSize: 18, color: 'info.main' }} />
                )}
                {s === 'Scheduled' && (
                  <PlannedIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
                )}
                {s === 'Pending' && (
                  <AccessTimeIcon
                    sx={{ fontSize: 18, color: 'warning.main' }}
                  />
                )}
                {s === 'On Hold' && (
                  <OnHoldIcon sx={{ fontSize: 18, color: 'error.main' }} />
                )}
                {s === 'Review' && (
                  <VisibilityIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
                )}
                {s === 'Done' && (
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 18, color: 'success.main' }}
                  />
                )}
                {s === 'Backlog' && (
                  <HistoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                )}
                {s === 'Archived' && (
                  <HistoryIcon sx={{ fontSize: 18, color: '#4b5563' }} />
                )}
                <Typography variant="body2" fontWeight={500}>
                  {s}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Popover>

      <Popover
        open={Boolean(priorityAnchor)}
        anchorEl={priorityAnchor}
        onClose={() => setPriorityAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: popoverPaperSx }}
      >
        <Stack sx={{ p: 1, minWidth: '150px' }}>
          {['High', 'Med', 'Low', 'No priority'].map((p) => (
            <MenuItem
              key={p}
              onClick={() => {
                setPriority(p as 'High' | 'Med' | 'Low' | 'No priority');
                setPriorityAnchor(null);
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <FlagIcon sx={{ fontSize: 18, color: getPriorityColor(p) }} />
                <Typography variant="body2" fontWeight={500}>
                  {p}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Stack>
      </Popover>

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

      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: colorPopoverPaperSx }}
      >
        <Box sx={colorGridSx}>
          {TASK_COLORS.map((c: string) => (
            <Box
              key={c}
              onClick={() => {
                setColor(c);
                setColorAnchor(null);
              }}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: c,
                cursor: 'pointer',
                border: color === c ? '2px solid white' : 'none',
                outline: color === c ? '1px solid black' : 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            />
          ))}
        </Box>
      </Popover>
    </Box>
  );
};
