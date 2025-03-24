import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProducts } from '../../api/DevTreeAPI';
// Importamos iconos de react-icons
import { FaSearch, FaFilter, FaTh, FaSpinner, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(true);

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  // Estados para mostrar/ocultar dropdowns
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // o el número que prefieras

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Manejadores
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (categoryValue: string) => {
    if (selectedCategory === categoryValue) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(categoryValue);
    }
    setShowCategoryMenu(false);
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

  // Filtrado
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

    const matchPrice = (() => {
      if (product.price === undefined) return true;
      if (typeof minPrice === 'number' && product.price < minPrice) return false;
      if (typeof maxPrice === 'number' && product.price > maxPrice) return false;
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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Listas únicas de categorías y marcas
  const categoryOptions = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  const brandOptions = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  return (
    <div>
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Fila con Buscador, Botón Categoría, Botón Filtros */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Buscador con icono */}
          <div className="relative flex-1">
            <FaSearch className="absolute top-2 left-2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pl-8 border border-gray-300 rounded-lg"
            />
          </div>

          {/* BOTÓN CATEGORÍA */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryMenu(!showCategoryMenu);
                setShowFilterMenu(false);
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
            >
              <FaTh className="inline mr-2" /> Categoría
            </button>

            {showCategoryMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedCategory === cat ? 'bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {categoryOptions.length > 0 && (
                  <button
                    onClick={() => handleCategoryClick('')}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedCategory === '' ? 'bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    Todas
                  </button>
                )}
              </div>
            )}
          </div>

          {/* BOTÓN FILTROS */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
                setShowCategoryMenu(false);
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
            >
              <FaFilter className="inline mr-2" /> Filtros
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg p-4 z-10">
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-sm">Marca</label>
                  <select
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Todas</option>
                    {brandOptions.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-sm">Precio mínimo</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    placeholder="Min"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-sm">Precio máximo</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vista de carga mejorada */}
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <FaSpinner className="animate-spin text-6xl text-blue-500 mb-4" />
            <p className="text-xl text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <>
            {/* GRID DE PRODUCTOS con transición */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <Link 
                    to={`/products/${encodeURIComponent(product.name)}`} 
                    key={product.name} 
                    className="block"
                  >
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transform transition duration-300 hover:scale-105">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover transition-opacity duration-500 ease-in-out"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      )}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
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
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500">No se encontraron productos.</p>
              )}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
                >
                  <FaArrowLeft className="inline mr-1" /> Anterior
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
                  className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
                >
                  Siguiente <FaArrowRight className="inline ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalogo;
