import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        setError("Please login to view your orders");
        return;
      }
      try {
        setLoading(true);
        const res = await api.get("/orders");
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user orders.", err);
        setError(err.response?.data?.message || "Failed to load your orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 text-xl mt-10">{error}</div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Your Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-200">
          <p className="text-xl text-gray-600">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  Order ID: {order._id.substring(0, 8)}...
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === "fulfilled"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-4">
                Total Price:{" "}
                <span className="font-bold text-lg text-green-700">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Products:
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {order.products.map((item) => (
                  <li
                    key={item.productId._id}
                    className="flex justify-between items-center text-gray-700"
                  >
                    <span>
                      {item.productId.name} (x{item.quantity})
                    </span>
                    <span className="font-medium">
                      ${(item.productId.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
                Shipping Address:
              </h3>
              <p className="text-gray-700">{order.shippingInfo.address}</p>
              <p className="text-gray-700">
                {order.shippingInfo.city}, {order.shippingInfo.postalCode}
              </p>
              <p className="text-gray-700">{order.shippingInfo.state}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
