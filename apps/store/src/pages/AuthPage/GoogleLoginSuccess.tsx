import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, useAuthStore } from '@shared';

const GoogleLoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const me = await userService.getCurrentUser();

        useAuthStore.getState().setSessionFromLogin({
          token: '',
          user: {
            _id: me._id,
            name: me.name,
            email: me.email,
            avatar: me.avatar ?? '',
            address: me.address ?? '',
            phone: me.phone ?? '',
            role: me.role,
          },
        });

        navigate('/', { replace: true });
      } catch (err) {
        useAuthStore.getState().clearSession();
        navigate('/auth', { replace: true });
      }
    };

    run();
  }, [navigate]);

  return <div>Logging in...</div>;
};

export default GoogleLoginSuccess;