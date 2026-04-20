import { useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import { Notification } from '../api/notification/notification.response';

export const useNotificationSocket = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handler = (data: Notification) => {
      console.log('📥 RECEIVED:', data);
      setNotifications((prev) => [{ ...data, isRead: false }, ...prev]);
    };

    socket.on('new_notification', handler);

    return () => {
      socket.off('new_notification', handler);
    };
  }, []);

  return { notifications, setNotifications };
};
