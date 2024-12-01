import React from 'react';
import { useOrders } from '../context/ordersContext';
import './Orders.css';

const Orders = () => {
  const { orders, clearOrders } = useOrders();

  if (orders.length === 0) {
    return <div>No orders yet!</div>;
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      <button className="clear-orders-button" onClick={clearOrders}>
        Remove All Orders
      </button>
      <ul className="orders-list">
        {orders.map((item, index) => (
          <li key={`${item._id}-${index}`} className="order-item">
            <img
              src={`http://localhost:5000/${item.image}`}
              alt={item.name}
              className="order-item-image"
            />
            <div className="order-item-details">
              <h4>{item.name}</h4>
              <p>Price: Rs {item.price}</p>
              <p>Quantity: {item.quantity}</p> {/* Display quantity */}
              <p>Status: Pending Delivery</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;

