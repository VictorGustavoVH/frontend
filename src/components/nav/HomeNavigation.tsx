import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import api from '../../config/axios';

const HomeNavigation = () => {
  const navigate = useNavigate();

  const handleDeviceClick = async () => {
    try {
      // Verifica si el usuario ya tiene un dispositivo registrado
      await api.get('/devices/me');
      // Si existe, redirige al dashboard
      navigate('/mi-dispositivo');
    } catch (error) {
      // Si no se encontró el dispositivo, redirige al formulario de registro
      navigate('/devices/register');
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleDeviceClick}
        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
      >
        Mi Dispositivo
      </button>

      {/* Enlace "Carrito" */}
      <Link
        to="/cart"
        className="flex items-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
      >
        <FaShoppingCart className="mr-2" />
        Carrito
      </Link>
    </div>
  );
};

export default HomeNavigation;
