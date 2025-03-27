import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RegisterDeviceView: React.FC = () => {
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceId) {
      setError('El deviceId (MAC) es obligatorio');
      return;
    }

    try {
      // Realiza la petición POST al endpoint /devices/register
      const response = await fetch('/devices/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deviceId })
      });

      if (!response.ok) {
        throw new Error('Error al registrar el dispositivo');
      }

      alert('Dispositivo registrado exitosamente');
      navigate('/Manage-products');
    } catch (err) {
      setError('Error al registrar el dispositivo');
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Registrar Nuevo Dispositivo IoT</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Device ID (MAC Address)</label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ej: AA:BB:CC:DD:EE:FF"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Registrar Dispositivo
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterDeviceView;
