// src/components/nav/HomeNavigation.t
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const HomeNavigation = () => {
  const navigate = useNavigate();

  const handleDeviceClick = async () => {
    try {
      await api.get('/devices/me');
      // Si el dispositivo existe, redirige al dashboard
      navigate('/mi-dispositivo');
    } catch (error) {
      // Si no se encontró el dispositivo (ej. error 404) u otro error, redirige al formulario de registro
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
    </div>
  );
};

export default HomeNavigation;
