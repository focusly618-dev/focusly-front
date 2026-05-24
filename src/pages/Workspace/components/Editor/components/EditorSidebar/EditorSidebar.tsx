import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Button,
} from '@mui/material';
import {
  ChevronRight,
  ChevronLeft,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  FlashOn as FlashOnIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  EventNote as PlannedIcon,
  Description as DescriptionIcon,
  LinkOff as LinkOffIcon,
  Check as CheckIcon,
  PlayArrow as PlayArrowIcon,
  Link as LinkIcon,
  Launch as LaunchIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  getPriorityFromLevel,
  getPriorityLevel,
  formatDuration,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { PriorityType } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { TaskSearchItems } from '../../../../types/workspace.types';
import {
  RightSidebar,
  DragHandle,
  MetadataSection,
  StartFocusButton,
  MarkDoneButton,
  DescriptionContainer,
  DescriptionHeader,
  PropertyGrid,
  PropertyCard,
  PropertyLabel,
  PropertyValue,
  SidebarSubtaskList,
  SidebarSubtaskItem,
  SubtaskActions,
  SubtaskCheck,
  FocusButton,
  ProgressSection,
  ProgressBar,
  SectionSubtitle,
  ResourceItem,
  PulseIndicator,
} from './EditorSidebar.styles';
import type { EditorSidebarProps } from './EditorSidebar.type';
import { useEditorSidebar } from './EditorSidebar.hook';

export const EditorSidebar = (props: EditorSidebarProps) => {
  const {
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    selectedSubtaskIndex,
    selectTask,
    onStartFocus,
    activeFocusTaskId,
    onUnlinkTask,
    handleUpdateTask,
  } = props;

  const {
    priorityAnchor,
    setPriorityAnchor,
    statusAnchor,
    setStatusAnchor,
    getPriorityColor,
    getStatusColor,
    handlePriorityClick,
    handleStatusClick,
    handlePrioritySelect,
    handleStatusSelect,
    handleMarkDone,
    currentStatus,
    currentPriorityLevel,
    cleanDescription,
    theme,
  } = useEditorSidebar(props);

  // Stateful sidebar width (300px - 600px)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('workspace_sidebar_width');
    return saved ? parseInt(saved, 10) : 360;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSubtaskDetails, setSelectedSubtaskDetails] = useState<
    NonNullable<TaskSearchItems['subtasks']>[0] | null
  >(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startWidth = sidebarWidth;
      const startX = e.clientX;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        // Sidebar is on the right, so dragging left (decreasing X) increases width.
        const deltaX = startX - moveEvent.clientX;
        const newWidth = Math.max(300, Math.min(600, startWidth + deltaX));
        setSidebarWidth(newWidth);
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [sidebarWidth],
  );

  useEffect(() => {
    localStorage.setItem('workspace_sidebar_width', String(sidebarWidth));
  }, [sidebarWidth]);

  // Handle circular checkbox toggle
  const handleToggleSubtaskCheckbox = async (subtaskIndex: number) => {
    if (!selectTask || !handleUpdateTask || !selectTask.subtasks) return;
    const updatedSubtasks = [...selectTask.subtasks].map((s, idx) => {
      if (idx === subtaskIndex) {
        const newCompleted = !s.completed;
        return {
          ...s,
          completed: newCompleted,
          status: newCompleted ? 'Done' : 'Todo',
        };
      }
      return s;
    });
    await handleUpdateTask(selectTask.id, { subtasks: updatedSubtasks });
  };

  const isTaskInFocus = activeFocusTaskId === selectTask?.id;
  const hasSubtasks = selectTask?.subtasks && selectTask.subtasks.length > 0;
  const completedSubtasksCount =
    selectTask?.subtasks?.filter((s) => s.completed).length || 0;
  const progressPercent = hasSubtasks
    ? Math.round(
        (completedSubtasksCount / (selectTask?.subtasks?.length || 1)) * 100,
      )
    : 0;

  return (
    <RightSidebar
      isOpen={isRightSidebarOpen}
      widthVal={sidebarWidth}
      isDragging={isDragging}
    >
      {/* Col-Resize Drag Handle */}
      {isRightSidebarOpen && (
        <DragHandle isDragging={isDragging} onPointerDown={handlePointerDown} />
      )}

      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isRightSidebarOpen ? 'space-between' : 'center',
          mb: 3,
          minHeight: '28px',
        }}
      >
        {isRightSidebarOpen && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              letterSpacing={1.2}
            >
              TASK DETAILS
            </Typography>
            {isTaskInFocus && currentStatus !== 'Done' && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  px: 1.5,
                  py: 0.2,
                  borderRadius: '99px',
                  border: `1px solid ${theme.palette.primary.main}33`,
                }}
              >
                <PulseIndicator />
                <Typography
                  variant="caption"
                  fontWeight={750}
                  fontSize="9px"
                  letterSpacing={0.5}
                >
                  IN PROGRESS
                </Typography>
              </Box>
            )}
          </Box>
        )}
        <IconButton
          onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: theme.palette.action.hover,
              color: theme.palette.text.primary,
            },
          }}
        >
          {isRightSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Render sidebar contents if open */}
      {isRightSidebarOpen && (
        <>
          {selectTask ? (
            <MetadataSection>
              {/* Back button or subtask header */}
              {selectedSubtaskIndex !== null && (
                <Button
                  onClick={() => {
                    // Navigate back to parent task details
                    if (props.onOpenTaskDetails && selectTask) {
                      props.onOpenTaskDetails(selectTask, 'view');
                    }
                  }}
                  startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    textTransform: 'none',
                    color: 'info.main',
                    fontWeight: 700,
                    fontSize: '11px',
                    mb: 1.5,
                    padding: '2px 6px',
                    minWidth: 'auto',
                    alignSelf: 'flex-start',
                    '&:hover': {
                      bgcolor: `${theme.palette.info.main}12`,
                    },
                  }}
                >
                  PARENT: {selectTask.title}
                </Button>
              )}

              {/* Title Header */}
              <Box sx={{ mb: 3 }}>
                <Box
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: 'text.primary',
                      lineHeight: 1.25,
                      fontSize: '1.25rem',
                      letterSpacing: '-0.02em',
                      flex: 1,
                    }}
                  >
                    {selectedSubtaskIndex !== null &&
                    selectTask.subtasks?.[selectedSubtaskIndex]
                      ? selectTask.subtasks[selectedSubtaskIndex].title
                      : selectTask.title}
                  </Typography>
                  {onUnlinkTask && selectedSubtaskIndex === null && (
                    <IconButton
                      size="small"
                      onClick={onUnlinkTask}
                      sx={{
                        color: 'text.secondary',
                        ml: 1,
                        '&:hover': {
                          color: 'error.main',
                          backgroundColor: `${theme.palette.error.main}12`,
                        },
                      }}
                      title="Unlink task"
                    >
                      <LinkOffIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {/* Redesigned Minimal Property Grid */}
              <PropertyGrid>
                {/* STATUS */}
                <PropertyCard>
                  <PropertyLabel>STATUS</PropertyLabel>
                  <PropertyValue
                    onClick={handleStatusClick}
                    sx={{
                      cursor: 'pointer',
                      px: 1,
                      py: 0.5,
                      borderRadius: '6px',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(currentStatus),
                        boxShadow: `0 0 6px ${getStatusColor(currentStatus)}`,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '13px',
                        color: getStatusColor(currentStatus),
                      }}
                    >
                      {currentStatus}
                    </Typography>
                  </PropertyValue>
                </PropertyCard>

                {/* PRIORITY */}
                <PropertyCard>
                  <PropertyLabel>PRIORITY</PropertyLabel>
                  <PropertyValue
                    onClick={handlePriorityClick}
                    sx={{
                      cursor: 'pointer',
                      px: 1,
                      py: 0.5,
                      borderRadius: '6px',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <FlagIcon
                      sx={{
                        fontSize: 14,
                        color: getPriorityColor(Number(currentPriorityLevel)),
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '13px',
                        color: getPriorityColor(Number(currentPriorityLevel)),
                      }}
                    >
                      {getPriorityFromLevel(Number(currentPriorityLevel)) ===
                      'No priority'
                        ? 'None'
                        : getPriorityFromLevel(Number(currentPriorityLevel))}
                    </Typography>
                  </PropertyValue>
                </PropertyCard>

                {/* ESTIMATE TIMER */}
                <PropertyCard>
                  <PropertyLabel>ESTIMATE</PropertyLabel>
                  <PropertyValue>
                    <AccessTimeIcon
                      sx={{ fontSize: 14, color: theme.palette.text.secondary }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '13px',
                        color: 'text.primary',
                      }}
                    >
                      {selectedSubtaskIndex !== null
                        ? selectTask?.subtasks?.[selectedSubtaskIndex]
                            ?.estimate_timer
                          ? formatDuration(
                              selectTask.subtasks[selectedSubtaskIndex]
                                .estimate_timer!,
                            )
                          : '0h'
                        : selectTask?.estimate_timer
                          ? formatDuration(selectTask.estimate_timer)
                          : '0h'}
                    </Typography>
                  </PropertyValue>
                </PropertyCard>

                {/* REAL TIMER */}
                <PropertyCard>
                  <PropertyLabel>REAL TIME</PropertyLabel>
                  <PropertyValue>
                    <HistoryIcon sx={{ fontSize: 14, color: 'info.main' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: '13px',
                        color: 'info.main',
                      }}
                    >
                      {selectedSubtaskIndex !== null
                        ? selectTask?.subtasks?.[selectedSubtaskIndex]?.timer
                          ? formatDuration(
                              selectTask.subtasks[selectedSubtaskIndex].timer,
                            )
                          : '0h'
                        : selectTask?.real_timer
                          ? formatDuration(selectTask.real_timer)
                          : '0h'}
                    </Typography>
                  </PropertyValue>
                </PropertyCard>
              </PropertyGrid>

              {/* LINKS & RESOURCES (If parent view and has links) */}
              {selectedSubtaskIndex === null &&
                selectTask.links &&
                selectTask.links.length > 0 && (
                  <>
                    <SectionSubtitle>Links & Resources</SectionSubtitle>
                    <Box display="flex" flexDirection="column" gap={1} mb={3}>
                      {selectTask.links.map((link, index) => (
                        <ResourceItem key={index}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1.2}
                            sx={{ minWidth: 0, flex: 1 }}
                          >
                            <LinkIcon
                              sx={{
                                fontSize: 16,
                                color: theme.palette.primary.main,
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: theme.palette.text.primary,
                                  lineHeight: 1.2,
                                  fontSize: '12px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {link.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  display: 'block',
                                  fontSize: '10px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {link.url}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            component="a"
                            size="small"
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<LaunchIcon sx={{ fontSize: 10 }} />}
                            sx={{
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              border: '1px solid',
                              borderColor: theme.palette.divider,
                              color: theme.palette.text.primary,
                              backgroundColor: 'transparent',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                borderColor: theme.palette.text.secondary,
                              },
                              flexShrink: 0,
                              ml: 1,
                              ...(link.title.toLowerCase().includes('meet') && {
                                bgcolor: `${theme.palette.primary.main}15`,
                                color: theme.palette.primary.main,
                                border: `1px solid ${theme.palette.primary.main}30`,
                                '&:hover': {
                                  bgcolor: `${theme.palette.primary.main}25`,
                                  borderColor: theme.palette.primary.main,
                                },
                              }),
                            }}
                          >
                            {link.title.toLowerCase().includes('meet')
                              ? 'JOIN'
                              : 'OPEN'}
                          </Button>
                        </ResourceItem>
                      ))}
                    </Box>
                  </>
                )}

              {/* SUBTASKS SECTION (If parent task and has subtasks) */}
              {selectedSubtaskIndex === null && hasSubtasks && (
                <>
                  <SectionSubtitle>
                    Subtasks ({selectTask.subtasks?.length || 0})
                  </SectionSubtitle>
                  <ProgressSection>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color={theme.palette.text.primary}
                      >
                        {completedSubtasksCount} of{' '}
                        {selectTask.subtasks?.length} completed
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color={theme.palette.primary.main}
                      >
                        {progressPercent}%
                      </Typography>
                    </Box>
                    <ProgressBar value={progressPercent} />
                  </ProgressSection>

                  <SidebarSubtaskList>
                    {selectTask.subtasks?.map((subtask, index) => {
                      const hasSubNotes = !!cleanDescription(
                        subtask.notes_encrypted,
                      );

                      const subPriority = subtask.priority_level
                        ? getPriorityFromLevel(subtask.priority_level)
                        : getPriorityFromLevel(selectTask.priority_level);

                      return (
                        <SidebarSubtaskItem
                          key={index}
                          completed={subtask.completed}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            <SubtaskCheck
                              completed={subtask.completed}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSubtaskCheckbox(index);
                              }}
                            >
                              {subtask.completed && (
                                <CheckIcon
                                  sx={{
                                    fontSize: 10,
                                    color: theme.palette.primary.main,
                                  }}
                                />
                              )}
                            </SubtaskCheck>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                onClick={() => {
                                  // Click title to enter specific subtask details view
                                  if (props.onOpenTaskDetails) {
                                    // Setting the subtask index using onOpenTaskDetails or a wrapper
                                    // Wait, WorkspaceEditor handles selecting subtask index via props
                                    if (onStartFocus && selectTask) {
                                      // If we want to view it, we can trigger selected subtask detail
                                      // Wait, the Workspace component has handles to update task selection.
                                      // We can also trigger detail notes dialog directly!
                                    }
                                  }
                                }}
                                sx={{
                                  color: subtask.completed
                                    ? theme.palette.text.secondary
                                    : theme.palette.text.primary,
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  textDecoration: subtask.completed
                                    ? 'line-through'
                                    : 'none',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              >
                                {subtask.title}
                              </Typography>

                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                mt={0.5}
                              >
                                {/* Subtask Priority Pill */}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.3,
                                    bgcolor:
                                      subPriority === 'High'
                                        ? `${theme.palette.error.main}08`
                                        : subPriority === 'Med'
                                          ? '#f59e0b08'
                                          : `${theme.palette.success.main}08`,
                                    border: `1px solid ${
                                      subPriority === 'High'
                                        ? `${theme.palette.error.main}30`
                                        : subPriority === 'Med'
                                          ? '#f59e0b30'
                                          : `${theme.palette.success.main}30`
                                    }`,
                                    px: 0.8,
                                    py: 0.1,
                                    borderRadius: '4px',
                                  }}
                                >
                                  <FlagIcon
                                    sx={{
                                      fontSize: 9,
                                      color:
                                        subPriority === 'High'
                                          ? theme.palette.error.main
                                          : '#f59e0b',
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: '8.5px',
                                      fontWeight: 600,
                                      color: theme.palette.text.secondary,
                                    }}
                                  >
                                    {subPriority}
                                  </Typography>
                                </Box>

                                {/* Subtask Estimate Timer Pill */}
                                {(subtask.estimate_timer !== undefined &&
                                  subtask.estimate_timer > 0) ||
                                (subtask.timer !== undefined &&
                                  subtask.timer > 0) ? (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      bgcolor: 'action.hover',
                                      border: `1px solid ${theme.palette.divider}`,
                                      px: 0.8,
                                      py: 0.1,
                                      borderRadius: '4px',
                                    }}
                                  >
                                    <AccessTimeIcon
                                      sx={{
                                        fontSize: 9,
                                        color: 'text.secondary',
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '8.5px',
                                        color: theme.palette.text.secondary,
                                        fontFamily: 'monospace',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {formatDuration(
                                        subtask.estimate_timer || subtask.timer,
                                      )}
                                    </Typography>
                                  </Box>
                                ) : null}
                              </Box>
                            </Box>
                          </Box>

                          {/* Subtask Action hover triggers */}
                          <SubtaskActions className="subtask-actions">
                            <Tooltip title="Focus Mode on this subtask">
                              <FocusButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onStartFocus && selectTask) {
                                    onStartFocus(selectTask, index);
                                  }
                                }}
                              >
                                <PlayArrowIcon sx={{ fontSize: 16 }} />
                              </FocusButton>
                            </Tooltip>

                            {hasSubNotes && (
                              <Tooltip title="View subtask notes">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSubtaskDetails(subtask);
                                  }}
                                  sx={{
                                    color: theme.palette.info.main,
                                    padding: '4px',
                                    '&:hover': {
                                      bgcolor: `${theme.palette.info.main}15`,
                                    },
                                  }}
                                >
                                  <LaunchIcon sx={{ fontSize: 13 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </SubtaskActions>
                        </SidebarSubtaskItem>
                      );
                    })}
                  </SidebarSubtaskList>
                </>
              )}

              {/* MAIN DESCRIPTION */}
              <Box sx={{ mt: 3 }}>
                <DescriptionHeader>
                  <DescriptionIcon sx={{ fontSize: 14 }} />
                  <Typography
                    variant="caption"
                    fontWeight={750}
                    letterSpacing={1.2}
                  >
                    DESCRIPTION
                  </Typography>
                </DescriptionHeader>
                <DescriptionContainer
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedSubtaskIndex !== null
                        ? cleanDescription(
                            selectTask?.subtasks?.[selectedSubtaskIndex]
                              ?.notes_encrypted,
                          ) ||
                          '<p style="color: grey; font-style: italic; font-size: 13px;">No description provided for this subtask.</p>'
                        : cleanDescription(selectTask?.notes_encrypted) ||
                          '<p style="color: grey; font-style: italic; font-size: 13px;">No description provided for this task.</p>',
                  }}
                />
              </Box>
            </MetadataSection>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', py: 8 }}
            >
              Select a task to see details
            </Typography>
          )}

          <Box sx={{ flexGrow: 1, minHeight: '20px' }} />

          {/* Action Footer Buttons */}
          {selectTask && (
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: 'column',
                mt: 'auto',
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              {currentStatus === 'Done' ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    bgcolor: `${theme.palette.success.main}15`,
                    color: theme.palette.success.main,
                    p: 1.8,
                    borderRadius: '10px',
                    border: `1px solid ${theme.palette.success.main}33`,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    letterSpacing={1}
                  >
                    COMPLETED
                  </Typography>
                </Box>
              ) : (
                <>
                  {!isTaskInFocus && (
                    <StartFocusButton
                      startIcon={<FlashOnIcon sx={{ fontSize: 14 }} />}
                      disabled={!selectTask}
                      onClick={() => {
                        if (onStartFocus && selectTask) {
                          onStartFocus(selectTask, selectedSubtaskIndex);
                        }
                      }}
                      sx={{
                        py: 1.5,
                        fontSize: '11px',
                        borderRadius: '8px',
                      }}
                    >
                      Start Focus Mode
                    </StartFocusButton>
                  )}
                  <MarkDoneButton
                    disabled={!selectTask}
                    onClick={handleMarkDone}
                    sx={{
                      py: 1.5,
                      fontSize: '11px',
                      borderRadius: '8px',
                    }}
                  >
                    Mark As Done
                  </MarkDoneButton>
                </>
              )}
            </Box>
          )}
        </>
      )}

      {/* Subtask Notes Dialog Modal */}
      <Dialog
        open={!!selectedSubtaskDetails}
        onClose={() => setSelectedSubtaskDetails(null)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
            minWidth: '320px',
            maxWidth: '450px',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              color: theme.palette.text.primary,
              fontSize: '13px',
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selectedSubtaskDetails?.title}
          </Typography>
          <IconButton
            onClick={() => setSelectedSubtaskDetails(null)}
            sx={{
              color: theme.palette.text.secondary,
              padding: '4px',
              '&:hover': {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2.5, pt: '16px !important' }}>
          <Box
            sx={{
              color: theme.palette.text.primary,
              fontSize: '13px',
              lineHeight: 1.6,
              '& p': {
                margin: 0,
                marginBottom: '10px',
                '&:last-child': { marginBottom: 0 },
              },
              '& ul, & ol': {
                marginTop: '4px',
                marginBottom: '10px',
                paddingLeft: '20px',
              },
              '& a': {
                color: theme.palette.info.main,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              },
            }}
            dangerouslySetInnerHTML={{
              __html:
                cleanDescription(selectedSubtaskDetails?.notes_encrypted) ||
                'No information provided.',
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Menus */}
      <Menu
        anchorEl={priorityAnchor}
        open={Boolean(priorityAnchor)}
        onClose={() => setPriorityAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            minWidth: '150px',
            mt: 0.5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: 'none',
          },
        }}
      >
        {(['High', 'Med', 'Low', 'No priority'] as PriorityType[]).map((p) => (
          <MenuItem
            key={p}
            onClick={() => handlePrioritySelect(getPriorityLevel(p))}
            sx={{
              gap: 1.2,
              py: 1,
              px: 1.5,
              borderRadius: '6px',
              mx: 0.8,
              my: 0.3,
              fontSize: '12px',
            }}
          >
            <FlagIcon
              sx={{
                fontSize: 16,
                color: getPriorityColor(getPriorityLevel(p)),
              }}
            />
            <Typography variant="body2" fontWeight={600} fontSize="12px">
              {p === 'No priority' ? 'No Priority' : p}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={statusAnchor}
        open={Boolean(statusAnchor)}
        onClose={() => setStatusAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            minWidth: '160px',
            mt: 0.5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: 'none',
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
            sx={{
              gap: 1.2,
              py: 1,
              px: 1.5,
              borderRadius: '6px',
              mx: 0.8,
              my: 0.3,
              fontSize: '12px',
            }}
          >
            {s === 'Todo' && (
              <RadioButtonUncheckedIcon
                sx={{ fontSize: 16, color: 'text.secondary' }}
              />
            )}
            {s === 'Planning' && (
              <PlannedIcon sx={{ fontSize: 16, color: 'info.main' }} />
            )}
            {s === 'Scheduled' && (
              <PlannedIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />
            )}
            {s === 'Pending' && (
              <PauseCircleIcon sx={{ fontSize: 16, color: 'warning.main' }} />
            )}
            {s === 'On Hold' && (
              <PauseCircleIcon sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            {s === 'Review' && (
              <VisibilityIcon sx={{ fontSize: 16, color: '#06b6d4' }} />
            )}
            {s === 'Done' && (
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
            )}
            {s === 'Backlog' && (
              <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            )}
            {s === 'Archived' && (
              <HistoryIcon sx={{ fontSize: 16, color: '#4b5563' }} />
            )}
            <Typography variant="body2" fontWeight={600} fontSize="12px">
              {s}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </RightSidebar>
  );
};
