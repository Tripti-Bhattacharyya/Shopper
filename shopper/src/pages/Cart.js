import React, { useContext } from "react";
import { CartContext } from "../context/cartContext";
import './Cart.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  // Calculate total bill
  const totalBill = cartItems.reduce((total, item) => total + item.price, 0);

  // Handle payment logic
  const handlePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user details
      const userEmail = user?.email || ''; // Extract user email from local storage

      // Create Razorpay order
      const orderResponse = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: totalBill,
        currency: 'INR',
      });

      console.log('Order Created:', orderResponse.data);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Razorpay Key ID
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.id,
        name: "Shopper",
        description: "Test Transaction",
        handler: async (response) => {
          try {
            // Verify payment and send email
            const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              ...response,
              userEmail, // Include user's email
              totalAmount: totalBill,
            });

            if (verifyResponse.data.message === 'Payment verified successfully and email sent.') {
              alert('Payment Successful! Check your email for confirmation.');
              navigate('/');
            } else {
              alert('Payment verification failed.');
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert('Error during payment verification.');
          }
        },
        prefill: {
          name: user?.name || 'Your Name',
          email: userEmail,
          contact: "9999999999", // Placeholder contact
        },
        theme: {
          color: "#eb9f40",
        },
      };

      const razorpay = new window.Razorpay(options);
      console.log(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
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
        <button className="buy-button" onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Cart;

