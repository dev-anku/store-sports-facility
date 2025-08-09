import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  // Helper to format prices in Indian style
  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR"
    });
  };

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-200">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0">
                <div className="flex items-center flex-grow">
                  <img
                    src={item.image || 'https://placehold.co/100x100/E0E0E0/333333?text=No+Image'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4 border border-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/E0E0E0/333333?text=No+Image'; }}
                  />
                  <div>
                    <Link to={`/product/${item.productId}`} className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition duration-200">
                      {item.name}
                    </Link>
                    <p className="text-gray-600">{formatPrice(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newQuantity = Math.max(1, parseInt(value) || 1);
                      updateQuantity(item.productId, newQuantity);
                    }}
                    className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-lg font-bold text-gray-800">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-800 transition duration-200"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Clear Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-xl border border-gray-200 h-fit">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg text-gray-700">Subtotal:</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-gray-700">Shipping:</span>
              <span className="text-xl font-bold text-gray-900">Free</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <span className="text-2xl font-bold text-gray-800">Total:</span>
              <span className="text-3xl font-extrabold text-blue-700">{formatPrice(getTotalPrice())}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md mt-6 transition duration-300 transform hover:scale-105"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

