import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import {
  DEFAULT_PROJECT_STATUSES,
  type ProjectStatusConfig,
  type ProjectTaskStatusId,
} from './projectTasks.types';

export interface ProjectTaskStatusBadgeProps {
  status: ProjectTaskStatusId;
  customStatuses?: ProjectStatusConfig[];
  onChange?: (newStatus: ProjectTaskStatusId) => void;
  size?: 'small' | 'medium';
  readOnly?: boolean;
}

export const ProjectTaskStatusBadge: React.FC<ProjectTaskStatusBadgeProps> = ({
  status,
  customStatuses = DEFAULT_PROJECT_STATUSES,
  onChange,
  size = 'small',
  readOnly = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentStatus = customStatuses.find(
    (s) =>
      s.id.toLowerCase() === status.toLowerCase() ||
      s.label.toLowerCase() === status.toLowerCase(),
  ) || {
    id: status,
    label: status,
    color: '#10b981',
    dotColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  };

  const isClickable = !readOnly && Boolean(onChange);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isClickable) {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (newStatusId: ProjectTaskStatusId) => {
    onChange?.(newStatusId);
    handleClose();
  };

  const isSmall = size === 'small';

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: isSmall ? '6px' : '8px',
          px: isSmall ? '8px' : '10px',
          py: isSmall ? '2px' : '4px',
          borderRadius: '20px',
          bgcolor: isDark
            ? currentStatus.bgColor || 'rgba(255, 255, 255, 0.05)'
            : currentStatus.bgColor || 'rgba(0, 0, 0, 0.05)',
          border: `1px solid ${
            currentStatus.borderColor ||
            (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')
          }`,
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
          userSelect: 'none',
          '&:hover': isClickable
            ? {
                transform: 'translateY(-0.5px)',
                filter: 'brightness(1.1)',
                boxShadow: isDark
                  ? '0 2px 8px rgba(0,0,0,0.3)'
                  : '0 2px 6px rgba(0,0,0,0.06)',
              }
            : {},
        }}
      >
        <Box
          sx={{
            width: isSmall ? 6 : 8,
            height: isSmall ? 6 : 8,
            borderRadius: '50%',
            bgcolor: currentStatus.dotColor || currentStatus.color,
            boxShadow: `0 0 6px ${currentStatus.dotColor || currentStatus.color}`,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: isSmall ? '11px' : '12px',
            fontWeight: 600,
            color: currentStatus.color,
            lineHeight: 1.2,
          }}
        >
          {currentStatus.label}
        </Typography>
        {isClickable && (
          <KeyboardArrowDownIcon
            sx={{
              fontSize: isSmall ? 14 : 16,
              color: currentStatus.color,
              opacity: 0.7,
              ml: -0.3,
            }}
          />
        )}
      </Box>

      {isClickable && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 0.5,
              borderRadius: '12px',
              bgcolor: isDark ? '#1a1b22' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              boxShadow: isDark
                ? '0 12px 32px rgba(0, 0, 0, 0.5)'
                : '0 8px 24px rgba(0, 0, 0, 0.1)',
              minWidth: 160,
              p: 0.5,
            },
          }}
        >
          {customStatuses.map((s) => {
            const isSelected =
              s.id.toLowerCase() === currentStatus.id.toLowerCase();
            return (
              <MenuItem
                key={s.id}
                onClick={() => handleSelect(s.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.75,
                  px: 1.5,
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 600 : 500,
                  color: isDark ? '#f4f4f5' : '#18181b',
                  '&:hover': {
                    bgcolor: isDark
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: s.dotColor || s.color,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1 }}>{s.label}</Box>
                {isSelected && (
                  <CheckIcon sx={{ fontSize: 16, color: s.color }} />
                )}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </>
  );
};
