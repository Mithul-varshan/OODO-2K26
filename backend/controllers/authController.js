const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Login Handler
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Query user from database
    const [users] = await db.query(
      'SELECT user_id, email, password_hash, first_name, last_name, is_active, role FROM users WHERE email = ?',
      [email]
    );

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check if user is active
    if (user.is_active !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.user_id, 
        email: user.email, 
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return success response with user data and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

// Forgot Password Handler
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const [users] = await db.query(
      'SELECT user_id, email, is_active, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Don't reveal that user doesn't exist for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    const user = users[0];

    // Check if user is active
    if (user.is_active !== 1) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiry time (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save token to database
    await db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.user_id, hashedToken, expiresAt]
    );

    // In production, you would send an email here
    // For demo purposes, we'll return the token in the response
    return res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      data: {
        resetToken, // In production, this would be sent via email only
        email: user.email
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request'
    });
  }
};

// Reset Password Handler
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash the token to match database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid token
    const [tokens] = await db.query(
      `SELECT user_id FROM password_reset_tokens 
       WHERE token = ? AND expires_at > NOW() AND used = 0`,
      [hashedToken]
    );

    if (tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const { user_id } = tokens[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, user_id]
    );

    // Mark token as used
    await db.query(
      'UPDATE password_reset_tokens SET used = 1 WHERE token = ?',
      [hashedToken]
    );

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting password'
    });
  }
};

// Verify Token Handler (optional - for protected routes)
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: decoded.id,
          email: decoded.email,
          userType: decoded.userType
        }
      }
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Registration Handler
const register = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      city, 
      country, 
      additionalInfo, 
      password 
    } = req.body;

    // Validate required fields (only firstName, lastName, email, password are required)
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user with actual schema columns (role defaults to 'user')
    const [result] = await db.query(
      `INSERT INTO users 
       (email, password_hash, first_name, last_name, is_active, role, created_at) 
       VALUES (?, ?, ?, ?, 1, 'user', NOW())`,
      [email, hashedPassword, firstName, lastName]
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Please login.',
      data: {
        userId: result.insertId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again.'
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
  register
};
