import React, { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { useOrders } from "../context/ordersContext";
import './Cart.css';
import { useNavigate } from "react-router-dom";
import { handlePayment } from '../pages/Payment';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const totalBill = cartItems.reduce((total, item) => total + item.price, 0);

  const handlePaymentForCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email || '';

  const paymentResult = await handlePayment({
    amount: totalBill,
    productName: 'Cart Items',
    userEmail,
    navigate,
  });

  if (paymentResult?.success) {
    addOrder(cartItems);
    clearCart();
  }
  else {
    alert('Payment was not successful. No changes to orders or cart.');
  }
  };

  if (cartItems.length === 0) {
    return <div>Your Cart is Empty!!!!</div>;
  }

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2>Your Cart Items</h2>
        <ul className="cart-list">
          {cartItems.map((item, index) => (
            <li key={`${item.id}-${index}`} className="cart-item">
              <img
                src={`http://localhost:5000/${item.image}`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>Price: Rs {item.price}</p>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="cart-summary">
        <h2>Cart Total</h2>
        <p>Total Items: {cartItems.length}</p>
        <p>Total Bill: Rs {totalBill.toFixed(2)}</p>
        <button className="buy-button" onClick={handlePaymentForCart}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Cart;


