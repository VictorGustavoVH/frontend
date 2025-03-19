// views/private/IserManagement
import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import { toast } from 'sonner';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'usuario';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

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

  return (
    <div>
      <Header />
      <section className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="p-2 border rounded w-1/2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Correo</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => user.username.toLowerCase().includes(search.toLowerCase()))
                    .map(user => (
                      <tr key={user._id} className="border-b dark:border-gray-700">
                        <td className="px-4 py-3">{user.username}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <button
                            className={`relative w-12 h-6 flex items-center rounded-full p-1 transition ${
                              user.role === 'admin' ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                            onClick={() => updateRole(user._id, user.role)}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                                user.role === 'admin' ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></div>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="px-3 py-2 text-white bg-red-500 rounded"
                            onClick={() => deleteUser(user._id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UserManagement;
