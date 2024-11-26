import axios from 'axios';

export const handlePayment = async ({ amount, productName, productId, userEmail, navigate }) => {
  try {
    // Step 1: Create Razorpay order
    const orderResponse = await axios.post('http://localhost:5000/api/payment/create-order', {
      amount,
      currency: 'INR',
    });

    if (!orderResponse || !orderResponse.data || !orderResponse.data.id) {
      throw new Error('Failed to create Razorpay order');
    }

    // Step 2: Return a Promise to handle Razorpay flow
    return new Promise((resolve) => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.id,
        name: "Shopper",
        description: `Purchase: ${productName}`,
        handler: async (response) => {
          try {
            // Verify payment on the backend
            const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userEmail,
              totalAmount: amount,
              productId,
            });

            if (verifyResponse.data.message === 'Payment verified successfully and email sent.') {
              alert('Payment Successful! Check your email for confirmation.');
              navigate('/orders');
              resolve({ success: true });
            } else {
              alert('Payment verification failed.');
              resolve({ success: false });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Error during payment verification.');
            resolve({ success: false });
          }
        },
        prefill: {
          name: "Your Name",
          email: userEmail,
          contact: "9999999999",
        },
        theme: {
          color: "#eb9f40",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        alert('Payment failed. Please try again.');
        resolve({ success: false }); // Resolve promise as failed
      });

      razorpay.open(); // Open Razorpay UI
    });
  } catch (error) {
    console.error('Error during payment:', error);
    alert('Error initiating payment. Please try again.');
    return { success: false };
  }
};


