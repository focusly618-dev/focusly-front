import React, { useEffect, useState } from 'react';
import { sileo, type Notification } from '@/utils';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { getIcon } from './NotificationToaster.utils';
import {
  ToasterContainer,
  NotificationRow,
  NotificationIconWrapper,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationActionRow,
  actionButtonStyle,
  closeButtonStyle,
  closeIconStyle,
} from './NotificationToaster.styles';

export const NotificationToaster: React.FC = () => {
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => {
    return sileo.subscribe((notifications) => {
      setList(notifications);
    });
  }, []);

  return (
    <ToasterContainer>
      {list.map((notification) => (
        <NotificationRow
          key={notification.id}
          className={`motion-notification ${
            notification.dismissing ? 'motion-slide-out' : 'motion-slide-in'
          }`}
        >
          <NotificationIconWrapper className="motion-notification-icon-wrapper">
            {getIcon(notification.type)}
          </NotificationIconWrapper>
          <NotificationContent>
            <NotificationTitle className="motion-notification-title">
              {notification.title}
            </NotificationTitle>
            {notification.description && (
              <NotificationDescription className="motion-notification-body">
                {notification.description}
              </NotificationDescription>
            )}
            {notification.button && (
              <NotificationActionRow>
                <Button
                  variant="contained"
                  size="small"
                  className="motion-notification-action-btn"
                  onClick={() => {
                    notification.button?.onClick();
                    sileo.dismiss(notification.id);
                  }}
                  style={actionButtonStyle}
                >
                  {notification.button.title}
                </Button>
              </NotificationActionRow>
            )}
          </NotificationContent>
          {notification.type !== 'loading' && (
            <IconButton
              size="small"
              className="motion-notification-close-btn"
              onClick={() => sileo.dismiss(notification.id)}
              style={closeButtonStyle}
            >
              <CloseRoundedIcon style={closeIconStyle} />
            </IconButton>
          )}
        </NotificationRow>
      ))}
    </ToasterContainer>
  );
};
