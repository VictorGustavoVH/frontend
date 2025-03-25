import React, { useEffect, useState } from 'react'; 
import api from '../../config/axios';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaSearch, FaTrash, FaUser, FaUserShield } from 'react-icons/fa';

interface User {
  _id: string;
  username: string;
  email: string;
  rol: 'admin' | 'usuario';
}

interface RoleToggleProps {
  role: 'admin' | 'usuario';
  onChange: (newRole: 'admin' | 'usuario') => void;
}

const RoleToggle: React.FC<RoleToggleProps> = ({ role, onChange }) => {
  return (
    <div className="flex items-center border rounded overflow-hidden text-xs">
      <button
        onClick={() => role !== 'usuario' && onChange('usuario')}
        className={`flex items-center px-2 py-1 transition-all duration-300 ${
          role === 'usuario'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
        }`}
      >
        <FaUser className="mr-1" size={14} />
        <span>Usr</span>
      </button>
      <button
        onClick={() => role !== 'admin' && onChange('admin')}
        className={`flex items-center px-2 py-1 transition-all duration-300 ${
          role === 'admin'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
        }`}
      >
        <FaUserShield className="mr-1" size={14} />
        <span>Adm</span>
      </button>
    </div>
  );
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al obtener usuarios');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const updateRole = async (id: string, newRole: 'admin' | 'usuario') => {
    try {
      await api.patch(`/users/${id}`, { rol: newRole });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, rol: newRole } : user
        )
      );
      toast.success(`Rol actualizado a ${newRole}`);
    } catch (error) {
      toast.error('Error al actualizar rol');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Cálculo de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <div className="p-4 max-w-screen-xl mx-auto">
        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative mb-4 sm:mb-0 sm:w-1/2">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Rol Actual</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentUsers.map(user => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleToggle
                      role={user.rol}
                      onChange={(newRole) => updateRole(user._id, newRole)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="flex items-center px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-all duration-300"
                    >
                      <FaTrash className="mr-2" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-4">
          <nav className="flex space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md hover:bg-blue-100 transition-all duration-300 disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded-md transition-all duration-300 ${
                  currentPage === number
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-100'
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md hover:bg-blue-100 transition-all duration-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;
