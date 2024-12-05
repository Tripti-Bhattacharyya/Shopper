import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    if (!userId || !token) {
      console.error('User ID or token is missing');
      return;
    }
  
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      const response = await axios.get(`http://localhost:5000/api/orders/${userId}`, config);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  

  const addOrder = async (orders) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (!token || !userId) {
      console.error('Token or userId is missing');
      return;
    }
  
    const payload = {
      userId,
      orders: Array.isArray(orders) ? orders : [orders], // Ensure orders is always an array
    };
  
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      console.log('Sending payload:', payload); // Debugging log
  
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        payload,
        config
      );
  
      setOrders((prevOrders) => [...prevOrders, ...response.data.orders]);
      window.location.reload();
    } catch (error) {
      console.error('Error adding order:', error.response?.data?.message || error.message);
    }
  };
console.log(orders);  
  
  

  const clearOrders = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    if (!userId || !token) {
      console.error('User ID or token is missing');
      return;
    }
  
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      await axios.delete(`http://localhost:5000/api/orders/${userId}`, config);
      setOrders([]);
    } catch (error) {
      console.error('Error clearing orders:', error);
    }
  };
  

  return (
    <OrdersContext.Provider value={{ orders, fetchOrders, addOrder, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);


