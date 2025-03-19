///components/header
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SmartViewImage from '../assets/SmartView.png';
import AdminNavigation from "./nav/AdminNavigation";
import HomeNavigation from "./nav/HomeNavigation";
import { FaUserCircle } from "react-icons/fa"; // Icono de usuario

// Definir la interfaz para el usuario
interface User {
  role: "admin" | "user";
}

const NAV_LINKS = [
  { label: "Inicio", path: "/" },
  { label: "Catálogo", path: "/products" },
];

const ABOUT_LINKS = [
  { label: "Quiénes Somos", path: "/quienes-somos" },
  { label: "Preguntas frecuentes", path: "/preguntasFrecuentes" },
  { label: "Términos y Condiciones", path: "/terminos-condiciones" },
];

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al cargar el usuario desde localStorage:", error);
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-600 shadow-md h-16">

      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={SmartViewImage} className="h-8" alt="SmartView Logo" />
        </Link>

        <div className="hidden md:flex md:ml-auto md:space-x-8 items-center">
          {NAV_LINKS.map(({ label, path }) => (
            <Link key={path} to={path} className="text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium">
              {label}
            </Link>
          ))}

          <div className="relative group">
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              Acerca de
              <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isAboutOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                <ul className="space-y-3">
                  {ABOUT_LINKS.map(({ label, path }) => (
                    <li key={path}><Link to={path} className="text-gray-600 hover:text-indigo-600">{label}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex md:order-2 space-x-4 items-center">
          {user ? (
            <>
              {user.role === "admin" ? <AdminNavigation /> : <HomeNavigation />}

              {/* Menú desplegable del perfil */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-gray-900 hover:text-blue-500 flex items-center"
                >
                  <FaUserCircle className="text-2xl" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                    <ul className="space-y-3">
                      <li>
                        <Link to="/perfil" className="text-gray-600 hover:text-indigo-600">
                          Actualizar datos
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700 w-full text-left">
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">Login</Link>
              <Link to="/register" className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">Regístrate</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
