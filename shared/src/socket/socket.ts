import { io } from 'socket.io-client';

export const socket = io('https://fashion-shop-socket.onrender.com', {
  autoConnect: false,
  withCredentials: true,
});
