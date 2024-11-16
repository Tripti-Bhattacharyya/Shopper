import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; // Assuming you have this component for rendering a product
import './Mens.css'; // Optional CSS for styling

const Mens = () => {
  const [mensProducts, setMensProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMensProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/category/m');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setMensProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMensProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mens-page">
      <h2>Men's Collection</h2>
      <div className="product-list">
        {mensProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Mens;

