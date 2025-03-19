//layouts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) return null; // No renderiza nada hasta verificar el token

  return (
    <div>
      
      <Outlet /> {/* Renderiza las rutas hijas como /admin/inicio */}
    </div>
  );
};

export default AppLayout;
