import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './AdminOrders.css'; 

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Admin's token for authorization
        if (!token) {
          console.error('Admin token is missing');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }, // Send token in headers
        };

        const response = await axios.get('http://localhost:5000/api/orders', config);
        setOrders(response.data.orders); // Assuming response data structure is correct
      } catch (error) {
        console.error('Error fetching orders:', error.response?.data?.message || error.message);
      }
    };

    fetchOrders();
  }, []);

  // Function to update order status to "Delivered"
  const markAsDelivered = async (orderId) => {
    try {
      const token = localStorage.getItem('token'); // Admin's token
      if (!token) {
        console.error('Admin token is missing');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: 'Delivered' },
        config
      );

      // Update the order status in the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error.response?.data?.message || error.message);
    }
    window.location.reload();
  };

  return (
    <div className="admin-orders">
      <h1>Admin Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name || order.user || 'Unknown'}</td>
              <td>{order.product?.name || 'Unknown'}</td>
              <td>{order.status}</td>
              <td>
                {order.status === 'Delivered' ? (
                  <span className="delivered-label">Delivered</span>
                ) : (
                  <button onClick={() => markAsDelivered(order._id)}>Mark as Delivered</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;

