import { useEffect } from 'react';
import { socket } from '../socket/socket';
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useAuthStore } from '../stores';
import { Notification, GetNotificationsResponse } from '../api';
import { connectSocket, disconnectSocket } from '../utils/socket';

export const useNotificationAdminSocket = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?.userId) return;

    connectSocket();

    socket.emit('join_admin_room', user.userId);

    const handleNewNotification = (data: Notification) => {
      queryClient.setQueryData(
        ['notifications-infinite', user.userId],
        (old: InfiniteData<GetNotificationsResponse>) => {
          if (!old) return old;

          const firstPage = old.pages[0];

          const exists = firstPage.data.some((n) => n._id === data._id);

          if (exists) return old;

          return {
            ...old,
            pages: [
              {
                ...firstPage,
                data: [{ ...data, isRead: false }, ...firstPage.data],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      queryClient.setQueryData(
        ['unread-notifications-count', user.userId],
        (old: { total: number }) => ({
          total: (old?.total ?? 0) + 1,
        }),
      );
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
      disconnectSocket();
    };
  }, [user?.userId, queryClient]);
};
