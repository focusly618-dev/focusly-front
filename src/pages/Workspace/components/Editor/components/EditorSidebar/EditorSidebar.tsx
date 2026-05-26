import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
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
  Link as LinkIcon,
  Launch as LaunchIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import {
  getPriorityFromLevel,
  getPriorityLevel,
  formatDuration,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { PriorityType } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
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
    selectTask,
    onStartFocus,
    activeFocusTaskId,
    onUnlinkTask,
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

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('workspace_sidebar_width');
    return saved ? parseInt(saved, 10) : 360;
  });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const startWidth = sidebarWidth;
      const startX = e.clientX;

      const handlePointerMove = (moveEvent: PointerEvent) => {
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

  const isTaskInFocus = activeFocusTaskId === selectTask?.id;

  return (
    <RightSidebar
      isOpen={isRightSidebarOpen}
      widthVal={sidebarWidth}
      isDragging={isDragging}
    >
      {isRightSidebarOpen && (
        <DragHandle isDragging={isDragging} onPointerDown={handlePointerDown} />
      )}

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

      {isRightSidebarOpen && (
        <>
          {selectTask ? (
            <MetadataSection>
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
                    {selectTask.title}
                  </Typography>
                  {onUnlinkTask && (
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

              <PropertyGrid>
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
                      {selectTask?.estimate_timer
                        ? formatDuration(selectTask.estimate_timer)
                        : '0h'}
                    </Typography>
                  </PropertyValue>
                </PropertyCard>

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
                      {selectTask?.real_timer
                        ? formatDuration(selectTask.real_timer)
                        : '0h'}
                    </Typography>
                  </PropertyValue>
                </PropertyCard>
              </PropertyGrid>

              {selectTask.links && selectTask.links.length > 0 && (
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
                      cleanDescription(selectTask?.notes_encrypted) ||
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
                          onStartFocus(selectTask);
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
