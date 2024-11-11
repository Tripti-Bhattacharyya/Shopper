import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import './ProductCard.css';
const ProductCard = ({ product }) => {
    //console.log('Rendering product:', product);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Price: ${product.new_price}</p>
      {product.old_price && <p className="old-price">${product.old_price}</p>}
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
