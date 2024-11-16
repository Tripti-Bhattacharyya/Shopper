import React, { useContext } from "react";
import { CartContext } from "../context/cartContext";
import './Cart.css';
const Cart = () => {
  const {cartItems,removeFromCart}=useContext(CartContext);
  if(cartItems.length===0){
    return <div>Your Cart is Empty!!!!</div>
  }
  return (
    <div className="cart-container">
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
                <p>Price:${item.price}</p>
                <button className="remove-button"
                  onClick={()=>removeFromCart(item._id)}>
                  Remove
                </button>
            </div>
          </li>
        ))}

      </ul>
    </div>
  )
};

export default Cart;
