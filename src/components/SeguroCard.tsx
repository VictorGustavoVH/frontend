import React from 'react';
import Switch from 'react-switch';
import { FaLock, FaLockOpen } from 'react-icons/fa';

interface SeguroCardProps {
  seguro: string;  // 'Activo' o 'Desactivo'
  onToggleSeguro: () => void;
  modo: string;
}

const SeguroCard: React.FC<SeguroCardProps> = ({ seguro, onToggleSeguro, modo }) => {
  // Consideramos activo si el string es exactamente "activo" (sin mayúsculas)
  const isActivo = seguro.toLowerCase() === 'activo';
  const esManual = modo.toLowerCase() === 'manual';
  void esManual; // Dummy usage para evitar error TS6133

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-4 transition-transform hover:-translate-y-1">
      <h5 className="text-xl font-bold text-blue-600 mb-2">Seguro</h5>
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl mb-2">
          {isActivo ? (
            <FaLock className="text-green-500" />
          ) : (
            <FaLockOpen className="text-red-500" />
          )}
        </div>
        <Switch
          onChange={onToggleSeguro}
          checked={isActivo}
          //disabled={!esManual}
          offColor="#ccc"
          onColor="#22c55e"  // Verde (Tailwind green-600)
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
          handleDiameter={18}
        />
        <span className="mt-2 font-semibold">{seguro}</span>
      </div>
      <small className="text-gray-500 block mt-1">Activo / Desactivo</small>
    </div>
  );
};

export default SeguroCard;
