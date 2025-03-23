import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProducts } from '../../api/DevTreeAPI';

// Ajusta la interfaz si tienes más campos
interface Product {
  name: string;
  description: string;
  category: string;
  image?: string;
  brand?: string;
  price?: number;
}

const Catalogo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>(''); // '' = sin filtro
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Al montar el componente, obtenemos los productos
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

  // Manejadores de cambio en búsquedas y filtros
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

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value === '' ? '' : parseFloat(value));
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value === '' ? '' : parseFloat(value));
    setCurrentPage(1);
  };

  // Filtra los productos
  const filteredProducts = products.filter((product) => {
    // Filtro por nombre
    const matchSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Filtro por categoría
    const matchCategory = selectedCategory
      ? product.category === selectedCategory
      : true;

    // Filtro por marca
    const matchBrand = selectedBrand
      ? product.brand === selectedBrand
      : true;

    // Filtro por rango de precios (si minPrice o maxPrice son numéricos)
    const matchPrice = (() => {
      if (product.price === undefined) return true;
      
      // minPrice
      if (typeof minPrice === 'number' && product.price < minPrice) {
        return false;
      }

      // maxPrice
      if (typeof maxPrice === 'number' && product.price > maxPrice) {
        return false;
      }

      return true;
    })();

    return matchSearch && matchCategory && matchBrand && matchPrice;
  });

  // Paginación
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Opciones únicas para categoría y marca
  const categoryOptions = Array.from(new Set(products.map((p) => p.category)));
  const brandOptions = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          
          {/* Filtro por Categoría */}
          <div className="w-full sm:w-1/6">
            <label className="block mb-1 font-semibold text-sm">Categoría</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas</option>
              {categoryOptions.map((cat) => (
                cat ? (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ) : null
              ))}
            </select>
          </div>

          {/* Filtro por Marca */}
          <div className="w-full sm:w-1/6">
            <label className="block mb-1 font-semibold text-sm">Marca</label>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas</option>
              {brandOptions.map((brand) =>
                brand ? (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ) : null
              )}
            </select>
          </div>

          {/* Filtro por precio mínimo */}
          <div className="w-full sm:w-1/6">
            <label className="block mb-1 font-semibold text-sm">Precio mínimo</label>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Filtro por precio máximo */}
          <div className="w-full sm:w-1/6">
            <label className="block mb-1 font-semibold text-sm">Precio máximo</label>
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Buscador por Nombre */}
          <div className="w-full sm:w-1/3">
            <label className="block mb-1 font-semibold text-sm">Buscar</label>
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

                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Categoría:</strong> {product.category}
                  </p>
                  {product.brand && (
                    <p className="text-sm text-gray-600">
                      <strong>Marca:</strong> {product.brand}
                    </p>
                  )}
                  {typeof product.price === 'number' && (
                    <p className="text-sm text-gray-600">
                      <strong>Precio:</strong> ${product.price.toFixed(2)}
                    </p>
                  )}

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
