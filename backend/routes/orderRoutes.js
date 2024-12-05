import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getUserOrders,
  createOrder,
  deleteUserOrders,
} from '../controllers/orderController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';
import validateOrderRequest from '../middleware/validateOrder.js';

const router = express.Router();

// Admin Routes
router.get('/',verifyToken, isAdmin, getAllOrders); // Fetch all orders for admins
router.put('/:orderId/status',verifyToken, isAdmin, updateOrderStatus); // Update order status

// User Routes
router.get('/:userId', verifyToken, getUserOrders); // Fetch user-specific orders
router.post('/', verifyToken, validateOrderRequest, createOrder); // Create a new order
router.delete('/:userId', verifyToken, deleteUserOrders); // Clear user orders

export default router;

