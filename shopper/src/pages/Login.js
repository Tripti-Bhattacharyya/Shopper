// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token, role, userId } = response.data; // Destructure userId
    

      // Save token and role in AuthContext and userId in localStorage
      login(token, role);
      localStorage.setItem('userId', userId); 

      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
      alert('Invalid credentials');
    }
  };

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button onClick={handleLogin}>Login</button>
      <p>New user? <a href="/register">Register here</a></p>
    </div>
  );
};

export default Login;







