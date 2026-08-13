import { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CreateNewFolder as CreateNewFolderIcon } from '@mui/icons-material';
import { BaseModal } from '@/components/modals';
import { Button, TextField } from '@/components/ui';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
}

export const CreateProjectModal = ({
  open,
  onClose,
  onCreate,
}: CreateProjectModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6'); // Default blue

  const colors = [
    { nameKey: 'colorNames.black', value: '#18181b' },
    { nameKey: 'colorNames.slate', value: '#475569' },
    { nameKey: 'colorNames.zinc', value: '#a1a1aa' },
    { nameKey: 'colorNames.darkGreen', value: '#054314ff' },
    { nameKey: 'colorNames.purple', value: '#2d0436ff' },
    { nameKey: 'colorNames.blue', value: '#3b82f6' },
    { nameKey: 'colorNames.indigo', value: '#6366f1' },
    { nameKey: 'colorNames.purple', value: '#8b5cf6' },
    { nameKey: 'colorNames.fuchsia', value: '#d946ef' },
    { nameKey: 'colorNames.pink', value: '#ec4899' },
    { nameKey: 'colorNames.rose', value: '#f43f5e' },
    { nameKey: 'colorNames.red', value: '#ef4444' },
    { nameKey: 'colorNames.orange', value: '#f97316' },
    { nameKey: 'colorNames.amber', value: '#f59e0b' },
    { nameKey: 'colorNames.yellow', value: '#eab308' },
    { nameKey: 'colorNames.lime', value: '#84cc16' },
    { nameKey: 'colorNames.green', value: '#22c55e' },
    { nameKey: 'colorNames.emerald', value: '#10b981' },
    { nameKey: 'colorNames.teal', value: '#14b8a6' },
    { nameKey: 'colorNames.seafoam', value: '#5eead4' },
    { nameKey: 'colorNames.cyan', value: '#06b6d4' },
    { nameKey: 'colorNames.sky', value: '#0ea5e9' },
  ];

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), selectedColor);
      setName('');
      onClose();
    }
  };

  const modalActions = (
    <>
      <Button onClick={onClose} variant="text" sx={{ color: 'text.secondary' }}>
        {t('common.cancel')}
      </Button>
      <Button
        onClick={handleCreate}
        variant="contained"
        disabled={!name.trim()}
        sx={{
          bgcolor: selectedColor,
          '&:hover': {
            bgcolor: selectedColor,
            filter: 'brightness(1.1)',
            boxShadow: `0 12px 24px ${selectedColor}55`,
          },
          boxShadow: `0 8px 16px ${selectedColor}33`,
        }}
      >
        {t('createProjectModal.create')}
      </Button>
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={t('createProjectModal.title')}
      subtitle={t('createProjectModal.subtitle')}
      icon={<CreateNewFolderIcon sx={{ fontSize: 28 }} />}
      iconBgColor={selectedColor}
      actions={modalActions}
    >
      <Box sx={{ mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'text.secondary',
            mb: 1.5,
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('createProjectModal.projectName')}
        </Typography>
        <TextField
          placeholder={t('createProjectModal.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreate();
            }
          }}
          sx={{ mb: 4 }}
        />

        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'text.secondary',
            mb: 2,
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('createProjectModal.projectColor')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
          {colors.map((color, idx) => (
            <Tooltip key={`${color.value}-${idx}`} title={t(color.nameKey)}>
              <Box
                onClick={() => setSelectedColor(color.value)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: color.value,
                  cursor: 'pointer',
                  border: '3px solid',
                  borderColor:
                    selectedColor === color.value ? 'white' : 'transparent',
                  boxShadow:
                    selectedColor === color.value
                      ? `0 0 0 2px ${color.value}`
                      : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: `0 4px 12px ${color.value}66`,
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>
    </BaseModal>
  );
};
