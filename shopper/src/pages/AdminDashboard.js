import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: '',
    stock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('stock', product.stock);
    formData.append('image', product.image);

    try {
      await axios.post('http://localhost:5000/api/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Product added successfully');
    } catch (error) {
      console.error("Error adding product:", error);
      alert('Failed to add product');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" onChange={handleChange} />
      <input name="category" placeholder="Category" onChange={handleChange} />
      <input name="stock" type="number" placeholder="Stock" onChange={handleChange} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
};

export default AdminDashboard;





