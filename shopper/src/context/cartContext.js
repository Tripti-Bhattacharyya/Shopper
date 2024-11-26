import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const cartKey = `cartItems_${userId}`;

  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (userId) {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [userId, cartKey]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, userId, cartKey]);

  // Function to add items to the cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find((cartItem) => cartItem._id === item._id);
  
      if (existingItem) {
        // Notify the user that the item is already in the cart
        alert(`${item.name} is already in the cart.`);
        return prevItems; // Return the previous cart items unchanged
      }
  
      // If the item is not in the cart, add it
      return [...prevItems, item];
    });
  };
  
//console.log(cartItems);
  // Function to remove items from the cart
  const removeFromCart = (itemId) => {
    console.log("Removing Item ID:", itemId); // Debugging log
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item._id !== itemId);
      console.log("Updated Cart Items:", updatedCart); // Debugging log
      return updatedCart;
    });
  };
  const clearCart = () => {
    setCartItems([]); // Clear cart state
    localStorage.removeItem(cartKey); // Remove from localStorage
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
