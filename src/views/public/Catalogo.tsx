import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProducts } from '../../api/DevTreeAPI';

// Solo definimos las props que necesitamos en el catálogo
interface Product {
  name: string;
  description: string;
  category: string;
  image?: string;
  brand?: string;
  price?: number;
  // stock?: number;         // lo quitamos
  // createdAt?: string;    // lo quitamos
  // updatedAt?: string;    // lo quitamos
}

const Catalogo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  // Handlers de cambios
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1);
  };

  // Filtrado de productos
  const filteredProducts = products.filter((product) => {
    const matchSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchCategory = selectedCategory
      ? product.category === selectedCategory
      : true;

    const matchBrand = selectedBrand
      ? product.brand === selectedBrand
      : true;

    return matchSearch && matchCategory && matchBrand;
  });

  // Paginación
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Extrae categorías y marcas únicas (para <select>)
  const categoryOptions = Array.from(new Set(products.map((p) => p.category)));
  const brandOptions = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          {/* Filtro por Categoría */}
          <div className="w-full sm:w-1/4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas las categorías</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Marca */}
          <div className="w-full sm:w-1/4">
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas las marcas</option>
              {brandOptions.map((brand) =>
                brand ? (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ) : null
              )}
            </select>
          </div>

          {/* Buscador por Nombre */}
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.name} className="bg-white shadow-lg rounded-lg overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>

                  {/* Mostramos sólo lo que queramos en el catálogo */}
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Categoría:</strong> {product.category}
                  </p>
                  {product.brand && (
                    <p className="text-sm text-gray-600">
                      <strong>Marca:</strong> {product.brand}
                    </p>
                  )}
                  {product.price !== undefined && (
                    <p className="text-sm text-gray-600">
                      <strong>Precio:</strong> ${product.price.toFixed(2)}
                    </p>
                  )}

                  {/* Botón de detalle (opcional) */}
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

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 bg-gray-200 rounded"
            >
              Anterior
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-3 py-1 bg-gray-200 rounded"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Catalogo;
