const pool = require('../database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerCompany = async (req, res) => {
  try {
    const { firstName, lastName, email, password, companyName, businessRegistrationNumber, description } = req.body;

    const user = await User.create({ name, email, password, role: 'company' });
    const [existingUser] = await pool.query(
      'SELECT * FROM user WHERE Email = ?', 
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await pool.query(
      `INSERT INTO user 
      (FirstName, LastName, Email, Password, Role, Verified) 
      VALUES (?, ?, ?, ?, 'company', 0)`,
      [firstName, lastName, email, hashedPassword]
    );

     await pool.query(
      `INSERT INTO companies 
      (user_id, company_name, business_registration_number, description) 
      VALUES (?, ?, ?, ?)`,
      [userResult.insertId, companyName, businessRegistrationNumber, description]
    );

    res.status(201).json({ 
      message: 'Company registration submitted for verification',
      userId: userResult.insertId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.getPendingCompanies = async (req, res) => {
  try {
    const [companies] = await pool.query(
      `SELECT c.*, u.FirstName, u.LastName, u.Email 
       FROM companies c
       JOIN user u ON c.user_id = u.UserId
       WHERE u.Verified = 0 AND u.Role = 'company'`
    );
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pending companies' });
  }
};

exports.verifyCompany = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

 try {
    await pool.query('UPDATE user SET Verified = ? WHERE UserId = ?', [verified ? 1 : 0, id]);
    res.json({ message: `Company ${verified ? 'approved' : 'rejected'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error during verification' });
  }
};
