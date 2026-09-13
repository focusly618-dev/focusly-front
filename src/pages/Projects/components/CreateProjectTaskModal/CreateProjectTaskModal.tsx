import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Checkbox,
  Stack,
  Menu,
  MenuItem,
  CircularProgress,
  InputBase,
  Divider,
  Tooltip,
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
  LocalOfferOutlined as TagIcon,
  SyncAlt as StatusIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Check as CheckIcon,
  DeleteOutline as DeleteOutlineIcon,
} from '@mui/icons-material';
import { sileo, UNTITLED_WORKSPACE_TITLE } from '@/utils';
import { GET_WORKSPACES } from '@/pages/Workspace/Workspace.graphql';
import {
  PRIORITY_OPTIONS,
  PriorityBadge,
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
} from '@/components/ui';
import type {
  CreateProjectTaskModalProps,
  ProjectOption,
} from './CreateProjectTaskModal.types';

const STATUS_OPTIONS = [
  { id: 'backlog', label: 'Backlog', color: '#64748b' },
  { id: 'todo', label: 'To Do', color: '#94a3b8' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'review', label: 'Review', color: '#8b5cf6' },
  { id: 'done', label: 'Done', color: '#10b981' },
];

const DURATION_OPTIONS = [
  '15m',
  '30m',
  '45m',
  '1h',
  '1h 30m',
  '2h',
  '3h',
  '4h',
];

