import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SmartViewImage from '../../assets/SmartView.png';
import api from '../../config/axios';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const response = await api.post('/login', data);
      const { token, role } = response.data;
      localStorage.setItem('AUTH_TOKEN', token);
      localStorage.setItem('user', JSON.stringify({ role }));
      
      // En lugar de toast, mostramos el modal de éxito
      setShowSuccessModal(true);
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error al iniciar sesión. Inténtalo de nuevo.');
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
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Iniciar sesión en tu cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tu correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "Por favor, ingresa un correo electrónico válido.",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Correo electrónico no válido"
                    }
                  })}
                />
                {errors.email && (
                  <div className="bg-red-100 text-red-700 px-3 py-2 rounded mt-1">
                    {errors.email.message}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="bg-red-100 text-red-700 px-3 py-2 rounded mt-1">
                    {errors.password.message}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      Recuérdame
                    </label>
                  </div>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Iniciar sesión
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                ¿No tienes cuenta aún?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer />

      {/* Modal de alerta de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Fondo semitransparente */}
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative p-4 w-full max-w-md h-full md:h-auto">
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowSuccessModal(false)}
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
                <svg aria-hidden="true" className="w-8 h-8 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Success</span>
              </div>
              <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Inicio de sesión exitoso.
              </p>
              <button
                type="button"
                onClick={() => { setShowSuccessModal(false); navigate('/inicio'); }}
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

export default Login;
