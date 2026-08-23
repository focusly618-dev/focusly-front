import type { NotificationType } from '@/utils';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CircularProgress from '@mui/material/CircularProgress';

export const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return (
        <CheckCircleRoundedIcon
          style={{ color: '#10b981', fontSize: '22px' }}
        />
      );
    case 'error':
      return (
        <ErrorRoundedIcon style={{ color: '#ef4444', fontSize: '22px' }} />
      );
    case 'warning':
      return (
        <WarningRoundedIcon style={{ color: '#f59e0b', fontSize: '22px' }} />
      );
    case 'info':
      return <InfoRoundedIcon style={{ color: '#3b82f6', fontSize: '22px' }} />;
    case 'loading':
      return (
        <CircularProgress
          size={20}
          style={{ color: 'var(--sileo-spinner-color)' }}
        />
      );
  }
};
