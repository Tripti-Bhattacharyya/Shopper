// backend/routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getUserData, getAdminData,updateUserProfile,sendOtp, verifyOtp, resetPassword } from '../controllers/authControllers.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Register Route
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  registerUser
);

// Login Route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  loginUser
);

// Protected route (requires login)
router.get('/user-data', verifyToken, getUserData);

// Admin-only route
router.get('/admin-data', verifyToken, isAdmin, getAdminData);

router.put('/:id', verifyToken, upload.single('profilePicture'), updateUserProfile);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
export default router;

