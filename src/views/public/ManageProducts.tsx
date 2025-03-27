import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ManageProducts: React.FC = () => {
  const navigate = useNavigate();

  // Datos del dispositivo actual. Puedes reemplazar estos datos con una consulta a una API o contexto.
  const existingDevice = {
    name: 'Ventana_Automatizada',
    description: 'Este es tu dispositivo IoT actual que ya tienes registrado.',
  };

  // Navega al formulario de registro de nuevos dispositivos
  const handleAddDevice = () => {
    navigate('/devices/register');
  };

  // Navega a la página de detalle del dispositivo actual (/mi-dispositivo)
  const handleViewExistingDevice = () => {
    navigate('/mi-dispositivo');
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Gestionar Dispositivos IoT
        </h1>
        
        {/* Sección del dispositivo actual */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Mi Dispositivo Actual
          </h2>
          <div className="bg-white shadow rounded p-4">
            <p className="text-xl font-bold">{existingDevice.name}</p>
            <p className="mt-2">{existingDevice.description}</p>
            <button
              onClick={handleViewExistingDevice}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ver dispositivo
            </button>
          </div>
        </section>
        
        {/* Sección para agregar un nuevo dispositivo */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Añadir Nuevo Dispositivo IoT
          </h2>
          <button
            onClick={handleAddDevice}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Agregar dispositivo
          </button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ManageProducts;
