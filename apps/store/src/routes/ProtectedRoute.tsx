import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@shared';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
