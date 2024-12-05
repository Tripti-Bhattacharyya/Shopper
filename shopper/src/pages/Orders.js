import React, { useEffect } from 'react';
import './Orders.css';
import { useOrders } from '../context/ordersContext';

const Orders = () => {
  const { orders, fetchOrders, clearOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

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
        {orders.map((item, index) => {
          const product = item.product; 
          return (
            <li key={`${item._id}-${index}`} className="order-item">
              <p>{product.name}</p>
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.name || 'Order Image'}
                className="order-item-image"
              />
              <div className="order-item-details">
                <h4>{product.name}</h4>
                <p>Price: Rs {product.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Status: {item.status || 'Pending Delivery'}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Orders;



