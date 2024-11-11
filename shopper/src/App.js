import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Cart from './pages/Cart';  
import { CartProvider } from './context/cartContext';
function App() {
  return (
    <CartProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/cart" element={<Cart />} /> 
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;

