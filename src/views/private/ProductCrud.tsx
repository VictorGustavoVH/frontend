import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getProducts,
  uploadProductImage,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct
} from '../../api/DevTreeAPI';
import { Product } from '../../types/product';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';

const ProductCrud: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Actualizar producto con validaciones
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editProduct._id) {
      toast.error('No hay producto seleccionado');
      return;
    }
    if (!editProduct.name || editProduct.name.trim() === '') {
      toast.error('El nombre es requerido');
      return;
    }
    if (!editProduct.description || editProduct.description.trim() === '') {
      toast.error('La descripción es requerida');
      return;
    }
    if (!editProduct.category || editProduct.category.trim() === '') {
      toast.error('La categoría es requerida');
      return;
    }
    if (!editProduct.brand || editProduct.brand.trim() === '') {
      toast.error('La marca es requerida');
      return;
    }
    if (editProduct.price == null || editProduct.price < 0) {
      toast.error('El precio debe ser mayor o igual a 0');
      return;
    }

    try {
      const { image, ...fields } = editProduct;
      await apiUpdateProduct(editProduct._id, fields);
      if (editImageFile) {
        await uploadProductImage(editImageFile, editProduct.name!);
      }
      toast.success('Producto actualizado');
      setShowUpdateModal(false);
      setEditProduct({});
      setEditImageFile(null);
      fetchAllProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error actualizando producto');
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId: string) => {
    try {
      await apiDeleteProduct(productId);
      toast.success('Producto eliminado');
      fetchAllProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error eliminando producto');
    }
  };

  // Abrir modal de edición
  const openEditModal = (p: Product) => {
    setEditProduct(p);
    setShowUpdateModal(true);
    setEditImageFile(null);
    setOpenDropdownId(null);
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cálculo de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <div className="p-4 max-w-screen-xl mx-auto">
        {/* Barra de búsqueda y botón para agregar producto */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative mb-4 sm:mb-0 sm:w-1/2">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div className="flex justify-end">
            <Link
              to="/admin/product/GestionProductos/Register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
            >
              <FaEdit />
              <span>Agregar Producto</span>
            </Link>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Marca</th>
                <th className="px-4 py-3 text-left">Precio</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentProducts.map((prod) => (
                <tr
                  key={prod._id || prod.name}
                  className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 object-cover rounded transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{prod.name}</td>
                  <td className="px-4 py-3">{prod.category}</td>
                  <td className="px-4 py-3">{prod.brand}</td>
                  <td className="px-4 py-3">${prod.price?.toFixed(2)}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === prod._id ? null : prod._id!)
                      }
                      className="text-gray-600 hover:text-gray-800 focus:outline-none transition-transform duration-300"
                    >
                      <FaEllipsisV />
                    </button>
                    {openDropdownId === prod._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 transition-all duration-200 transform origin-top">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="flex items-center w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <FaEdit className="mr-2" /> <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteProduct(prod._id!);
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
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No se encontraron productos.
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1 border rounded-md hover:bg-blue-100 transition-all duration-300 disabled:opacity-50"
            >
              <FaArrowLeft className="mr-1" /> Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded-md transition-all duration-300 ${
                  currentPage === number ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1 border rounded-md hover:bg-blue-100 transition-all duration-300 disabled:opacity-50"
            >
              Siguiente <FaArrowRight className="ml-1" />
            </button>
          </nav>
        </div>
      </div>

      {/* Modal de actualización */}
      {showUpdateModal && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white dark:bg-gray-800 p-6 w-full max-w-md rounded-md shadow-lg transform transition-transform duration-300">
            <h2 className="text-xl mb-4 font-bold">Editar Producto</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editProduct.name || ''}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Descripción
                </label>
                <textarea
                  value={editProduct.description || ''}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, description: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Categoría
                </label>
                <input
                  type="text"
                  value={editProduct.category || ''}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, category: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Marca
                </label>
                <input
                  type="text"
                  value={editProduct.brand || ''}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, brand: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editProduct.price || ''}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: Number(e.target.value) })
                  }
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Imagen (nueva)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setEditImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-2">
                  {editImageFile ? (
                    <img
                      src={URL.createObjectURL(editImageFile)}
                      alt="Nueva"
                      className="w-16 h-16 object-cover rounded transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    editProduct.image && (
                      <img
                        src={editProduct.image}
                        alt="Actual"
                        className="w-16 h-16 object-cover rounded transition-transform duration-300 hover:scale-105"
                      />
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductCrud;
