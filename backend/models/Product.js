// backend/models/Product.js

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
 
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

// Default export
export default Product;

