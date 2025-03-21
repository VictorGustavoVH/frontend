import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './views/public/Login';
import RegisterView from './views/public/Register';
import Catalogo from './views/public/Catalogo';
import PreguntasFrecuente from './views/public/PreguntasFrecuente';
import BodyContent from './views/public/BodyContent';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import NotFoundView from './views/public/NotFoundView';
import HomeView from './views/public/Home';
import Inicio from './views/public/Inicio';
import RegisterProduct from './views/private/RegisterProductView';
import RegisterDeviceView from './views/private/RegisterDeviceView';
import ProtectedRoute from './components/ProtectedRoute';
import DetalleProducto from './views/private/DetalleProducto';
import SmartViewDashboard from './views/private/SmartViewDashboard';
import LinkTreeView from './views/private/LinkTreeView';
import ProfileView from './views/private/UserProfileForm';
import UserManagement from './views/private/UserManagement';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />

        {/* Rutas del panel de administración */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<LinkTreeView />} />
            <Route path="product/register" element={<RegisterProduct />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>

        {/* Ruta protegida para el dashboard del dispositivo */}
        <Route path="/mi-dispositivo" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<SmartViewDashboard />} />
          </Route>
        </Route>

        {/* Ruta protegida para registrar dispositivo */}
        <Route path="/devices/register" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<RegisterDeviceView />} />
          </Route>
        </Route>

        {/* Rutas públicas */}
        <Route path="/" element={<HomeView />} />
        <Route path="/products" element={<Catalogo />} />
        <Route path="/products/:name" element={<DetalleProducto />} />
        <Route path="/preguntasFrecuentes" element={<PreguntasFrecuente />} />
        <Route path="/quienes-somos" element={<BodyContent />} />
        <Route path="/contenido" element={<BodyContent />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/perfil" element={<ProfileView />} />

        {/* Página 404 */}
        <Route path="/404" element={<AuthLayout />}>
          <Route index element={<NotFoundView />} />
        </Route>

        {/* Captura de rutas no encontradas */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  );
}
