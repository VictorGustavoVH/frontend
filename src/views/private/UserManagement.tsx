import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaSearch, FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';

interface User {
  _id: string;
  username: string;
  email: string;
  rol: 'admin' | 'usuario';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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

  const updateRole = async (id: string, currentRole: 'admin' | 'usuario') => {
    const newRole = currentRole === 'admin' ? 'usuario' : 'admin';
    try {
      await api.patch(`/users/${id}`, { role: newRole });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
      toast.success(`Rol actualizado a ${newRole}`);
      await fetchUsers();
    } catch (error) {
      toast.error('Error al actualizar rol');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Aquí podrías agregar un botón para "Agregar Usuario" si lo requieres */}
        </div>

        {/* Tabla de usuarios */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.rol}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === user._id ? null : user._id)
                      }
                      className="text-gray-600 hover:text-gray-800 focus:outline-none transition-transform duration-300"
                    >
                      <FaEllipsisV />
                    </button>
                    {openDropdownId === user._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition-all duration-200 transform origin-top">
                        <button
                          onClick={() => {
                            updateRole(user._id, user.rol);
                            setOpenDropdownId(null);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <FaEdit className="mr-2" /> <span>Cambiar Rol</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteUser(user._id);
                            setOpenDropdownId(null);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FaTrash className="mr-2" /> <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserManagement;
