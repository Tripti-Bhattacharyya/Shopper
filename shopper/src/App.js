// src/App.js
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './context/authContext';
import { useContext, useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/cartContext';
function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

function PrivateRoutes() {
  const { isAuthenticated, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <Home />;
  }

  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />
      <Route path="/kids" element={<Kids />} />
      <Route path="/cart" element={<Cart />} />
      {role === 'admin' && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
    </Routes>
  );
}

export default App;






