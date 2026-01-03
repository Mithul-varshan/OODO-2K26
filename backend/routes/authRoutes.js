const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login);

// Registration route
router.post('/register', authController.register);

// Forgot password route
router.post('/forgot-password', authController.forgotPassword);

// Reset password route
router.post('/reset-password', authController.resetPassword);

// Verify token route (optional - for checking if user is authenticated)
router.get('/verify', authController.verifyToken);

module.exports = router;
