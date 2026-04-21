import { authEvent } from '@shared';
import { AppRoutes } from './routes';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      navigate('/');
    };

    authEvent.addEventListener('session-expired', handler);

    return () => {
      authEvent.removeEventListener('session-expired', handler);
    };
  }, [navigate]);

  return <AppRoutes />;
};

export default App;
