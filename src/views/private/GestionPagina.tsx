// GestionPagina.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import api from '../../config/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export type PageContent = {
  quienesSomos: string;
  mision: string;
  vision: string;
  valores: string;
  preguntasFrecuentes: string;
  contacto?: string;
  terminos?: string;
};

const GestionPagina: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PageContent>();

  // Define el identificador de la página a gestionar (por ejemplo "contenido")
  const paginaName = "contenido";

  // Cargar el contenido actual cuando se monta el componente
  useEffect(() => {
    api.get(`/admin/pagina/${paginaName}`)
      .then((res) => {
        reset({
          quienesSomos: res.data.quienesSomos,
          mision: res.data.mision,
          vision: res.data.vision,
          valores: res.data.valores,
          preguntasFrecuentes: res.data.preguntasFrecuentes,
          contacto: res.data.contacto,
          terminos: res.data.terminos,
        });
      })
      .catch((err) => {
        toast.error("Error al cargar el contenido");
        console.error(err);
      });
  }, [paginaName, reset]);

  const onSubmit = async (data: PageContent) => {
    try {
      await api.patch(`/admin/pagina/${paginaName}`, data);
      toast.success("Contenido actualizado correctamente");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(String(error.response.data.error));
      } else {
        toast.error("Error al actualizar el contenido");
      }
      console.error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-center mb-6">Gestión de Contenido de la Página</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ¿Quiénes Somos? */}
          <div>
            <label className="block text-lg font-medium text-blue-700">¿Quiénes Somos?</label>
            <textarea 
              className="w-full p-2 mt-1 rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
              {...register('quienesSomos', { required: 'Este campo es obligatorio' })}
            />
            {errors.quienesSomos && <p className="text-red-500 text-sm">{errors.quienesSomos.message}</p>}
          </div>

          {/* Misión */}
          <div>
            <label className="block text-lg font-medium text-blue-700">Misión</label>
            <textarea 
              className="w-full p-2 mt-1 rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
              {...register('mision', { required: 'Este campo es obligatorio' })}
            />
            {errors.mision && <p className="text-red-500 text-sm">{errors.mision.message}</p>}
          </div>

          {/* Visión */}
          <div>
            <label className="block text-lg font-medium text-blue-700">Visión</label>
            <textarea 
              className="w-full p-2 mt-1 rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
              {...register('vision', { required: 'Este campo es obligatorio' })}
            />
            {errors.vision && <p className="text-red-500 text-sm">{errors.vision.message}</p>}
          </div>

          {/* Valores */}
          <div>
            <label className="block text-lg font-medium text-blue-700">Valores</label>
            <textarea 
              className="w-full p-2 mt-1 rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
              {...register('valores', { required: 'Este campo es obligatorio' })}
            />
            {errors.valores && <p className="text-red-500 text-sm">{errors.valores.message}</p>}
          </div>

          {/* Preguntas Frecuentes (Formato JSON) */}
          <div>
            <label className="block text-lg font-medium text-blue-700">
              Preguntas Frecuentes (Formato JSON)
            </label>
            <textarea 
              className="w-full p-2 mt-1 rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
              {...register('preguntasFrecuentes', { required: 'Este campo es obligatorio' })}
              placeholder={`[ { "id": "faq1", "title": "Pregunta 1", "description": "Descripción", "icon": "❓", "content": "<p>Respuesta</p>" } ]`}
            />
            {errors.preguntasFrecuentes && <p className="text-red-500 text-sm">{errors.preguntasFrecuentes.message}</p>}
          </div>

          {/* Contacto */}
          <div>
            <label className="block text-lg font-medium text-blue-700">Contacto</label>
            <textarea 
              className="w-full p-2 mt-1 rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
              {...register('contacto')}
            />
          </div>

          {/* Términos y Condiciones */}
          <div>
            <label className="block text-lg font-medium text-blue-700">Términos y Condiciones</label>
            <textarea 
              className="w-full p-2 mt-1 rounded border border-blue-300 focus:ring-2 focus:ring-blue-400"
              {...register('terminos')}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold text-lg transition duration-300"
          >
            Actualizar Contenido
          </button>
        </form>
      </div>
      <Footer />
      <style>{`
        .container {
          max-width: 800px;
        }
      `}</style>
    </div>
  );
};

export default GestionPagina;
