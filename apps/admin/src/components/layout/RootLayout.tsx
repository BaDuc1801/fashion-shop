import { Spin, Badge, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Navigate, Outlet } from 'react-router-dom';
import {
  connectSocket,
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

  const { data: unreadCountData } = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: () => notificationService.getUnreadNotificationsCount(),
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) return;

    connectSocket();

    socket.on('connect', () => {
      console.log('✅ SOCKET CONNECTED:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.log('❌ SOCKET ERROR:', err.message);
    });

    socket.on('new_notification', (data: Notification) => {
      queryClient.setQueryData(
        ['notifications-infinite'],
        (old: GetNotificationsResponse[]) => {
          if (!old) return old;

          const firstPage = old[0];

          const exists = firstPage.data.some(
            (n: Notification) => n._id === data._id,
          );

          if (exists) return old;

          const newFirstPage: GetNotificationsResponse = {
            ...firstPage,
            data: [{ ...data, isRead: false }, ...firstPage.data],
          };

          return {
            ...old,
            pages: [newFirstPage, ...old.slice(1)],
            pageParams: [1, ...old.slice(1)],
          };
        },
      );

      queryClient.setQueryData<{ total: number }>(
        ['unread-notifications-count'],
        (old) => {
          if (!old) return { total: 1 };
          return { total: old.total + 1 };
        },
      );
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('new_notification');
    };
  }, [token, queryClient]);

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
      {/* NOTIFICATION */}
      <div className="absolute top-3 right-10 z-50">
        <Dropdown
          trigger={['click']}
          open={open}
          onOpenChange={(v) => setOpen(v)}
          placement="bottomRight"
          dropdownRender={() => <NotificationInfinityList setOpen={setOpen} />}
        >
          <Badge
            count={unreadCountData?.total || 0}
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
