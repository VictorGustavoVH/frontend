import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Product } from '../../types/product';
import { getProducts } from '../../api/DevTreeAPI';

const Catalogo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    }
    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    (selectedCategory ? product.category === selectedCategory : true) &&
    (searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
  );

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Filtro de categoría y buscador */}
        <div className="flex justify-between items-center mb-6">
          {/* ComboBox de Categorías */}
          <div className="w-1/4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Seleccionar categoría</option>
              {[...new Set(products.map(p => p.category))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Buscador */}
          <div className="w-2/3">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Tarjetas de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.name} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                  <Link to={`/products/${encodeURIComponent(product.name)}`}>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                      Ver detalle
                    </button>
                  </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No se encontraron productos.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catalogo;
