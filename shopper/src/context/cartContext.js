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
 // Function to add items to the cart or increase quantity
 const addToCart = (item, fromShopPage = false) => {
  setCartItems((prevItems) => {
    // Check if the item is already in the cart
   

    const existingItem = prevItems.find(
      (cartItem) => cartItem._id === item._id
    );

    // If the item already exists in the cart
    if (existingItem) {
      if (!fromShopPage) {
        // Check stock before increasing the quantity
        if (existingItem.quantity + 1 > item.stock) {
          alert("Cannot add more than available stock!");
          return prevItems;
        }

        // Increase the quantity of the existing item
        return prevItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      if (fromShopPage) {
        alert(
          "This item is already in your cart! To increase the quantity, go to your cart."
        );
      }

      return prevItems; // Return cart without changes
    }

    // If the item is not in the cart, check stock before adding
    if (item.stock < 1) {
      alert("This item is out of stock!");
      return prevItems;
    }

    return [...prevItems, { ...item, quantity: 1 }];
  });
};

// Function to decrease the quantity of an item
const decreaseQuantity = (itemId) => {
  setCartItems((prevItems) =>
    prevItems
      .map((item) =>
        item._id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0) // Remove items with quantity 0
  );
};

  

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
 <CartContext.Provider
    value={{ cartItems, addToCart, removeFromCart, clearCart, decreaseQuantity }}
>
   {children}
</CartContext.Provider>
 
  );
};
