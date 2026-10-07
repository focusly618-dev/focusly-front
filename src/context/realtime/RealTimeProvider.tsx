import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { API_BASE_URL } from '@/config/env.config';
import {
  refreshQueries,
  requestCalendarSync,
  TASK_QUERIES,
  WORKSPACE_QUERIES,
} from '@/api/refreshQueries';
import { notify, soundPlayer } from '@/utils';
import { RealTimeContext } from './RealTimeContext';

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
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
      console.error('[REALTIME] Connection error:', error.message || error);
    });

    newSocket.on('schedule_updated', (data) => {
      console.log('[REALTIME] Received schedule_updated event:', data);

      // The lists on screen and the Google Calendar events. When this tab
      // made the change, it refreshed them already: skipped then.
      refreshQueries([...TASK_QUERIES, ...WORKSPACE_QUERIES], {
        fromServer: true,
      }).catch((err) => {
        console.error('[REALTIME] Failed to refetch queries via Apollo:', err);
      });
      requestCalendarSync(dispatch, { fromServer: true });
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
          notify.warning({
            title: `¡Tarea urgente: ${data.title}!`,
            description,
            duration: 6000,
          });
        } else {
          notify.info({
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

    // ── Workflow: Automatización TODO ─────────────────────────────────────────
    // Se dispara cuando el backend detecta un "TODO:" en el workspace guardado
    // y crea tareas automáticamente.
    // Muestra un toast informativo y refresca la lista de tareas.
    newSocket.on(
      'automation_triggered',
      (data: {
        workspaceId: string;
        tasksCreated: { taskId: string; taskTitle: string }[];
        count: number;
      }) => {
        console.log('[REALTIME] Automation triggered:', data);

        if (data.count === 0) return;

        const taskNames = data.tasksCreated
          .map((t) => `• ${t.taskTitle}`)
          .join('\n');

        notify.success({
          title: `⚡ ${data.count === 1 ? '1 tarea creada' : `${data.count} tareas creadas`} automáticamente`,
          description: taskNames,
          duration: 6000,
        });

        // Refrescar la lista de tareas para que aparezcan las nuevas (son
        // tareas nuevas del servidor, no un eco de un cambio de esta pestaña).
        refreshQueries(TASK_QUERIES).catch((err) => {
          console.error(
            '[REALTIME] Failed to refetch tasks after automation:',
            err,
          );
        });
      },
    );
    // ──────────────────────────────────────────────────────────────────────────

    return () => {
      newSocket.disconnect();
      setSocket(null);
      console.log('[REALTIME] Cleaned up socket connection');
    };
  }, [userId, dispatch, user?.pushEnabled]);

  return (
    <RealTimeContext.Provider value={socket}>
      {children}
    </RealTimeContext.Provider>
  );
};
