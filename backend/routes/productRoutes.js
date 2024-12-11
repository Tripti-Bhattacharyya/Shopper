import express from 'express';
import Product from '../models/Product.js'; 
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in an 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Add Product (Admin only, with file upload)
router.post('/add', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    const imagePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
  //In JavaScript, a regular expression is written like this: /pattern/
    //console.log('Image path saved:', imagePath); 

    const product = new Product({
      ...req.body,
      image: imagePath,  
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/purchase', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock -= quantity; // Decrease stock
    await product.save();

    res.status(200).json({ message: 'Purchase successful', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock', error: error.message });
  }
});

router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;
  const image = req.file?.path;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        stock,
        ...(image && { image }),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
});




// Delete Product (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});


router.post('/validateStock', async (req, res) => {
  try {
    const { cartItems } = req.body;
    const failedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product || product.stock < item.quantity) {
        failedItems.push({
          name: product?.name || 'Unknown',
          availableStock: product?.stock || 0,
          requestedQuantity: item.quantity,
        });
      }
    }

    if (failedItems.length > 0) {
      return res.status(200).json({ isStockAvailable: false, failedItems });
    }

    res.status(200).json({ isStockAvailable: true, failedItems: [] });
  } catch (error) {
    console.error('Error validating stock:', error);
    res.status(500).json({ error: 'Server error during stock validation' });
  }
});

export default router;


