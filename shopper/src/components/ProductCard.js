import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <img
        src={`http://localhost:5000/${product.image}`}
        alt={product.name}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button className="add-to-cart-button" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

