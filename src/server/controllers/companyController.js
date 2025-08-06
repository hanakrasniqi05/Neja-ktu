const pool = require('../database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controller to handle company registration
exports.registerCompany = async (req, res) => {
  try {
    const { firstName, lastName, email, password, companyName, businessRegistrationNumber, description } = req.body;

    // Check if user with this email already exists in the user table
    const [existingUser] = await pool.query(
      'SELECT * FROM user WHERE Email = ?', 
      [email]
    );

    if (existingUser.length > 0) {
      // If user exists, send 400 response with message
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user as company with verified = 0 (not verified yet)
    const [userResult] = await pool.query(
      `INSERT INTO user 
      (FirstName, LastName, Email, Password, Role, Verified) 
      VALUES (?, ?, ?, ?, 'company', 0)`,
      [firstName, lastName, email, hashedPassword]
    );

    // Insert additional company info into companies table linked to user_id
    await pool.query(
      `INSERT INTO companies 
      (user_id, company_name, business_registration_number, description) 
      VALUES (?, ?, ?, ?)`,
      [userResult.insertId, companyName, businessRegistrationNumber, description]
    );

    // Send success response indicating company registration is pending verification
    res.status(201).json({ 
      message: 'Company registration submitted for verification',
      userId: userResult.insertId
    });

  } catch (error) {
    // Log error on server side and send 500 response
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Controller to get all companies pending verification
exports.getPendingCompanies = async (req, res) => {
  try {
    const [companies] = await pool.query(
      `SELECT c.*, u.FirstName, u.LastName, u.Email 
       FROM companies c
       JOIN user u ON c.user_id = u.UserId
       WHERE u.Verified = 0 AND u.Role = 'company'`
    );
    // Send list of pending companies as JSON
    res.json(companies);
  } catch (error) {
    // Handle server error
    res.status(500).json({ message: 'Server error fetching pending companies' });
  }
};

// Controller to verify or reject a company registration
exports.verifyCompany = async (req, res) => {
  const { id } = req.params;           
  const { verified } = req.body;       

  try {
    // Update Verified status in user table
    await pool.query('UPDATE user SET Verified = ? WHERE UserId = ?', [verified ? 1 : 0, id]);
    // Send success response with appropriate message
    res.json({ message: `Company ${verified ? 'approved' : 'rejected'} successfully` });
  } catch (error) {
    // Handle server error during verification
    res.status(500).json({ message: 'Server error during verification' });
  }
};
