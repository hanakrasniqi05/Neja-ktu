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
       LEFT JOIN events e ON e.company_id = c.id  -- Fixed: join on companies.id, not user.UserId
       WHERE c.verification_status = 'verified'
       GROUP BY c.id, c.company_name, c.logo_path
       HAVING COUNT(e.EventID) > 0  -- Only include companies with events
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
exports.getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [company] = await pool.query(
      `SELECT 
        id,
        user_id,
        company_name,
        description,
        business_registration_number,
        company_email,
        phone_number,
        address,
        website,
        logo_path,
        verification_status
       FROM companies 
       WHERE user_id = ?`,
      [userId]
    );

    if (company.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company[0]
    });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching company profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company_name,
      description,
      address,
      website,
      phone_number
    } = req.body;

    const logoFile = req.file ? req.file.filename : null;
    const logoPath = logoFile ? `/uploads/${logoFile}` : undefined;

    // Check if company exists
    const [company] = await pool.query(
      'SELECT id FROM companies WHERE user_id = ?',
      [userId]
    );

    if (company.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (company_name) {
      updates.push('company_name = ?');
      values.push(company_name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (website !== undefined) {
      updates.push('website = ?');
      values.push(website);
    }
    if (phone_number !== undefined) {
      updates.push('phone_number = ?');
      values.push(phone_number);
    }
    if (logoPath) {
      updates.push('logo_path = ?');
      values.push(logoPath);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(userId);

    await pool.query(
      `UPDATE companies SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    // Get updated company data
    const [updatedCompany] = await pool.query(
      `SELECT 
        id,
        company_name,
        description,
        phone_number,
        address,
        website,
        logo_path,
        verification_status
       FROM companies WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      data: updatedCompany[0]
    });

  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating company profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};