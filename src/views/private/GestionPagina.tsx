import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import api from '../../config/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

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
  const paginaName = "contenido";

  useEffect(() => {
    api.get(`/admin/pagina/${paginaName}`)
      .then((res) => {
        reset(res.data);
      })
      .catch((err) => {
        toast.error("❌ Error al cargar el contenido");
        console.error(err);
      });
  }, [paginaName, reset]);

  const onSubmit = async (data: PageContent) => {
    try {
      await api.patch(`/admin/pagina/${paginaName}`, data);

      toast.custom(() => (
        <div className="bg-green-100 text-green-800 px-6 py-4 rounded shadow-md flex items-center space-x-2 max-w-md mx-auto">
          <CheckCircle2 className="w-6 h-6" />
          <span>Contenido actualizado correctamente</span>
        </div>
      ));
    } catch (error) {
      const errorMsg = isAxiosError(error) && error.response
        ? String(error.response.data.error)
        : "Error al actualizar el contenido";

      toast.custom(() => (
        <div className="bg-red-100 text-red-800 px-6 py-4 rounded shadow-md flex items-center space-x-2 max-w-md mx-auto">
          <AlertCircle className="w-6 h-6" />
          <span>{errorMsg}</span>
        </div>
      ));
      console.error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-800">
          Gestión de Contenido de la Página
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white shadow-xl rounded-lg p-8"
        >
          {/* Render de campos */}
          {[
            { label: '¿Quiénes Somos?', name: 'quienesSomos' },
            { label: 'Misión', name: 'mision' },
            { label: 'Visión', name: 'vision' },
            { label: 'Valores', name: 'valores' },
            { label: 'Preguntas Frecuentes (Formato JSON)', name: 'preguntasFrecuentes', placeholder: `[ { "id": "faq1", "title": "Pregunta 1", "description": "Descripción", "icon": "❓", "content": "<p>Respuesta</p>" } ]` },
            { label: 'Contacto', name: 'contacto' },
            { label: 'Términos y Condiciones', name: 'terminos' },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block text-lg font-semibold text-blue-700 mb-1">
                {label}
              </label>
              <textarea
                placeholder={placeholder}
                className="w-full min-h-[100px] p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                {...register(name as keyof PageContent, {
                  required: name !== 'contacto' && name !== 'terminos'
                    ? 'Este campo es obligatorio' : false,
                })}
              />
              {errors[name as keyof PageContent] && (
                <p className="text-sm text-red-500 mt-1">
                  {errors[name as keyof PageContent]?.message}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-md"
          >
            💾 Actualizar Contenido
          </button>
        </form>
      </div>
      <Footer />
      <style>{`
        .container {
          max-width: 900px;
        }
      `}</style>
    </div>
  );
};

export default GestionPagina;
