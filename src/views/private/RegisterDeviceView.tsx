// views/private/SmartViewDashboard.tsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Importamos los componentes
import ModoCard from '../../components/ModoCard';
import VentanaCard from '../../components/VentanaCard';
import SeguroCard from '../../components/SeguroCard';
import AlarmaCard from '../../components/AlarmaCard';
import SensoresCard from '../../components/SensoresCard';

interface IDevice {
  _id?: string;
  deviceId: string;       // Ejemplo: "ventana1"
  lluvia: string;         // "SI" / "NO"
  alarma: string;         // "ACTIVADA" / "DESACTIVADA"
  diaNoche: string;       // "Día" / "Noche"
  temperatura: number;    // Ejemplo: 22.5
  ventana: string;        // "abierto" / "cerrado"
  modo: string;           // "manual" / "automático"
  seguro: string;         // "activo" / "desactivo"
}

// Conectar al servidor de websockets (ajusta la URL según corresponda)
const socket = io("http://localhost:5000");

const SmartViewDashboard: React.FC = () => {
  const [device, setDevice] = useState<IDevice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado al websocket");
    });

    socket.on("deviceUpdate", (updatedDevice: IDevice) => {
      console.log("Recibido deviceUpdate:", updatedDevice);
      setDevice(updatedDevice);
      setLoading(false);
      setError("");
    });

    socket.emit("getDevice", { deviceId: "ventana1" }, (response: IDevice) => {
      if (response) {
        setDevice(response);
        setLoading(false);
        setError("");
      } else {
        setError("No se encontró el dispositivo.");
        setLoading(false);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("deviceUpdate");
    };
  }, []);

  const sendCommand = async (command: string) => {
    if (!device) return;
    try {
      const res = await fetch(`http://localhost:5000/products/devices/${device.deviceId}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      if (!res.ok) {
        throw new Error(`Error al enviar comando: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers para la UI
  const handleToggleModo = () => {
    if (!device) return;
    if (device.modo.toLowerCase() === "manual") {
      sendCommand("automatico");
    } else {
      sendCommand("manual");
    }
  };

  const handleAbrir = () => sendCommand("abrir");
  const handleCerrar = () => sendCommand("cerrar");

  const handleToggleSeguro = () => {
    if (!device) return;
    if (device.seguro.toLowerCase() === "activo") {
      sendCommand("desactivarSeguro");
    } else {
      sendCommand("activarSeguro");
    }
  };

  const handleToggleAlarma = () => {
    if (!device) return;
    if (device.alarma === "ACTIVADA") {
      sendCommand("desactivarAlarma");
    } else {
      sendCommand("activarAlarma");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando dispositivo...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }
  if (!device) {
    return <div className="p-4 text-center">No se encontró el dispositivo.</div>;
  }

  // Mapeo de valores para los componentes
  const modoVal = device.modo.toLowerCase() === "manual" ? "Manual" : "Automático";
  const ventanaVal = device.ventana.toLowerCase() === "abierto" ? "Abierto" : "Cerrado";
  const seguroVal = device.seguro.toLowerCase() === "activo" ? "Activo" : "Desactivo";
  const alarmaVal = device.alarma === "ACTIVADA" ? "Activa" : "Desactivada";
  const lluviaVal = device.lluvia === "SI" ? "Sí" : "No";
  const diaNocheVal = device.diaNoche;
  const tempVal = String(device.temperatura);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 py-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">Smart Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Primera sección: Modo y Ventana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModoCard modo={modoVal} onToggleModo={handleToggleModo} />
          <VentanaCard
            estadoVentana={ventanaVal}
            onAbrir={handleAbrir}
            onCerrar={handleCerrar}
            modo={modoVal}
          />
        </div>

        {/* Segunda sección: Seguro y Alarma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <SeguroCard
            seguro={seguroVal}
            onToggleSeguro={handleToggleSeguro}
            modo={modoVal}
          />
          <AlarmaCard
            alarma={alarmaVal}
            onToggleAlarma={handleToggleAlarma}
            modo={modoVal}
          />
        </div>

        {/* Tercera sección: Sensores */}
        <div className="mt-8">
          <SensoresCard
            temperatura={tempVal}
            lluvia={lluviaVal}
            diaNoche={diaNocheVal}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 py-4">
        <p className="text-center text-white">
          © 2025 Smart Dashboard. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SmartViewDashboard;
