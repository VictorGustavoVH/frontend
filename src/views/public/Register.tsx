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
  // Estado para el mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Observamos el valor del password para validar confirmación
  const watchPassword = watch('password');

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: RegisterForm) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (data.password !== data.password_confirmation) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await api.post('/register', data);

      // Mostramos el mensaje de éxito en el toast
      toast.success(response.data.message || 'Usuario registrado exitosamente');
      // Guardamos el mensaje en el estado para mostrarlo en la página
      setSuccessMessage(response.data.message || 'Usuario registrado exitosamente');

      reset();
      // Redirigimos al login
      navigate('/login');
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

            {/* Mensaje de éxito */}
            {successMessage && (
              <div className="bg-green-100 text-green-700 px-3 py-2 rounded">
                {successMessage}
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
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
                      El nombre de usuario debe tener entre 1 y 20 caracteres y solo puede contener letras,
                      números y guiones bajos.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Correo Electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
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
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                   focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 pr-10
                                   dark:bg-gray-700 dark:border-gray-600"
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
                    <label
                      htmlFor="password_confirmation"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirmar Contraseña
                    </label>
                    <input
                      id="password_confirmation"
                      type="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="••••••••"
                      {...register('password_confirmation', {
                        required: 'Debes confirmar tu contraseña',
                        validate: (value) =>
                          value === watchPassword || 'Las contraseñas no coinciden',
                      })}
                    />
                    {errors.password_confirmation && (
                      <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
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
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
                      {...register('preguntaSecreta', {
                        required: 'La pregunta secreta es obligatoria',
                      })}
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
                    <label
                      htmlFor="respuestaSecreta"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Respuesta Secreta
                    </label>
                    <input
                      id="respuestaSecreta"
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5
                                 dark:bg-gray-700 dark:border-gray-600"
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
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium
                           rounded-lg text-sm px-5 py-2.5 text-center"
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
    </div>
  );
};

export default Register;
