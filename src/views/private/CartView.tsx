// src/views/private/CartView.tsx
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaTrashAlt } from 'react-icons/fa';

const CartView: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Calcular el total del carrito
  const total = cart.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased flex-grow transition-all duration-300">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
          {cart.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío.</p>
          ) : (
            <div>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        item.product.image ||
                        'https://via.placeholder.com/150'
                      }
                      alt={item.product.name}
                      className="w-20 h-20 object-cover mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">
                        {item.product.name}
                      </h2>
                      <p className="text-gray-600">
                        ${item.product.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      className="w-16 p-1 border rounded mr-2"
                      onChange={(e) =>
                        updateQuantity(
                          item.product._id!,
                          Number(e.target.value)
                        )
                      }
                    />
                    <button
                      onClick={() => removeFromCart(item.product._id!)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Vaciar Carrito
                </button>
                <div className="text-xl font-bold">
                  Total: ${total.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CartView;
