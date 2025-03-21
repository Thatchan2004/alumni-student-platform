// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  verifyEmail
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

// Password management
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// These routes are undefined in your controller, so they're causing the error
// Comment them out for now until you implement them
// router.put('/updatepassword', protect, updatePassword);
// router.put('/updatedetails', protect, updateDetails);

// Email verification
router.get('/verify-email/:verificationToken', verifyEmail);

module.exports = router;
