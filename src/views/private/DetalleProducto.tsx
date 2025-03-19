//private/DetallePro..
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Product } from '../../types/product';
import { getProductByName } from '../../api/DevTreeAPI';

const DetalleProducto: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // Obtenemos el nombre desde la URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
        try {
            if (!name) {
                console.error("❌ No se recibió un nombre en la URL");
                return;
            }

            const decodedName = decodeURIComponent(name);
            console.log(`🔍 Buscando producto en el frontend: "${decodedName}"`);

            const data = await getProductByName(decodedName);
            console.log("📌 Nombre obtenido de la URL:", name);
            console.log("✅ Producto obtenido:", data);
            setProduct(data);
        } catch (error) {
            console.error('❌ Error al obtener el producto:', error);
        } finally {
            setLoading(false);
        }
    }

    fetchProduct();
}, [name]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-500">Producto no encontrado.</p>;
  }

  return (
    <div>
      <Header />
        <p>Nombre del producto en la URL: {name}</p>
        {loading && <p className="text-center text-gray-500">Cargando...</p>}
        {!loading && !product && <p className="text-center text-red-500">Producto no encontrado.</p>}
        {product && (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600 mt-4">{product.description}</p>
                    </div>
                </div>
            </div>
        )}
        <Footer />
    </div>
  );
};

export default DetalleProducto;
