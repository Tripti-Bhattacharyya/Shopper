import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import { useOrders } from "../context/ordersContext";
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from '../pages/Payment';
import axios from 'axios';
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { addOrder } = useOrders();

  const handleBuyNow = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email || '';
  
    try {
      const paymentResult = await handlePayment({
        amount: product.price,
        productName: product.name,
        productId: product._id,
        userEmail,
        navigate,
      });
  
      if (paymentResult.success) {
        // Update stock on the server
        await axios.post('http://localhost:5000/api/products/purchase', {
          productId: product._id,
          quantity: 1, // Purchase 1 unit
        });
  
        // Add order locally
        const order = {
          product: product._id, // Use product._id
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        };
  
        await addOrder(order); // Pass the correct structure
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };
  

  return (
    <div className="product-card">
      <img
        src={`http://localhost:5000/${product.image}`}
        alt={product.name}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p>Price: Rs {product.price}</p>
      <p>Stock: {product.stock > 0 ? product.stock : 'Out of stock'}</p>
      <button
        className="add-to-cart-button"
        onClick={() => addToCart(product, true)}
        disabled={product.stock === 0}
      >
        Add to Cart
      </button>
      <button
        className="buy-now-button"
        onClick={handleBuyNow}
        disabled={product.stock === 0}
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;


