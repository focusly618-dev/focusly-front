import type { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

export const getSelectionChipSx = (
  variant: 'status' | 'priority' | 'category',
  value: string,
) => {
  const getColorByValue = () => {
    switch (variant) {
      case 'status':
        switch (value) {
          case 'Planning':
            return '#3b82f6';
          case 'Scheduled':
            return '#8b5cf6';
          case 'Pending':
            return '#f59e0b';
          case 'On Hold':
            return '#ef4444';
          case 'Review':
            return '#06b6d4';
          case 'Done':
            return '#16a34a';
          case 'Backlog':
          case 'Archived':
          case 'Todo':
          default:
            return 'text.secondary';
        }
      case 'priority':
        switch (value) {
          case 'High':
            return '#ef4444';
          case 'Med':
            return '#f59e0b';
          case 'Low':
            return '#16a34a';
          case 'No priority':
          default:
            return 'text.secondary';
        }
      case 'category':
        switch (value) {
          case 'Deep Work':
            return '#8b5cf6';
          case 'Meeting':
            return '#3b82f6';
          case 'Design':
          case 'Learning':
            return '#f59e0b';
          case 'Development':
            return '#2563eb';
          case 'Marketing':
            return '#ef4444';
          case 'Planning':
          case 'Research':
            return '#06b6d4';
          default:
            return 'text.secondary';
        }
      default:
        return 'text.secondary';
    }
  };

  const color = getColorByValue();

  return {
    borderRadius: '20px',
    px: 1.5,
    height: '28px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    bgcolor: (theme: Theme) => {
      if (color === 'text.secondary') {
        return theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.04)';
      }
      return theme.palette.mode === 'dark'
        ? alpha(color, 0.14)
        : alpha(color, 0.08);
    },
    border: '1px solid',
    borderColor: (theme: Theme) => {
      if (color === 'text.secondary') {
        return 'divider';
      }
      return theme.palette.mode === 'dark'
        ? alpha(color, 0.28)
        : alpha(color, 0.18);
    },
    color: (theme: Theme) => {
      if (color === 'text.secondary') {
        return theme.palette.text.secondary;
      }
      return color;
    },
    '&:hover': {
      bgcolor: (theme: Theme) => {
        if (color === 'text.secondary') {
          return theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)';
        }
        return theme.palette.mode === 'dark'
          ? alpha(color, 0.22)
          : alpha(color, 0.12);
      },
      transform: 'translateY(-0.5px)',
    },
    '& .MuiChip-icon': {
      marginLeft: '-2px',
      marginRight: '-4px',
      color: 'inherit !important',
      fontSize: '14px',
    },
  };
};
