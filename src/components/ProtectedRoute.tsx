import  { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);

  // Si por alguna razón no se carga el contexto, se redirige a login
  if (!authContext) {
    return <Navigate to="/login" replace />;
  }

  // Si el role es "visitor", consideramos que el usuario no está autenticado
  if (authContext.role === "visitor") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
