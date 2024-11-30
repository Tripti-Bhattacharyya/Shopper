import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      alert('OTP sent to your email.');
      setStep(2);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      console.log('Email being sent:', email);
      console.log('OTP being sent:', otp);
  
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: email.trim().toLowerCase(), // Normalize email here too
        otp: otp.trim(), // Trim OTP to remove extra spaces
      });
  
      console.log(response.data); // See success message
      setStep(3);
    } catch (error) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error);
      alert('Invalid OTP.');
    }
  };
  
  

  const handleChangePassword = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, newPassword });
      alert('Password changed successfully.');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password.');
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
