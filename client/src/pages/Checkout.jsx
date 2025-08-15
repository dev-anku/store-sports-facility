import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      setLoading(false);
      return;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.state) {
      setError("Please fill in all shipping information fields.");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingInfo,
        totalPrice: getTotalPrice(),
      };

      const res = await api.post("/orders", orderData);
      setMessage(res.message, "Redirecting you to orders...");
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Error placing order.", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center text-red-600 text-xl mt-10">Please log in to proceed to checkout.</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Information Form */}
        <div className="lg:w-2/3 bg-white p-8 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Shipping Information</h2>
          <form onSubmit={handleSubmitOrder}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>
            </div>

            {message && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{message}</p>}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}

            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg font-bold text-xl transition duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md transform hover:scale-105'
                }`}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-xl border border-gray-200 h-fit">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
          <div className="max-h-60 overflow-y-auto mb-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-gray-700">Subtotal:</span>
            <span className="text-xl font-bold text-gray-900">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg text-gray-700">Shipping:</span>
            <span className="text-xl font-bold text-gray-900">Free</span>
          </div>
          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <span className="text-2xl font-bold text-gray-800">Total:</span>
            <span className="text-3xl font-extrabold text-blue-700">${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
