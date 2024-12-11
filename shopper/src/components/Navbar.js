import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import cart_icon from '../assets/cart_icon.png';
import defaultAvatar from '../assets/default-avatar.png'; // Placeholder avatar
import { CartContext } from '../context/cartContext';
import { AuthContext } from '../context/authContext';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, logout, role, user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle Dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown') && !event.target.closest('.profile-circle')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const BASE_URL = "http://localhost:5000";
  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Shopper Logo" aria-label="Home" />
        </Link>
        <p>SHOPPER</p>
      </div>

      {/* Navigation Menu */}
      {isAuthenticated && (
        <ul className="nav-menu">
          {role === 'admin' ? (
            <li>
               <Link to="/admin/orders">Manage Orders</Link>
            </li>
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
      )}
      {/* User/Profile Section */}
      <div className="nav-user">
        {isAuthenticated ? (
          <div className="user-menu">
            {role !== 'admin' && (
              <div className="cart-icon">
                <Link to="/cart" className="cart-link">
                  <img src={cart_icon} alt="Cart" aria-label="Cart" />
                  {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                </Link>
              </div>
            )}

            {/* Profile Circle with Dropdown */}
            <div className="profile-circle" onClick={toggleDropdown}>
            <img
              src={
                user?.profilePicture
                  ? `${BASE_URL}/${user.profilePicture.replace(/\\/g, '/')}`
                  : defaultAvatar
              }
              alt="Profile"
              className="profile-image"
            />
            </div>
            {isDropdownOpen && (
              <div className="dropdown">
                <ul>
                  <li onClick={() => navigate('/profile')}>Profile</li>
                  {role === 'admin' && (
                    <li onClick={() => navigate('/admin-dashboard')}>Admin Dashboard</li>
                  )}
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="nav-login-button">
            <Link to="/login">
              <button aria-label="Login">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
