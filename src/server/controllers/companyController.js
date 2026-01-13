const pool = require('../database.js');
const bcrypt = require('bcryptjs');

exports.registerCompany = async (req, res) => {
  let connection;
  try {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'companyEmail', 'password', 'companyName'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `${field} is required`,
          field: field
        });
      }
    }

    const {
      firstName,
      lastName,
      companyEmail,
      password,
      companyName,
      businessRegistrationNumber,
      phoneNumber,
      address,
      website,
      description
    } = req.body;

    const logoFile = req.file ? req.file.filename : null;
    const logoPath = logoFile ? `/uploads/${logoFile}` : null;

    const cleanEmail = companyEmail.trim().toLowerCase();

    // Get database connection
    connection = await pool.getConnection();

    // Check if user already exists
    const [existingUser] = await connection.query(
      'SELECT UserId FROM user WHERE Email = ?',
      [cleanEmail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        message: 'Email already registered',
        email: cleanEmail
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Create user
      const [userResult] = await connection.query(
        `INSERT INTO user (FirstName, LastName, Email, Password, Role) 
         VALUES (?, ?, ?, ?, 'company')`,
        [firstName, lastName, cleanEmail, hashedPassword]
      );

      const userId = userResult.insertId;
      const fullName = `${firstName} ${lastName}`;

      // Create company
      await connection.query(
        `INSERT INTO companies 
         (user_id, full_name, company_name, business_registration_number, 
          company_email, phone_number, address, website, logo_path, 
          verification_status, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [
          userId,
          fullName,
          companyName,
          businessRegistrationNumber || null,
          cleanEmail,
          phoneNumber || null,
          address || null,
          website || null,
          logoPath,
          description || null
        ]
      );

      await connection.commit();

      res.status(201).json({ 
        message: 'Company registration submitted for verification',
        userId: userId,
        status: 'pending'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        message: 'Database configuration error - table missing',
        error: 'Please check your database setup'
      });
    }

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ 
        message: 'Database connection failed',
        error: 'Check database credentials'
      });
    }

    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
};

exports.getPendingCompanies = async (req, res) => {
  try {
    const [companies] = await pool.query(
      `SELECT c.*, u.FirstName, u.LastName, u.Email 
       FROM companies c
       JOIN user u ON c.user_id = u.UserId
       WHERE c.verification_status = 'pending'`
    );
    
    res.json({
      success: true,
      count: companies.length,
      companies: companies
    });
    
  } catch (error) {
    console.error('Error fetching pending companies:', error);
    res.status(500).json({ 
      message: 'Server error fetching pending companies',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    if (typeof verified !== 'boolean') {
      return res.status(400).json({ 
        message: 'Verified field must be a boolean' 
      });
    }

    const [company] = await pool.query(
      'SELECT user_id FROM companies WHERE id = ?',
      [id]
    );

    if (company.length === 0) {
      return res.status(404).json({ 
        message: 'Company not found' 
      });
    }

    const userId = company[0].user_id;
    const status = verified ? 'verified' : 'rejected';

    await pool.query(
      'UPDATE companies SET verification_status = ? WHERE id = ?',
      [status, id]
    );

    await pool.query(
      'UPDATE user SET Verified = ? WHERE UserId = ?',
      [verified ? 1 : 0, userId]
    );

    res.json({
      success: true,
      message: `Company ${verified ? 'approved' : 'rejected'} successfully`,
      status: status
    });

  } catch (error) {
    console.error('Error verifying company:', error);
    res.status(500).json({ 
      message: 'Server error during verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
exports.getTopCompanies = async (req, res) => {
  try {
    const [companies] = await pool.query(
      `SELECT 
          c.id,
          c.company_name,
          c.logo_path,
          COUNT(e.EventID) AS eventCount
       FROM companies c
       LEFT JOIN user u ON c.user_id = u.UserId
       LEFT JOIN events e ON e.company_id = u.UserId
       WHERE c.verification_status = 'verified'
       GROUP BY c.id, c.company_name, c.logo_path
       ORDER BY eventCount DESC
       LIMIT 4`
    );

    res.json({
      success: true,
      companies: companies.map(c => ({
        id: c.id,
        name: c.company_name,
        events: `${c.eventCount} Active Events`,
        image: c.logo_path || "/uploads/default-logo.png"
      }))
    });
  } catch (error) {
    console.error("Error fetching top companies:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching top companies"
    });
  }
};
