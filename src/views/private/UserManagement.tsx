import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface User {
  _id: string;
  username: string;
  email: string;
  rol: 'usuario' | 'admin';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Asegúrate de que el backend retorne el campo "rol"
      const response = await api.get('/users');
      console.log('Usuarios obtenidos:', response.data); // Para depurar
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al obtener usuarios');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(user => user._id !== id));
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const updateRole = async (id: string, currentRol: 'usuario' | 'admin') => {
    const newRol = currentRol === 'admin' ? 'usuario' : 'admin';
    try {
      // Se envía "rol" en el payload para actualizar
      await api.patch(`/users/${id}`, { rol: newRol });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, rol: newRol } : user
        )
      );
      toast.success(`Rol actualizado a ${newRol}`);
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
            <span className="absolute top-3 left-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2.4a7.5 7.5 0 010 14.25z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.rol || 'No asignado'}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => updateRole(user._id, user.rol)}
                      className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                    >
                      Cambiar Rol
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
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
