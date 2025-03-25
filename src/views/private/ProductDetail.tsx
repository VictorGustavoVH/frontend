// src/views/private/ProductDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProductByName } from '../../api/DevTreeAPI';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

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
  const { name } = useParams(); // Ruta: /products/:name
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    alert(`Producto "${product.name}" añadido al carrito.`);
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
              <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white transition-all duration-300">
                {product.name}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white transition-all duration-300">
                  {product.price ? `$${product.price.toFixed(2)}` : '$0.00'}
                </p>
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
              <div className="mt-6 sm:flex sm:gap-4 sm:items-center sm:mt-8">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition transform duration-300 hover:scale-105"
                >
                  <FaShoppingCart className="w-5 h-5 mr-2" />
                  Añadir al carrito
                </button>
                {/* Puedes agregar aquí otros botones, como "añadir a favoritos" o "comprar ahora" */}
              </div>
              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
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
