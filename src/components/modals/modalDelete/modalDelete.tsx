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
} from './modalDelete.styles';

export const ModalDelete = ({ title, description, open, onClose, onConfirm }: ModalItemsProps) => {
  const modalActions = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
      <Button
        variant="contained"
        fullWidth
        onClick={onConfirm}
        sx={deleteButtonSx}
      >
        Delete Workspace
      </Button>

      <Button
        variant="outlined"
        fullWidth
        onClick={onClose}
        sx={cancelButtonSx}
      >
        Cancel
      </Button>
    </Box>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle="Confirming permanent deletion"
      icon={<WarningRoundedIcon sx={{ color: '#f24848' }} />}
      iconBgColor="rgba(242, 72, 72, 0.15)"
      actions={modalActions}
      sx={{ bgcolor: '#151c28', border: '1px solid #283447' }}
    >
      <Box sx={descriptionBoxSx}>
        <Typography variant="body2" sx={descriptionTextSx}>
          {description}
        </Typography>
      </Box>
    </BaseModal>
  );
};
