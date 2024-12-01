import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import { useOrders } from "../context/ordersContext";
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from '../pages/Payment';

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
        addOrder([{ id: product._id, name: product.name, price: product.price, image: product.image }]);
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
      <button className="add-to-cart-button" onClick={() => addToCart(product,true)}>
        Add to Cart
      </button>
      <button className="buy-now-button" onClick={handleBuyNow}>
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;

