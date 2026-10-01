import { Typography, Box } from '@mui/material';
import { WarningRounded as WarningRoundedIcon } from '@mui/icons-material';
import { BaseModal } from '../BaseModal';
import { Button } from '../../ui/Button';
import type { ModalItemsProps } from './modalDelete.types';
import {
  deleteButtonSx,
  cancelButtonSx,
  descriptionBoxSx,
  descriptionTextSx,
  actionsContainerSx,
  deleteIconSx,
  modalSx,
} from './modalDelete.styles';

export const ModalDelete = ({
  title,
  description,
  open,
  onClose,
  onConfirm,
  subtitle = 'Confirming permanent deletion',
  confirmLabel = 'Delete Workspace',
  cancelLabel = 'Cancel',
  isLoading = false,
}: ModalItemsProps) => {
  const modalActions = (
    <Box sx={actionsContainerSx}>
      <Button
        variant="contained"
        fullWidth
        onClick={onConfirm}
        disabled={isLoading}
        sx={deleteButtonSx}
      >
        {confirmLabel}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        onClick={onClose}
        disabled={isLoading}
        sx={cancelButtonSx}
      >
        {cancelLabel}
      </Button>
    </Box>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={<WarningRoundedIcon sx={deleteIconSx} />}
      iconBgColor="rgba(242, 72, 72, 0.15)"
      actions={modalActions}
      sx={modalSx}
    >
      <Box sx={descriptionBoxSx}>
        <Typography variant="body2" sx={descriptionTextSx}>
          {description}
        </Typography>
      </Box>
    </BaseModal>
  );
};
