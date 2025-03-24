import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProducts } from '../../api/DevTreeAPI';

// Ajusta la interfaz si tienes más campos
interface Product {
  _id?: string;            // Si tus productos tienen un ID
  name: string;
  brand?: string;
  category?: string;
  price?: number;
  image?: string;
  description?: string;
  // ... cualquier otro campo
}

const Catalogo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // ZONA DE BÚSQUEDA
  const [searchQuery, setSearchQuery] = useState('');

  // FILTROS
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Para mostrar 10 productos por página

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

  // Lógica de filtro sobre la lista original de productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;

    const matchesBrand = !selectedBrand || product.brand === selectedBrand;

    const matchesPrice = (() => {
      if (product.price === undefined) return true;
      // Verifica min
      if (typeof minPrice === 'number' && product.price < minPrice) {
        return false;
      }
      // Verifica max
      if (typeof maxPrice === 'number' && product.price > maxPrice) {
        return false;
      }
      return true;
    })();

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // PAGINACIÓN
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Opciones únicas para categoría y marca
  const categoryOptions = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  const brandOptions = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6 flex-grow">
        {/* FILTROS: puedes cambiar a botones si lo deseas */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          
          {/* CATEGORÍA */}
          <div className="w-full sm:w-1/6">
            <label className="block mb-1 font-semibold text-sm">Categoría</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* MARCA */}
          <div className="w-full sm:w-1/6">
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

          {/* PRECIO MÍNIMO */}
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

          {/* PRECIO MÁXIMO */}
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

          {/* BÚSQUEDA POR NOMBRE */}
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

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div
                key={product._id || product.name}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
              >
                {/* Imagen (opcional) */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Contenido de la tarjeta */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  {product.brand && (
                    <p className="text-gray-600">
                      <strong>Marca:</strong> {product.brand}
                    </p>
                  )}
                  {typeof product.price === 'number' && (
                    <p className="text-gray-600">
                      <strong>Precio:</strong> ${product.price.toFixed(2)}
                    </p>
                  )}

                  {/* Botón para ver detalles */}
                  <div className="mt-auto">
                    <Link to={`/products/${encodeURIComponent(product.name)}`}>
                      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">
                        Ver detalles
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-1 sm:col-span-2 lg:col-span-3">
              No se encontraron productos.
            </p>
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
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
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Catalogo;
