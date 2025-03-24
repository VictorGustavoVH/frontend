import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProducts } from '../../api/DevTreeAPI';

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
    // Si ya está seleccionada la categoría, limpiamos al volver a presionar
    if (selectedCategory === categoryValue) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(categoryValue);
    }
    setShowCategoryMenu(false); // Cerramos el menú
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
    // Búsqueda por nombre
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

    // Filtro por rango de precios
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
    setCurrentPage(page);
  };

  // Listas únicas de categorías y marcas
  const categoryOptions = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  const brandOptions = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  return (
    <div>
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* Fila con Buscador, Botón Categoría, Botón Filtros (todo en línea) */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Buscador */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* BOTÓN CATEGORÍA */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryMenu(!showCategoryMenu);
                setShowFilterMenu(false); // Cerramos el otro menú si está abierto
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Categoría
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
                {/* Opción "Todas" */}
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
                setShowCategoryMenu(false); // Cierra menú de categorías si está abierto
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Filtros
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

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div
                key={product.name}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
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

                  <div className="mt-auto pt-4">
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

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
              className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
