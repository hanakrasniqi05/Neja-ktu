const pool = require('../database.js');
const bcrypt = require('bcryptjs');

exports.registerCompany = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      companyName,
      businessRegistrationNumber,
      phoneNumber,
      address,
      website,
      description
    } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    // Check existing user
    const [existingUser] = await pool.query(
      'SELECT * FROM user WHERE Email = ?', 
      [cleanEmail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [userResult] = await pool.query(
      `INSERT INTO user 
      (FirstName, LastName, Email, Password, Role) 
      VALUES (?, ?, ?, ?, 'company')`,
      [firstName, lastName, cleanEmail, hashedPassword]
    );

    // Create company
    await pool.query(
      `INSERT INTO companies 
      (user_id, company_name, business_registration_number, 
       phone_number, address, website, description, verification_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userResult.insertId,
        companyName,
        businessRegistrationNumber,
        phoneNumber,
        address,
        website,
        description
      ]
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
  const companies = await Company.findAll({ where: { is_verified: false }, include: 'User' });
  res.json(companies);
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
  await Company.update({ is_verified: true }, { where: { id } });
  res.json({ message: 'Company verified' });
  const { verified } = req.body;

 try {
    await pool.query('UPDATE user SET Verified = ? WHERE UserId = ?', [verified ? 1 : 0, id]);
    res.json({ message: `Company ${verified ? 'approved' : 'rejected'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error during verification' });
  }
};