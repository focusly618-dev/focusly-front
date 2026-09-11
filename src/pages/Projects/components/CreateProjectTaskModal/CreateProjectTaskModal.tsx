import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  Checkbox,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  OpenInFull as OpenInFullIcon,
  CloseFullscreen as CloseFullscreenIcon,
  CalendarTodayOutlined as CalendarIcon,
  TimerOutlined as TimerIcon,
  DescriptionOutlined as DocIcon,
  OpenInNew as ExternalLinkIcon,
  DragIndicator as DragIcon,
  AutoAwesome as SparklesIcon,
  Search as SearchIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  Code as CodeIcon,
  FormatListBulleted as ListIcon,
  InsertLink as LinkIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  AccessTime as ClockIcon,
  Add as AddIcon,
  FlagOutlined as FlagIcon,
  PersonOutline as PersonIcon,
  LocalOfferOutlined as TagIcon,
  SyncAlt as StatusIcon,
} from '@mui/icons-material';

export interface CreateProjectTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectName?: string;
  projectEmoji?: string;
  sprintName?: string;
  linkedSpecTitle?: string;
  linkedSpecSection?: string;
  onCreate?: (task: Record<string, unknown>) => void;
}

export const CreateProjectTaskModal: React.FC<CreateProjectTaskModalProps> = ({
  open,
  onClose,
  projectName = 'Mobile App Redesign',
  projectEmoji = '🚀',
  sprintName = 'Sprint 4.2',
  linkedSpecTitle = 'Mobile App Redesign v3 Brief',
  linkedSpecSection = 'Section: #4.3 Token Lifecycle & Silent Re-authentication',
  onCreate,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Local UI State for interactive demonstration
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [title, setTitle] = useState('Implement OAuth token refresh flow');
  const [status] = useState('In Progress');
  const [priority] = useState('High');
  const [assignee] = useState({ name: 'Sotelo U.', initials: 'SU' });
  const [modules] = useState(['Security', 'Auth']);
  const [dueDate] = useState('Sep 30, 2026');
  const [estimatedDuration] = useState('1h 30m');
  const [createMore, setCreateMore] = useState(false);
  const [description, setDescription] = useState(
    'Implement refresh rotation with short-lived access JWTs. On 401 unauthenticated response, intercept request pipeline and execute queued payload replay seamlessly.',
  );

  const [subtasks, setSubtasks] = useState([
    {
      id: '1',
      title: 'Generate API token handler interceptor',
      time: '15m',
      completed: true,
    },
    {
      id: '2',
      title: 'Verify refresh token rotation and revocation logic',
      time: '30m',
      completed: false,
    },
    {
      id: '3',
      title: 'Add automated integration tests for network edge cases',
      time: '45m',
      completed: false,
    },
  ]);

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    );
  };

  const completedCount = subtasks.filter((s) => s.completed).length;

  // Visual Theme Tokens
  const surfaceBg = isDark ? '#141417' : '#ffffff';
  const cardBg = isDark ? '#1a1a1f' : '#f8fafc';
  const cardBorder = isDark ? '#27272a' : '#e2e8f0';
  const secondaryText = isDark ? '#a1a1aa' : '#64748b';
  const headerText = isDark ? '#f4f4f5' : '#0f172a';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isFullScreen}
      PaperProps={{
        sx: {
          borderRadius: isFullScreen ? 0 : '16px',
          bgcolor: surfaceBg,
          backgroundImage: 'none',
          boxShadow: isDark
            ? '0 24px 48px -12px rgba(0, 0, 0, 0.7)'
            : '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
          border: `1px solid ${cardBorder}`,
          maxHeight: isFullScreen ? '100vh' : '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── HEADER BREADCRUMBS & CONTROLS ── */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(cardBorder, 0.6)}`,
        }}
      >
        {/* Breadcrumb Context */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ minWidth: 0 }}
        >
          <Typography sx={{ fontSize: '15px' }}>{projectEmoji}</Typography>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: headerText,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {projectName}
          </Typography>
          <Typography sx={{ color: secondaryText, fontSize: '13px' }}>
            /
          </Typography>
          <Typography
            sx={{ fontSize: '13px', fontWeight: 500, color: secondaryText }}
          >
            New Task
          </Typography>
          {sprintName && (
            <Chip
              label={sprintName}
              size="small"
              sx={{
                height: 22,
                fontSize: '11px',
                fontWeight: 600,
                bgcolor: isDark ? alpha('#3b82f6', 0.15) : '#eff6ff',
                color: '#3b82f6',
                borderRadius: '6px',
                border: `1px solid ${alpha('#3b82f6', 0.3)}`,
              }}
            />
          )}
        </Stack>

        {/* Top Controls */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => setIsFullScreen(!isFullScreen)}
            sx={{ color: secondaryText, p: '6px' }}
          >
            {isFullScreen ? (
              <CloseFullscreenIcon sx={{ fontSize: 16 }} />
            ) : (
              <OpenInFullIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
          <Box
            sx={{
              px: '6px',
              py: '2px',
              borderRadius: '4px',
              bgcolor: isDark ? '#27272a' : '#f1f5f9',
              color: secondaryText,
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'monospace',
              letterSpacing: -0.5,
            }}
          >
            ⌘↵
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: secondaryText, p: '6px' }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* ── SCROLLABLE BODY ── */}
      <Box
        sx={{
          px: 3.5,
          py: 3,
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Task Title (Borderless Linear-style input) */}
        <Box>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Implement OAuth token refresh flow"
            style={{
              width: '100%',
              fontSize: '22px',
              fontWeight: 700,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: headerText,
              fontFamily: 'inherit',
              padding: 0,
            }}
          />
        </Box>

        {/* ── METADATA ATTRIBUTES GRID ── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.5,
            bgcolor: cardBg,
            borderRadius: '12px',
            p: 1.5,
            border: `1px solid ${cardBorder}`,
          }}
        >
          {/* Status */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.8,
              borderRadius: '8px',
              bgcolor: isDark ? '#232328' : '#ffffff',
              border: `1px solid ${alpha(cardBorder, 0.8)}`,
              cursor: 'pointer',
              '&:hover': { borderColor: '#3b82f6' },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <StatusIcon sx={{ fontSize: 15, color: secondaryText }} />
              <Typography
                sx={{ fontSize: '12px', color: secondaryText, fontWeight: 500 }}
              >
                Status
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: '#3b82f6',
                }}
              />
              <Typography
                sx={{ fontSize: '12px', fontWeight: 600, color: headerText }}
              >
                {status}
              </Typography>
              <Typography sx={{ fontSize: '10px', color: secondaryText }}>
                ▼
              </Typography>
            </Stack>
          </Box>

          {/* Priority */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.8,
              borderRadius: '8px',
              bgcolor: isDark ? '#232328' : '#ffffff',
              border: `1px solid ${alpha(cardBorder, 0.8)}`,
              cursor: 'pointer',
              '&:hover': { borderColor: '#f59e0b' },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <FlagIcon sx={{ fontSize: 15, color: secondaryText }} />
              <Typography
                sx={{ fontSize: '12px', color: secondaryText, fontWeight: 500 }}
              >
                Priority
              </Typography>
            </Stack>
            <Box
              sx={{
                px: 1,
                py: '2px',
                borderRadius: '6px',
                bgcolor: isDark ? alpha('#f59e0b', 0.18) : '#fef3c7',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              <span>▲</span>
              <span>{priority}</span>
              <span style={{ fontSize: '9px', opacity: 0.8 }}>▼</span>
            </Box>
          </Box>

          {/* Assignee */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.8,
              borderRadius: '8px',
              bgcolor: isDark ? '#232328' : '#ffffff',
              border: `1px solid ${alpha(cardBorder, 0.8)}`,
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <PersonIcon sx={{ fontSize: 15, color: secondaryText }} />
              <Typography
                sx={{ fontSize: '12px', color: secondaryText, fontWeight: 500 }}
              >
                Assignee
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: '9px',
                  fontWeight: 700,
                  bgcolor: '#ea580c',
                  color: '#ffffff',
                }}
              >
                {assignee.initials}
              </Avatar>
              <Typography
                sx={{ fontSize: '12px', fontWeight: 600, color: headerText }}
              >
                {assignee.name}
              </Typography>
              <Typography sx={{ fontSize: '10px', color: secondaryText }}>
                ▼
              </Typography>
            </Stack>
          </Box>

          {/* Module / Tags */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.8,
              borderRadius: '8px',
              bgcolor: isDark ? '#232328' : '#ffffff',
              border: `1px solid ${alpha(cardBorder, 0.8)}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <TagIcon sx={{ fontSize: 15, color: secondaryText }} />
              <Typography
                sx={{ fontSize: '12px', color: secondaryText, fontWeight: 500 }}
              >
                Module
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.6}>
              {modules.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '10.5px',
                    fontWeight: 600,
                    bgcolor: isDark ? alpha('#6366f1', 0.18) : '#eff6ff',
                    color: isDark ? '#a5b4fc' : '#2563eb',
                    borderRadius: '4px',
                  }}
                />
              ))}
              <IconButton size="small" sx={{ p: '2px', color: secondaryText }}>
                <AddIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        {/* ── SCHEDULE & EXECUTION ── */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: cardBg,
            border: `1px solid ${cardBorder}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <ClockIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: secondaryText,
                  textTransform: 'uppercase',
                }}
              >
                Schedule & Execution
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '11px', color: secondaryText }}>
              Auto-synced to Daily Plan
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
            }}
          >
            {/* Due Date */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: '8px',
                bgcolor: isDark ? '#232328' : '#ffffff',
                border: `1px solid ${alpha(cardBorder, 0.8)}`,
              }}
            >
              <CalendarIcon sx={{ fontSize: 18, color: secondaryText }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: '10.5px',
                    color: secondaryText,
                    textTransform: 'uppercase',
                  }}
                >
                  Due Date
                </Typography>
                <Typography
                  sx={{ fontSize: '13px', fontWeight: 600, color: headerText }}
                >
                  {dueDate}
                </Typography>
              </Box>
            </Box>

            {/* Estimated Duration */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: '8px',
                bgcolor: isDark ? '#232328' : '#ffffff',
                border: `1px solid ${alpha(cardBorder, 0.8)}`,
              }}
            >
              <TimerIcon sx={{ fontSize: 18, color: secondaryText }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: '10.5px',
                    color: secondaryText,
                    textTransform: 'uppercase',
                  }}
                >
                  Estimated Duration
                </Typography>
                <Typography
                  sx={{ fontSize: '13px', fontWeight: 600, color: headerText }}
                >
                  {estimatedDuration}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── LINKED SPEC & PRD ANCHOR (DDD Bridge) ── */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: cardBg,
            border: `1px solid ${cardBorder}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <DocIcon sx={{ fontSize: 15, color: '#6366f1' }} />
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: secondaryText,
                  textTransform: 'uppercase',
                }}
              >
                Linked Spec & PRD Anchor
              </Typography>
            </Stack>
            <Button
              size="small"
              startIcon={<SearchIcon sx={{ fontSize: 13 }} />}
              sx={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'none',
                color: '#3b82f6',
                p: '2px 6px',
                minWidth: 0,
              }}
            >
              Link Note
            </Button>
          </Box>

          {/* Linked Note Item Card */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: '8px',
              bgcolor: isDark ? '#232328' : '#ffffff',
              border: `1px solid ${alpha(cardBorder, 0.8)}`,
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
              '&:hover': {
                borderColor: '#3b82f6',
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '6px',
                  bgcolor: isDark ? alpha('#6366f1', 0.15) : '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4f46e5',
                }}
              >
                <DocIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography
                  sx={{ fontSize: '13px', fontWeight: 600, color: headerText }}
                >
                  {linkedSpecTitle}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: secondaryText }}>
                  {linkedSpecSection}
                </Typography>
              </Box>
            </Stack>
            <ExternalLinkIcon sx={{ fontSize: 15, color: secondaryText }} />
          </Box>
        </Box>

        {/* ── DESCRIPTION & CONTEXT ── */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: secondaryText,
                textTransform: 'uppercase',
              }}
            >
              Description & Context
            </Typography>

            {/* Formatting Toolbar */}
            <Stack direction="row" spacing={0.4} alignItems="center">
              {[BoldIcon, ItalicIcon, CodeIcon, ListIcon, LinkIcon].map(
                (Icon, idx) => (
                  <IconButton
                    key={idx}
                    size="small"
                    sx={{
                      p: '4px',
                      color: secondaryText,
                      borderRadius: '4px',
                      '&:hover': { color: headerText, bgcolor: cardBg },
                    }}
                  >
                    <Icon sx={{ fontSize: 15 }} />
                  </IconButton>
                ),
              )}
            </Stack>
          </Box>

          <Box
            component="textarea"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            rows={3}
            style={{
              width: '100%',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '13px',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              border: `1px solid ${cardBorder}`,
              backgroundColor: cardBg,
              color: headerText,
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </Box>

        {/* ── SUBTASKS (MICRO-DESGLOSE CON TIEMPOS) ── */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.2,
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: secondaryText,
                textTransform: 'uppercase',
              }}
            >
              Subtasks ({completedCount}/{subtasks.length} Completed)
            </Typography>
            <Typography
              sx={{ fontSize: '11px', color: secondaryText, fontWeight: 500 }}
            >
              90m Total
            </Typography>
          </Box>

          <Stack spacing={1}>
            {subtasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: '10px 14px',
                  borderRadius: '8px',
                  bgcolor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#232328' : '#f1f5f9',
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.2}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <DragIcon
                    sx={{
                      fontSize: 16,
                      color: alpha(secondaryText, 0.6),
                      cursor: 'grab',
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => toggleSubtask(task.id)}
                    sx={{
                      p: 0,
                      color: task.completed ? '#2563eb' : secondaryText,
                    }}
                  >
                    {task.completed ? (
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: '#2563eb' }}
                      />
                    ) : (
                      <UncheckedIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: task.completed ? secondaryText : headerText,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {task.title}
                  </Typography>
                </Stack>

                <Chip
                  label={task.time}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '11px',
                    fontWeight: 600,
                    bgcolor: isDark ? '#27272a' : '#ffffff',
                    color: secondaryText,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '6px',
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* ── FOOTER ACTIONS BAR ── */}
      <Box
        sx={{
          px: 3.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${alpha(cardBorder, 0.8)}`,
          bgcolor: isDark ? '#17171b' : '#fafafa',
        }}
      >
        {/* Lumina AI Breakdown Trigger */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<SparklesIcon sx={{ fontSize: 15, color: '#7c3aed' }} />}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '12px',
            fontWeight: 600,
            color: isDark ? '#c4b5fd' : '#6d28d9',
            borderColor: isDark
              ? alpha('#7c3aed', 0.4)
              : alpha('#7c3aed', 0.25),
            bgcolor: isDark ? alpha('#7c3aed', 0.1) : '#f5f3ff',
            px: 1.8,
            py: 0.6,
            '&:hover': {
              bgcolor: isDark ? alpha('#7c3aed', 0.2) : '#ede9fe',
              borderColor: '#7c3aed',
            },
          }}
        >
          Lumina AI Breakdown
        </Button>

        {/* Actions on the Right */}
        <Stack direction="row" alignItems="center" spacing={2.5}>
          {/* Create More Checkbox */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            onClick={() => setCreateMore(!createMore)}
            sx={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <Checkbox
              size="small"
              checked={createMore}
              sx={{
                p: 0.5,
                color: secondaryText,
                '&.Mui-checked': { color: '#2563eb' },
              }}
            />
            <Typography
              sx={{ fontSize: '12.5px', color: secondaryText, fontWeight: 500 }}
            >
              Create more
            </Typography>
          </Stack>

          <Button
            size="small"
            onClick={onClose}
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: secondaryText,
              '&:hover': { color: headerText, bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>

          {/* Primary Action Button */}
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              if (onCreate) {
                onCreate({
                  title,
                  status,
                  priority,
                  assignee,
                  modules,
                  dueDate,
                  estimatedDuration,
                  description,
                  subtasks,
                });
              }
              if (!createMore) onClose();
            }}
            sx={{
              bgcolor: '#2563eb',
              color: '#ffffff',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              px: 2.2,
              py: 0.8,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                bgcolor: '#1d4ed8',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)',
              },
            }}
          >
            <span>Create Task</span>
            <Box
              sx={{
                px: '5px',
                py: '1px',
                borderRadius: '4px',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '10px',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            >
              ⌘↵
            </Box>
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default CreateProjectTaskModal;
