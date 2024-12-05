import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Login from './pages/Login';
import Orders from './pages/Orders';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider, AuthContext } from './context/authContext';
import { useContext } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/cartContext';
import { OrdersProvider } from './context/ordersContext';
import Profile from './pages/profile';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
       
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <CartProvider>
      <OrdersProvider>
      <Navbar />
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
     
        <Route path="/*" element={isAuthenticated ? <PrivateRoutes /> : <Home />} />
      </Routes>
      </OrdersProvider>
    </CartProvider>
  );
}

function PrivateRoutes() {
  const { isAuthenticated, role } = useContext(AuthContext);

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
      <Route path="/orders" element={<Orders />} />
    
      {role === 'admin' && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
      {role === 'admin' &&  <Route path="/admin/orders" element={<AdminOrders />} />}
    </Routes>
  );
}

export default App;









