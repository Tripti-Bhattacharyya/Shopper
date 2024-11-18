// backend/routes/paymentRoutes.js
import express from 'express';
import Stripe from 'stripe';
import { verifyToken } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY);

// Payment route
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  const { amount, currency = 'inr' } = req.body; // Amount in the smallest currency unit (e.g., paisa for INR)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // e.g., 10000 for Rs. 100
      currency, // 'inr', 'usd', etc.
      payment_method_types: ['card'], // Add available methods
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret, // Send this to the frontend
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment creation failed', error: error.message });
  }
});

export default router;
