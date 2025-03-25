import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../config/axios';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ErrorMessage from '../../components/ErrorMessage';
import SmartViewImage from '../../assets/SmartView.png';
import type { ProfileForm } from '../../types';

const UpdateProfile: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del usuario para precargar el formulario
  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get('/user');
        reset(data);
      } catch (error) {
        setErrorMessage('Error al cargar la información del usuario');
      }
    }
    fetchUser();
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const response = await api.patch('/user', data);
      toast.success(response.data || 'Perfil actualizado exitosamente');
      navigate('/');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Error al actualizar el perfil';
      toast.error(msg);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-39 h-8 mr-2" src={SmartViewImage} alt="logo" />
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Actualizar Perfil
            </h1>

            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Columna izquierda */}
                <div className="flex flex-col space-y-4">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nombre Completo
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      placeholder="Juan Pérez"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('nombre', { required: 'El nombre es obligatorio' })}
                    />
                    {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nombre de Usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="usuario123"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('username', { required: 'El nombre de usuario es obligatorio' })}
                    />
                    {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      disabled
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('email', { required: 'El correo electrónico es obligatorio' })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                  </div>

                  <div>
                    <label
                      htmlFor="telefono"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      placeholder="1234567890"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('telefono', {
                        required: 'El teléfono es obligatorio',
                        pattern: {
                          value: /^\d{10}$/,
                          message: 'El teléfono debe contener exactamente 10 dígitos numéricos',
                        },
                      })}
                    />
                    {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="flex flex-col space-y-4">
                  <div>
                    <label
                      htmlFor="direccion"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Dirección
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      placeholder="Ingresa tu dirección"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('direccion', { required: 'La dirección es obligatoria' })}
                    />
                    {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
                  </div>

                  <div>
                    <label
                      htmlFor="preguntaSecreta"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Pregunta Secreta
                    </label>
                    <select
                      id="preguntaSecreta"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('preguntaSecreta')}
                    >
                      <option value="">Seleccione una pregunta</option>
                      <option value="1">¿Cuál es el nombre de tu primera mascota?</option>
                      <option value="2">¿Cuál es tu comida favorita?</option>
                      <option value="3">
                        ¿Cuál es el nombre de tu mejor amigo de la infancia?
                      </option>
                      <option value="4">¿Cuál es tu lugar de nacimiento?</option>
                      <option value="5">¿Cuál fue el nombre de tu primera escuela?</option>
                    </select>
                    {errors.preguntaSecreta && (
                      <ErrorMessage>{errors.preguntaSecreta.message}</ErrorMessage>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="respuestaSecreta"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Respuesta Secreta
                    </label>
                    <input
                      id="respuestaSecreta"
                      type="text"
                      placeholder="Ingresa tu respuesta"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('respuestaSecreta', { required: 'La respuesta secreta es obligatoria' })}
                    />
                    {errors.respuestaSecreta && (
                      <ErrorMessage>{errors.respuestaSecreta.message}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700
                           font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar Perfil'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UpdateProfile;
