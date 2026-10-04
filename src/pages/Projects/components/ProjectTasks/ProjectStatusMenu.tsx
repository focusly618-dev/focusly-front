import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {
  DEFAULT_PROJECT_STATUSES,
  type ProjectTaskStatusId,
} from './projectTasks.types';

export interface ProjectStatusMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  /** Marked as the current one. */
  current?: ProjectTaskStatusId;
  onSelect: (status: ProjectTaskStatusId) => void;
}

/** Every status, to move one or several tasks without opening them. */
export const ProjectStatusMenu: React.FC<ProjectStatusMenuProps> = ({
  anchorEl,
  onClose,
  current,
  onSelect,
}) => {
  const { t } = useTranslation();
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      onClick={(e) => e.stopPropagation()}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{
        paper: { sx: { borderRadius: '10px', minWidth: 190, p: 0.5 } },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          px: 1.5,
          py: 0.5,
          fontWeight: 700,
          color: 'text.secondary',
        }}
      >
        {t('projectTasks.moveTo')}
      </Typography>
      {DEFAULT_PROJECT_STATUSES.map((status) => (
        <MenuItem
          key={status.id}
          selected={status.id === current}
          onClick={() => {
            onClose();
            if (status.id !== current) onSelect(status.id);
          }}
          sx={{ fontSize: '13px', borderRadius: '6px', py: 0.75, gap: 1 }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: status.dotColor,
              flexShrink: 0,
            }}
          />
          <Box component="span" sx={{ flex: 1 }}>
            {t(status.labelKey, { defaultValue: status.label })}
          </Box>
          {status.id === current && (
            <ListItemIcon sx={{ minWidth: 0 }}>
              <CheckIcon sx={{ fontSize: 16 }} />
            </ListItemIcon>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};
