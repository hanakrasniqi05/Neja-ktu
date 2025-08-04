const jwt = require('jsonwebtoken');
const pool = require('../database.js');
const bcrypt = require('bcryptjs');

// Signup controller
const signup = async (req, res) => {
  
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide all required fields' 
    });
  }

  try {
    // Check if user exists
    console.log("Signup attempt for email:", email);
    const [existingUser] = await pool.query('SELECT * FROM user WHERE Email = ?', [email]);
    console.log("Existing user check result:", existingUser);

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    console.log("Hashing password for new user");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate and set role
    const userRole = role && ['user', 'company', 'admin'].includes(role) ? role : 'user';
    console.log("User role set to:", userRole);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO user (FirstName, LastName, Email, Password, Role) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, userRole]
    );
    console.log("User inserted with ID:", result.insertId);

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return response without password
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        role: userRole,
        token
      }
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide email and password' 
    });
  }

  try {
    // Get user from database
    console.log("Login attempt for email:", email);
    const [users] = await pool.query('SELECT * FROM user WHERE Email = ?', [email]);
    console.log("User fetch result:", users);
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const user = users[0];

    // Compare passwords
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
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return response without password
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
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login
};
