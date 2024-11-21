import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { sendMail } from '../utils/mailer.js';
dotenv.config();

const router = express.Router();


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
//console.log('Razorpay Instance:', razorpayInstance);
// Create Razorpay order
router.post('/create-order', async (req, res) => {
    try {
      const { amount, currency } = req.body; // Ensure `amount` and `currency` are passed
      if (!amount || !currency) {
        return res.status(400).json({ message: 'Amount and currency are required.' });
      }
  
      const options = {
        amount: amount * 100, // Convert to smallest currency unit
        currency: currency,
        receipt: `receipt_${Date.now()}`,
      };
  
      const order = await razorpayInstance.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userEmail, totalAmount } = req.body;

    // Verify payment signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment verified, send confirmation email
      const emailSubject = 'Payment Confirmation';
      const emailContent = `
        <h1>Thank you for your payment!</h1>
        <p>Your payment of Rs. ${totalAmount.toFixed(2)} has been successfully received.</p>
        <p>Payment ID: ${razorpay_payment_id}</p>
        <p>Order ID: ${razorpay_order_id}</p>
      `;

      await sendMail(userEmail, emailSubject, emailContent);

      return res.status(200).json({ message: 'Payment verified successfully and email sent.' });
    } else {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error during payment verification.' });
  }
});

export default router;


