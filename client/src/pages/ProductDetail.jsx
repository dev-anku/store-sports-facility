import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Product might not exist.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      if (quantity > product.stock) {
        setMessage('Cannot add more than available stock!');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      addToCart(product, quantity);
      setMessage(`${quantity} ${product.name}(s) added to cart!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-10">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-600 text-xl mt-10">Product not found.</div>;
  }

  return (
    <div className="py-8">
      <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold mb-6 inline-block">
        &larr; Back to Products
      </Link>
      <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="md:w-1/2">
          <img
            src={product.image || 'https://placehold.co/600x400/E0E0E0/333333?text=No+Image'}
            alt={product.name}
            className="w-full h-auto max-h-[400px] object-contain rounded-lg border border-gray-200"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/E0E0E0/333333?text=No+Image'; }}
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-4">{product.category}</p>
          <p className="text-gray-800 text-base leading-relaxed mb-6">{product.description}</p>
          <div className="flex justify-between items-center mb-6">
            <span className="text-4xl font-bold text-green-700">
              {Number(product.price).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR'
              })}
            </span>
            <span className={`text-xl font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              Status: {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="quantity" className="text-gray-700 font-medium">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center"
              />
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 px-6 rounded-lg font-bold text-xl transition duration-300 ${product.stock > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md transform hover:scale-105'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          {message && (
            <p className="mt-4 text-center text-green-600 font-semibold bg-green-100 p-3 rounded-md">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

