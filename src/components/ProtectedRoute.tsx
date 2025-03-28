// src/components/ProtectedRoute.tsx
import  { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const authContext = useContext(AuthContext);
  const token = localStorage.getItem('AUTH_TOKEN');

  // Si no hay token, o el contexto no está definido o el rol es "visitor", redirige al login.
  if (!token || !authContext || authContext.role === "visitor") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
