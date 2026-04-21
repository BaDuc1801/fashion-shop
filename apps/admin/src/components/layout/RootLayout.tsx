import { Spin, Badge, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Navigate, Outlet } from 'react-router-dom';
import {
  isAdminUser,
  useAuthStore,
  notificationService,
  NotificationInfinityList,
  useNotificationAdminSocket,
} from '@shared';
import SidebarMenu from './SidebarMenu';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const RootLayout = () => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const hasHydrated = useAuthStore.persist.hasHydrated();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const { data: unreadCountData } = useQuery({
    queryKey: ['unread-notifications-count', user?.userId],
    queryFn: () => notificationService.getUnreadNotificationsCount(),
    enabled: !!user?.userId,
  });

  useNotificationAdminSocket();

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
            <NotificationInfinityList
              t={t}
              lang={lang}
              setOpen={setOpen}
              queryKeyPrefix="notifications-infinite"
              unreadKey="unread-notifications-count"
              getList={notificationService.getNotifications}
              markAsRead={notificationService.markAsRead}
              markAllAsRead={notificationService.markAllAsRead}
              isAdmin={true}
            />
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
