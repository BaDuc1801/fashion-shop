import { io } from 'socket.io-client';

export const socket = io('https://fashion-shop-socket.onrender.com', {
  autoConnect: true,
  withCredentials: true,
});
