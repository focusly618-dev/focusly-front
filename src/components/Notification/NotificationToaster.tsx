import React, { useEffect, useState } from 'react';
import { sileo, type Notification, type NotificationType } from '@/utils';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

export const NotificationToaster: React.FC = () => {
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => {
    return sileo.subscribe((notifications) => {
      setList(notifications);
    });
  }, []);

  const getIcon = (type: NotificationType) => {
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
        return (
          <InfoRoundedIcon style={{ color: '#3b82f6', fontSize: '22px' }} />
        );
      case 'loading':
        return (
          <CircularProgress
            size={20}
            style={{ color: 'var(--sileo-spinner-color)' }}
          />
        );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {list.map((notification) => (
        <div
          key={notification.id}
          className={`motion-notification ${
            notification.dismissing ? 'motion-slide-out' : 'motion-slide-in'
          }`}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <div
            className="motion-notification-icon-wrapper"
            style={{ marginTop: '2px' }}
          >
            {getIcon(notification.type)}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="motion-notification-title"
              style={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
              }}
            >
              {notification.title}
            </div>
            {notification.description && (
              <div
                className="motion-notification-body"
                style={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  marginTop: '4px',
                  textAlign: 'left',
                }}
              >
                {notification.description}
              </div>
            )}
            {notification.button && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginTop: '10px',
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  className="motion-notification-action-btn"
                  onClick={() => {
                    notification.button?.onClick();
                    sileo.dismiss(notification.id);
                  }}
                  style={{
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'none',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    padding: '4px 12px',
                  }}
                >
                  {notification.button.title}
                </Button>
              </div>
            )}
          </div>
          {notification.type !== 'loading' && (
            <IconButton
              size="small"
              className="motion-notification-close-btn"
              onClick={() => sileo.dismiss(notification.id)}
              style={{
                padding: '4px',
                marginLeft: '4px',
                marginTop: '2px',
              }}
            >
              <CloseRoundedIcon style={{ fontSize: '18px' }} />
            </IconButton>
          )}
        </div>
      ))}
    </div>
  );
};
