import express from 'express';
import { signUpUser, signInUser, saveUserProfile, getUserProfile } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signin route
router.post('/signin', signInUser);

// Signup route
router.post('/signup', signUpUser);

// Get profile route (protected)
router.get('/profile', protect, getUserProfile);

// Save profile route (protected)
router.post('/profile', protect, saveUserProfile);

export default router;
