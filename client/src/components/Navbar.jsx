import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-white text-3xl font-bold tracking-wide hover:text-blue-200 transition duration-300"
        >
          E-Shop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-white text-lg hover:text-blue-200 transition duration-300"
          >
            Products
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="text-white text-lg hover:text-blue-200 transition duration-300 relative"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {/* User is logged in */}
              <Link
                to="/orders"
                className="text-white text-lg hover:text-blue-200 transition duration-300"
              >
                My Orders
              </Link>

              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="text-white text-lg hover:text-blue-200 transition duration-300 bg-purple-600 px-3 py-1 rounded-md"
                >
                  Admin
                </Link>
              )}

              <span className="text-white text-lg">
                Hello, {user?.name || 'User'}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* User is not logged in */}
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
