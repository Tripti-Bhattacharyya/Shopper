import React from 'react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <p>No product selected for checkout.</p>;
  }

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
        <p>Price: ${product.price}</p>
        <button>Proceed to Payment</button>
      </div>
    </div>
  );
};

export default Checkout;
