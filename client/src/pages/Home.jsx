import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-10">{error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Our Products</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No products available at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image || 'https://placehold.co/400x300/E0E0E0/333333?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover object-center rounded-t-xl"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/E0E0E0/333333?text=No+Image'; }}
                />
              </Link>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                  <Link to={`/product/${product._id}`} className="hover:text-blue-600 transition duration-200">
                    {product.name}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-3">{product.category}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-700">${product.price.toFixed(2)}</span>
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 rounded-lg font-bold transition duration-300 ${product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md transform hover:scale-105'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home
