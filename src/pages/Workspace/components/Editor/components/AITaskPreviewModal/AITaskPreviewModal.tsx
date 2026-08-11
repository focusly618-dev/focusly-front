import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { format } from 'date-fns';

export interface AITaskPreviewData {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  duration: string;
  startDate: Date;
  endDate: Date;
  priorityLevel: number;
  estimateTimer: number;
  category: string;
  user_id: string;
}

export interface AITaskPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (finalData: AITaskPreviewData) => void;
  previewData: AITaskPreviewData | null;
  loading?: boolean;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} timeout={200} />;
});

interface AITaskPreviewContentProps {
  previewData: AITaskPreviewData;
  loading: boolean;
  onClose: () => void;
  onConfirm: (finalData: AITaskPreviewData) => void;
}

const AITaskPreviewContent: React.FC<AITaskPreviewContentProps> = ({
  previewData,
  loading,
  onClose,
  onConfirm,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [title, setTitle] = useState(previewData.title || '');
  const [description, setDescription] = useState(previewData.description || '');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(
    previewData.priority || 'Medium',
  );
  const [category] = useState(previewData.category || 'General');

  const handleConfirm = () => {
    const priorityLevel = priority === 'High' ? 4 : priority === 'Low' ? 1 : 2;

    onConfirm({
      ...previewData,
      title,
      description,
      priority,
      priorityLevel,
      category,
    });
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High':
        return '#ef4444';
      case 'Low':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  const formattedDate = previewData.startDate
    ? format(previewData.startDate, 'EEEE, MMM d, yyyy')
    : '';
  const formattedStartTime = previewData.startDate
    ? format(previewData.startDate, 'h:mm a')
    : '';
  const formattedEndTime = previewData.endDate
    ? format(previewData.endDate, 'h:mm a')
    : '';

  return (
    <>
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${
            isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'
          }`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              color: '#fff',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              AI Task Preview
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Review generated details before adding to your schedule
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Title Field */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5,
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Task Title
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                },
              }}
            />
          </Box>

          {/* Schedule & Metadata Card */}
          <Box
            sx={{
              p: 2,
              borderRadius: '14px',
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
              border: `1px solid ${
                isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'
              }`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {/* Scheduled Date & Time Range */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CalendarTodayIcon
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formattedDate}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
              <Typography
                variant="body2"
                sx={{ color: 'text.primary', fontWeight: 600 }}
              >
                {formattedStartTime} – {formattedEndTime}
              </Typography>
              <Chip
                label={previewData.duration || '30m'}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '11px',
                  fontWeight: 700,
                  bgcolor: alpha('#8b5cf6', 0.15),
                  color: '#8b5cf6',
                  borderRadius: '6px',
                }}
              />
            </Box>

            <Divider sx={{ opacity: 0.5 }} />

            {/* Properties Badges */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FlagIcon
                  sx={{
                    fontSize: 16,
                    color: getPriorityColor(priority),
                  }}
                />
                <Chip
                  label={`${priority} Priority`}
                  size="small"
                  onClick={() => {
                    const next =
                      priority === 'Low'
                        ? 'Medium'
                        : priority === 'Medium'
                          ? 'High'
                          : 'Low';
                    setPriority(next);
                  }}
                  sx={{
                    height: 24,
                    fontWeight: 700,
                    fontSize: '12px',
                    bgcolor: alpha(getPriorityColor(priority), 0.12),
                    color: getPriorityColor(priority),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(getPriorityColor(priority), 0.25),
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Chip
                  label={category}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 600,
                    fontSize: '12px',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Notes / Description */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 0.5,
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Description & Notes
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  bgcolor: isDark
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider sx={{ opacity: 0.5 }} />

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
            px: 2.5,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading || !title.trim()}
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.45)',
            },
          }}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </>
  );
};

export const AITaskPreviewModal: React.FC<AITaskPreviewModalProps> = ({
  open,
  onClose,
  onConfirm,
  previewData,
  loading = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!previewData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: isDark
            ? '0 20px 60px rgba(0, 0, 0, 0.6)'
            : '0 20px 60px rgba(0, 0, 0, 0.15)',
          background: isDark
            ? 'linear-gradient(145deg, #18181b 0%, #09090b 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: `1px solid ${
            isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
          }`,
          overflow: 'hidden',
        },
      }}
    >
      <AITaskPreviewContent
        key={`${previewData.title}-${previewData.startDate?.getTime()}`}
        previewData={previewData}
        loading={loading}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </Dialog>
  );
};
