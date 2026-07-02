import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  Popover,
  MenuItem,
  List,
  ListItemText,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  RadioButtonUnchecked as TodoIcon,
  CalendarToday as PlannedIcon,
  AutoFixHigh as AutoFixHighIcon,
  Description as DescriptionIcon,
  Flag as FlagIcon,
  Add as AddIcon,
  Timer as TimerIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format } from 'date-fns';
import {
  propertyListSx,
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
} from '../../CreateTaskModal.styles';
import { getTagColors } from '../../CreateTaskModal.utils';
import { getStatusIcon, getCategoryIcon } from '../TaskIcons';
import { getSelectionChipSx } from './TaskProperties.utils';
import type { TaskPropertiesProps } from './TaskProperties.types';

export const TaskProperties = (props: TaskPropertiesProps) => {
  const {
    status,
    setStatusAnchor,
    priority,
    setPriorityAnchor,
    category,
    setCategoryAnchor,
    currentDate,
    setCurrentDate,
    timeSlotDisplay,
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
    handleTimerChange,
    durationSuggestions,
    setDurationSuggestions,
    durationAnchor,
    setDurationAnchor,
    realTimeSuggestions,
    setRealTimeSuggestions,
    realTimeAnchor,
    setRealTimeAnchor,
    errors,
  } = props;

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
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

  return (
    <Box sx={propertyListSx}>
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
                  onClick={() => setDatePickerOpen(true)}
                  sx={{
                    cursor: 'pointer',
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
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <PlannedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
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
                    desktopPaper: { sx: datePickerPaperSx },
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
                  onClick={() => setTimePickerOpen(true)}
                  sx={{
                    cursor: 'pointer',
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
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <AccessTimeIcon
                    sx={{ fontSize: 16, color: 'primary.main' }}
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
                    desktopPaper: { sx: timePickerPaperSx },
                    layout: { sx: timePickerLayoutSx },
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
                  borderColor:
                    errors?.duration || durationInputError
                      ? 'error.main'
                      : 'divider',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '#1A1F2B'
                      : 'background.paper',
                  minHeight: '43px',
                }}
              >
                <TimerIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <TextField
                  variant="standard"
                  value={duration}
                  type="text"
                  inputMode="text"
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
                  error={!!errors?.duration}
                  inputProps={{
                    inputMode: 'text',
                    pattern: '[0-9hHmM s]*',
                    maxLength: 12,
                  }}
                  InputProps={{
                    disableUnderline: true,
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
                  slotProps={{
                    paper: {
                      sx: {
                        minWidth: 80,
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      },
                    },
                  }}
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
              {(errors?.duration || durationInputError) && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'error.main',
                    fontSize: '10px',
                    ml: 0.5,
                  }}
                >
                  {durationInputError || errors?.duration}
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
                <HistoryIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <TextField
                  variant="standard"
                  value={realTime}
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
                  inputProps={{
                    inputMode: 'text',
                    pattern: '[0-9hHmM s]*',
                    maxLength: 12,
                  }}
                  InputProps={{
                    disableUnderline: true,
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
                  slotProps={{
                    paper: {
                      sx: {
                        minWidth: 80,
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      },
                    },
                  }}
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
      </Box>

      {/* Metadata & Tags at the bottom */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Status */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <TodoIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography
              variant="caption"
              sx={{ fontSize: '14px', fontWeight: 500 }}
            >
              Status
            </Typography>
          </Box>
          <Box sx={propertyValueSx}>
            <Chip
              icon={getStatusIcon(status)}
              label={status || 'Todo'}
              onClick={(e) => setStatusAnchor(e.currentTarget)}
              sx={getSelectionChipSx('status', status || 'Todo')}
            />
          </Box>
        </Box>

        {/* Priority */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <FlagIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography
              variant="caption"
              sx={{ fontSize: '14px', fontWeight: 500 }}
            >
              Priority
            </Typography>
          </Box>
          <Box sx={propertyValueSx}>
            <Chip
              icon={<FlagIcon sx={{ fontSize: 16 }} />}
              label={priority || 'No priority'}
              onClick={(e) => setPriorityAnchor(e.currentTarget)}
              sx={getSelectionChipSx('priority', priority || 'No priority')}
            />
          </Box>
        </Box>

        {/* Category */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <AutoFixHighIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography
              variant="caption"
              sx={{ fontSize: '14px', fontWeight: 500 }}
            >
              Category
            </Typography>
          </Box>
          <Box sx={propertyValueSx}>
            <Chip
              icon={getCategoryIcon(category)}
              label={category || 'General'}
              onClick={(e) => setCategoryAnchor(e.currentTarget)}
              sx={getSelectionChipSx('category', category || 'General')}
            />
          </Box>
        </Box>

        {/* Tags */}
        <Box sx={propertyRowSx}>
          <Box sx={propertyLabelSx}>
            <DescriptionIcon
              sx={{
                fontSize: 16,
                color: 'primary.main',
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
          <Box sx={propertyValueSx}>
            {tags.map((tag, index) => {
              const colors = getTagColors(tag);
              return (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => setTags(tags.filter((_, i) => i !== index))}
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
              );
            })}
            {isAddingTag ? (
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
            ) : (
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
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
