import React, { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { useOrders } from "../context/ordersContext";
import './Cart.css';
import { useNavigate } from "react-router-dom";
import { handlePayment } from '../pages/Payment';
import axios from 'axios';
const Cart = () => {
  const { cartItems, removeFromCart, addToCart, decreaseQuantity, clearCart } = useContext(CartContext);
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const totalBill = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePaymentForCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user?.email || "";
  
    try {
      const paymentResult = await handlePayment({
        amount: totalBill,
        productName: "Cart Items",
        userEmail,
        navigate,
      });
  
      if (paymentResult?.success) {
        const failedItems = [];
  
        for (const item of cartItems) {
          try {
            const response = await axios.post("http://localhost:5000/api/products/purchase", {
              productId: item._id,
              quantity: item.quantity,
            });
  
            if (response.status !== 200) {
              failedItems.push(item.name);
            }
          } catch {
            failedItems.push(item.name);
          }
        }
  
        if (failedItems.length > 0) {
          alert(`Stock update failed for: ${failedItems.join(", ")}`);
          return;
        }
  
        addOrder(cartItems);
        clearCart();
      } else {
        alert("Payment was not successful. No changes to orders or cart.");
      }
    } catch (error) {
      console.error("Error during payment and stock update:", error);
      alert("An error occurred. Please try again.");
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
            <li key={`${item._id}-${index}`} className="cart-item">
              <img
                src={`http://localhost:5000/${item.image}`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>Price: Rs {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="quantity-buttons">
                  <button
                    className="decrease-button"
                    onClick={() => decreaseQuantity(item._id)}
                  >
                    -
                  </button>
              <button
                  className="increase-button"
                  onClick={() => {
                    const product = cartItems.find((cartItem) => cartItem._id === item._id);
                    if (product.quantity + 1 > product.stock) {
                      alert('Cannot exceed available stock!');
                    } else {
                      addToCart(item);
                    }
                  }}
                >
                  +
            </button>

                </div>
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
        <p>Total Items: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
        <p>Total Bill: Rs {totalBill.toFixed(2)}</p>
        <button className="buy-button" onClick={handlePaymentForCart}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Cart;



