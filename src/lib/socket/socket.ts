'use client';

import { io, Socket } from 'socket.io-client';

const isBrowser = typeof window !== 'undefined';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!isBrowser) {
    return {} as Socket;
  }

  if (!socket) {
    socket = io({
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
