import React from 'react';
import { useTranslation } from 'react-i18next';
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
  alpha,
  useTheme,
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
import {
  PriorityBadge,
  ModernFolderFilledIcon,
  ModernFolderOutlinedIcon,
  isCustomEmoji,
  PRIORITY_OPTIONS,
} from '@/components/ui';
import { sileo, UNTITLED_WORKSPACE_TITLE } from '@/utils';
import type { CreateProjectTaskModalProps } from './CreateProjectTaskModal.types';
import {
  useCreateProjectTaskModal,
  STATUS_OPTIONS,
  DURATION_OPTIONS,
} from './useCreateProjectTaskModal.hook';
import { surfaceColor } from '@/context';
import { ConfirmDeleteDialog } from '../../modals/ConfirmDeleteDialog/ConfirmDeleteDialog';

export const CreateProjectTaskModal: React.FC<CreateProjectTaskModalProps> = (
  props,
) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    // Theme
    isDark,
    themeTokens,

    // Editing
    isEditing,

    // Project
    selectedProject,
    setSelectedProjectOverride,
    projectMenuAnchor,
    setProjectMenuAnchor,
    currentProjectName,
    currentProjectColor,
    currentProjectEmoji,
    isCurrentEmojiCustom,
    isCurrentOutlined,
    hasProjects,
    isMultipleProjects,

    // Workspace
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    workspaceMenuAnchor,
    setWorkspaceMenuAnchor,
    workspaceSearch,
    setWorkspaceSearch,
    loadingWorkspaces,
    filteredWorkspaces,
    isWorkspaceLinked,
    displayWorkspaceTitle,
    displayWorkspaceSection,
    displayWorkspaceEmoji,
    isCreateWorkspaceDialogOpen,
    setIsCreateWorkspaceDialogOpen,
    newWorkspaceTitle,
    setNewWorkspaceTitle,
    isCreatingWorkspace,
    handleCreateWorkspace,

    // Form
    isFullScreen,
    setIsFullScreen,
    title,
    setTitle,
    setStatus,
    statusMenuAnchor,
    setStatusMenuAnchor,
    setPriority,
    priorityMenuAnchor,
    setPriorityMenuAnchor,
    modules,
    newTagInput,
    setNewTagInput,
    isAddingTag,
    setIsAddingTag,
    dueDate,
    setDueDate,
    estimatedDuration,
    setEstimatedDuration,
    durationMenuAnchor,
    setDurationMenuAnchor,
    createMore,
    setCreateMore,
    description,
    setDescription,
    subtasks,
    newSubtaskTitle,
    setNewSubtaskTitle,
    newSubtaskTime,
    setNewSubtaskTime,
    isSubmitting,

    // Derived
    currentStatusConfig,
    currentPriorityConfig,
    completedCount,

    // Handlers
    toggleSubtask,
    handleAddSubtask,
    handleRemoveSubtask,
    handleAddTag,
    handleRemoveTag,
    handleCreateTask,
    handleDeleteTask,
    confirmDeleteTask,
    isDeleteConfirmOpen,
    closeDeleteConfirm,
    handleKeyDown,
    handleRedirectWorkspace,
  } = useCreateProjectTaskModal(props);

  const { open, onClose, sprintName, projects, onDelete } = props;

  // Visual Theme Tokens
  const surfaceBg = themeTokens.surfaceBg;
  const cardBg = themeTokens.cardBg;
  const cardBorder = themeTokens.cardBorder;
  const secondaryText = themeTokens.secondaryText;
  const headerText = themeTokens.headerText;

  return (
    <>
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
                  bgcolor: surfaceColor(theme, '#18181b', '#222222', '#ffffff'),
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
                    {t('projects.noProjects', 'No projects available')}
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
              {isEditing
                ? t('tasks.actions.editTask', 'Edit Task')
                : t('tasks.header.newTask', 'New Task')}
            </Typography>
            {sprintName && (
              <Chip
                label={sprintName}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '11px',
                  fontWeight: 600,
                  bgcolor: isDark ? alpha('#008767', 0.15) : '#ecfdf5',
                  color: '#008767',
                  borderRadius: '6px',
                  border: `1px solid ${alpha('#008767', 0.3)}`,
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
                bgcolor: surfaceColor(theme, '#27272a', '#333333', '#f1f5f9'),
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
              placeholder={t('tasks.createProjectTaskModal.titlePlaceholder')}
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
                bgcolor: surfaceColor(theme, '#232328', '#2F2F2F', '#ffffff'),
                border: `1px solid ${statusMenuAnchor ? currentStatusConfig.color : alpha(cardBorder, 0.8)}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: currentStatusConfig.color },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <StatusIcon sx={{ fontSize: 15, color: secondaryText }} />
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: secondaryText,
                    fontWeight: 500,
                  }}
                >
                  {t('tasks.createProjectTaskModal.status')}
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
                  {t(currentStatusConfig.labelKey, {
                    defaultValue: currentStatusConfig.label,
                  })}
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
                  bgcolor: surfaceColor(theme, '#1a1b22', '#262626', '#ffffff'),
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
                    {t(opt.labelKey, { defaultValue: opt.label })}
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
                bgcolor: surfaceColor(theme, '#232328', '#2F2F2F', '#ffffff'),
                border: `1px solid ${priorityMenuAnchor ? currentPriorityConfig.color : alpha(cardBorder, 0.8)}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: currentPriorityConfig.color },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <PriorityBadge priority={currentPriorityConfig.id} size={18} />
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: secondaryText,
                    fontWeight: 500,
                  }}
                >
                  {t('tasks.createProjectTaskModal.priority')}
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
                <span>
                  {t(`tasks.priorities.${currentPriorityConfig.id}`, {
                    defaultValue: currentPriorityConfig.label,
                  })}
                </span>
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
                  bgcolor: surfaceColor(theme, '#1a1b22', '#262626', '#ffffff'),
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
                  <Typography
                    sx={{ fontSize: '13px', fontWeight: 500, flex: 1 }}
                  >
                    {t(`tasks.priorities.${pOpt.id}`, {
                      defaultValue: pOpt.label,
                    })}
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
                bgcolor: surfaceColor(theme, '#232328', '#2F2F2F', '#ffffff'),
                border: `1px solid ${alpha(cardBorder, 0.8)}`,
                gridColumn: { xs: '1', sm: '1 / -1' },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <TagIcon sx={{ fontSize: 15, color: secondaryText }} />
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: secondaryText,
                    fontWeight: 500,
                  }}
                >
                  {t('tasks.createProjectTaskModal.tagsModules')}
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
                      bgcolor: isDark ? alpha('#008767', 0.18) : '#ecfdf5',
                      color: isDark ? '#10B981' : '#008767',
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
                      placeholder={t(
                        'tasks.createProjectTaskModal.tagPlaceholder',
                      )}
                      style={{
                        height: 22,
                        fontSize: '11px',
                        padding: '0 8px',
                        borderRadius: '4px',
                        border: `1px solid ${isDark ? '#007357' : '#008767'}`,
                        background: surfaceColor(
                          theme,
                          '#18181b',
                          '#222222',
                          '#ffffff',
                        ),
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
                <ClockIcon sx={{ fontSize: 14, color: '#008767' }} />
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: secondaryText,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('tasks.createProjectTaskModal.scheduleExecution')}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '11px', color: secondaryText }}>
                {t('tasks.createProjectTaskModal.autoSynced')}
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
                  bgcolor: surfaceColor(theme, '#232328', '#2F2F2F', '#ffffff'),
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
                    {t('tasks.createProjectTaskModal.dueDate')}
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
                  bgcolor: surfaceColor(theme, '#232328', '#2F2F2F', '#ffffff'),
                  border: `1px solid ${durationMenuAnchor ? '#008767' : alpha(cardBorder, 0.8)}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: '#008767' },
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
                      {t('tasks.createProjectTaskModal.duration')}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: headerText,
                      }}
                    >
                      {estimatedDuration ||
                        t('tasks.createProjectTaskModal.setDuration')}
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
                    bgcolor: surfaceColor(
                      theme,
                      '#1a1b22',
                      '#262626',
                      '#ffffff',
                    ),
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
                <DocIcon sx={{ fontSize: 15, color: '#008767' }} />
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: secondaryText,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('tasks.createProjectTaskModal.linkedSpec')}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Button
                  size="small"
                  onClick={() => {
                    setNewWorkspaceTitle('');
                    setIsCreateWorkspaceDialogOpen(true);
                  }}
                  startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                  sx={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'none',
                    color: '#008767',
                    p: '2px 8px',
                    minWidth: 0,
                    borderRadius: '6px',
                    bgcolor: alpha('#008767', 0.08),
                    '&:hover': {
                      bgcolor: alpha('#008767', 0.16),
                    },
                  }}
                >
                  {t('tasks.createProjectTaskModal.createWorkspace')}
                </Button>
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
                    color: '#008767',
                    p: '2px 8px',
                    minWidth: 0,
                    borderRadius: '6px',
                    bgcolor: alpha('#008767', 0.08),
                    '&:hover': {
                      bgcolor: alpha('#008767', 0.16),
                    },
                  }}
                >
                  {isWorkspaceLinked
                    ? t('tasks.createProjectTaskModal.changeWorkspace')
                    : t('tasks.createProjectTaskModal.linkWorkspace')}
                </Button>
              </Stack>
            </Box>

            {/* Linked Workspace Item Card */}
            {isWorkspaceLinked ? (
              <Box
                onClick={() => handleRedirectWorkspace()}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: '8px',
                  bgcolor: surfaceColor(theme, '#232328', '#2F2F2F', '#ffffff'),
                  border: `1px solid ${alpha('#008767', 0.35)}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#008767',
                    boxShadow: isDark
                      ? '0 4px 14px rgba(0, 135, 103, 0.2)'
                      : '0 4px 14px rgba(0, 135, 103, 0.12)',
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
                      bgcolor: isDark ? alpha('#008767', 0.18) : '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '17px',
                      color: '#008767',
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

                <Stack direction="row" alignItems="center" spacing={0.75}>
                  {/* Open workspace button */}
                  <Tooltip
                    title={t('tasks.createProjectTaskModal.openWorkspace')}
                    arrow
                    placement="top"
                  >
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRedirectWorkspace();
                      }}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1,
                        py: 0.4,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        bgcolor: isDark
                          ? alpha('#008767', 0.14)
                          : alpha('#008767', 0.08),
                        border: `1px solid ${isDark ? alpha('#008767', 0.28) : alpha('#008767', 0.2)}`,
                        color: isDark ? '#10B981' : '#008767',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          bgcolor: isDark
                            ? alpha('#008767', 0.24)
                            : alpha('#008767', 0.15),
                          borderColor: isDark
                            ? alpha('#008767', 0.5)
                            : alpha('#008767', 0.4),
                        },
                      }}
                    >
                      <DocIcon sx={{ fontSize: 11 }} />
                      <Typography
                        sx={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {t('tasks.createProjectTaskModal.openWorkspace')}
                      </Typography>
                    </Box>
                  </Tooltip>

                  {/* Linked badge */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.4,
                      px: 0.75,
                      py: 0.35,
                      borderRadius: '6px',
                      bgcolor: isDark
                        ? alpha('#10b981', 0.1)
                        : alpha('#10b981', 0.08),
                      border: `1px solid ${isDark ? alpha('#10b981', 0.22) : alpha('#10b981', 0.2)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        bgcolor: isDark ? '#34d399' : '#10b981',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isDark ? '#34d399' : '#059669',
                        lineHeight: 1,
                      }}
                    >
                      {t('tasks.createProjectTaskModal.linked')}
                    </Typography>
                  </Box>

                  {/* Unlink button */}
                  <Tooltip
                    title={t('tasks.createProjectTaskModal.unlinkWorkspace')}
                    arrow
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorkspaceId(null);
                      }}
                      sx={{
                        p: 0.45,
                        color: secondaryText,
                        '&:hover': {
                          color: '#ef4444',
                          bgcolor: alpha('#ef4444', 0.08),
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 13 }} />
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
                  border: `1px dashed ${cardBorder}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: '#008767',
                    bgcolor: isDark
                      ? alpha('#008767', 0.08)
                      : alpha('#008767', 0.04),
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
                      {t('tasks.createProjectTaskModal.noWorkspaceLinked')}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: secondaryText }}>
                      {t('tasks.createProjectTaskModal.clickToLink')}
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setNewWorkspaceTitle('');
                      setIsCreateWorkspaceDialogOpen(true);
                    }}
                    startIcon={<AddIcon sx={{ fontSize: 13 }} />}
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderColor: alpha('#008767', 0.35),
                      color: '#008767',
                      p: '2px 8px',
                      borderRadius: '6px',
                      minWidth: 0,
                      '&:hover': {
                        borderColor: '#008767',
                        bgcolor: alpha('#008767', 0.08),
                      },
                    }}
                  >
                    + {t('tasks.createProjectTaskModal.add')}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      setWorkspaceSearch('');
                      setWorkspaceMenuAnchor(e.currentTarget);
                    }}
                    sx={{
                      fontSize: '11px',
                      textTransform: 'none',
                      borderColor: cardBorder,
                      color: '#008767',
                      p: '2px 8px',
                      borderRadius: '6px',
                      minWidth: 0,
                    }}
                  >
                    + {t('tasks.createProjectTaskModal.linkWorkspace')}
                  </Button>
                </Stack>
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
                  maxHeight: 400,
                  borderRadius: '14px',
                  p: 1,
                  bgcolor: surfaceColor(theme, '#1e1e24', '#2A2A2A', '#ffffff'),
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
                  placeholder={t(
                    'tasks.createProjectTaskModal.searchWorkspacePlaceholder',
                  )}
                  fullWidth
                  autoFocus
                  sx={{
                    fontSize: '12.5px',
                    color: headerText,
                    '& input': { p: 0 },
                  }}
                />
              </Box>

              {/* Quick button to create a workspace with a custom title */}
              <Box sx={{ px: 0.5, mb: 1 }}>
                <Button
                  fullWidth
                  size="small"
                  startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                  onClick={() => {
                    setWorkspaceMenuAnchor(null);
                    setNewWorkspaceTitle(workspaceSearch.trim() || '');
                    setIsCreateWorkspaceDialogOpen(true);
                  }}
                  sx={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                    p: '6px 10px',
                    borderRadius: '8px',
                    color: '#008767',
                    bgcolor: isDark
                      ? alpha('#008767', 0.12)
                      : alpha('#008767', 0.06),
                    '&:hover': {
                      bgcolor: isDark
                        ? alpha('#008767', 0.2)
                        : alpha('#008767', 0.12),
                    },
                  }}
                >
                  + {t('tasks.createProjectTaskModal.createWorkspace')}
                </Button>
              </Box>

              {/* Quick-create option when searching */}
              {workspaceSearch.trim().length > 0 &&
                !filteredWorkspaces.some(
                  (w) =>
                    w.title?.toLowerCase() ===
                    workspaceSearch.trim().toLowerCase(),
                ) && (
                  <MenuItem
                    onClick={() =>
                      handleCreateWorkspace(workspaceSearch.trim())
                    }
                    sx={{
                      borderRadius: '8px',
                      py: 1,
                      px: 1.25,
                      mb: 0.5,
                      bgcolor: isDark
                        ? alpha('#008767', 0.12)
                        : alpha('#008767', 0.08),
                      border: `1px dashed ${alpha('#008767', 0.35)}`,
                      '&:hover': {
                        bgcolor: isDark
                          ? alpha('#008767', 0.2)
                          : alpha('#008767', 0.14),
                      },
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
                          bgcolor: alpha('#008767', 0.15),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#008767',
                          flexShrink: 0,
                        }}
                      >
                        <AddIcon sx={{ fontSize: 16 }} />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '12.5px',
                            fontWeight: 650,
                            color: '#008767',
                          }}
                        >
                          {t('tasks.createProjectTaskModal.add')} &quot;
                          {workspaceSearch.trim()}&quot;
                        </Typography>
                        <Typography
                          noWrap
                          sx={{ fontSize: '10.5px', color: secondaryText }}
                        >
                          {t(
                            'tasks.createProjectTaskModal.createWorkspaceDialogDesc',
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                )}

              {loadingWorkspaces ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2.5 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : filteredWorkspaces.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography
                    sx={{ fontSize: '12px', color: secondaryText, mb: 1.5 }}
                  >
                    {workspaceSearch
                      ? t('workspaceLibrary.emptySearch.title')
                      : t('tasks.createProjectTaskModal.noWorkspaceLinked')}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                    onClick={() => {
                      setWorkspaceMenuAnchor(null);
                      setNewWorkspaceTitle(workspaceSearch.trim() || '');
                      setIsCreateWorkspaceDialogOpen(true);
                    }}
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      borderColor: alpha('#008767', 0.4),
                      color: '#008767',
                      '&:hover': {
                        borderColor: '#008767',
                        bgcolor: alpha('#008767', 0.08),
                      },
                    }}
                  >
                    {workspaceSearch.trim()
                      ? `${t('tasks.createProjectTaskModal.add')} "${workspaceSearch.trim()}"`
                      : t('tasks.createProjectTaskModal.createWorkspace')}
                  </Button>
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
                          title: t('tasks.createProjectTaskModal.linked'),
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
                            ? 'rgba(0, 135, 103, 0.18)'
                            : 'rgba(0, 135, 103, 0.08)'
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
                              color: isSelected ? '#008767' : headerText,
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
                        <CheckIcon sx={{ fontSize: 16, color: '#008767' }} />
                      )}
                    </MenuItem>
                  );
                })
              )}

              {selectedWorkspaceId && [
                <Divider key="divider" sx={{ my: 0.75 }} />,
                <MenuItem
                  key="desvincular"
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
                  {t('tasks.createProjectTaskModal.unlinkWorkspace')}
                </MenuItem>,
              ]}
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
                {t('tasks.createProjectTaskModal.descAndContext')}
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
              placeholder={t('tasks.createProjectTaskModal.descPlaceholder')}
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
                {t('tasks.createProjectTaskModal.subtasks')}{' '}
                {subtasks.length > 0 &&
                  `(${completedCount}/${subtasks.length})`}
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
                      bgcolor: surfaceColor(
                        theme,
                        '#232328',
                        '#2F2F2F',
                        '#f1f5f9',
                      ),
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
                        color: task.completed ? '#008767' : secondaryText,
                      }}
                    >
                      {task.completed ? (
                        <CheckCircleIcon
                          sx={{ fontSize: 18, color: '#008767' }}
                        />
                      ) : (
                        <UncheckedIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: task.completed ? secondaryText : headerText,
                        textDecoration: task.completed
                          ? 'line-through'
                          : 'none',
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
                          bgcolor: surfaceColor(
                            theme,
                            '#27272a',
                            '#333333',
                            '#ffffff',
                          ),
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
                  placeholder={t(
                    'tasks.createProjectTaskModal.subtaskPlaceholder',
                  )}
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
                    background: surfaceColor(
                      theme,
                      '#27272a',
                      '#333333',
                      '#ffffff',
                    ),
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
                  {t('tasks.createProjectTaskModal.add')}
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
            bgcolor: surfaceColor(theme, '#17171b', '#212121', '#fafafa'),
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
            {t('tasks.createProjectTaskModal.aiBreakdown')}
          </Button>

          {/* Actions on the Right */}
          <Stack direction="row" alignItems="center" spacing={2.5}>
            {/* Delete Button (Editing mode) */}
            {isEditing && onDelete && (
              <Tooltip title={t('tasks.createProjectTaskModal.deleteTask')}>
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
                    '&.Mui-checked': { color: '#008767' },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '12.5px',
                    color: secondaryText,
                    fontWeight: 500,
                  }}
                >
                  {t('tasks.createProjectTaskModal.createMore')}
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
              {t('tasks.createProjectTaskModal.cancel')}
            </Button>

            {/* Primary Action Button */}
            <Button
              id="modal-submit-create-task-btn"
              variant="contained"
              size="small"
              disabled={isSubmitting || !title.trim()}
              onClick={handleCreateTask}
              sx={{
                bgcolor: '#008767',
                color: '#ffffff',
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 600,
                px: 2.2,
                py: 0.8,
                boxShadow: '0 4px 12px rgba(0, 135, 103, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  bgcolor: '#007357',
                  boxShadow: '0 6px 16px rgba(0, 135, 103, 0.35)',
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
                  <span>
                    {isEditing
                      ? t('tasks.createProjectTaskModal.saveChanges')
                      : t('tasks.createProjectTaskModal.createTask')}
                  </span>
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

      {/* ── Dialog para Crear Workspace con Título Personalizado ── */}
      <Dialog
        open={isCreateWorkspaceDialogOpen}
        onClose={() => {
          if (!isCreatingWorkspace) {
            setIsCreateWorkspaceDialogOpen(false);
            setNewWorkspaceTitle('');
          }
        }}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 2.5,
            bgcolor: surfaceColor(theme, '#1a1a1f', '#252525', '#ffffff'),
            border: `1px solid ${cardBorder}`,
            boxShadow: isDark
              ? '0 20px 40px rgba(0,0,0,0.7)'
              : '0 20px 40px rgba(15,23,42,0.12)',
          },
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
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: alpha('#008767', 0.12),
                color: '#008767',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DocIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography
              sx={{ fontSize: '15px', fontWeight: 700, color: headerText }}
            >
              {t('tasks.createProjectTaskModal.createWorkspace')}
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={() => {
              setIsCreateWorkspaceDialogOpen(false);
              setNewWorkspaceTitle('');
            }}
            disabled={isCreatingWorkspace}
            sx={{ color: secondaryText }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Typography
          sx={{
            fontSize: '12px',
            color: secondaryText,
            mb: 2,
            lineHeight: 1.4,
          }}
        >
          {t('tasks.createProjectTaskModal.createWorkspaceDialogDesc')}
        </Typography>

        {currentProjectName && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.2,
              py: 0.5,
              mb: 2,
              borderRadius: '6px',
              bgcolor: isDark ? alpha('#ffffff', 0.04) : '#f1f5f9',
              border: `1px solid ${cardBorder}`,
              width: 'fit-content',
            }}
          >
            <Typography
              sx={{ fontSize: '11px', color: secondaryText, fontWeight: 500 }}
            >
              {t('tasks.createProjectTaskModal.project')}
            </Typography>
            <Typography
              sx={{ fontSize: '11px', color: headerText, fontWeight: 600 }}
            >
              {currentProjectName}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: secondaryText,
              textTransform: 'uppercase',
              mb: 0.75,
            }}
          >
            {t('tasks.createProjectTaskModal.workspaceTitle')}
          </Typography>
          <InputBase
            value={newWorkspaceTitle}
            onChange={(e) => setNewWorkspaceTitle(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                newWorkspaceTitle.trim() &&
                !isCreatingWorkspace
              ) {
                e.preventDefault();
                handleCreateWorkspace();
              }
            }}
            placeholder={t(
              'tasks.createProjectTaskModal.workspaceTitlePlaceholder',
            )}
            autoFocus
            fullWidth
            sx={{
              fontSize: '13px',
              color: headerText,
              p: '10px 12px',
              borderRadius: '8px',
              bgcolor: isDark ? alpha('#ffffff', 0.03) : '#f8fafc',
              border: `1px solid ${cardBorder}`,
              transition: 'all 0.15s ease',
              '&:focus-within': {
                borderColor: '#008767',
                boxShadow: `0 0 0 3px ${alpha('#008767', 0.15)}`,
              },
            }}
          />
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            size="small"
            onClick={() => {
              setIsCreateWorkspaceDialogOpen(false);
              setNewWorkspaceTitle('');
            }}
            disabled={isCreatingWorkspace}
            sx={{
              textTransform: 'none',
              fontSize: '12px',
              fontWeight: 600,
              color: secondaryText,
            }}
          >
            {t('tasks.createProjectTaskModal.cancel')}
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={!newWorkspaceTitle.trim() || isCreatingWorkspace}
            onClick={() => handleCreateWorkspace()}
            sx={{
              textTransform: 'none',
              fontSize: '12px',
              fontWeight: 600,
              px: 2,
              borderRadius: '8px',
              bgcolor: '#008767',
              '&:hover': { bgcolor: '#007357' },
            }}
          >
            {isCreatingWorkspace ? (
              <CircularProgress size={16} sx={{ color: '#ffffff' }} />
            ) : (
              t('tasks.createProjectTaskModal.createAndLink')
            )}
          </Button>
        </Stack>
      </Dialog>

      <ConfirmDeleteDialog
        open={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        title={t('tasks.deleteTaskDialog.title')}
        description={t('tasks.deleteTaskDialog.description', {
          title: props.task?.title || '',
        })}
        warning={t('tasks.deleteTaskDialog.warning')}
        onConfirm={confirmDeleteTask}
      />
    </>
  );
};

export default CreateProjectTaskModal;
