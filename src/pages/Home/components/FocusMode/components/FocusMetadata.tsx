import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, useTheme } from '@mui/material';
import {
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  History as HistoryIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  EventNote as PlannedIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  TaskTitleContainer,
  CurrentTaskBadge,
  TaskMetadataContainer,
} from '../FocusMode.styles';
import {
  PriorityBadge,
  PRIORITY_OPTIONS,
  getPriorityConfig,
} from '@/components/ui';
import {
  formatDuration,
  getPriorityLevel,
  type PriorityType,
} from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import type { TaskStatus } from '@/redux/tasks/task.types';

interface FocusMetadataProps {
  activeItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  handleUpdateStatus: (status: TaskStatus) => void;
  handleUpdatePriority: (level: number) => void;
}

export const FocusMetadata: React.FC<FocusMetadataProps> = ({
  activeItem,
  handleUpdateStatus,
  handleUpdatePriority,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [priorityAnchor, setPriorityAnchor] = useState<null | HTMLElement>(
    null,
  );

  const folder =
    activeItem?.workspace?.project ||
    activeItem?.workspace?.folder ||
    activeItem?.workspaces?.[0]?.folder;

  return (
    <TaskTitleContainer>
      <CurrentTaskBadge>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: '#3b82f6',
            boxShadow: '0 0 8px #3b82f6',
          }}
        />
        Active Session
      </CurrentTaskBadge>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mt: 2,
          mb: 1.5,
          fontSize: '3.5rem',
          letterSpacing: '-0.02em',
          background: isDark
            ? 'linear-gradient(to right, #fff, #94a3b8)'
            : `linear-gradient(to right, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}
      >
        {activeItem?.title || 'Select a task'}
      </Typography>
      <TaskMetadataContainer>
        {folder && (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: 'rgba(255,255,255,0.05)',
              }}
            >
              <FolderIcon
                sx={{
                  fontSize: 16,
                  color: folder.color || 'primary.main',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: folder.color || 'primary.main',
                }}
              >
                {folder.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mx: 0.5, opacity: 0.5 }}>
              •
            </Typography>
          </>
        )}

        <Box
          onClick={(e) => setStatusAnchor(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            '&:hover': {
              color: theme.palette.text.primary,
              bgcolor: 'rgba(255,255,255,0.05)',
            },
            px: 1,
            py: 0.5,
            borderRadius: 1,
            transition: 'all 0.2s',
          }}
        >
          {(() => {
            const status = activeItem?.status || 'Todo';
            switch (status) {
              case 'Done':
                return (
                  <CheckCircleIcon
                    sx={{ fontSize: 16, color: 'success.main' }}
                  />
                );
              case 'Pending':
                return (
                  <PauseCircleIcon
                    sx={{ fontSize: 16, color: 'warning.main' }}
                  />
                );
              case 'Backlog':
                return (
                  <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                );
              case 'Planning':
                return (
                  <PlannedIcon sx={{ fontSize: 16, color: 'info.main' }} />
                );
              case 'Scheduled':
                return <PlannedIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />;
              case 'On Hold':
                return (
                  <PauseCircleIcon sx={{ fontSize: 16, color: 'error.main' }} />
                );
              case 'Review':
                return (
                  <VisibilityIcon sx={{ fontSize: 16, color: '#06b6d4' }} />
                );
              case 'Archived':
                return <HistoryIcon sx={{ fontSize: 16, color: '#4b5563' }} />;
              default:
                return (
                  <RadioButtonUncheckedIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                );
            }
          })()}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {activeItem?.status || 'Todo'}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mx: 0.5, opacity: 0.5 }}>
          •
        </Typography>

        <Box
          onClick={(e) => setPriorityAnchor(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            cursor: 'pointer',
            '&:hover': {
              color: theme.palette.text.primary,
              bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            },
            px: 1,
            py: 0.5,
            borderRadius: 1,
            transition: 'all 0.2s',
          }}
        >
          <PriorityBadge priority={activeItem?.priority_level} size={18} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: getPriorityConfig(activeItem?.priority_level).color,
            }}
          >
            {getPriorityConfig(activeItem?.priority_level).label}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mx: 0.5, opacity: 0.5 }}>
          •
        </Typography>

        <Box sx={{ px: 1, py: 0.5 }}>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {formatDuration(activeItem?.estimate_timer || 25)} estimated
          </Typography>
        </Box>
      </TaskMetadataContainer>

      {/* Status Menu */}
      <Menu
        anchorEl={statusAnchor}
        open={Boolean(statusAnchor)}
        onClose={() => setStatusAnchor(null)}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            minWidth: 160,
          },
        }}
      >
        {[
          {
            label: 'Todo',
            icon: (
              <RadioButtonUncheckedIcon
                sx={{ fontSize: 18, color: 'text.secondary' }}
              />
            ),
          },
          {
            label: 'Planning',
            icon: <PlannedIcon sx={{ fontSize: 18, color: 'info.main' }} />,
          },
          {
            label: 'Scheduled',
            icon: <PlannedIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />,
          },
          {
            label: 'Pending',
            icon: (
              <PauseCircleIcon sx={{ fontSize: 18, color: 'warning.main' }} />
            ),
          },
          {
            label: 'On Hold',
            icon: (
              <PauseCircleIcon sx={{ fontSize: 18, color: 'error.main' }} />
            ),
          },
          {
            label: 'Review',
            icon: <VisibilityIcon sx={{ fontSize: 18, color: '#06b6d4' }} />,
          },
          {
            label: 'Backlog',
            icon: (
              <HistoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            ),
          },
          {
            label: 'Done',
            icon: (
              <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
            ),
          },
          {
            label: 'Archived',
            icon: <HistoryIcon sx={{ fontSize: 18, color: '#4b5563' }} />,
          },
        ].map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              handleUpdateStatus(option.label as TaskStatus);
              setStatusAnchor(null);
            }}
            sx={{ gap: 1.5, py: 1 }}
          >
            {option.icon}
            <Typography variant="body2">{option.label}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Priority Menu */}
      <Menu
        anchorEl={priorityAnchor}
        open={Boolean(priorityAnchor)}
        onClose={() => setPriorityAnchor(null)}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            minWidth: 160,
            borderRadius: '8px',
            p: 0.5,
          },
        }}
      >
        {PRIORITY_OPTIONS.map((pOpt) => {
          const level = getPriorityLevel(pOpt.id as PriorityType);
          const isSelected =
            getPriorityConfig(activeItem?.priority_level).id === pOpt.id;

          return (
            <MenuItem
              key={pOpt.id}
              selected={isSelected}
              onClick={() => {
                handleUpdatePriority(level);
                setPriorityAnchor(null);
              }}
              sx={{
                gap: 1.5,
                py: 0.75,
                px: 1.25,
                borderRadius: '6px',
                my: 0.25,
              }}
            >
              <PriorityBadge priority={pOpt.id} size={20} />
              <Typography variant="body2" fontWeight={isSelected ? 600 : 500}>
                {pOpt.label}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </TaskTitleContainer>
  );
};
