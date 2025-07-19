const signup = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  console.log("SIGNUP BODY:", req.body);  

  if (!firstName || !lastName || !email || !password) {
    console.log("Missing required fields!");
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  try {
    console.log("Checking if user already exists...");
    const [existingUser] = await pool.query('SELECT * FROM user WHERE Email = ?', [email]);
    console.log("Existing user found:", existingUser);

    if (existingUser.length > 0) {
      console.log("User already exists!");
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const userRole = role && ['user', 'company', 'admin'].includes(role) ? role : 'user';

    console.log("Inserting new user to database...");
    const [result] = await pool.query(
      'INSERT INTO user (FirstName, LastName, Email, Password, Role) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, userRole]
    );
    console.log("Insert result:", result);

    const token = jwt.sign(
      { id: result.insertId, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log("JWT token created");

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
