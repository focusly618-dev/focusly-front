import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

export const RealTimeContext = createContext<Socket | null>(null);

export const useRealTime = () => useContext(RealTimeContext);
