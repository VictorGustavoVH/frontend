// src/Router.tsx (o donde administres tus rutas)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
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
import ProductDetail from './views/private/ProductDetail';
import CartView from './views/private/CartView';
import SmartViewDashboard from './views/private/SmartViewDashboard';
import LinkTreeView from './views/private/LinkTreeView';
import UpdateProfile from './views/private/UpdateProfile';
import UserManagement from './views/private/UserManagement';
import ProductCrud from './views/private/ProductCrud';
import Pagina from './views/private/GestionPagina';
import ContactoView from './views/public/ContactoView';
import TerminosView from './views/public/TerminosView';
import ManageProducts from './views/public/ManageProducts';

export default function Router() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            {/* Layout para rutas autenticadas */}
            <Route element={<AppLayout />}>
              {/* Panel de administración */}
              <Route path="/admin">
                <Route index element={<LinkTreeView />} />
                <Route
                  path="product/GestionProductos/Register"
                  element={<RegisterProduct />}
                />
                <Route path="users" element={<UserManagement />} />
                <Route path="product/GestionProductos" element={<ProductCrud />} />
                <Route path="pagina" element={<Pagina />} />
              </Route>

              {/* Dispositivo */}
              <Route path="/mi-dispositivo">
                <Route index element={<SmartViewDashboard />} />
              </Route>

              {/* Otras rutas protegidas */}
              <Route path="/products/:name" element={<ProductDetail />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/perfil" element={<UpdateProfile />} />
              <Route path="/manage-products" element={<ManageProducts />} />
              <Route path="/devices/register" element={<RegisterDeviceView />} />
            </Route>
          </Route>

          {/* Rutas públicas */}
          <Route path="/" element={<HomeView />} />
          <Route path="/products" element={<Catalogo />} />
          <Route path="/preguntasFrecuentes" element={<PreguntasFrecuente />} />
          <Route path="/quienes-somos" element={<BodyContent />} />
          <Route path="/contenido" element={<BodyContent />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/contacto" element={<ContactoView />} />
          <Route path="/terminos" element={<TerminosView />} />

          {/* Página 404 */}
          <Route path="/404" element={<AuthLayout />}>
            <Route index element={<NotFoundView />} />
          </Route>

          {/* Captura de rutas no encontradas */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}