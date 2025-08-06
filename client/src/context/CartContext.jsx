import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("cartItems");
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product, quantity = 1) {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => { item.productId === product._id });

      if (existingItem) {
        return prevItems.map((item) => {
          item.productId === product._id ? { ...item, quantity: item.quantity + quantity } : item
        });
      } else {
        return [...prevItems, { productId: product._id, name: product.name, price: product.name, image: product.image, quantity }];
      }
    });
  };

  function removeFromCart(productId) {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  function updateQuantity(productId, newQuantity) {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.productid !== productId);
      }
      return prevItems.map((item) => { item.productId === productId ? { ...item, quantity: newQuantity } : item });
    });
  };

  function clearCart() {
    setCartItems([]);
  };

  function getTotalPrice() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  return useContext(CartContext);
};
