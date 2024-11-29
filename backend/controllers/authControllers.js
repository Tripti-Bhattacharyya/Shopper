// backend/controllers/authControllers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';


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
      const { name } = req.body;
      const profilePicture = req.file ? req.file.path : undefined;

      if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
      }

      const updatedData = { name };
      if (profilePicture) {
          updatedData.profilePicture = profilePicture;
      }

      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: updatedData },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
          user: updatedUser,
          message: "Profile updated successfully",
      });
  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};
