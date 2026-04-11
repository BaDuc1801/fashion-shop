import { Spin } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminUser, useAuthStore } from '@shared';
import SidebarMenu from './SidebarMenu';

const RootLayout = () => {
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

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
    <div className="flex">
      <SidebarMenu />
      <div className="ml-80 px-10 py-5 border-l border-gray-200 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
