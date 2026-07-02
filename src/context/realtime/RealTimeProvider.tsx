import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import type { RootState } from '@/redux/store';
import { incrementSyncVersion } from '@/redux/calendar/calendar.slice';
import { API_BASE_URL } from '@/config/env.config';
import { GET_TASKS } from '@/pages/Tasks/Tasks.graphql';
import { GET_WORKSPACES } from '@/pages/Workspace/Workspace.graphql';
import { sileo } from '@/utils/sileo';
import { soundPlayer } from '@/utils/notificationSounds';
import { RealTimeContext } from './RealTimeContext';

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let socketUrl = API_BASE_URL;
    if (!socketUrl) {
      socketUrl = window.location.origin;
    }

    console.log('[REALTIME] Connecting WebSocket to URL:', socketUrl);

    const newSocket = io(`${socketUrl}/realtime`, {
      query: { userId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(
        '[REALTIME] Connected to server successfully. Socket ID:',
        newSocket.id,
      );
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[REALTIME] Socket disconnected. Reason:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[REALTIME] Connection error:', error);
    });

    newSocket.on('schedule_updated', (data) => {
      console.log('[REALTIME] Received schedule_updated event:', data);

      // 1. Refetch current active tasks and workspaces queries
      apolloClient
        .refetchQueries({
          include: [GET_TASKS, GET_WORKSPACES],
        })
        .catch((err) => {
          console.error(
            '[REALTIME] Failed to refetch queries via Apollo:',
            err,
          );
        });

      // 2. Trigger Google Calendar refetch by incrementing version
      dispatch(incrementSyncVersion());
    });

    newSocket.on(
      'task_upcoming',
      (data: {
        taskId: string;
        title: string;
        deadline: string;
        minutesLeft: number;
        type: '5min' | '1min';
      }) => {
        console.log('[REALTIME] Received task_upcoming event:', data);

        const pushEnabled = user?.pushEnabled !== false;
        if (!pushEnabled) {
          console.log('[REALTIME] Notification ignored due to user settings');
          return;
        }

        soundPlayer.playTaskUpcoming();

        const date = new Date(data.deadline);
        const timeFormatted = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const description =
          data.type === '1min'
            ? `Comienza en 1 minuto (${timeFormatted})`
            : `Comienza en ${data.minutesLeft} minutos (${timeFormatted})`;

        if (data.type === '1min') {
          sileo.warning({
            title: `¡Tarea urgente: ${data.title}!`,
            description,
            duration: 6000,
          });
        } else {
          sileo.info({
            title: `Tarea próxima: ${data.title}`,
            description,
            duration: 5000,
          });
        }

        if (typeof Notification !== 'undefined') {
          if (Notification.permission === 'granted') {
            try {
              new Notification(data.title, {
                body: description,
                icon: '/Focusly.png',
                tag: data.taskId,
              });
            } catch (err) {
              console.warn(
                '[REALTIME] Standard Notification failed, trying Service Worker:',
                err,
              );
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready
                  .then((registration) => {
                    void registration.showNotification(data.title, {
                      body: description,
                      icon: '/Focusly.png',
                      tag: data.taskId,
                      renotify: true,
                    } as NotificationOptions);
                  })
                  .catch((swErr) => {
                    console.error(
                      '[REALTIME] Service Worker notification error:',
                      swErr,
                    );
                  });
              }
            }
          } else if (Notification.permission !== 'denied') {
            void Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification(data.title, {
                  body: description,
                  icon: '/Focusly.png',
                  tag: data.taskId,
                });
              }
            });
          }
        }
      },
    );

    return () => {
      newSocket.disconnect();
      setSocket(null);
      console.log('[REALTIME] Cleaned up socket connection');
    };
  }, [userId, apolloClient, dispatch, user?.pushEnabled]);

  return (
    <RealTimeContext.Provider value={socket}>
      {children}
    </RealTimeContext.Provider>
  );
};
