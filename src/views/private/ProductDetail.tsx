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
  // etc...
}

const ProductDetail: React.FC = () => {
  const { name } = useParams(); // Extrae "name" de la URL -> /products/:name
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Si no hay name en la URL, volvemos al catálogo
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
    // Aquí podrías usar un contexto global, Redux, o localStorage,
    // según la arquitectura de tu app.
    console.log('Producto añadido al carrito:', product.name);
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto p-6 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagen principal del producto */}
          {product.image && (
            <div className="w-full md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded"
              />
            </div>
          )}

          {/* Detalles del producto */}
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            {product.brand && (
              <p className="text-gray-600">
                <strong>Marca:</strong> {product.brand}
              </p>
            )}
            {product.category && (
              <p className="text-gray-600">
                <strong>Categoría:</strong> {product.category}
              </p>
            )}
            {typeof product.price === 'number' && (
              <p className="text-gray-600">
                <strong>Precio:</strong> ${product.price.toFixed(2)}
              </p>
            )}

            {/* Descripción */}
            {product.description && (
              <p className="mt-4 text-gray-800">{product.description}</p>
            )}

            {/* Botón para añadir al carrito */}
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
