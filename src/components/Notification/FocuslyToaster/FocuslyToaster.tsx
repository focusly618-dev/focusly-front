import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import {
  CheckCircleRounded as SuccessIcon,
  ErrorRounded as ErrorIcon,
  WarningRounded as WarningIcon,
  InfoRounded as InfoIcon,
  CloseRounded as CloseIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@/redux/hooks';

// Below the session banner when it shows (see App's top padding).
const BANNER_OFFSET = { xs: 104, sm: 114 };

/**
 * Where notify() toasts appear: top center, the one spot no page puts its
 * buttons (create buttons sit top right; the chat input, the editor's AI
 * dock and bulk bars sit at the bottom). At most three, stacked; hovering
 * expands and pauses them, a swipe or the × closes one.
 */
export const FocuslyToaster = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const bannerShown = useAppSelector(
    (state) => state.auth.sessionExpiredNotice,
  );
  const top = bannerShown
    ? BANNER_OFFSET[isPhone ? 'xs' : 'sm']
    : isPhone
      ? 12
      : 16;

  return (
    <Toaster
      position="top-center"
      theme={theme.palette.mode}
      offset={{ top }}
      mobileOffset={{ top, left: 12, right: 12 }}
      visibleToasts={3}
      gap={8}
      closeButton
      containerAriaLabel={t('toasts.region')}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <InfoIcon />,
        loading: <CircularProgress size={16} thickness={5} color="inherit" />,
        close: <CloseIcon />,
      }}
      toastOptions={{
        className: 'focusly-toast',
        classNames: {
          title: 'focusly-toast-title',
          description: 'focusly-toast-description',
          icon: 'focusly-toast-icon',
          actionButton: 'focusly-toast-action',
          closeButton: 'focusly-toast-close',
        },
      }}
    />
  );
};
