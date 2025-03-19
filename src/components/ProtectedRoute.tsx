//component/protectedRoute
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('AUTH_TOKEN');

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
