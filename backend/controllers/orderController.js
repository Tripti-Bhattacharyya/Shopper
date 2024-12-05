// backend/controllers/orderController.js
import Order from '../models/Order.js';
import { sendMail } from '../utils/mailer.js';
// Fetch all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name').populate('product', 'name');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId).populate('user').populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // If status is "Delivered", send an email to the user
    if (status === 'Delivered') {
      const userEmail = order.user.email;
      const subject = 'Order Delivered!';
      const html = `
        <h1>Your Order Has Been Delivered!</h1>
        <p>Thank you for shopping with us. Your order <strong>${order.product.name}</strong> has been successfully delivered.</p>
        <p>We hope to serve you again soon!</p>
      `;

      // Send the email
      await sendMail(userEmail, subject, html);
    }

    res.status(200).json({ message: 'Order status updated', status: order.status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch user-specific orders
export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId }).populate('product', 'name price image');
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  const { userId, orders } = req.body;

  try {
    // Log the incoming orders for debugging
    console.log('Incoming request body:', req.body);

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: 'Orders array is required' });
    }

    // Validate each order
    const validatedOrders = orders.map((order) => {
      if (!order.product || !order.quantity) {
        throw new Error('Product and quantity are required');
      }
      return { ...order, user: userId };
    });

    const createdOrders = await Order.insertMany(validatedOrders);
    res.status(201).json({ orders: createdOrders });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: error.message });
  }
};



// Delete user orders
export const deleteUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    await Order.deleteMany({ user: userId });
    res.status(200).json({ message: 'Orders cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing orders' });
  }
};
