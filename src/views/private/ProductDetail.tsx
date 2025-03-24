import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProductByName } from '../../api/DevTreeAPI';
// Importamos iconos de react-icons
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';

interface Product {
  _id?: string;
  name: string;
  brand?: string;
  category?: string;
  price?: number;
  image?: string;
  description?: string;
}

const ProductDetail: React.FC = () => {
  const { name } = useParams(); // /products/:name
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!name) {
      navigate('/products');
      return;
    }

    const fetchProduct = async () => {
      try {
        const fetched = await getProductByName(name);
        setProduct(fetched);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProduct();
  }, [name, navigate]);

  // Función para añadir al carrito (implementa tu propia lógica)
  const handleAddToCart = () => {
    if (!product) return;
    console.log('Producto añadido al carrito:', product.name);
    alert(`Producto "${product.name}" añadido al carrito.`);
  };

  // Función para añadir a favoritos
  const handleAddToFavorites = () => {
    if (!product) return;
    console.log('Producto añadido a favoritos:', product.name);
    alert(`Producto "${product.name}" añadido a favoritos.`);
  };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Cargando producto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased flex-grow transition-all duration-300">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            {/* Imagen */}
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              {product.image ? (
                <img
                  className="w-full transition transform duration-300 ease-in-out hover:scale-105"
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />
              ) : (
                <img
                  className="w-full"
                  src="https://via.placeholder.com/600x400?text=No+Image"
                  alt="Sin imagen"
                />
              )}
            </div>

            {/* Detalles */}
            <div className="mt-6 sm:mt-8 lg:mt-0">
              {/* Nombre */}
              <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white transition-all duration-300">
                {product.name}
              </h1>

              {/* Precio + Rating */}
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white transition-all duration-300">
                  {product.price ? `$${product.price.toFixed(2)}` : '$0.00'}
                </p>
                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-5 h-5 text-yellow-300" />
                    ))}
                  </div>
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                    (5.0)
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    345 Reviews
                  </a>
                </div>
              </div>

              {/* Marca y Categoría */}
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                {product.brand && (
                  <p className="text-sm">
                    <strong>Marca:</strong> {product.brand}
                  </p>
                )}
                {product.category && (
                  <p className="text-sm">
                    <strong>Categoría:</strong> {product.category}
                  </p>
                )}
              </div>

              {/* Botones de "favoritos" y "añadir al carrito" */}
              <div className="mt-6 sm:flex sm:gap-4 sm:items-center sm:mt-8">
                <button
                  onClick={handleAddToFavorites}
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition transform duration-300 hover:scale-105"
                >
                  <FaHeart className="w-5 h-5 mr-2" />
                  Añadir a favoritos
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center mt-4 sm:mt-0 py-2.5 px-5 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition transform duration-300 hover:scale-105"
                >
                  <FaShoppingCart className="w-5 h-5 mr-2" />
                  Añadir al carrito
                </button>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              {/* Descripción */}
              {product.description ? (
                <p className="mb-6 text-gray-500 dark:text-gray-400 transition-opacity duration-300">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Sin descripción disponible.
                </p>
              )}

            
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProductDetail;
