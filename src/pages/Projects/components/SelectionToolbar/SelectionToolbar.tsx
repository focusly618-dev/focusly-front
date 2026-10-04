import React from 'react';
import { Box, Button, Checkbox, Typography } from '@mui/material';
import {
  CheckBoxOutlined as CheckBoxOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface SelectionToolbarProps {
  isSelecting: boolean;
  selectedCount: number;
  allSelected: boolean;
  hasItems: boolean;
  onStart: () => void;
  onCancel: () => void;
  onToggleAll: () => void;
  onDelete: () => void;
  /** More bulk actions, shown before Delete. */
  children?: React.ReactNode;
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  isSelecting,
  selectedCount,
  allSelected,
  hasItems,
  onStart,
  onCancel,
  onToggleAll,
  onDelete,
  children,
}) => {
  const { t } = useTranslation();

  if (!isSelecting) {
    if (!hasItems) return null;
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          startIcon={<CheckBoxOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={onStart}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
            color: 'text.secondary',
            borderRadius: '8px',
            '&:hover': { color: '#008767' },
          }}
        >
          {t('selection.select')}
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Checkbox
          size="small"
          checked={allSelected}
          indeterminate={selectedCount > 0 && !allSelected}
          onChange={onToggleAll}
          disabled={!hasItems}
          sx={{
            '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#008767' },
          }}
          inputProps={{ 'aria-label': t('selection.selectAll') }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, fontSize: '13px', color: 'text.primary' }}
        >
          {selectedCount > 0
            ? t('selection.selectedCount', { count: selectedCount })
            : t('selection.selectAll')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={onCancel}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          {t('common.cancel')}
        </Button>
        {children}
        <Button
          size="small"
          variant="contained"
          color="error"
          disabled={selectedCount === 0}
          startIcon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />}
          onClick={onDelete}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: 'none',
          }}
        >
          {selectedCount > 0
            ? t('selection.deleteCount', { count: selectedCount })
            : t('common.delete')}
        </Button>
      </Box>
    </Box>
  );
};
