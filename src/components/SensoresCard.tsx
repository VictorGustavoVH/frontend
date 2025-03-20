import React from 'react';
import { 
  FaThermometerHalf, 
  FaCloudShowersHeavy, 
  FaCloud, 
  FaSun, 
  FaMoon, 
  FaQuestion 
} from 'react-icons/fa';

void FaThermometerHalf; // Dummy usage para evitar error TS6133

interface SensoresCardProps {
  temperatura: string;   // e.g. '20'
  lluvia: string;        // 'Sí' / 'No'
  diaNoche: string;      // 'Día' o 'Noche'
}

/**
 * TemperatureGauge: Widget circular que muestra la temperatura como gauge.
 */
const TemperatureGauge: React.FC<{ temperature: number; min?: number; max?: number }> = ({
  temperature,
  min = 0,
  max = 50,
}) => {
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clampedTemp = Math.min(Math.max(temperature, min), max);
  const percent = (clampedTemp - min) / (max - min);
  const strokeDashoffset = circumference - percent * circumference;

  let strokeColor = "#22c55e"; // verde por defecto
  if (temperature < 15) strokeColor = "#3b82f6"; // azul
  if (temperature > 25) strokeColor = "#ef4444"; // rojo

  return (
    <div className="relative">
      <svg height={radius * 2} width={radius * 2}>
        {/* Círculo de fondo */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Arco de progreso */}
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease-out" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{temperature}°C</span>
      </div>
    </div>
  );
};

/**
 * DayNightWidget: Muestra Día o Noche en un contenedor circular homogéneo.
 */
const DayNightWidget: React.FC<{ diaNoche: string }> = ({ diaNoche }) => {
  let icon = <FaQuestion className="text-3xl" />;
  let borderColor = "border-gray-400";
  let label = "--";
  if (diaNoche.toLowerCase().includes("dia")) {
    icon = <FaSun className="text-yellow-400 text-3xl" />;
    borderColor = "border-yellow-400";
    label = "Día";
  } else if (diaNoche.toLowerCase().includes("noche")) {
    icon = <FaMoon className="text-gray-500 text-3xl" />;
    borderColor = "border-gray-500";
    label = "Noche";
  }
  return (
    <div className="flex flex-col items-center">
      <div className={`w-24 h-24 flex items-center justify-center rounded-full border-2 ${borderColor} bg-white`}>
        {icon}
      </div>
      <p className="mt-2 text-lg font-semibold">{label}</p>
    </div>
  );
};

/**
 * RainWidget: Muestra el estado de la lluvia en un contenedor circular homogéneo.
 */
const RainWidget: React.FC<{ lluvia: string }> = ({ lluvia }) => {
  let icon = <FaQuestion className="text-3xl" />;
  let borderColor = "border-gray-400";
  let label = "Lluvia: --";
  if (lluvia.toLowerCase() === "sí" || lluvia.toLowerCase() === "si") {
    icon = <FaCloudShowersHeavy className="text-blue-500 text-3xl" />;
    borderColor = "border-blue-500";
    label = "Lluvia: Sí";
  } else if (lluvia.toLowerCase() === "no") {
    icon = <FaCloud className="text-gray-500 text-3xl" />;
    borderColor = "border-gray-500";
    label = "Lluvia: No";
  }
  return (
    <div className="flex flex-col items-center">
      <div className={`w-24 h-24 flex items-center justify-center rounded-full border-2 ${borderColor} bg-white`}>
        {icon}
      </div>
      <p className="mt-2 text-lg font-semibold">{label}</p>
    </div>
  );
};

const SensoresCard: React.FC<SensoresCardProps> = ({ temperatura, lluvia, diaNoche }) => {
  const tempNum = parseFloat(temperatura) || 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md transition-transform hover:-translate-y-1">
      <h5 className="text-xl font-bold text-blue-600 mb-6">Sensores</h5>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Widget Día/Noche */}
        <DayNightWidget diaNoche={diaNoche} />
        {/* Widget Temperatura */}
        <div className="flex flex-col items-center">
          <TemperatureGauge temperature={tempNum} min={0} max={50} />
          <p className="mt-2 text-lg font-semibold">Temperatura</p>
        </div>
        {/* Widget Lluvia */}
        <RainWidget lluvia={lluvia} />
      </div>
    </div>
  );
};

export default SensoresCard;
