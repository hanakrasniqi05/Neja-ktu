const pool = require('../database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../utils/jwt.js');

// Register 
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'user' } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT * FROM user WHERE Email = ?', 
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO user (FirstName, LastName, Email, Password, Role) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, role]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.accessExpiration }
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        role,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM user WHERE Email = ?',
      [email]
    );
    const user = users[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.UserId, role: user.Role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.accessExpiration }
    );

    res.json({
      success: true,
      data: {
        id: user.UserId,
        firstName: user.FirstName,
        lastName: user.LastName,
        email: user.Email,
        role: user.Role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT UserId as id, FirstName as firstName, LastName as lastName, Email as email, Role as role FROM user WHERE UserId = ?',
      [req.user.id]
    );
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update current user profile
const updateMe = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    let profilePic = req.body.profilePic;

    // Get current user
    const [users] = await pool.query(
      'SELECT * FROM user WHERE UserId = ?',
      [req.user.id]
    );
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build update query dynamically
    let updates = [];
    let values = [];

    if (firstName) {
      updates.push('FirstName = ?');
      values.push(firstName);
    }
    if (lastName) {
      updates.push('LastName = ?');
      values.push(lastName);
    }
    if (profilePic) {
      updates.push('ProfilePic = ?');
      values.push(profilePic);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(req.user.id);

    await pool.query(
      `UPDATE user SET ${updates.join(', ')} WHERE UserId = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
  
};
const deleteMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT * FROM user WHERE UserId = ?',
      [req.user.id]
    );
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await pool.query('DELETE FROM user WHERE UserId = ?', [req.user.id]);

    res.json({
      success: true,
      message: 'Your account has been deleted'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deletion'
    });
  }
};


// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
     'SELECT UserId as id, FirstName as firstName, LastName as lastName, Email as email, Role as role, ProfilePicture as profilePicture FROM user'
    );
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Authentication middleware
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Get user from database
    const [users] = await pool.query(
      'SELECT UserId as id, FirstName, LastName, Email, Role FROM user WHERE UserId = ?',
      [decoded.id]
    );
    const user = users[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      role: user.Role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Role checking middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires ${role} role.`
      });
    }
    next();
  };
};

// Any role from list middleware
const requireAnyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
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
  register,
  login,
  getMe,
  getAllUsers,
  updateMe,
  protect,
  requireRole,
  requireAnyRole,
  adminOnly,
  deleteMe
};