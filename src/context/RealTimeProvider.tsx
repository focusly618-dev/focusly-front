import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import type { RootState } from '@/redux/store';
import { incrementSyncVersion } from '@/redux/calendar/calendar.slice';
import { API_BASE_URL } from '@/config/env.config';
import { GET_TASKS } from '@/pages/Tasks/Task.graphql';
import { GET_WORKSPACES } from '@/pages/Workspace/workspaces.graphql';
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

    return () => {
      newSocket.disconnect();
      setSocket(null);
      console.log('[REALTIME] Cleaned up socket connection');
    };
  }, [userId, apolloClient, dispatch]);

  return (
    <RealTimeContext.Provider value={socket}>
      {children}
    </RealTimeContext.Provider>
  );
};
