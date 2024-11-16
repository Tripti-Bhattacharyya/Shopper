import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; 
import './Kids.css'; 

const Kids = () => {
  const [KidsProducts, setKidsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKidsProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/category/k');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setKidsProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKidsProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="kids-page">
      <h2>Kids Collection</h2>
      <div className="product-list">
        {KidsProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Kids;

