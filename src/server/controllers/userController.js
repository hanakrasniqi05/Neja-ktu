const pool = require('../database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../utils/jwt.js');

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
      'SELECT * FROM user WHERE email = ?', 
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
      'INSERT INTO user (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
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

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT UserId, FirstName, LastName, Email, Role, CreatedAt 
      FROM user
    `);
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const [user] = await pool.query(`
      SELECT UserId, FirstName, LastName, Email, Role, CreatedAt 
      FROM user 
      WHERE UserId = ?
    `, [req.params.id]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const [user] = await pool.query(`
      SELECT UserId, FirstName, LastName, Email, Role, CreatedAt 
      FROM user 
      WHERE UserId = ?
    `, [req.user.UserId]);

    res.json(user[0]);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { FirstName, LastName, Email } = req.body;
    const userId = req.user.UserId;

    // Basic validation
    if (!FirstName || !LastName || !Email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email is being changed to one that already exists
    if (Email !== req.user.Email) {
      const [existing] = await pool.query(
        'SELECT * FROM user WHERE Email = ? AND UserId != ?',
        [Email, userId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    await pool.query(
      `UPDATE user 
       SET FirstName = ?, LastName = ?, Email = ?
       WHERE UserId = ?`,
      [FirstName, LastName, Email, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.UserId;

    // Get current password hash
    const [users] = await pool.query(
      'SELECT Password FROM user WHERE UserId = ?',
      [userId]
    );
    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE user SET Password = ? WHERE UserId = ?',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user (admin can delete any, users can delete themselves)
const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const currentUser = req.user;

    // Check if user exists
    const [user] = await pool.query(
      'SELECT * FROM user WHERE UserId = ?',
      [userIdToDelete]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Authorization check
    if (currentUser.Role !== 'admin' && currentUser.UserId !== parseInt(userIdToDelete)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM user WHERE UserId = ?', [userIdToDelete]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin-only: Change user role
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validate role
    if (!['admin', 'company', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await pool.query(
      'UPDATE user SET Role = ? WHERE UserId = ?',
      [role, userId]
    );

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Change user role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  register,
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  changePassword,
  deleteUser,
  changeUserRole
};