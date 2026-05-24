import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import {
  FlashOn as FlashOnIcon,
  AccessTime as AccessTimeIcon,
  Launch as LaunchIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import {
  getPriorityFromLevel,
  formatDuration,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { TaskSearchItems } from '../../types/workspace.types';

import {
  SidebarTopNav,
  SidebarBreadcrumbs,
  SidebarTaskTitle,
  PropertyGrid,
  PropertyCard,
  PropertyLabel,
  PropertyValue,
  SidebarFooter,
  ViewTaskButton,
  SectionSubtitle,
  DescriptionContainer,
} from './TaskDetailsFull.styles';

import { MarkDoneButton } from '../Editor/WorkspaceEditor.styles';

interface TaskDetailsFullProps {
  task: TaskSearchItems;
  onClose: () => void;
  onMarkDone?: (task: TaskSearchItems) => void;
  onStartFocus?: (task: TaskSearchItems) => void;
  activeFocusTaskId?: string | null;
}

const cleanDescription = (desc?: string): string => {
  if (!desc) return '';
  const cleaned = desc
    .replace(/\[COLOR:(.*?)\]/g, '')
    .replace(/\[START_DATE:(.*?)\]/g, '')
    .replace(
      /https?:\/\/(www\.)?(calendar\.google\.com|google\.com\/calendar|meet\.google\.com)[^\s]*/g,
      '',
    )
    .trim();

  const hasText =
    cleaned
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim().length > 0;
  return hasText ? cleaned : '';
};

export const TaskDetailsFull: React.FC<TaskDetailsFullProps> = ({
  task,
  onClose,
  onMarkDone,
  onStartFocus,
  activeFocusTaskId,
}) => {
  const isTaskInFocus = activeFocusTaskId === task.id;
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        pt: 1,
        overflowY: 'auto',
      }}
    >
      <SidebarTopNav>
        <Button
          onClick={onClose}
          startIcon={
            <KeyboardArrowRightIcon
              sx={{ fontSize: 20, color: theme.palette.text.primary }}
            />
          }
          sx={{
            textTransform: 'none',
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: '14px',
            padding: 0,
            minWidth: 'auto',
            '&:hover': {
              bgcolor: 'transparent',
              opacity: 0.8,
            },
          }}
        >
          Task Details
        </Button>
        {isTaskInFocus ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: `${theme.palette.primary.main}15`,
              color: theme.palette.primary.main,
              px: 2,
              borderRadius: '99px',
              border: `1px solid ${theme.palette.primary.main}33`,
              height: '32px',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 0 8px ${theme.palette.primary.main}`,
              }}
            />
            <Typography variant="caption" fontWeight={700} letterSpacing={1}>
              IN PROGRESS
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            startIcon={<FlashOnIcon sx={{ fontSize: 16 }} />}
            onClick={() => onStartFocus && onStartFocus(task)}
            sx={{
              minWidth: 'auto',
              padding: '6px 16px',
              fontSize: '11px',
              height: '32px',
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Start Focus Mode
          </Button>
        )}
      </SidebarTopNav>

      <SidebarBreadcrumbs>
        WORKSPACE / {task.category || 'PROJECTS'}
      </SidebarBreadcrumbs>
      <SidebarTaskTitle>{task.title}</SidebarTaskTitle>

      <PropertyGrid>
        <PropertyCard
          sx={{
            border: `1px solid ${
              task.status === 'DONE'
                ? theme.palette.success.main
                : task.status === 'IN_PROGRESS'
                  ? theme.palette.primary.main
                  : theme.palette.warning.main
            }40`,
            bgcolor: `${
              task.status === 'DONE'
                ? theme.palette.success.main
                : task.status === 'IN_PROGRESS'
                  ? theme.palette.primary.main
                  : theme.palette.warning.main
            }08`,
          }}
        >
          <PropertyLabel>STATUS</PropertyLabel>
          <PropertyValue>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor:
                  task.status === 'DONE'
                    ? theme.palette.success.main
                    : task.status === 'IN_PROGRESS'
                      ? theme.palette.primary.main
                      : theme.palette.warning.main,
              }}
            />
            {task.status === 'IN_PROGRESS'
              ? 'In Progress'
              : task.status?.replace('_', ' ') || 'Todo'}
          </PropertyValue>
        </PropertyCard>
        <PropertyCard
          sx={{
            border: `1px solid ${
              getPriorityFromLevel(Number(task.priority_level)) === 'High'
                ? theme.palette.error.main
                : getPriorityFromLevel(Number(task.priority_level)) === 'Med'
                  ? theme.palette.warning.main
                  : theme.palette.success.main
            }40`,
            bgcolor: `${
              getPriorityFromLevel(Number(task.priority_level)) === 'High'
                ? theme.palette.error.main
                : getPriorityFromLevel(Number(task.priority_level)) === 'Med'
                  ? theme.palette.warning.main
                  : theme.palette.success.main
            }08`,
          }}
        >
          <PropertyLabel>PRIORITY</PropertyLabel>
          <PropertyValue>
            <FlashOnIcon
              sx={{
                fontSize: 12,
                color:
                  getPriorityFromLevel(Number(task.priority_level)) === 'High'
                    ? theme.palette.error.main
                    : '#f59e0b',
              }}
            />
            {getPriorityFromLevel(Number(task.priority_level))}
          </PropertyValue>
        </PropertyCard>
        <PropertyCard sx={{ bgcolor: theme.palette.background.default }}>
          <PropertyLabel>ESTIMATE</PropertyLabel>
          <PropertyValue>
            <AccessTimeIcon
              sx={{ fontSize: 12, color: theme.palette.text.secondary }}
            />
            {task.estimate_timer ? formatDuration(task.estimate_timer) : '0h'}
          </PropertyValue>
        </PropertyCard>
      </PropertyGrid>

      {task.links && task.links.length > 0 && (
        <>
          <SectionSubtitle>Links & Resources</SectionSubtitle>
          <Box display="flex" flexDirection="column" gap={1} mb={3}>
            {task.links.map((link, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: '8px',
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <LinkIcon
                    sx={{ fontSize: 18, color: theme.palette.primary.main }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        lineHeight: 1.2,
                      }}
                    >
                      {link.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        display: 'block',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {link.url}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '4px',
                    ...(link.title.toLowerCase().includes('meet') && {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      border: 'none',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                        border: 'none',
                      },
                    }),
                  }}
                >
                  {link.title.toLowerCase().includes('meet') ? 'JOIN' : 'OPEN'}
                </Button>
              </Box>
            ))}
          </Box>
        </>
      )}

      <SectionSubtitle>Description</SectionSubtitle>
      <DescriptionContainer
        dangerouslySetInnerHTML={{
          __html:
            cleanDescription(task.notes_encrypted) ||
            '<p style="color: grey; font-style: italic;">No description provided for this task.</p>',
        }}
      />

      <SidebarFooter>
        <ViewTaskButton onClick={onClose} startIcon={undefined}>
          CLOSE
        </ViewTaskButton>
        {!isTaskInFocus && (
          <MarkDoneButton
            onClick={() => onMarkDone && onMarkDone(task)}
            sx={{
              flex: 1,
              padding: '12px',
              fontSize: '11px',
              bgcolor: theme.palette.text.primary,
              color: theme.palette.background.default,
              border: 'none',
              '&:hover': {
                bgcolor: theme.palette.text.secondary,
                color: theme.palette.background.default,
                borderColor: 'transparent',
              },
            }}
          >
            MARK AS DONE
          </MarkDoneButton>
        )}
      </SidebarFooter>
    </Box>
  );
};