export const CreateProjectTaskModal: React.FC<CreateProjectTaskModalProps> = ({
  open,
  onClose,
  task,
  projects,
  selectedProjectId,
  projectName = 'Select Project',
  projectEmoji = '📁',
  sprintName,
  linkedSpecTitle,
  linkedSpecSection,
  linkedWorkspaceId,
  defaultStatus,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isEditing = Boolean(task);

  const [selectedProjectOverride, setSelectedProjectOverride] = useState<
    ProjectOption | undefined
  >(undefined);
  const [projectMenuAnchor, setProjectMenuAnchor] =
    useState<null | HTMLElement>(null);

  const selectedProject =
    selectedProjectOverride ||
    (selectedProjectId && projects
      ? projects.find((p) => p.id === selectedProjectId)
      : projects?.[0]);

  const currentProjectName = selectedProject?.name || projectName;
  const currentProjectColor = selectedProject?.color || '#3b82f6';
  const currentProjectEmoji =
    selectedProject?.emoji ||
    (projectEmoji !== '📁' ? projectEmoji : undefined);
  const isCurrentEmojiCustom = isCustomEmoji(currentProjectEmoji);
  const isCurrentOutlined = currentProjectEmoji === 'outlined';
  const hasProjects = Boolean(projects && projects.length > 0);
  const isMultipleProjects = Boolean(projects && projects.length > 1);

  // ── Workspaces for Linked Spec & PRD Anchor ──
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    linkedWorkspaceId || null,
  );
  const [workspaceMenuAnchor, setWorkspaceMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [workspaceSearch, setWorkspaceSearch] = useState('');

  const { data: workspacesData, loading: loadingWorkspaces } = useQuery(
    GET_WORKSPACES,
    {
      variables: {
        projectId: selectedProject?.id || undefined,
        limit: 50,
        offset: 0,
      },
      skip: !open,
      fetchPolicy: 'cache-and-network',
    },
  );

  const availableWorkspaces: Array<{
    id: string;
    title: string;
    emoji?: string;
    projectId?: string;
    updatedAt?: string;
  }> = useMemo(() => {
    return workspacesData?.result?.workspaces || [];
  }, [workspacesData]);

  const filteredWorkspaces = useMemo(() => {
    if (!workspaceSearch.trim()) return availableWorkspaces;
    const lower = workspaceSearch.toLowerCase();
    return availableWorkspaces.filter(
      (w) =>
        (w.title && w.title.toLowerCase().includes(lower)) ||
        (w.emoji && w.emoji.includes(lower)),
    );
  }, [availableWorkspaces, workspaceSearch]);

  const selectedWorkspace = useMemo(() => {
    if (selectedWorkspaceId) {
      return (
        availableWorkspaces.find((w) => w.id === selectedWorkspaceId) || null
      );
    }
    return null;
  }, [availableWorkspaces, selectedWorkspaceId]);

  const isWorkspaceLinked = Boolean(
    selectedWorkspace || selectedWorkspaceId || linkedSpecTitle,
  );
  const displayWorkspaceTitle =
    selectedWorkspace?.title?.trim() ||
    linkedSpecTitle?.trim() ||
    (selectedWorkspaceId ? UNTITLED_WORKSPACE_TITLE : '');
  const displayWorkspaceSection = selectedWorkspace
    ? currentProjectName
    : linkedSpecSection || currentProjectName;
  const displayWorkspaceEmoji = selectedWorkspace?.emoji || '📄';

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<string>(defaultStatus || 'in_progress');
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const [priority, setPriority] = useState<string>('Medium');
  const [priorityMenuAnchor, setPriorityMenuAnchor] =
    useState<null | HTMLElement>(null);

  const [modules, setModules] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const [dueDate, setDueDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('30m');
  const [durationMenuAnchor, setDurationMenuAnchor] =
    useState<null | HTMLElement>(null);

  const [createMore, setCreateMore] = useState(false);
  const [description, setDescription] = useState('');

  const [subtasks, setSubtasks] = useState<
    Array<{
      id: string;
      title: string;
      time?: string;
      completed?: boolean;
    }>
  >([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskTime, setNewSubtaskTime] = useState('15m');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Sync Form with Passed Task (or Reset for New Task) ──
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStatus(task.status || defaultStatus || 'in_progress');
        setPriority(task.priority || 'Medium');

        // Due date: YYYY-MM-DD for date input
        if (task.rawDeadline) {
          try {
            setDueDate(new Date(task.rawDeadline).toISOString().slice(0, 10));
          } catch {
            setDueDate(task.rawDeadline.slice(0, 10));
          }
        } else if (task.dueDate && /^\d{4}-\d{2}-\d{2}/.test(task.dueDate)) {
          setDueDate(task.dueDate.slice(0, 10));
        } else {
          setDueDate('');
        }

        setEstimatedDuration(task.duration || '30m');
        setModules(
          task.modules && task.modules.length > 0
            ? task.modules
            : task.tag
              ? [task.tag]
              : [],
        );
        setSubtasks(
          (task.subtasks || []).map((s) => ({
            id: s.id,
            title: s.title,
            time: s.duration || '15m',
            completed: Boolean(s.completed),
          })),
        );
        setSelectedWorkspaceId(task.workspaceId || linkedWorkspaceId || null);

        const matchedProject = projects?.find(
          (p) => p.id === task.projectId || p.id === task.project?.id,
        );
        if (matchedProject) {
          setSelectedProjectOverride(matchedProject);
        } else if (selectedProjectId && projects) {
          setSelectedProjectOverride(
            projects.find((p) => p.id === selectedProjectId),
          );
        } else {
          setSelectedProjectOverride(undefined);
        }
      } else {
        setTitle('');
        setDescription('');
        setStatus(defaultStatus || 'in_progress');
        setPriority('Medium');
        setDueDate('');
        setEstimatedDuration('30m');
        setModules([]);
        setSubtasks([]);
        setSelectedWorkspaceId(linkedWorkspaceId || null);
        if (selectedProjectId && projects) {
          setSelectedProjectOverride(
            projects.find((p) => p.id === selectedProjectId),
          );
        } else {
          setSelectedProjectOverride(undefined);
        }
      }
    }
  }, [
    open,
    task,
    linkedWorkspaceId,
    defaultStatus,
    selectedProjectId,
    projects,
  ]);

  const currentStatusConfig =
    STATUS_OPTIONS.find(
      (s) => s.id === status || s.label.toLowerCase() === status.toLowerCase(),
    ) || STATUS_OPTIONS[2];

  const currentPriorityConfig =
    PRIORITY_OPTIONS.find(
      (p) =>
        p.id.toLowerCase() === priority.toLowerCase() ||
        p.label.toLowerCase() === priority.toLowerCase(),
    ) || PRIORITY_OPTIONS[1];

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: `st-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        time: newSubtaskTime || '15m',
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !modules.includes(trimmed)) {
      setModules((prev) => [...prev, trimmed]);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setModules((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      sileo.warning({
        title: 'Title required',
        description: 'Please enter a title for the task.',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        status: currentStatusConfig.id,
        priority: currentPriorityConfig.id,
        modules,
        dueDate: dueDate || undefined,
        estimatedDuration,
        description: description.trim(),
        subtasks,
        projectId: selectedProject?.id,
        workspaceId: selectedWorkspaceId || undefined,
      };

      if (isEditing && task) {
        if (onUpdate) {
          await onUpdate(task.id, payload);
        } else if (onCreate) {
          await onCreate({ ...payload, id: task.id });
        }
        sileo.success({
          title: 'Task updated',
          description: `"${title.trim()}" saved successfully.`,
          duration: 2500,
        });
        onClose();
      } else {
        if (onCreate) {
          await onCreate(payload);
        }

        if (createMore) {
          setTitle('');
          setDescription('');
          setSubtasks([]);
          setModules([]);
        } else {
          onClose();
        }
      }
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task?.id || !onDelete) return;
    setIsSubmitting(true);
    try {
      await onDelete(task.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCreateTask();
    }
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
      onKeyDown={handleKeyDown}
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
          {/* Project Selector Trigger */}
          <Box
            onClick={(e) => {
              if (hasProjects) {
                setProjectMenuAnchor(e.currentTarget);
              }
            }}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.9,
              cursor: hasProjects ? 'pointer' : 'default',
              px: 1,
              py: 0.45,
              height: 30,
              borderRadius: '8px',
              bgcolor: isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0.03)',
              border: `1px solid ${
                projectMenuAnchor
                  ? alpha(currentProjectColor, 0.5)
                  : isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.08)'
              }`,
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': hasProjects
                ? {
                    bgcolor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                    borderColor: alpha(currentProjectColor, 0.35),
                  }
                : {},
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '5px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(currentProjectColor, isDark ? 0.2 : 0.12),
                color: currentProjectColor,
                flexShrink: 0,
              }}
            >
              {isCurrentEmojiCustom ? (
                <Typography sx={{ fontSize: '12px', lineHeight: 1 }}>
                  {currentProjectEmoji}
                </Typography>
              ) : isCurrentOutlined ? (
                <ModernFolderOutlinedIcon sx={{ fontSize: 13 }} />
              ) : (
                <ModernFolderFilledIcon sx={{ fontSize: 13 }} />
              )}
            </Box>

            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: headerText,
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {currentProjectName}
            </Typography>

            {isMultipleProjects && (
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 15,
                  color: secondaryText,
                  opacity: 0.7,
                  ml: -0.2,
                  transition: 'transform 0.15s ease',
                  transform: projectMenuAnchor ? 'rotate(180deg)' : 'none',
                }}
              />
            )}
          </Box>

          {/* Project Selector Menu */}
          <Menu
            anchorEl={projectMenuAnchor}
            open={Boolean(projectMenuAnchor)}
            onClose={() => setProjectMenuAnchor(null)}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                borderRadius: '12px',
                mt: 0.75,
                bgcolor: isDark ? '#18181b' : '#ffffff',
                backgroundImage: 'none',
                border: `1px solid ${
                  isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
                }`,
                boxShadow: isDark
                  ? '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05)'
                  : '0 12px 28px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.04)',
                minWidth: 220,
                maxWidth: 280,
                maxHeight: 340,
                p: 0.75,
              },
            }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: secondaryText,
                  letterSpacing: '0.06em',
                }}
              >
                Select Project
              </Typography>
              {projects && projects.length > 0 && (
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: secondaryText,
                    bgcolor: isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.05)',
                    px: 0.75,
                    py: 0.1,
                    borderRadius: '10px',
                  }}
                >
                  {projects.length}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                height: '1px',
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'rgba(0, 0, 0, 0.06)',
                my: 0.5,
              }}
            />

            {projects && projects.length > 0 ? (
              projects.map((proj) => {
                const isSelected = proj.id === selectedProject?.id;
                const projColor = proj.color || '#3b82f6';
                const projHasCustomEmoji = isCustomEmoji(proj.emoji);
                const projIsOutlined = proj.emoji === 'outlined';

                return (
                  <MenuItem
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectOverride(proj);
                      setProjectMenuAnchor(null);
                    }}
                    selected={isSelected}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      py: 0.85,
                      px: 1.2,
                      my: 0.25,
                      borderRadius: '8px',
                      transition: 'all 0.15s ease',
                      '&.Mui-selected': {
                        bgcolor: isDark
                          ? 'rgba(255, 255, 255, 0.07)'
                          : 'rgba(0, 0, 0, 0.05)',
                        '&:hover': {
                          bgcolor: isDark
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.08)',
                        },
                      },
                      '&:hover': {
                        bgcolor: isDark
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(projColor, isDark ? 0.2 : 0.12),
                        color: projColor,
                        flexShrink: 0,
                      }}
                    >
                      {projHasCustomEmoji ? (
                        <Typography sx={{ fontSize: '13px', lineHeight: 1 }}>
                          {proj.emoji}
                        </Typography>
                      ) : projIsOutlined ? (
                        <ModernFolderOutlinedIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <ModernFolderFilledIcon sx={{ fontSize: 14 }} />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 500,
                        color: headerText,
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {proj.name}
                    </Typography>

                    {isSelected && (
                      <CheckCircleIcon
                        sx={{ fontSize: 16, color: 'primary.main' }}
                      />
                    )}
                  </MenuItem>
                );
              })
            ) : (
              <Box sx={{ py: 2, px: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '12px', color: secondaryText }}>
                  No projects available
                </Typography>
              </Box>
            )}
          </Menu>

          <Typography sx={{ color: secondaryText, fontSize: '13px' }}>
            /
          </Typography>
          <Typography
            sx={{ fontSize: '13px', fontWeight: 500, color: secondaryText }}
          >
            {isEditing ? 'Edit Task' : 'New Task'}
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
            placeholder="Task title..."
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
            onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.8,
              borderRadius: '8px',
              bgcolor: isDark ? '#232328' : '#ffffff',
              border: `1px solid ${statusMenuAnchor ? currentStatusConfig.color : alpha(cardBorder, 0.8)}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': { borderColor: currentStatusConfig.color },
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
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: currentStatusConfig.color,
                }}
              />
              <Typography
                sx={{ fontSize: '12px', fontWeight: 600, color: headerText }}
              >
                {currentStatusConfig.label}
              </Typography>
              <Typography sx={{ fontSize: '10px', color: secondaryText }}>
                ▼
              </Typography>
            </Stack>
          </Box>

          <Menu
            anchorEl={statusMenuAnchor}
            open={Boolean(statusMenuAnchor)}
            onClose={() => setStatusMenuAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: '10px',
                bgcolor: isDark ? '#1a1b22' : '#ffffff',
                border: `1px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 12px 32px rgba(0, 0, 0, 0.5)'
                  : '0 8px 24px rgba(0, 0, 0, 0.1)',
                minWidth: 160,
                p: 0.5,
              },
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem
                key={opt.id}
                onClick={() => {
                  setStatus(opt.id);
                  setStatusMenuAnchor(null);
                }}
                selected={currentStatusConfig.id === opt.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '13px',
                  py: 0.8,
                  borderRadius: '6px',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: opt.color,
                  }}
                />
                <Typography sx={{ fontSize: '13px', flex: 1 }}>
                  {opt.label}
                </Typography>
                {currentStatusConfig.id === opt.id && (
                  <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} />
                )}
              </MenuItem>
            ))}
          </Menu>

          {/* Priority */}
          <Box
            onClick={(e) => setPriorityMenuAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 0.8,
              borderRadius: '8px',
              bgcolor: isDark ? '#232328' : '#ffffff',
              border: `1px solid ${priorityMenuAnchor ? currentPriorityConfig.color : alpha(cardBorder, 0.8)}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': { borderColor: currentPriorityConfig.color },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <PriorityBadge priority={currentPriorityConfig.id} size={18} />
              <Typography
                sx={{ fontSize: '12px', color: secondaryText, fontWeight: 500 }}
              >
                Priority
              </Typography>
            </Stack>
            <Box
              sx={{
                px: 1,
                py: '3px',
                borderRadius: '6px',
                bgcolor: alpha(currentPriorityConfig.color, 0.12),
                color: currentPriorityConfig.color,
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <PriorityBadge priority={currentPriorityConfig.id} size={16} />
              <span>{currentPriorityConfig.label}</span>
              <span
                style={{ fontSize: '9px', opacity: 0.7, marginLeft: '2px' }}
              >
                ▼
              </span>
            </Box>
          </Box>

          <Menu
            anchorEl={priorityMenuAnchor}
            open={Boolean(priorityMenuAnchor)}
            onClose={() => setPriorityMenuAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: '10px',
                bgcolor: isDark ? '#1a1b22' : '#ffffff',
                border: `1px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 12px 32px rgba(0, 0, 0, 0.5)'
                  : '0 8px 24px rgba(0, 0, 0, 0.1)',
                minWidth: 160,
                p: 0.5,
              },
            }}
          >
            {PRIORITY_OPTIONS.map((pOpt) => (
              <MenuItem
                key={pOpt.id}
                onClick={() => {
                  setPriority(pOpt.id);
                  setPriorityMenuAnchor(null);
                }}
                selected={currentPriorityConfig.id === pOpt.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontSize: '13px',
                  py: 0.9,
                  px: 1.5,
                  borderRadius: '6px',
                }}
              >
                <PriorityBadge priority={pOpt.id} size={24} />
                <Typography sx={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>
                  {pOpt.label}
                </Typography>
                {currentPriorityConfig.id === pOpt.id && (
                  <CheckCircleIcon sx={{ fontSize: 15, color: '#10b981' }} />
                )}
              </MenuItem>
            ))}
          </Menu>

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
              gridColumn: { xs: '1', sm: '1 / -1' },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <TagIcon sx={{ fontSize: 15, color: secondaryText }} />
              <Typography
                sx={{ fontSize: '12px', color: secondaryText, fontWeight: 500 }}
              >
                Tags / Modules
              </Typography>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.6}
              flexWrap="wrap"
            >
              {modules.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  size="small"
                  onDelete={() => handleRemoveTag(m)}
                  sx={{
                    height: 22,
                    fontSize: '11px',
                    fontWeight: 600,
                    bgcolor: isDark ? alpha('#6366f1', 0.18) : '#eff6ff',
                    color: isDark ? '#a5b4fc' : '#2563eb',
                    borderRadius: '5px',
                    '& .MuiChip-deleteIcon': {
                      fontSize: 13,
                      color: 'inherit',
                      opacity: 0.7,
                      '&:hover': { opacity: 1 },
                    },
                  }}
                />
              ))}

              {isAddingTag ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <input
                    autoFocus
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      } else if (e.key === 'Escape') {
                        setIsAddingTag(false);
                      }
                    }}
                    onBlur={handleAddTag}
                    placeholder="Tag name..."
                    style={{
                      height: 22,
                      fontSize: '11px',
                      padding: '0 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDark ? '#4f46e5' : '#6366f1'}`,
                      background: isDark ? '#18181b' : '#ffffff',
                      color: headerText,
                      outline: 'none',
                      width: '90px',
                    }}
                  />
                </Box>
              ) : (
                <IconButton
                  size="small"
                  onClick={() => setIsAddingTag(true)}
                  sx={{
                    p: '3px',
                    color: secondaryText,
                    borderRadius: '4px',
                    bgcolor: isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      color: headerText,
                      bgcolor: isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
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
                p: 1.2,
                borderRadius: '8px',
                bgcolor: isDark ? '#232328' : '#ffffff',
                border: `1px solid ${alpha(cardBorder, 0.8)}`,
              }}
            >
              <CalendarIcon sx={{ fontSize: 18, color: secondaryText }} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '10.5px',
                    color: secondaryText,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Due Date
                </Typography>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: headerText,
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    padding: 0,
                    cursor: 'pointer',
                    width: '100%',
                    colorScheme: isDark ? 'dark' : 'light',
                  }}
                />
              </Box>
            </Box>

            {/* Estimated Duration */}
            <Box
              onClick={(e) => setDurationMenuAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
                p: 1.2,
                borderRadius: '8px',
                bgcolor: isDark ? '#232328' : '#ffffff',
                border: `1px solid ${durationMenuAnchor ? '#3b82f6' : alpha(cardBorder, 0.8)}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: '#3b82f6' },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <TimerIcon sx={{ fontSize: 18, color: secondaryText }} />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '10.5px',
                      color: secondaryText,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    Duration
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: headerText,
                    }}
                  >
                    {estimatedDuration || 'Set duration'}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ fontSize: '10px', color: secondaryText }}>
                ▼
              </Typography>
            </Box>

            <Menu
              anchorEl={durationMenuAnchor}
              open={Boolean(durationMenuAnchor)}
              onClose={() => setDurationMenuAnchor(null)}
              PaperProps={{
                sx: {
                  borderRadius: '10px',
                  bgcolor: isDark ? '#1a1b22' : '#ffffff',
                  border: `1px solid ${cardBorder}`,
                  minWidth: 130,
                  p: 0.5,
                },
              }}
            >
              {DURATION_OPTIONS.map((dur) => (
                <MenuItem
                  key={dur}
                  onClick={() => {
                    setEstimatedDuration(dur);
                    setDurationMenuAnchor(null);
                  }}
                  selected={estimatedDuration === dur}
                  sx={{ fontSize: '13px', py: 0.7, borderRadius: '6px' }}
                >
                  {dur}
                </MenuItem>
              ))}
            </Menu>
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
              onClick={(e) => {
                setWorkspaceSearch('');
                setWorkspaceMenuAnchor(e.currentTarget);
              }}
              startIcon={<SearchIcon sx={{ fontSize: 13 }} />}
              sx={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'none',
                color: '#3b82f6',
                p: '2px 8px',
                minWidth: 0,
                borderRadius: '6px',
                bgcolor: alpha('#3b82f6', 0.08),
                '&:hover': {
                  bgcolor: alpha('#3b82f6', 0.16),
                },
              }}
            >
              {isWorkspaceLinked ? 'Cambiar Workspace' : 'Vincular Workspace'}
            </Button>
          </Box>

          {/* Linked Workspace Item Card */}
          {isWorkspaceLinked ? (
            <Box
              onClick={(e) => {
                setWorkspaceSearch('');
                setWorkspaceMenuAnchor(e.currentTarget);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: '8px',
                bgcolor: isDark ? '#232328' : '#ffffff',
                border: `1px solid ${alpha('#6366f1', 0.35)}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#6366f1',
                  boxShadow: isDark
                    ? '0 4px 14px rgba(99, 102, 241, 0.2)'
                    : '0 4px 14px rgba(99, 102, 241, 0.12)',
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ minWidth: 0, flex: 1 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    bgcolor: isDark ? alpha('#6366f1', 0.18) : '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '17px',
                    color: '#4f46e5',
                    flexShrink: 0,
                  }}
                >
                  {displayWorkspaceEmoji}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: '13px',
                      fontWeight: 650,
                      color: headerText,
                    }}
                  >
                    {displayWorkspaceTitle}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ fontSize: '11px', color: secondaryText }}
                  >
                    {displayWorkspaceSection} • Spec / PRD
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label="Vinculado"
                  size="small"
                  sx={{
                    height: '20px',
                    fontSize: '10px',
                    fontWeight: 700,
                    bgcolor: isDark ? alpha('#10b981', 0.15) : '#d1fae5',
                    color: isDark ? '#34d399' : '#059669',
                    border: '1px solid',
                    borderColor: isDark ? alpha('#10b981', 0.3) : '#a7f3d0',
                  }}
                />
                <Tooltip title="Desvincular workspace" arrow>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorkspaceId(null);
                    }}
                    sx={{
                      p: 0.5,
                      color: secondaryText,
                      '&:hover': {
                        color: '#ef4444',
                        bgcolor: alpha('#ef4444', 0.1),
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ) : (
            /* Unlinked Empty State Card */
            <Box
              onClick={(e) => {
                setWorkspaceSearch('');
                setWorkspaceMenuAnchor(e.currentTarget);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: '8px',
                bgcolor: isDark ? alpha('#ffffff', 0.02) : '#f8fafc',
                border: `1px dashed ${alpha(cardBorder, 1.2)}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#3b82f6',
                  bgcolor: isDark
                    ? alpha('#3b82f6', 0.05)
                    : alpha('#3b82f6', 0.03),
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ minWidth: 0 }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    bgcolor: isDark ? alpha('#ffffff', 0.05) : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: secondaryText,
                    flexShrink: 0,
                  }}
                >
                  <DocIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: headerText,
                    }}
                  >
                    Ningún workspace vinculado
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: secondaryText }}>
                    Haz clic para asociar esta tarea a una especificación o nota
                  </Typography>
                </Box>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '11px',
                  textTransform: 'none',
                  borderColor: alpha(cardBorder, 1.4),
                  color: '#3b82f6',
                  p: '2px 8px',
                  borderRadius: '6px',
                  minWidth: 0,
                }}
              >
                + Seleccionar
              </Button>
            </Box>
          )}

          {/* ── Workspace Selection Dropdown Menu ── */}
          <Menu
            anchorEl={workspaceMenuAnchor}
            open={Boolean(workspaceMenuAnchor)}
            onClose={() => setWorkspaceMenuAnchor(null)}
            PaperProps={{
              sx: {
                width: 340,
                maxHeight: 380,
                borderRadius: '14px',
                p: 1,
                bgcolor: isDark ? '#1e1e24' : '#ffffff',
                border: `1px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 16px 36px rgba(0,0,0,0.6)'
                  : '0 16px 36px rgba(15,23,42,0.15)',
              },
            }}
          >
            {/* Search Input */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.8,
                mb: 1,
                borderRadius: '8px',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
              }}
            >
              <SearchIcon sx={{ fontSize: 16, color: secondaryText }} />
              <InputBase
                value={workspaceSearch}
                onChange={(e) => setWorkspaceSearch(e.target.value)}
                placeholder="Buscar workspace o nota..."
                fullWidth
                autoFocus
                sx={{
                  fontSize: '12.5px',
                  color: headerText,
                  '& input': { p: 0 },
                }}
              />
            </Box>

            {loadingWorkspaces ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2.5 }}>
                <CircularProgress size={20} />
              </Box>
            ) : filteredWorkspaces.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '12px', color: secondaryText }}>
                  {workspaceSearch
                    ? 'No se encontraron workspaces'
                    : 'No hay workspaces en este proyecto'}
                </Typography>
              </Box>
            ) : (
              filteredWorkspaces.map((ws) => {
                const isSelected = selectedWorkspaceId === ws.id;
                return (
                  <MenuItem
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspaceId(ws.id);
                      setWorkspaceMenuAnchor(null);
                      sileo.success({
                        title: 'Workspace vinculado',
                        description: ws.title || UNTITLED_WORKSPACE_TITLE,
                        duration: 2500,
                      });
                    }}
                    selected={isSelected}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '8px',
                      py: 1,
                      px: 1.25,
                      mb: 0.5,
                      bgcolor: isSelected
                        ? isDark
                          ? 'rgba(99, 102, 241, 0.18)'
                          : 'rgba(99, 102, 241, 0.08)'
                        : 'transparent',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.2}
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: '6px',
                          bgcolor: isDark
                            ? 'rgba(255,255,255,0.06)'
                            : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          flexShrink: 0,
                        }}
                      >
                        {ws.emoji || '📄'}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '12.5px',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#6366f1' : headerText,
                          }}
                        >
                          {ws.title || UNTITLED_WORKSPACE_TITLE}
                        </Typography>
                        {currentProjectName && (
                          <Typography
                            noWrap
                            sx={{ fontSize: '10.5px', color: secondaryText }}
                          >
                            {currentProjectName}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    {isSelected && (
                      <CheckIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                    )}
                  </MenuItem>
                );
              })
            )}

            {selectedWorkspaceId && (
              <>
                <Divider sx={{ my: 0.75 }} />
                <MenuItem
                  onClick={() => {
                    setSelectedWorkspaceId(null);
                    setWorkspaceMenuAnchor(null);
                  }}
                  sx={{
                    borderRadius: '8px',
                    py: 0.75,
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                  Desvincular workspace
                </MenuItem>
              </>
            )}
          </Menu>
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
            placeholder="Add a more detailed description..."
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

        {/* ── SUBTASKS ── */}
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
              Subtasks{' '}
              {subtasks.length > 0 && `(${completedCount}/${subtasks.length})`}
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
                  p: '8px 12px',
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

                <Stack direction="row" alignItems="center" spacing={1}>
                  {task.time && (
                    <Chip
                      label={task.time}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '10.5px',
                        fontWeight: 600,
                        bgcolor: isDark ? '#27272a' : '#ffffff',
                        color: secondaryText,
                        border: `1px solid ${cardBorder}`,
                        borderRadius: '5px',
                      }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveSubtask(task.id)}
                    sx={{
                      p: '2px',
                      color: secondaryText,
                      '&:hover': { color: '#ef4444' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Stack>
              </Box>
            ))}

            {/* Quick Add Subtask Input */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.6,
                borderRadius: '8px',
                border: `1px dashed ${alpha(cardBorder, 0.9)}`,
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.01)',
              }}
            >
              <AddIcon sx={{ fontSize: 16, color: secondaryText }} />
              <input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask... (Press Enter)"
                style={{
                  flex: 1,
                  fontSize: '12.5px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: headerText,
                  fontFamily: 'inherit',
                  padding: '4px 0',
                }}
              />
              <select
                value={newSubtaskTime}
                onChange={(e) => setNewSubtaskTime(e.target.value)}
                style={{
                  fontSize: '11px',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  border: `1px solid ${cardBorder}`,
                  background: isDark ? '#27272a' : '#ffffff',
                  color: secondaryText,
                  outline: 'none',
                }}
              >
                <option value="10m">10m</option>
                <option value="15m">15m</option>
                <option value="30m">30m</option>
                <option value="45m">45m</option>
                <option value="1h">1h</option>
              </select>
              <Button
                size="small"
                variant="text"
                onClick={handleAddSubtask}
                disabled={!newSubtaskTitle.trim()}
                sx={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  textTransform: 'none',
                  py: 0.2,
                  px: 1,
                  minWidth: 'auto',
                }}
              >
                Add
              </Button>
            </Box>
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
          {/* Delete Button (Editing mode) */}
          {isEditing && onDelete && (
            <Tooltip title="Eliminar tarea">
              <IconButton
                size="small"
                onClick={handleDeleteTask}
                disabled={isSubmitting}
                sx={{
                  color: '#ef4444',
                  p: 0.8,
                  borderRadius: '8px',
                  bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fecaca',
                  },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Create More Checkbox (Creation mode only) */}
          {!isEditing && (
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
                sx={{
                  fontSize: '12.5px',
                  color: secondaryText,
                  fontWeight: 500,
                }}
              >
                Create more
              </Typography>
            </Stack>
          )}

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
            id="modal-submit-create-task-btn"
            variant="contained"
            size="small"
            disabled={isSubmitting || !title.trim()}
            onClick={handleCreateTask}
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
              '&.Mui-disabled': {
                bgcolor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
                color: isDark
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={16} sx={{ color: '#ffffff' }} />
            ) : (
              <>
                <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
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
              </>
            )}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default CreateProjectTaskModal;
