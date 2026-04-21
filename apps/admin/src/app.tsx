import { useEffect } from 'react';
import AppRoutes from './routes';
import { useNavigate } from 'react-router-dom';
import { authEvent } from '@shared';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      navigate('/login');
    };

    authEvent.addEventListener('session-expired', handler);

    return () => {
      authEvent.removeEventListener('session-expired', handler);
    };
  }, [navigate]);

  return <AppRoutes />;
};

export default App;
