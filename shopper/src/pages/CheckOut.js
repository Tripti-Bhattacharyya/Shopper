import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // Single product (direct buy)
  const cartItems = location.state?.cartItems || []; // Multiple products (from cart)

  const handlePayment = async (totalAmount) => {
    try {
      // Create payment intent on the backend
      const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your token retrieval logic
        },
        body: JSON.stringify({ amount: totalAmount * 100, currency: 'inr' }), // Amount in smallest currency unit
      });

      const data = await response.json();
      if (response.ok) {
        // Redirect to Payment page with the clientSecret
        navigate('/payment', { state: { clientSecret: data.clientSecret, totalAmount } });
      } else {
        console.error('Failed to create payment intent:', data.message);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  // Case 1: If a single product is being bought
  if (product) {
    return (
      <div>
        <h2>Checkout</h2>
        <div>
          <img
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
            style={{ width: '200px' }}
          />
          <h3>{product.name}</h3>
          <p>Price: Rs {product.price}</p>
          <button onClick={() => handlePayment(product.price)}>Proceed to Payment</button>
        </div>
      </div>
    );
  }

  // Case 2: If multiple items are being bought from the cart
  if (cartItems.length > 0) {
    const totalBill = cartItems.reduce((total, item) => total + item.price, 0);

    return (
      <div>
        <h2>Checkout</h2>
        <div>
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <img
                  src={`http://localhost:5000/${item.image}`}
                  alt={item.name}
                  style={{ width: '50px', marginRight: '10px' }}
                />
                <span>{item.name}</span> - Rs {item.price}
              </li>
            ))}
          </ul>
          <h4>Total: Rs {totalBill.toFixed(2)}</h4>
          <button onClick={() => handlePayment(totalBill)}>Proceed to Payment</button>
        </div>
      </div>
    );
  }

  return <p>No items selected for checkout.</p>;
};

export default Checkout;

