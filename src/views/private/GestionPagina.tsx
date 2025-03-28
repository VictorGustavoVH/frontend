import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import api from '../../config/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Tipo para las FAQs (Preguntas Frecuentes)
type FAQ = {
  question: string;
  answer: string;
};

// Tipo de contenido de la página
export type PageContent = {
  quienesSomos: string;
  mision: string;
  vision: string;
  valores: string;
  preguntasFrecuentes: FAQ[];
  contacto?: string;
  terminos?: string;
};

// Se definen las secciones que se podrán editar
type Section = 'quienes' | 'faq' | 'contacto' | 'terminos' | null;

// Modal para editar cada sección
const EditSectionModal: React.FC<{
  section: Section;
  initialData: any;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ section, initialData, onClose, onSave }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  // Para la sección de FAQ se utiliza un field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'preguntasFrecuentes'
  });

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <h3 className="text-2xl font-bold mb-4">
          {section === 'quienes' && 'Editar Quiénes Somos'}
          {section === 'faq' && 'Editar Preguntas Frecuentes'}
          {section === 'contacto' && 'Editar Contacto'}
          {section === 'terminos' && 'Editar Términos y Condiciones'}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {section === 'quienes' && (
            <>
              <div>
                <label className="block font-semibold text-blue-700">Quiénes Somos</label>
                <textarea
                  {...register('quienesSomos', { required: 'Campo requerido' })}
                  className="w-full p-2 border rounded" rows={3} />
                {errors.quienesSomos && <p className="text-red-500 text-sm">{String(errors.quienesSomos.message)}</p>}
              </div>
              <div>
                <label className="block font-semibold text-blue-700">Misión</label>
                <textarea
                  {...register('mision', { required: 'Campo requerido' })}
                  className="w-full p-2 border rounded" rows={3} />
                {errors.mision && <p className="text-red-500 text-sm">{String(errors.mision.message)}</p>}
              </div>
              <div>
                <label className="block font-semibold text-blue-700">Visión</label>
                <textarea
                  {...register('vision', { required: 'Campo requerido' })}
                  className="w-full p-2 border rounded" rows={3} />
                {errors.vision && <p className="text-red-500 text-sm">{String(errors.vision.message)}</p>}
              </div>
              <div>
                <label className="block font-semibold text-blue-700">Valores</label>
                <textarea
                  {...register('valores', { required: 'Campo requerido' })}
                  className="w-full p-2 border rounded" rows={3} />
                {errors.valores && <p className="text-red-500 text-sm">{String(errors.valores.message)}</p>}
              </div>
            </>
          )}

          {section === 'faq' && (
            <div>
              <div className="space-y-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="border p-4 rounded relative">
                    <div>
                      <label className="block font-semibold text-blue-700">Pregunta</label>
                      <input
                        {...register(`preguntasFrecuentes.${index}.question`, { required: 'Campo requerido' })}
                        className="w-full p-2 border rounded"
                      />
                      {errors.preguntasFrecuentes &&
                        (errors.preguntasFrecuentes as any)?.[index]?.question && (
                          <p className="text-red-500 text-sm">
                            {(errors.preguntasFrecuentes as any)?.[index]?.question?.message}
                          </p>
                        )}
                    </div>
                    <div className="mt-2">
                      <label className="block font-semibold text-blue-700">Respuesta</label>
                      <textarea
                        {...register(`preguntasFrecuentes.${index}.answer`, { required: 'Campo requerido' })}
                        className="w-full p-2 border rounded" rows={3}
                      />
                      {errors.preguntasFrecuentes &&
                        (errors.preguntasFrecuentes as any)?.[index]?.answer && (
                          <p className="text-red-500 text-sm">
                            {(errors.preguntasFrecuentes as any)?.[index]?.answer?.message}
                          </p>
                        )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ question: '', answer: '' })}
                className="mt-4 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Agregar Pregunta
              </button>
            </div>
          )}

          {section === 'contacto' && (
            <div>
              <label className="block font-semibold text-blue-700">Contacto</label>
              <textarea
                {...register('contacto', { required: 'Campo requerido' })}
                className="w-full p-2 border rounded" rows={4} />
              {errors.contacto && <p className="text-red-500 text-sm">{String(errors.contacto.message)}</p>}
            </div>
          )}

          {section === 'terminos' && (
            <div>
              <label className="block font-semibold text-blue-700">Términos y Condiciones</label>
              <textarea
                {...register('terminos', { required: 'Campo requerido' })}
                className="w-full p-2 border rounded" rows={4} />
              {errors.terminos && <p className="text-red-500 text-sm">{String(errors.terminos.message)}</p>}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GestionPagina: React.FC = () => {
  const { handleSubmit, reset, setValue, watch } = useForm<PageContent>({
    defaultValues: {
      quienesSomos: '',
      mision: '',
      vision: '',
      valores: '',
      preguntasFrecuentes: [],
      contacto: '',
      terminos: ''
    }
  });
  const paginaName = "contenido";
  const [activeSection, setActiveSection] = useState<Section>(null);

  useEffect(() => {
    api.get(`/admin/pagina/${paginaName}`)
      .then((res) => {
        // Si la data de preguntasFrecuentes viene como string (JSON), se parsea
        const data = res.data;
        if (typeof data.preguntasFrecuentes === 'string') {
          try {
            data.preguntasFrecuentes = JSON.parse(data.preguntasFrecuentes);
          } catch (error) {
            data.preguntasFrecuentes = [];
          }
        }
        reset(data);
      })
      .catch((err) => {
        toast.error("❌ Error al cargar el contenido");
        console.error(err);
      });
  }, [paginaName, reset]);

  const onSubmit = async (data: PageContent) => {
    try {
      // Se puede convertir el array de FAQs a JSON si es necesario para el backend
      const payload = {
        ...data,
        preguntasFrecuentes: JSON.stringify(data.preguntasFrecuentes)
      };
      await api.patch(`/admin/pagina/${paginaName}`, payload);

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

  // Obtenemos los valores actuales del formulario para mostrarlos en las cards
  const formValues = watch();

  // Al guardar en el modal se actualiza el valor correspondiente en el formulario principal
  const handleSaveSection = (data: any) => {
    if (activeSection === 'quienes') {
      setValue('quienesSomos', data.quienesSomos);
      setValue('mision', data.mision);
      setValue('vision', data.vision);
      setValue('valores', data.valores);
    } else if (activeSection === 'faq') {
      setValue('preguntasFrecuentes', data.preguntasFrecuentes);
    } else if (activeSection === 'contacto') {
      setValue('contacto', data.contacto);
    } else if (activeSection === 'terminos') {
      setValue('terminos', data.terminos);
    }
  };

  // Datos iniciales para cada modal según la sección activa
  let initialModalData: any = {};
  if (activeSection === 'quienes') {
    initialModalData = {
      quienesSomos: formValues.quienesSomos,
      mision: formValues.mision,
      vision: formValues.vision,
      valores: formValues.valores
    };
  } else if (activeSection === 'faq') {
    initialModalData = {
      preguntasFrecuentes: formValues.preguntasFrecuentes || []
    };
  } else if (activeSection === 'contacto') {
    initialModalData = {
      contacto: formValues.contacto
    };
  } else if (activeSection === 'terminos') {
    initialModalData = {
      terminos: formValues.terminos
    };
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-800">
          Gestión de Contenido de la Página
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Quiénes Somos */}
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Quiénes Somos</h3>
            <p><strong>Quiénes Somos:</strong> {formValues.quienesSomos || 'No definido'}</p>
            <p><strong>Misión:</strong> {formValues.mision || 'No definido'}</p>
            <p><strong>Visión:</strong> {formValues.vision || 'No definido'}</p>
            <p><strong>Valores:</strong> {formValues.valores || 'No definido'}</p>
            <button onClick={() => setActiveSection('quienes')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Editar
            </button>
          </div>

          {/* Card: Preguntas Frecuentes */}
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Preguntas Frecuentes</h3>
            {formValues.preguntasFrecuentes && formValues.preguntasFrecuentes.length > 0 ? (
              <ul className="space-y-2">
                {formValues.preguntasFrecuentes.map((faq: FAQ, index: number) => (
                  <li key={index} className="border p-2 rounded">
                    <p><strong>Pregunta:</strong> {faq.question}</p>
                    <p><strong>Respuesta:</strong> {faq.answer}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay preguntas registradas</p>
            )}
            <button onClick={() => setActiveSection('faq')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Editar
            </button>
          </div>

          {/* Card: Contacto */}
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Contacto</h3>
            <p>{formValues.contacto || 'No definido'}</p>
            <button onClick={() => setActiveSection('contacto')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Editar
            </button>
          </div>

          {/* Card: Términos y Condiciones */}
          <div className="bg-white shadow-xl rounded-lg p-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Términos y Condiciones</h3>
            <p>{formValues.terminos || 'No definido'}</p>
            <button onClick={() => setActiveSection('terminos')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Editar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-md">
            💾 Actualizar Contenido
          </button>
        </form>
      </div>
      <Footer />
      {activeSection && (
        <EditSectionModal
          section={activeSection}
          initialData={initialModalData}
          onClose={() => setActiveSection(null)}
          onSave={handleSaveSection}
        />
      )}
      <style>{`
        .container {
          max-width: 900px;
        }
      `}</style>
    </div>
  );
};

export default GestionPagina;
