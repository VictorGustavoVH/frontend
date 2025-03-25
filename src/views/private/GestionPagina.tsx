// GestionPagina.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PageData {
  quienesSomos: string;
  mision: string;
  vision: string;
  valores: string;
  preguntasFrecuentes: string;
  contacto?: string;
  terminos?: string;
}

const GestionPagina: React.FC = () => {
  const [data, setData] = useState<PageData>({
    quienesSomos: '',
    mision: '',
    vision: '',
    valores: '',
    preguntasFrecuentes: '',
    contacto: '',
    terminos: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Definir el identificador de la página (por ejemplo "contenido")
  const paginaName = "contenido";

  // Cargar datos actuales al montar el componente
  useEffect(() => {
    axios.get(`/admin/pagina/${paginaName}`)
      .then(res => {
        setData(prev => ({ ...prev, ...res.data }));
      })
      .catch(err => {
        console.error("Error al obtener la información de la página:", err);
      });
  }, [paginaName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    axios.patch(`/admin/pagina/${paginaName}`, data)
      .then(() => {
        setMessage("Contenido actualizado correctamente.");
      })
      .catch(err => {
        console.error("Error al actualizar el contenido:", err);
        setMessage("Error al actualizar el contenido.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="pagina-container">
      <h2>Editor de Contenido de la Página</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quienesSomos">¿Quiénes Somos?</label>
          <textarea
            id="quienesSomos"
            name="quienesSomos"
            value={data.quienesSomos}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mision">Misión</label>
          <textarea
            id="mision"
            name="mision"
            value={data.mision}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label htmlFor="vision">Visión</label>
          <textarea
            id="vision"
            name="vision"
            value={data.vision}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label htmlFor="valores">Valores</label>
          <textarea
            id="valores"
            name="valores"
            value={data.valores}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label htmlFor="preguntasFrecuentes">Preguntas Frecuentes (JSON)</label>
          <textarea
            id="preguntasFrecuentes"
            name="preguntasFrecuentes"
            value={data.preguntasFrecuentes}
            onChange={handleChange}
            rows={6}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contacto">Contacto</label>
          <textarea
            id="contacto"
            name="contacto"
            value={data.contacto || ''}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="terminos">Términos y Condiciones</label>
          <textarea
            id="terminos"
            name="terminos"
            value={data.terminos || ''}
            onChange={handleChange}
            rows={6}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
      <style>{`
        .pagina-container {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background: #f8f8f8;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }
        .pagina-container h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        .form-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #555;
        }
        .form-group textarea {
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: vertical;
          font-family: Arial, sans-serif;
        }
        .message {
          text-align: center;
          margin-bottom: 15px;
          color: green;
        }
        button {
          width: 100%;
          padding: 10px;
          font-size: 18px;
          background: #0057b8;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background: #aaa;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default GestionPagina;
