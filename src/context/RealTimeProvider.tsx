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

    const newSocket = io(`${socketUrl}/realtime`, {
      query: { userId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    newSocket.on('schedule_updated', () => {
      // 1. Refetch current active tasks and workspaces queries
      apolloClient
        .refetchQueries({
          include: [GET_TASKS, GET_WORKSPACES],
        })
        .catch(() => {});

      // 2. Trigger Google Calendar refetch by incrementing version
      dispatch(incrementSyncVersion());
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [userId, apolloClient, dispatch]);

  return (
    <RealTimeContext.Provider value={socket}>
      {children}
    </RealTimeContext.Provider>
  );
};
