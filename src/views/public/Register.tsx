import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import type { RegisterForm } from '../../types';
import api from '../../config/axios';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ErrorMessage from '../../components/ErrorMessage';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SmartViewImage from '../../assets/SmartView.png';

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegisterForm>();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  // Estado para controlar la visibilidad del modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Observamos el valor del password para validar confirmación
  const watchPassword = watch('password');

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: RegisterForm) => {
    setErrorMessage('');
    // Validamos que las contraseñas coincidan
    if (data.password !== data.password_confirmation) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await api.post('/register', data);

      // Mostramos un toast de éxito
      toast.success(response.data.message || 'Usuario registrado exitosamente');
      reset();
      // En lugar de redirigir de inmediato, mostramos el modal de éxito
      setShowSuccessModal(true);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const msg = error.response.data?.error || 'Ha ocurrido un error en el registro';
        toast.error(msg);
        setErrorMessage(msg);
      } else {
        toast.error('Ha ocurrido un error inesperado');
        setErrorMessage('Ha ocurrido un error inesperado');
      }
    }
  };

  return (
    <div>
      <Header />
      <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-39 h-8 mr-2" src={SmartViewImage} alt="logo" />
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Crear una cuenta
            </h1>

            {/* Mensaje de error */}
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
                    <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Nombre Completo
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Juan Pérez"
                      {...register('nombre', { required: 'El nombre es obligatorio' })}
                    />
                    {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
                  </div>

                  <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Nombre de Usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="usuario123"
                      {...register('username', {
                        required: 'El nombre de usuario es obligatorio',
                        pattern: {
                          value: /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{1,20}$/,
                          message: 'Debe contener entre 1 y 20 caracteres, solo letras, números y guion bajo.',
                        },
                      })}
                    />
                    {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    <p className="text-xs text-gray-500 mt-1">
                      El nombre de usuario debe tener entre 1 y 20 caracteres y solo puede contener letras, números y guiones bajos.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Correo Electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="name@company.com"
                      {...register('email', {
                        required: 'El correo electrónico es obligatorio',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Formato de email no válido',
                        },
                      })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                  </div>

                  <div>
                    <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="1234567890"
                      {...register('telefono', {
                        required: 'El teléfono es obligatorio',
                        pattern: {
                          value: /^\d{10}$/,
                          message: 'El teléfono debe contener exactamente 10 dígitos numéricos',
                        },
                      })}
                    />
                    {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
                    <p className="text-xs text-gray-500 mt-1">
                      El teléfono debe contener exactamente 10 dígitos numéricos.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="direccion" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Dirección
                    </label>
                    <input
                      id="direccion"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Ingresa tu dirección"
                      {...register('direccion', {
                        required: 'La dirección es obligatoria',
                        minLength: {
                          value: 5,
                          message: 'La dirección debe contener al menos 5 caracteres',
                        },
                      })}
                    />
                    {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="flex flex-col space-y-4">
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600"
                        placeholder="••••••••"
                        {...register('password', {
                          required: 'La contraseña es obligatoria',
                          pattern: {
                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
                            message: 'Mín. 8 caract., con mayúscula, minúscula, número y carácter especial.',
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y carácter especial.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Confirmar Contraseña
                    </label>
                    <input
                      id="password_confirmation"
                      type="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="••••••••"
                      {...register('password_confirmation', {
                        required: 'Debes confirmar tu contraseña',
                        validate: (value) => value === watchPassword || 'Las contraseñas no coinciden',
                      })}
                    />
                    {errors.password_confirmation && (
                      <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                  </div>

                  <div>
                    <label htmlFor="preguntaSecreta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Pregunta Secreta
                    </label>
                    <select
                      id="preguntaSecreta"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      {...register('preguntaSecreta', { required: 'La pregunta secreta es obligatoria' })}
                    >
                      <option value="">Seleccione una pregunta</option>
                      <option value="1">¿Cuál es el nombre de tu primera mascota?</option>
                      <option value="2">¿Cuál es tu comida favorita?</option>
                      <option value="3">¿Cuál es el nombre de tu mejor amigo de la infancia?</option>
                      <option value="4">¿Cuál es tu lugar de nacimiento?</option>
                      <option value="5">¿Cuál fue el nombre de tu primera escuela?</option>
                    </select>
                    {errors.preguntaSecreta && (
                      <ErrorMessage>{errors.preguntaSecreta.message}</ErrorMessage>
                    )}
                  </div>

                  <div>
                    <label htmlFor="respuestaSecreta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Respuesta Secreta
                    </label>
                    <input
                      id="respuestaSecreta"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Ingresa tu respuesta"
                      {...register('respuestaSecreta', {
                        required: 'La respuesta secreta es obligatoria',
                        pattern: {
                          value: /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]{2,}$/,
                          message: 'Solo se permiten letras y espacios; mínimo 2 caracteres.',
                        },
                      })}
                    />
                    {errors.respuestaSecreta && (
                      <ErrorMessage>{errors.respuestaSecreta.message}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Crear cuenta
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                ¿Ya tienes cuenta?&nbsp;
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modal de alerta de éxito para registro */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Fondo semitransparente */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Cerrar modal</span>
              </button>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
                <svg aria-hidden="true" className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Success</span>
              </div>
              <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Usuario registrado exitosamente.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/login');
                }}
                className="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
