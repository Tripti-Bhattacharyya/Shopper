import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import { useOrders } from '../context/ordersContext';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from '../pages/Payment';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, decreaseQuantity, clearCart } = useContext(CartContext);
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  //const userId = localStorage.getItem('userId');

  const totalBill = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const handlePaymentForCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email || '';
  
    try {
      // Step 1: Validate stock on the server
      const stockValidationResponse = await axios.post('http://localhost:5000/api/products/validateStock', {
        cartItems: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      });
  
      const { isStockAvailable, failedItems } = stockValidationResponse.data;
  
      // Step 2: Handle insufficient stock scenario
      if (!isStockAvailable) {
        alert(
          `The following items have insufficient stock:\n${failedItems
            .map((item) => `${item.name} (Available: ${item.availableStock}, Requested: ${item.requestedQuantity})`)
            .join('\n')}`
        );
        return; // Stop further execution if stock is insufficient
      }
  
      // Step 3: Proceed with payment if stock is valid
      const paymentResult = await handlePayment({
        amount: totalBill,
        productName: 'Cart Items',
        userEmail,
        navigate,
      });
  
      if (paymentResult?.success) {
        const failedItemsDuringPurchase = [];
  
        for (const item of cartItems) {
          try {
            const response = await axios.post('http://localhost:5000/api/products/purchase', {
              productId: item._id,
              quantity: item.quantity,
            });
  
            if (response.status !== 200) {
              failedItemsDuringPurchase.push(item.name);
            }
          } catch {
            failedItemsDuringPurchase.push(item.name);
          }
        }
  
        if (failedItemsDuringPurchase.length > 0) {
          alert(`Stock update failed for: ${failedItemsDuringPurchase.join(', ')}`);
          return;
        }
  
        // Save all cart items as orders
        const orders = cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }));
  
        await addOrder(orders); // Save all orders
        clearCart();
      } else {
        alert('Payment was not successful. No changes to orders or cart.');
      }
    } catch (error) {
      console.error('Error during payment and stock validation:', error);
      alert('An error occurred. Please try again.');
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



