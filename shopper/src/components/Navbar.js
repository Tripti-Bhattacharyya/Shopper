import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import logo from '../assets/logo.png';
import cart_icon from '../assets/cart_icon.png';
import { CartContext } from '../context/cartContext';

const Navbar = () => {
  const { cartItems } = useContext(CartContext); // Access cart items from context

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Shopper Logo" aria-label="Home" />
        </Link>
        <p>SHOPPER</p>
      </div>

      <ul className="nav-menu">
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/men">Men</Link></li>
        <li><Link to="/women">Women</Link></li>
        <li><Link to="/kids">Kids</Link></li>
      </ul>

      <div className="nav-login-cart">
        <button aria-label="Login">Login</button>
        <div className="cart-icon">
          <Link to="/cart" className="cart-link">
            <img src={cart_icon} alt="Cart" aria-label="Cart" />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
