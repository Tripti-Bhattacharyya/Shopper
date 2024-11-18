// backend/routes/webhookRoutes.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook endpoint
router.post('/hook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = req.body;
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      endpointSecret
    );

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent);

      // You can notify the admin here
      // e.g., send an email, update the database, etc.
    }

    res.status(200).send({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send({ error: 'Webhook Error' });
  }
});

export default router;
