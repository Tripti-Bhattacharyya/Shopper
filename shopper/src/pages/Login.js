import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import './Login.css'; // Import the CSS file

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token, role, user } = response.data;

      login(token, role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      alert('Invalid credentials');
    }
  };

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="login-input"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <p className="forgot-password">
          Forgot your password? <a href="/forgot-password">Click here</a>
        </p>
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p className="register-link">
          New user? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;








