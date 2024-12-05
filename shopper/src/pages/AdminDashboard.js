import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: 0,
    image: null,
  });

  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(
        response.data.map((product) => ({
          ...product,
          imagePreview: product.image, // Use existing image URL as default
        }))
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input change for adding/updating products
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change for adding a new product
  const handleFileChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Add a new product
  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("stock", product.stock);
    formData.append("image", product.image);

    try {
      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Product added successfully");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  // Update a product
  const handleUpdateProduct = async (id) => {
    const updatedProduct = products.find((p) => p._id === id);

    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("price", updatedProduct.price);
    formData.append("category", updatedProduct.category);
    formData.append("stock", updatedProduct.stock);
    if (updatedProduct.image instanceof File) {
      formData.append("image", updatedProduct.image);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Product updated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Add Product Section */}
      <div>
        <h3>Add Product</h3>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} />
        <select name="category" value={product.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="m">Men</option>
          <option value="f">Women</option>
          <option value="k">Kids</option>
        </select>
        <input name="stock" type="number" placeholder="Stock" onChange={handleChange} />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      {/* Product List Section */}
      <div>
        <h3>All Products</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                 <td>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id ? { ...p, name: e.target.value } : p
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <img
                    src={
                      product.imagePreview instanceof File
                        ? URL.createObjectURL(product.imagePreview)
                        : `http://localhost:5000/${product.imagePreview}`
                    }
                    alt={product.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id
                            ? { ...p, image: e.target.files[0], imagePreview: e.target.files[0] }
                            : p
                        )
                      )
                    }
                  />
                </td>
               
                <td>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id ? { ...p, price: e.target.value } : p
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <select
                    value={product.category}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id ? { ...p, category: e.target.value } : p
                        )
                      )
                    }
                  >
                    <option value="m">Men</option>
                    <option value="f">Women</option>
                    <option value="k">Kids</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id ? { ...p, stock: e.target.value } : p
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleUpdateProduct(product._id)}>Update</button>
                  <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;






