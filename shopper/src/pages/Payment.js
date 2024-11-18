import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// Load Stripe
const stripePromise = loadStripe('pk_test_51OsfLSSDK53yDPuaMdZw2Vy4TyJGB8Nug8Yc4nvATKi7iOqIvLRli0SIdmkdsQBERIwMO1Ekb6GdW5TYO4pjz72W00Luof9MUU');

const PaymentForm = ({ clientSecret, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('Payment failed:', error.message);
        alert('Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        // Redirect to order confirmation or homepage
        navigate('/');
      }
    } catch (err) {
      console.error('Error processing payment:', err.message);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <h3>Total: Rs {totalAmount}</h3>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const { clientSecret, totalAmount } = location.state || {};

  if (!clientSecret) {
    return <p>Payment could not be initialized. Please try again.</p>;
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm clientSecret={clientSecret} totalAmount={totalAmount} />
    </Elements>
  );
};

export default Payment;
