import type { CSSProperties } from 'react';
import { styled } from '@mui/material';
import type { NotificationType } from '@/utils';

export const ToasterContainer = styled('div')({
  position: 'fixed',
  top: '24px',
  right: '24px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  pointerEvents: 'none',
});

export const NotificationRow = styled('div')({
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
});

export const NotificationIconWrapper = styled('div')({
  marginTop: '2px',
});

export const NotificationContent = styled('div')({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const NotificationTitle = styled('div')({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  textAlign: 'left',
});

export const NotificationDescription = styled('div')({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  marginTop: '4px',
  textAlign: 'left',
});

export const NotificationActionRow = styled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: '10px',
});

export const actionButtonStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: '12px',
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: 'none',
  padding: '4px 12px',
};

export const closeButtonStyle: CSSProperties = {
  padding: '4px',
  marginLeft: '4px',
  marginTop: '2px',
};

export const closeIconStyle: CSSProperties = {
  fontSize: '18px',
};

export const notificationIconStyle: Record<NotificationType, CSSProperties> = {
  success: { color: '#10b981', fontSize: '22px' },
  error: { color: '#ef4444', fontSize: '22px' },
  warning: { color: '#f59e0b', fontSize: '22px' },
  info: { color: '#3b82f6', fontSize: '22px' },
  loading: { color: 'var(--sileo-spinner-color)' },
};
