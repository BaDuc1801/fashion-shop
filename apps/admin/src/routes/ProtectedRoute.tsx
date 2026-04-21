import { Navigate } from 'react-router-dom';
import { ADMIN_PANEL_ROLE, useAuthStore } from '@shared';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== ADMIN_PANEL_ROLE) {
    return <Navigate to="/" replace />;
  }

  return children;
};
