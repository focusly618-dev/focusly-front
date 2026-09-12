import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ProjectGroupTypes } from '../../../Workspace/types/workspace.types';

export interface DeleteFolderModalProps {
  open: boolean;
  onClose: () => void;
  group: ProjectGroupTypes | null;
  onConfirmDelete: (id: string) => Promise<unknown> | void;
}

export const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  open,
  onClose,
  group,
  onConfirmDelete,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!group) return;
    setLoading(true);
    try {
      await onConfirmDelete(group.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 1.5,
          maxWidth: '420px',
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
        {t('workspaceLibrary.deleteDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
          {t('workspaceLibrary.deleteDialog.description', {
            name: group?.name || '',
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={loading}
          onClick={handleDelete}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: 'none',
          }}
        >
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
