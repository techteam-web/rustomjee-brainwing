// components/BackButtonHandler.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't override if already on / or /home
    if (location.pathname === '/' || location.pathname === '/home') {
      return;
    }

    // Push current state to create a "buffer" entry
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      navigate('/home');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);

  return null;
};

export default BackButtonHandler;