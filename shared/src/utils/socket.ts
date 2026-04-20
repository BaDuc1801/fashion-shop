import { socket } from '../socket/socket';
import { useAuthStore } from '../stores/authStore';

export const connectSocket = () => {
  const token = useAuthStore.getState().token;
  socket.auth = token ? { token } : {};

  if (socket.connected) return;

  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
