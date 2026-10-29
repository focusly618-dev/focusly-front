import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  CircularProgress,
  Popover,
  Typography,
} from '@mui/material';
import { AddRounded as AddIcon } from '@mui/icons-material';
import { DEFAULT_CANVAS_ICON } from '../EditorContent/canvasLinks.utils';
import { CANVAS_ACCENT, CanvasIdentityField } from './CanvasIdentityField';

interface CreateCanvasPopoverProps {
  /** Open while set: the name it starts with (from the selected text) and
   * the screen point it opens at, right under that text. */
  draft: { name: string; anchor: { top: number; left: number } } | null;
  creating: boolean;
  onCancel: () => void;
  onCreate: (name: string, icon: string) => void;
}

/** Names a new canvas right under the text it's made from. */
export const CreateCanvasPopover = ({
  draft,
  creating,
  onCancel,
  onCreate,
}: CreateCanvasPopoverProps) => (
  <Popover
    open={draft !== null}
    onClose={creating ? undefined : onCancel}
    anchorReference="anchorPosition"
    anchorPosition={draft?.anchor}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    marginThreshold={16}
    PaperProps={{
      sx: {
        width: 340,
        maxWidth: 'calc(100vw - 32px)',
        p: 1.5,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
        backgroundImage: 'none',
      },
    }}
  >
    {/* Mounted per opening, so each starts from that selection's name. */}
    {draft && (
      <CreateCanvasForm
        initialName={draft.name}
        creating={creating}
        onCancel={onCancel}
        onCreate={onCreate}
      />
    )}
  </Popover>
);

const CreateCanvasForm = ({
  initialName,
  creating,
  onCancel,
  onCreate,
}: Omit<CreateCanvasPopoverProps, 'draft'> & { initialName: string }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(DEFAULT_CANVAS_ICON);
  const canCreate = name.trim().length > 0 && !creating;

  const submit = () => {
    if (canCreate) onCreate(name.trim(), icon);
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'text.secondary',
          mb: 0.75,
          px: 0.5,
        }}
      >
        {t('workspaceEditor.newCanvas', 'Nuevo canvas')}
      </Typography>

      <CanvasIdentityField
        icon={icon}
        name={name}
        onIconChange={setIcon}
        onNameChange={setName}
        size="medium"
        autoFocus
        onSubmit={submit}
        disabled={creating}
      />

      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.25 }}
      >
        <Button
          size="small"
          onClick={onCancel}
          disabled={creating}
          sx={{ color: 'text.secondary', textTransform: 'none' }}
        >
          {t('common.cancel', 'Cancelar')}
        </Button>
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={submit}
          disabled={!canCreate}
          startIcon={
            creating ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <AddIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
            px: 1.5,
            bgcolor: CANVAS_ACCENT,
            '&:hover': { bgcolor: '#0284c7' },
          }}
        >
          {t('workspaceEditor.createCanvas', 'Crear')}
        </Button>
      </Box>
    </>
  );
};
