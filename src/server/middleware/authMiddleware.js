const jwt = require('jsonwebtoken');
const pool = require('../database.js');
const bcrypt = require('bcryptjs');

// Authentication middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await pool.query(
      'SELECT UserId, FirstName, LastName, Email, Role FROM user WHERE UserId = ?', 
      [decoded.id]
    );
    
    if (!user.length) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = {
      id: user[0].UserId,
      firstName: user[0].FirstName,
      lastName: user[0].LastName,
      email: user[0].Email,
      role: user[0].Role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Role hierarchy definition
const roleHierarchy = {
  admin: ['admin', 'company', 'user'],
  company: ['company', 'user'],
  user: ['user']
};

// Role checking middleware
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!roleHierarchy[userRole]?.includes(requiredRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires ${requiredRole} role.`
      });
    }
    
    next();
  };
};

// Any role from list middleware
const requireAnyRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`
      });
    }
    
    next();
  };
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

module.exports = {
  protect,
  requireRole,
  requireAnyRole,
  adminOnly
};