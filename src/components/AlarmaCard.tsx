// /components/AlarmaCard.tsx
import React from 'react';
import Switch from 'react-switch';
import { FaBell } from 'react-icons/fa';

interface AlarmaCardProps {
  alarma: string;          
  onToggleAlarma: () => void;
  modo: string;
}

const AlarmaCard: React.FC<AlarmaCardProps> = ({ alarma, onToggleAlarma, modo }) => {
  // Comparamos exactamente para evitar que "desactivada" incluya "activa"
  const isActiva = alarma.toLowerCase() === "activa";
  const esManual = modo.toLowerCase() === "manual";

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-4 transition-transform hover:-translate-y-1">
      <h5 className="text-xl font-bold text-blue-600 mb-2">Alarma</h5>
      <div className="flex flex-col items-center justify-center">
        {/* Ícono de campana: rojo y con animación si activa, verde si inactiva */}
        <div className="text-6xl mb-2">
          <FaBell className={`transition-all duration-300 ${isActiva ? 'text-red-500 animate-bounce' : 'text-green-500'}`} />
        </div>
        <Switch
          onChange={onToggleAlarma}
          checked={isActiva}
          //disabled={!esManual}
          offColor="#ccc"
          onColor="#ef4444"  // Rojo para activo
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
          handleDiameter={18}
        />
        <span className="mt-2 font-semibold">
          {isActiva ? "Alarma Activada" : "Alarma Desactivada"}
        </span>
      </div>
      <small className="text-gray-500 block mt-1">Activar/Desactivar</small>
    </div>
  );
};

export default AlarmaCard;
