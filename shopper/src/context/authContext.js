import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null; // Parse stored user or set to null
  });

  useEffect(() => {
    // Load from localStorage on initial render
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setRole(localStorage.getItem('role'));
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (token, role, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data
    setIsAuthenticated(true);
    setRole(role);
    setUser(userData); // Update user state
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setRole('');
    setUser(null); // Clear user state
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser); // Update context state
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Sync with localStorage
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Sync with localStorage on user change
    }
  }, [user]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};


