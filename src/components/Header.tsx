import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SmartViewImage from "../assets/SmartView.png";
import AdminNavigation from "./nav/AdminNavigation";
import HomeNavigation from "./nav/HomeNavigation";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

// Interfaz del usuario (se agregó la propiedad "name")
interface User {
  role: "admin" | "user";
  name: string;
}

const NAV_LINKS = [
  { label: "Inicio", path: "/" },
  { label: "Catálogo", path: "/products" },
];

const ABOUT_LINKS = [
  { label: "Quiénes Somos", path: "/quienes-somos" },
  { label: "Preguntas frecuentes", path: "/preguntasFrecuentes" },
  { label: "Términos y Condiciones", path: "/terminos" },
  { label: "Contacto", path: "/Contacto" },
];

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Cargar usuario desde localStorage
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
    localStorage.removeItem("AUTH_TOKEN");
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-600 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={SmartViewImage} className="h-8" alt="SmartView Logo" />
        </Link>

        {/* Botón de menú para móvil */}
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="inline-flex items-center p-2 text-base text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors duration-300"
        >
          {isMobileNavOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Enlaces Desktop */}
        <div className="hidden md:flex md:ml-auto md:space-x-8 items-center">
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className="text-gray-900 px-4 py-2 rounded-md text-base font-medium transition-transform duration-300 hover:scale-105 hover:bg-gray-100"
            >
              {label}
            </Link>
          ))}

          {/* Dropdown "Acerca de" */}
          <div className="relative">
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="text-gray-900 px-4 py-2 rounded-md text-base font-medium flex items-center transition-transform duration-300 hover:scale-105 hover:bg-gray-100"
            >
              Acerca de
              <svg
                className="ml-2 h-5 w-5 transition-transform duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ transform: isAboutOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className={`absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 origin-top-right transition-all duration-300 ${
                isAboutOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <ul className="space-y-3">
                {ABOUT_LINKS.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Menú de usuario (Desktop) */}
        <div className="flex md:order-2 space-x-4 items-center">
          {user ? (
            <>
              {user.role === "admin" ? <AdminNavigation /> : <HomeNavigation />}
              {/* Mostramos el nombre del usuario */}
              <span className="hidden md:block text-gray-900 font-medium">{user.name}</span>
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-gray-900 hover:text-blue-500 flex items-center transition-transform duration-300 hover:scale-105"
                >
                  <FaUserCircle className="text-2xl" />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 origin-top-right transition-all duration-300 ${
                    isProfileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/perfil"
                        className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                      >
                        Actualizar datos
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-700 w-full text-left transition-colors duration-200"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-transform duration-300 hover:scale-105 text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-transform duration-300 hover:scale-105 text-base font-medium"
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú Móvil */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-600 shadow-md overflow-hidden transition-all duration-300 ${
          isMobileNavOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 transition-transform duration-300 hover:scale-105"
            >
              {label}
            </Link>
          ))}

          {/* Dropdown "Acerca de" en móvil */}
          <div className="relative">
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100 transition-transform duration-300 hover:scale-105"
            >
              Acerca de
              <svg
                className="ml-2 h-5 w-5 transition-transform duration-300"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ transform: isAboutOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className={`mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 origin-top transition-all duration-300 transform ${
                isAboutOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <ul className="space-y-3 p-3">
                {ABOUT_LINKS.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => {
                        setIsMobileNavOpen(false);
                        setIsAboutOpen(false);
                      }}
                      className="text-gray-600 hover:text-indigo-600 block transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Menú de usuario en móvil */}
          {user ? (
            <div className="mt-4 space-y-2 px-3">
              {/* Mostramos el nombre del usuario */}
              <div className="px-3 py-2">
                <span className="text-gray-900 font-medium">{user.name}</span>
              </div>
              <Link
                to="/perfil"
                className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200 text-base font-medium"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Actualizar datos
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileNavOpen(false);
                }}
                className="block text-red-500 hover:text-red-700 w-full text-left text-base font-medium transition-colors duration-200"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="space-y-2 mt-4 px-3">
              <Link
                to="/login"
                className="block text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-center transition-transform duration-300 hover:scale-105 text-base font-medium"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-center transition-transform duration-300 hover:scale-105 text-base font-medium"
                onClick={() => setIsMobileNavOpen(false)}
              >
                Regístrate
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
