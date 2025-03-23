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
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  // "Show More" - cuántos productos se ven
  const [visibleCount, setVisibleCount] = useState(8);

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
    setVisibleCount(8); // cuando busco, reseteo a 8
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setVisibleCount(8);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setVisibleCount(8);
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

  // Productos visibles (hasta visibleCount)
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Opciones únicas de categoría y marca
  const categoryOptions = Array.from(new Set(products.map((p) => p.category)));
  const brandOptions = Array.from(new Set(products.map((p) => p.brand)));

  // Mostrar u ocultar el botón "Show More"
  const canShowMore = visibleCount < filteredProducts.length;

  return (
    <div>
      <Header />
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">

          {/* Heading & Filters */}
          <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
            <div>
              {/* Rastro / Título (puedes ajustarlo a tu gusto) */}
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <a
                      href="#"
                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m9 5 7 7-7 7"
                        />
                      </svg>
                      <span className="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white md:ms-2">
                        Products
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Catálogo de Productos
              </h2>
            </div>

            {/* Tus Filtros: Categoría, Marca, Buscador */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {/* Filtro Categoría */}
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todas las categorías</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Filtro Marca */}
              <select
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg"
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

              {/* Buscador */}
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Grid de productos */}
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <div
                key={product.name}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="h-56 w-full">
                  <Link to={`/products/${encodeURIComponent(product.name)}`}>
                    {/* Si no hay imagen, podrías mostrar un placeholder */}
                    {product.image ? (
                      <img
                        className="mx-auto h-full"
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <img
                        className="mx-auto h-full"
                        src="https://via.placeholder.com/300x200?text=No+Image"
                        alt={product.name}
                      />
                    )}
                  </Link>
                </div>

                <div className="pt-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    {/* Ejemplo de label de marca */}
                    {product.brand && (
                      <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        {product.brand}
                      </span>
                    )}
                    {/* Acciones ocultas, etc. */}
                  </div>

                  {/* Nombre del producto */}
                  <Link
                    to={`/products/${encodeURIComponent(product.name)}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                  >
                    {product.name}
                  </Link>

                  {/* Descripción corta */}
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {product.description}
                  </p>

                  {/* Precio */}
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                      {product.price
                        ? `$${product.price.toFixed(2)}`
                        : '$0.00'}
                    </p>
                    {/* Botón de detalle, "Agregar al carrito", etc. */}
                    <Link
                      to={`/products/${encodeURIComponent(product.name)}`}
                      className="inline-flex items-center rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón "Show more" */}
          {canShowMore && (
            <div className="w-full text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                Show more
              </button>
            </div>
          )}

          {/* Opcional: Modal de filtros avanzado (lo copias si quieres, o lo quitas) */}
          {/* <form> .... </form> */}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Catalogo;
