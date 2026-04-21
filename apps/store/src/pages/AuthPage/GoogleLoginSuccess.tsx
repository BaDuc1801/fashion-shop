import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore, userService } from '@shared';

const GoogleLoginSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');

    const run = async () => {
      if (!token) {
        navigate('/auth', { replace: true });
        return;
      }

      try {
        useAuthStore.setState({ token });

        const me = await userService.getCurrentUser();

        useAuthStore.getState().setSessionFromLogin({
          token,
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
        console.error(err);
        useAuthStore.getState().clearSession();
        navigate('/auth', { replace: true });
      }
    };

    run();
  }, [navigate, params]);

  return <div>Logging in...</div>;
};

export default GoogleLoginSuccess;
