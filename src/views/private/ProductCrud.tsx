// ProductCrud.tsx
import React, { useEffect, useState } from 'react';
import {
  getProducts,
  registerProduct,
  uploadProductImage,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct
} from '../../api/DevTreeAPI';
import { Product } from '../../types/product';
import { toast } from 'sonner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ProductCrud: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // For create
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  // For edit
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});

  // Load products on mount
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

  // CREATE product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1) crea producto sin imagen
      const resp = await registerProduct(newProduct);

      // 2) si hay imagen, sube
      if (newProduct.image) {
        // newProduct.name debe ser EXACTO al name guardado. 
        // Si el backend slugifica, obtén el slug de la respuesta
        // (ajusta si no usas slug)
        const slugName = resp.slug || newProduct.name;
        const uploadResp = await uploadProductImage(newProduct.image as unknown as File, slugName!);
        toast.success(uploadResp.message || 'Imagen subida');
      }

      toast.success('Producto creado');
      setShowCreateModal(false);
      setNewProduct({});
      fetchAllProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error creando producto');
    }
  };

  // UPDATE product
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!editProduct._id) {
        toast.error('No hay producto seleccionado');
        return;
      }

      // 1) Actualizar campos (sin imagen)
      const { image, ...fields } = editProduct;
      await apiUpdateProduct(editProduct._id, fields);

      // 2) Subir imagen si hay
      if (image) {
        // Si el backend slugifica, obtén el name (slug) desde la BD. 
        // Aquí asumo que editProduct.name ya es el slug:
        await uploadProductImage(image as unknown as File, editProduct.name!);
      }

      toast.success('Producto actualizado');
      setShowUpdateModal(false);
      setEditProduct({});
      fetchAllProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error actualizando producto');
    }
  };

  // DELETE product
  const handleDeleteProduct = async (productId: string) => {
    try {
      await apiDeleteProduct(productId);
      toast.success('Producto eliminado');
      fetchAllProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error eliminando producto');
    }
  };

  // Handle field changes for create
  const handleNewProductChange = (field: keyof Product, value: string | number | File) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  // Handle field changes for edit
  const handleEditChange = (field: keyof Product, value: string | number | File) => {
    setEditProduct({ ...editProduct, [field]: value });
  };

  // Apertura modal de edición
  const openEditModal = (p: Product) => {
    setEditProduct(p);
    setShowUpdateModal(true);
  };

  return (
    <div>
        <Header/>
    <div className="p-4">
      <div className="flex justify-end mb-3">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add product
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs uppercase bg-gray-50 text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Imagen</th>
              <th scope="col" className="px-4 py-3">Product Name</th>
              <th scope="col" className="px-4 py-3">Category</th>
              <th scope="col" className="px-4 py-3">Brand</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id || prod.name} className="border-b">
                <td className="px-4 py-3">
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{prod.name}</td>
                <td className="px-4 py-3">{prod.category}</td>
                <td className="px-4 py-3">{prod.brand}</td>
                <td className="px-4 py-3">${prod.price?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => openEditModal(prod)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(prod._id!)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 w-full max-w-md rounded">
            <h2 className="text-xl mb-4">Agregar Producto</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label>Nombre</label>
                <input
                  className="border w-full p-2"
                  value={newProduct.name || ''}
                  onChange={(e) => handleNewProductChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Descripción</label>
                <textarea
                  className="border w-full p-2"
                  value={newProduct.description || ''}
                  onChange={(e) => handleNewProductChange('description', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Categoría</label>
                <input
                  className="border w-full p-2"
                  value={newProduct.category || ''}
                  onChange={(e) => handleNewProductChange('category', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Marca</label>
                <input
                  className="border w-full p-2"
                  value={newProduct.brand || ''}
                  onChange={(e) => handleNewProductChange('brand', e.target.value)}
                />
              </div>
              <div>
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  className="border w-full p-2"
                  value={newProduct.price || ''}
                  onChange={(e) => handleNewProductChange('price', Number(e.target.value))}
                />
              </div>
              <div>
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border w-full p-2"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleNewProductChange('image', e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {showUpdateModal && editProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 w-full max-w-md rounded">
            <h2 className="text-xl mb-4">Editar Producto</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label>Nombre</label>
                <input
                  className="border w-full p-2"
                  value={editProduct.name || ''}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Descripción</label>
                <textarea
                  className="border w-full p-2"
                  value={editProduct.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Categoría</label>
                <input
                  className="border w-full p-2"
                  value={editProduct.category || ''}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Marca</label>
                <input
                  className="border w-full p-2"
                  value={editProduct.brand || ''}
                  onChange={(e) => handleEditChange('brand', e.target.value)}
                />
              </div>
              <div>
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  className="border w-full p-2"
                  value={editProduct.price || ''}
                  onChange={(e) => handleEditChange('price', Number(e.target.value))}
                />
              </div>
              <div>
                <label>Imagen (subir nueva)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border w-full p-2"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleEditChange('image', e.target.files[0]);
                    }
                  }}
                />
                {editProduct.image && (
                  <div className="mt-2">
                    <img src={editProduct.image} alt="Current" className="w-16 h-16 object-cover" />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    <Footer/>
    </div>
  );
};

export default ProductCrud;
