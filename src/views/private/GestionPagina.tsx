import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PaginaData {
  quienesSomos: string;
  mision: string;
  vision: string;
  valores: string;
  contacto: string;
  terminos: string;
}

const GestionPagina: React.FC = () => {
  const [pagina, setPagina] = useState<PaginaData>({
    quienesSomos: '',
    mision: '',
    vision: '',
    valores: '',
    contacto: '',
    terminos: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // Obtener datos actuales al cargar el componente
  useEffect(() => {
    axios.get<PaginaData>('/api/pagina/gestion') // Asegúrate de tener este endpoint
      .then(response => {
        setPagina(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar los datos:', error);
        setLoading(false);
      });
  }, []);

  // Actualiza el estado en cada cambio de input
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPagina({ ...pagina, [e.target.name]: e.target.value });
  };

  // Envía el formulario para actualizar los datos
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.patch('/api/pagina/gestion', pagina) // Asegúrate de tener implementado este endpoint
      .then(response => {
        setMessage('Datos actualizados correctamente');
      })
      .catch(error => {
        console.error('Error al actualizar:', error);
        setMessage('Error al actualizar los datos');
      });
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="gestion-pagina">
      <h1>Gestión de Página</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiénes Somos:</label>
          <textarea
            name="quienesSomos"
            value={pagina.quienesSomos}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Misión:</label>
          <textarea
            name="mision"
            value={pagina.mision}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Visión:</label>
          <textarea
            name="vision"
            value={pagina.vision}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Valores:</label>
          <textarea
            name="valores"
            value={pagina.valores}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Contacto:</label>
          <textarea
            name="contacto"
            value={pagina.contacto}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Términos y Condiciones:</label>
          <textarea
            name="terminos"
            value={pagina.terminos}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
      {/* Puedes agregar estilos o importar un archivo CSS */}
      <style>{`
        .gestion-pagina {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: vertical;
        }
        button {
          padding: 10px 20px;
          background-color: #0057b8;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #004399;
        }
      `}</style>
    </div>
  );
};

export default GestionPagina;
