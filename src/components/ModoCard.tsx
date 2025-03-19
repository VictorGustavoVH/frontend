// app/components/ModoCard.tsx
import React from 'react';
import { FaCogs, FaHandPaper } from 'react-icons/fa';

interface ModoCardProps {
  modo: string;  // 'Manual' o 'Automático'
  onToggleModo: () => void;
}

const ModoCard: React.FC<ModoCardProps> = ({ modo, onToggleModo }) => {
  const isAutomatico = modo.toLowerCase().includes('automático');

  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-4 transition-transform hover:-translate-y-1">
      <h5 className="text-xl font-bold text-blue-600 mb-2">Modo</h5>
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl mb-2">
          {isAutomatico ? (
            <FaCogs className="text-blue-400 animate-pulse" />
          ) : (
            <FaHandPaper className="text-yellow-400 animate-pulse" />
          )}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isAutomatico} 
            onChange={onToggleModo} 
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer 
            peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors
            peer-checked:bg-blue-600">
          </div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform 
            peer-checked:translate-x-5">
          </div>
        </label>
        <span className="mt-2 font-semibold">{modo}</span>
      </div>
      <small className="text-gray-500 block mt-1">Manual / Automático</small>
    </div>
  );
};

export default ModoCard;
