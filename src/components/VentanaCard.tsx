///components/VentanaCard.tsx
import React from 'react';
import { RiWindowFill, RiWindowLine } from 'react-icons/ri';

interface VentanaCardProps {
  estadoVentana: string;   // 'Abierto' o 'Cerrado'
  onAbrir: () => void;
  onCerrar: () => void;
  modo: string;
}

const VentanaCard: React.FC<VentanaCardProps> = ({ estadoVentana, onAbrir, onCerrar, modo }) => {
  const isAbierto = estadoVentana.toLowerCase().includes('abierto');
  const esManual = modo.toLowerCase() === 'manual';

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-4 transition-transform hover:-translate-y-1">
      <h5 className="text-xl font-bold text-blue-600 mb-2">Ventana</h5>
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl mb-2">
          {isAbierto ? (
            <RiWindowFill className="text-green-500 animate-pulse" />
          ) : (
            <RiWindowLine className="text-red-500 animate-pulse" />
          )}
        </div>
        <p className="text-center mb-4">
          <span className="font-semibold">{estadoVentana}</span>
        </p>
        <div className="flex justify-around w-full">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            onClick={onAbrir}
            disabled={!esManual}
          >
            Abrir
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            onClick={onCerrar}
            disabled={!esManual}
          >
            Cerrar
          </button>
        </div>
      </div>
      <small className="text-gray-500 block mt-1">Abrir / Cerrar</small>
    </div>
  );
};

export default VentanaCard;
