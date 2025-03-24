import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getProductByName } from '../../api/DevTreeAPI';

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

  // Función "favoritos" (ejemplo). Puedes cambiar la lógica
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
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased flex-grow">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            {/* Imagen */}
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              {product.image ? (
                <img
                  className="w-full"
                  src={product.image}
                  alt={product.name}
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
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {product.name}
              </h1>

              {/* Precio + Rating (ejemplo de estrellas fijas) */}
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  {product.price
                    ? `$${product.price.toFixed(2)}`
                    : '$0.00'}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    {/* 5 estrellas en amarillo (puedes hacerlas dinámicas si tienes rating) */}
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                      </svg>
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

              {/* Marca y categoría (opcional) */}
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

              {/* Botones de "favoritos" y "carrito" */}
              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <button
                  onClick={handleAddToFavorites}
                  className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-5 h-5 -ms-2 me-2 mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                    />
                  </svg>
                  Añadir a favoritos
                </button>

                <button
                  onClick={handleAddToCart}
                  className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center ml-0 sm:ml-4"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                    />
                  </svg>
                  Añadir al carrito
                </button>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              {/* Descripción */}
              {product.description ? (
                <p className="mb-6 text-gray-500 dark:text-gray-400">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Sin descripción disponible.
                </p>
              )}

              {/* Ejemplo de texto extra (puedes omitir o personalizar) */}
              <p className="text-gray-500 dark:text-gray-400">
                (Ejemplo) Este producto cuenta con la mejor calidad del mercado...
                <br />
                Asegúrate de verificar todas sus especificaciones antes de comprar.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProductDetail;
