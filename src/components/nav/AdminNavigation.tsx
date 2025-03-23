import { Link } from "react-router-dom";
import { useState } from "react";

const AdminNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium flex items-center"
      >
        Gestión
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <ul className="space-y-3">
            <li><Link to="/admin/product/GestionProductos" className="text-gray-600 hover:text-indigo-600">Productos</Link></li>
            <li><Link to="/admin/users" className="text-gray-600 hover:text-indigo-600">Usuarios</Link></li>
            <li><Link to="/admin/pagina" className="text-gray-600 hover:text-indigo-600">Gestión de Página</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminNavigation;
