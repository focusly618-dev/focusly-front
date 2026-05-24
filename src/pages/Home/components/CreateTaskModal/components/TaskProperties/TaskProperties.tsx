import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
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
  AttachFile as AttachFileIcon,
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
import {
  getStatusIcon,
  getStatusColor,
  getCategoryIcon,
  getCategoryColor,
  getPriorityIconColor,
} from '../TaskIcons';
import type { TaskStatus } from '@/redux/tasks/task.types';

interface TaskPropertiesProps {
  status: TaskStatus;
  setStatusAnchor: (el: HTMLElement | null) => void;
  priority: string;
  setPriorityAnchor: (el: HTMLElement | null) => void;
  category: string;
  setCategoryAnchor: (el: HTMLElement | null) => void;
  currentDate: Date | null;
  setCurrentDate: (d: Date | null) => void;
  timeSlotDisplay: string;
  tags: string[];
  setTags: (t: string[]) => void;
  newTag: string;
  setNewTag: (v: string) => void;
  isAddingTag: boolean;
  setIsAddingTag: (v: boolean) => void;
  handleAddTag: () => void;
  duration: string;
  setDuration: (v: string) => void;
  realTime: string;
  setRealTime: (v: string) => void;
  handleTimerChange: (
    value: string,
    setter: (v: string) => void,
    setSuggestions: (s: string[]) => void,
    setAnchor: (el: HTMLDivElement | null) => void,
    target: HTMLDivElement,
  ) => void;
  durationSuggestions: string[];
  setDurationSuggestions: (s: string[]) => void;
  durationAnchor: HTMLDivElement | null;
  setDurationAnchor: (el: HTMLDivElement | null) => void;
  realTimeSuggestions: string[];
  setRealTimeSuggestions: (s: string[]) => void;
  realTimeAnchor: HTMLDivElement | null;
  setRealTimeAnchor: (el: HTMLDivElement | null) => void;
  errors?: { duration?: string };
}

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

  const getChipSx = (colorCode: string) => ({
    borderRadius: '20px',
    px: 1.5,
    height: '28px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    bgcolor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? alpha(colorCode, 0.12)
        : alpha(colorCode, 0.08),
    border: '1px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? alpha(colorCode, 0.2)
        : alpha(colorCode, 0.15),
    color: (theme: Theme) =>
      theme.palette.mode === 'dark' ? alpha(colorCode, 0.9) : colorCode,
    '&:hover': {
      bgcolor: (theme: Theme) =>
        theme.palette.mode === 'dark'
          ? alpha(colorCode, 0.18)
          : alpha(colorCode, 0.12),
      transform: 'translateY(-0.5px)',
    },
    '& .MuiChip-icon': {
      marginLeft: '-2px',
      marginRight: '-4px',
      color: 'inherit !important',
      fontSize: '14px',
    },
  });

  return (
    <Box sx={propertyListSx}>
      {/* Status */}
      <Box sx={propertyRowSx}>
        <Box sx={propertyLabelSx}>
          <TodoIcon sx={{ fontSize: 18 }} />
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
            sx={getChipSx(getStatusColor(status))}
          />
        </Box>
      </Box>

      {/* Priority */}
      <Box sx={propertyRowSx}>
        <Box sx={propertyLabelSx}>
          <AttachFileIcon sx={{ fontSize: 18, transform: 'rotate(45deg)' }} />
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
            sx={getChipSx(getPriorityIconColor(priority))}
          />
        </Box>
      </Box>

      {/* Category */}
      <Box sx={propertyRowSx}>
        <Box sx={propertyLabelSx}>
          <AutoFixHighIcon sx={{ fontSize: 18 }} />
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
            sx={getChipSx(getCategoryColor(category))}
          />
        </Box>
      </Box>

      {/* Date */}
      <Box sx={propertyRowSx}>
        <Box sx={propertyLabelSx}>
          <PlannedIcon sx={{ fontSize: 18 }} />
          <Typography
            variant="caption"
            sx={{ fontSize: '14px', fontWeight: 500 }}
          >
            Date
          </Typography>
        </Box>
        <Box sx={{ ...propertyValueSx, position: 'relative' }}>
          <Chip
            label={currentDate ? format(currentDate, 'PPP') : 'Pick a date'}
            onClick={() => setDatePickerOpen(true)}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              height: '32px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          />
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
      </Box>

      {/* Time */}
      <Box sx={propertyRowSx}>
        <Box sx={propertyLabelSx}>
          <AccessTimeIcon sx={{ fontSize: 18 }} />
          <Typography
            variant="caption"
            sx={{ fontSize: '14px', fontWeight: 500 }}
          >
            Time
          </Typography>
        </Box>
        <Box sx={{ ...propertyValueSx, position: 'relative' }}>
          <Chip
            label={currentDate ? format(currentDate, 'hh:mm a') : 'Pick a time'}
            onClick={() => setTimePickerOpen(true)}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              height: '32px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          />
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
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', ml: 1.5, fontStyle: 'italic' }}
          >
            ({timeSlotDisplay})
          </Typography>
        </Box>
      </Box>

      {/* Tags */}
      <Box sx={propertyRowSx}>
        <Box sx={propertyLabelSx}>
          <DescriptionIcon sx={{ fontSize: 18, transform: 'rotate(180deg)' }} />
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

      {/* Time Tracking */}
      <Box sx={{ ...propertyRowSx, alignItems: 'center' }}>
        <Box sx={propertyLabelSx}>
          <AccessTimeIcon sx={{ fontSize: 18 }} />
          <Typography
            variant="caption"
            sx={{ fontSize: '14px', fontWeight: 500 }}
          >
            Time Tracking
          </Typography>
        </Box>
        <Box sx={{ ...propertyValueSx, gap: 6 }}>
          {/* Estimated */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{ textAlign: 'center' }}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <TimerIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  ESTIMATED
                </Typography>
              </Box>
              <TextField
                variant="standard"
                value={duration}
                onChange={(e) =>
                  handleTimerChange(
                    e.target.value,
                    setDuration,
                    setDurationSuggestions,
                    setDurationAnchor,
                    e.currentTarget.parentElement as HTMLDivElement,
                  )
                }
                onBlur={() => setTimeout(() => setDurationAnchor(null), 200)}
                placeholder="2h 00m"
                error={!!errors?.duration}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'text.primary',
                  },
                }}
                sx={{
                  width: '80px',
                  bgcolor: 'background.default',
                  borderRadius: '10px',
                  px: 1,
                }}
              />
              {errors?.duration && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'error.main',
                    fontSize: '10px',
                    mt: 0.5,
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  {errors.duration}
                </Typography>
              )}
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
          </Box>
          {/* Real */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{ textAlign: 'center' }}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <HistoryIcon sx={{ fontSize: 14, color: 'info.main' }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'info.main',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  REAL
                </Typography>
              </Box>
              <TextField
                variant="standard"
                value={realTime}
                onChange={(e) =>
                  handleTimerChange(
                    e.target.value,
                    setRealTime,
                    setRealTimeSuggestions,
                    setRealTimeAnchor,
                    e.currentTarget.parentElement as HTMLDivElement,
                  )
                }
                onBlur={() => setTimeout(() => setRealTimeAnchor(null), 200)}
                placeholder="1h 30m"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '15px', color: 'info.main', fontWeight: 700 },
                }}
                sx={{
                  width: '80px',
                  bgcolor: 'background.default',
                  borderRadius: '10px',
                  px: 1,
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
                          color: 'info.main',
                        }}
                      />
                    </MenuItem>
                  ))}
                </List>
              </Popover>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2, borderBottom: '1px solid', borderColor: 'divider' }} />
    </Box>
  );
};
