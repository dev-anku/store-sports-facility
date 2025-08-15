import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, admin } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [productError, setProductError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null,
  });
  const [productMessage, setProductMessage] = useState("");
  const [productFormError, setProductFormError] = useState("");

  useEffect(() => {
    if (admin) {
      fetchProducts();
      fetchAllOrders();
    }
  }, [admin]);

  async function fetchProducts() {
    try {
      setLoadingProducts(true);
      const res = await api.get("/products");
      setProducts(res.data);
      setLoadingProducts(false);
    } catch (err) {
      console.error("Error fetching products for admin.", err);
      setProductError("Failed to load products");
      setLoadingProducts(false);
    }
  };

  async function fetchAllOrders() {
    try {
      setLoadingOrders(true);
      const res = await api.get("/orders/all");
      setOrders(res.data);
      setLoadingOrders(false);
    } catch (err) {
      console.error("Error fetching all orders for admin.", err);
      setOrderError("Failed to load all orders.");
      setLoadingOrders(false);
    }
  };

  async function handleDeleteProduct(productId) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${productId}`);
        setProductMessage("Product deleted successfully!");
        fetchProducts();
        setTimeout(() => setProductMessage(""), 2000);
      } catch (err) {
        console.error("Error deleting product: ", err);
        setProductFormError(err.response?.data?.message || "Failed to delete product.");
        setTimeout(() => setProductFormError(""), 3000);
      }
    }
  };

  async function handleUpdateOrderStatus(orderId, newStatus) {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setProductMessage("Order status updated successfully.");
      fetchAllOrders();
      setTimeout(() => setProductMessage(''), 2000);
    } catch (err) {
      console.error('Error updating order status:', err);
      setProductFormError(err.response?.data?.message || 'Failed to update order status.');
      setTimeout(() => setProductFormError(''), 3000);
    }
  };

  function openProductModal(product = null) {
    setCurrentProduct(product);
    if (product) {
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        image: null,
      });
    } else {
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });
    }
    setProductError("");
    setShowProductModal(true);
  };

  function closeProductModal() {
    setShowProductModal(false);
    setCurrentProduct(null);
    setProductFormError("");
  };

  function handleProductFormChange(e) {
    const { name, value, files } = e.target;
    setProductForm({
      ...productForm,
      [name]: files ? files[0] : value,
    });
  };

  async function handleProductSubmit(e) {
    e.preventDefault();
    setProductFormError("");
    setProductMessage("");

    const formData = new FormData();
    for (const key in productForm) {
      if (productForm[key] !== null) {
        formData.append(key, productForm[key]);
      }
    }

    try {
      if (currentProduct) {
        await api.put(`/products/${currentProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProductMessage('Product updated successfully!');
      } else {
        await api.post("/products", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProductMessage('Product created successfully!');
      }
      fetchProducts();
      closeProductModal();
      setTimeout(() => setProductMessage(''), 2000);
    } catch (err) {
      console.error("Product form submission error.", err);
      setProductFormError(err.response?.data?.message || "Failed to save product.");
    }
  };

  if (!admin) {
    return <div className="text-center text-red-600 text-xl mt-10">You are not authorized to access this page.</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Admin Dashboard</h1>

      {productMessage && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{productMessage}</p>}
      {productFormError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{productFormError}</p>}

      {/* Product Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 mb-10">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
          <button
            onClick={() => openProductModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            Add New Product
          </button>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p className="ml-4 text-md">Loading products...</p>cart
          </div>
        ) : productError ? (
          <div className="text-center text-red-600 text-lg">{productError}</div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={product.image || 'https://placehold.co/50x50/E0E0E0/333333?text=No+Image'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50/E0E0E0/333333?text=No+Image'; }}
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-green-700 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">{product.stock}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-sm transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Order Management</h2>

        {loadingOrders ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            <p className="ml-4 text-md">Loading orders...</p>
          </div>
        ) : orderError ? (
          <div className="text-center text-red-600 text-lg">{orderError}</div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Products</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{order._id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 text-gray-600">{order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})</td>
                    <td className="py-3 px-4 text-gray-600">
                      <ul className="list-disc list-inside text-sm">
                        {order.products.map(item => (
                          <li key={item.productId?._id || item._id}>{item.productId?.name || 'Unknown Product'} (x{item.quantity})</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4 text-green-700 font-semibold">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative">
            <button
              onClick={closeProductModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
              {currentProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleProductSubmit}>
              {productFormError && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{productFormError}</p>}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">Stock</label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  value={productForm.stock}
                  onChange={handleProductFormChange}
                  className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image (Optional)</label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleProductFormChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*"
                />
                {currentProduct?.image && (
                  <p className="text-sm text-gray-500 mt-2">Current image: <a href={currentProduct.image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">view</a></p>
                )}
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 transform hover:scale-105"
              >
                {currentProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

