import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const navigate = useNavigate();

  const handleBuyNow = () => {
    // Redirect to checkout with the selected product
    navigate('/checkout', { state: { product } });
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
      <button className="add-to-cart-button" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
      <button className="buy-now-button" onClick={handleBuyNow}>
          Buy Now
        </button>
    </div>
  );
};

export default ProductCard;

