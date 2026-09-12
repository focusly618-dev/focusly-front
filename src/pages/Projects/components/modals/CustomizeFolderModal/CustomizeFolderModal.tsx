import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Folder as FolderFilledIcon,
  FolderOutlined as FolderOutlinedIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { StyledTextField } from '../CreateFolderModal/CreateFolderModal';
import type { ProjectGroupTypes } from '../../../Workspace/types/workspace.types';

const FOLDER_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Slate', value: '#64748b' },
];

export interface CustomizeFolderModalProps {
  open: boolean;
  onClose: () => void;
  group: ProjectGroupTypes | null;
  onUpdateFolder: (
    id: string,
    input: { name?: string; color?: string; emoji?: string },
  ) => Promise<unknown> | void;
}

export const CustomizeFolderModal: React.FC<CustomizeFolderModalProps> = ({
  open,
  onClose,
  group,
  onUpdateFolder,
}) => {
  const { t } = useTranslation();
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#7c3aed');
  const [folderStyle, setFolderStyle] = useState<'filled' | 'outlined'>(
    'filled',
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (group) {
      setFolderName(group.name);
      setFolderColor(group.color || '#7c3aed');
      setFolderStyle(group.emoji === 'outlined' ? 'outlined' : 'filled');
    }
  }, [group]);

  const handleSave = async () => {
    if (!group || !folderName.trim()) return;
    setLoading(true);
    try {
      await onUpdateFolder(group.id, {
        name: folderName.trim(),
        color: folderColor,
        emoji: folderStyle,
      });
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
          width: '520px',
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
        {t('workspaceLibrary.customizeDialog.title')}
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{
            display: 'block',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('workspaceLibrary.folderName')}
        </Typography>
        <StyledTextField
          fullWidth
          placeholder={t('workspaceLibrary.namePlaceholder')}
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          size="small"
          sx={{ mb: 3, maxWidth: 'none' }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{
            display: 'block',
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('workspaceLibrary.iconShape')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant={folderStyle === 'filled' ? 'contained' : 'outlined'}
            onClick={() => setFolderStyle('filled')}
            startIcon={<FolderFilledIcon />}
            sx={{
              flex: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('workspaceLibrary.filled')}
          </Button>
          <Button
            variant={folderStyle === 'outlined' ? 'contained' : 'outlined'}
            onClick={() => setFolderStyle('outlined')}
            startIcon={<FolderOutlinedIcon />}
            sx={{
              flex: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('workspaceLibrary.outlined')}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          sx={{
            display: 'block',
            mb: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('workspaceLibrary.folderColor')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap', mb: 1 }}>
          {FOLDER_COLORS.map((c) => (
            <Tooltip key={c.value} title={c.name}>
              <Box
                onClick={() => setFolderColor(c.value)}
                sx={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  bgcolor: c.value,
                  cursor: 'pointer',
                  border:
                    folderColor === c.value
                      ? '3px solid white'
                      : '2px solid transparent',
                  boxShadow:
                    folderColor === c.value ? `0 0 0 2px ${c.value}` : 'none',
                  transition: 'transform 0.15s',
                  '&:hover': {
                    transform: 'scale(1.15)',
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
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
          disabled={!folderName.trim() || loading}
          onClick={handleSave}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '8px',
            boxShadow: 'none',
          }}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
