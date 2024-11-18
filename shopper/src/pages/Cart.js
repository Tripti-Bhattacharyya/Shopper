import React, { useContext } from "react";
import { CartContext } from "../context/cartContext";
import './Cart.css';
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate(); 
  // Calculate total price
  const totalBill = cartItems.reduce((total, item) => total + item.price, 0);

  if (cartItems.length === 0) {
    return <div>Your Cart is Empty!!!!</div>;
  }
  const handleBuyNow = () => {
    const userConfirmed = window.confirm("Proceeding to Checkout!");
    if (userConfirmed) {
      navigate('/checkout', { state: { cartItems } });
    }
  };

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
        <button className="buy-button" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;

