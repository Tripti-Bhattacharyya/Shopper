// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import logo from '../assets/logo.png';
import cart_icon from '../assets/cart_icon.png';
import { CartContext } from '../context/cartContext';
import { AuthContext } from '../context/authContext';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, logout, role } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Shopper Logo" aria-label="Home" />
        </Link>
        <p>SHOPPER</p>
      </div>

      {isAuthenticated ? (
        <>
          <ul className="nav-menu">
          {role === 'admin' ? (
              <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
            ) : (
              
              <>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/men">Men</Link></li>
                <li><Link to="/women">Women</Link></li>
                <li><Link to="/kids">Kids</Link></li>
                <li><Link to="/orders">Orders</Link></li>

              </>
            )}
          </ul>
          <div className="nav-login-cart">
              {role !== 'admin' &&(
            <div className="cart-icon">
              <Link to="/cart" className="cart-link">
                <img src={cart_icon} alt="Cart" aria-label="Cart" />
                {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
              </Link>
            </div>
          )}
            <button onClick={logout} aria-label="Logout">Logout</button>
          </div>
        </>
      ) : (
        <div className="nav-login-cart">
          <Link to="/login">
            <button aria-label="Login">Login</button>
          </Link>
         
        </div>
      )}
    </div>
  );
};

export default Navbar;

