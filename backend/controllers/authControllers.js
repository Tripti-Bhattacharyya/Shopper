// backend/controllers/authControllers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

import { sendMail } from '../utils/mailer.js'; 
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'  
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );


    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      userId: user._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || '',
      },
    });
    
    //console.log("b-user:",user._id);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserData = (req, res) => {
  res.json({ message: 'User data accessed', userId: req.userId });
};

export const getAdminData = (req, res) => {
  res.json({ message: 'Admin data accessed' });
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, removeProfilePicture } = req.body;
    const profilePicture = req.file ? req.file.path : undefined;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedData = { name };

 
    if (email && email !== user.email) {
     
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      updatedData.email = email;
    }

    if (profilePicture) {
      
      if (user.profilePicture) {
        const oldPicturePath = path.resolve(user.profilePicture);
        fs.unlink(oldPicturePath, (err) => {
          if (err) console.error("Error deleting old profile picture:", err);
        });
      }
      updatedData.profilePicture = profilePicture;
    } else if (removeProfilePicture) {
    
      if (user.profilePicture) {
        const oldPicturePath = path.resolve(user.profilePicture);
        fs.unlink(oldPicturePath, (err) => {
          if (err) console.error("Error deleting profile picture:", err);
        });
      }
      updatedData.profilePicture = "";
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const otps = {}; 

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); 
    otps[email] = otp;

    console.log("Generated OTP:", otp);
    const subject = 'Your OTP Code';
    const html = `<p>Your OTP code is <strong>${otp}</strong></p>`;
    
    
    await sendMail(email, subject, html);

    res.status(200).json({ message: 'OTP sent successfully', otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  console.log('Stored OTP:', otps[email]); // Debug log
  console.log('Entered OTP:', otp);

  if (!otps[email]) {
    return res.status(400).json({ message: 'OTP not sent for this email' });
  }

  const storedOtp = otps[email].toString().trim();
  const enteredOtp = otp.toString().trim();

  if (storedOtp === enteredOtp) {
    delete otps[email];
    return res.status(200).json({ message: 'OTP verified' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};