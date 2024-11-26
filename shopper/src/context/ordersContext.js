import React, { createContext, useState, useContext, useEffect } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const ordersKey = `orders_${userId}`;
console.log(userId);
  // Initialize state with orders from localStorage if available
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem(ordersKey);
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    if (userId) {
      const savedOrder = localStorage.getItem(ordersKey);
      if (savedOrder) {
        setOrders(JSON.parse(savedOrder));
      }
    }
  }, [userId, ordersKey]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(ordersKey, JSON.stringify(orders));
    }
  }, [orders, userId, ordersKey]);

  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, ...order]);
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem(ordersKey);
  };
  return (
    <OrdersContext.Provider value={{ orders, addOrder,clearOrders  }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
