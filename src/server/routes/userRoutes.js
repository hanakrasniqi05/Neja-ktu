const express = require('express');
const router = express.Router();
const pool = require('../database.js');
// Import middleware funksionet me CommonJS
const {
  protect,
  adminOnly,
  requireRole,
  requireAnyRole
} = require('../middleware/authMiddleware');

// Import controller-at me CommonJS
const {
  register,
  login,
  getMe,
  getAllUsers 
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Apply JWT token protection for all routes below
router.use(protect);

// Protected route për përdoruesin aktual
router.get('/me', getMe);

// Admin-only routes
router.get('/admin/dashboard', adminOnly, (req, res) => {
  res.json({ success: true, message: 'Welcome to admin dashboard', user: req.user });
});

router.get('/admin/users', adminOnly, async (req, res) => {
  try {
    const [users] = await require('../database').query(
       'SELECT UserId as id, FirstName as firstName, LastName as lastName, Email as email, Role as role FROM user'
    );
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Company & admin route
router.get('/company/dashboard', requireAnyRole('admin', 'company'), (req, res) => {
  res.json({ success: true, message: 'Welcome to company dashboard', user : req.user });
});

// User-only route
router.get('/user/dashboard', requireRole('user'), (req, res) => {
  res.json({ success: true, message: 'Welcome to user dashboard', user: req.user });
});

module.exports = router;
