import type { NotificationType } from '@/utils';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { notificationIconStyle } from './NotificationToaster.styles';

export const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return (
        <CheckCircleRoundedIcon style={notificationIconStyle.success} />
      );
    case 'error':
      return <ErrorRoundedIcon style={notificationIconStyle.error} />;
    case 'warning':
      return <WarningRoundedIcon style={notificationIconStyle.warning} />;
    case 'info':
      return <InfoRoundedIcon style={notificationIconStyle.info} />;
    case 'loading':
      return (
        <CircularProgress size={20} style={notificationIconStyle.loading} />
      );
  }
};
