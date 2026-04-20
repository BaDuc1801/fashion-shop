import { Spin, Badge, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Navigate, Outlet } from 'react-router-dom';
import {
  connectSocket,
  disconnectSocket,
  isAdminUser,
  socket,
  useAuthStore,
  notificationService,
  Notification,
  NotificationInfinityList,
  GetNotificationsResponse,
} from '@shared';
import SidebarMenu from './SidebarMenu';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const RootLayout = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const hasHydrated = useAuthStore.persist.hasHydrated();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  // ✅ LOAD ONCE ONLY
  const { data: unreadCountData } = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: () => notificationService.getUnreadNotificationsCount(),
    enabled: !!token,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!token || !user) return;

    connectSocket();

    socket.emit('join_admin_room', user.userId);

    const handleNewNotification = (data: Notification) => {
      console.log('🔥 NEW NOTI:', data);

      // =============================
      // 1. UPDATE LIST (INFINITE)
      // =============================
      queryClient.setQueryData(
        ['notifications-infinite'],
        (old: any) => {
          if (!old) return old;

          const pages = old.pages ?? [];
          const firstPage = pages[0];

          const exists = firstPage?.data?.some(
            (n: Notification) => n._id === data._id,
          );

          if (exists) return old;

          const updatedFirstPage: GetNotificationsResponse = {
            ...firstPage,
            data: [{ ...data, isRead: false }, ...firstPage.data],
          };

          return {
            ...old,
            pages: [updatedFirstPage, ...pages.slice(1)],
          };
        },
      );

      // =============================
      // 2. UPDATE BADGE (SAFE WAY)
      // =============================
      queryClient.setQueryData(
        ['unread-notifications-count'],
        (old: any) => {
          const prev = old?.total ?? 0;

          return {
            total: prev + 1,
          };
        },
      );
    };

    const handleNotificationRead = () => {
      queryClient.setQueryData(['unread-notifications-count'], (old: any) => ({
        total: Math.max(0, (old?.total ?? 1) - 1),
      }));
    };

    const handleNotificationReadAll = () => {
      queryClient.setQueryData(['unread-notifications-count'], () => ({
        total: 0,
      }));
    };

    socket.on('connect', () => {
      console.log('✅ SOCKET CONNECTED:', socket.id);
    });

    socket.on('connect_error', (err: Error) => {
      console.log('❌ SOCKET ERROR:', err.message);
    });

    socket.on('new_notification', handleNewNotification);
    socket.on('notification_read', handleNotificationRead);
    socket.on('notification_read_all', handleNotificationReadAll);

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('new_notification', handleNewNotification);
      socket.off('notification_read', handleNotificationRead);
      socket.off('notification_read_all', handleNotificationReadAll);
      disconnectSocket();
    };
  }, [token, user, queryClient]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!token || !isAdminUser(user)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex relative">
      <div className="absolute top-3 right-10 z-50">
        <Dropdown
          trigger={['click']}
          open={open}
          onOpenChange={(v) => setOpen(v)}
          placement="bottomRight"
          dropdownRender={() => (
            <NotificationInfinityList setOpen={setOpen} />
          )}
        >
          <Badge
            count={unreadCountData?.total ?? 0}
            size="middle"
            offset={[-3, 5]}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-xl cursor-pointer border border-gray-200">
              <BellOutlined style={{ fontSize: 18 }} />
            </div>
          </Badge>
        </Dropdown>
      </div>

      <SidebarMenu />

      <div className="ml-80 px-10 py-5 border-l border-gray-200 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;