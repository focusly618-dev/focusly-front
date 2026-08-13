import React from 'react';
import { useTranslation } from 'react-i18next';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  ExitModalOverlay,
  ExitModalCard,
  WarningIconWrapper,
  ExitModalTitle,
  ExitModalText,
  ExitModalActions,
  CancelButton,
  EndSessionButton,
} from '../FocusMode.styles';

interface EndSessionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EndSessionModal: React.FC<EndSessionModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <ExitModalOverlay>
      <ExitModalCard>
        <WarningIconWrapper>
          <WarningAmberRoundedIcon />
        </WarningIconWrapper>
        <ExitModalTitle>{t('endSessionModal.title')}</ExitModalTitle>
        <ExitModalText>
          {t('endSessionModal.confirmText')}
          <br />
          {t('endSessionModal.warningText')}
        </ExitModalText>
        <ExitModalActions>
          <CancelButton onClick={onClose}>{t('common.cancel')}</CancelButton>
          <EndSessionButton onClick={onConfirm}>
            {t('endSessionModal.endSession')}
          </EndSessionButton>
        </ExitModalActions>
      </ExitModalCard>
    </ExitModalOverlay>
  );
};
