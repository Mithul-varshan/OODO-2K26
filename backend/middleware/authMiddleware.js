const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate JWT tokens
 * Use this to protect routes that require authentication
 * 
 * Usage:
 * const authenticate = require('./middleware/authMiddleware');
 * app.get('/api/protected', authenticate, (req, res) => { ... });
 */
const authenticate = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      userType: decoded.userType
    };

    // Continue to next middleware/route handler
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

/**
 * Middleware to check if user is an admin
 * Must be used after authenticate middleware
 * 
 * Usage:
 * app.get('/api/admin-only', authenticate, requireAdmin, (req, res) => { ... });
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};

/**
 * Middleware to check if user is active
 * Queries database to verify user's is_active status
 * 
 * Usage:
 * app.get('/api/active-users-only', authenticate, requireActive, (req, res) => { ... });
 */
const requireActive = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const db = require('../db');
    const [users] = await db.query(
      'SELECT is_active FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0 || users[0].is_active !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    next();

  } catch (error) {
    console.error('Active check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify account status.'
    });
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  requireActive
};
