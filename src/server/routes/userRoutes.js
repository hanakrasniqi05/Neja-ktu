// userRoutes.js
const express = require('express');
const router = express.Router();

// Import middleware funksionet me CommonJS
const {
  protect,
  authorize,
  requireRole,
  requireAnyRole,
  adminOnly
} = require('../middleware/authMiddleware.js');

// Import controller-at me CommonJS
const {
  register,
  login,
  getMe
} = require('../controllers/userController.js');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Apply JWT token protection for all routes below
router.use(protect);

// Protected route për përdoruesin aktual
router.get('/me', getMe);

// Admin-only routes
router.get('/admin/dashboard', adminOnly, (req, res) => {
  res.json({ success: true, message: 'Welcome to admin dashboard' });
});

router.get('/admin/users', adminOnly, async (req, res) => {
  try {
    const [users] = await require('../database').query(
      'SELECT id, firstName, lastName, email, role FROM user'
    );
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Company & admin route
router.get('/company/dashboard', requireAnyRole('admin', 'company'), (req, res) => {
  res.json({ success: true, message: 'Welcome to company dashboard' });
});

// User-only route
router.get('/user/dashboard', requireRole('user'), (req, res) => {
  res.json({ success: true, message: 'Welcome to user dashboard' });
});

// Eksporto router-in me CommonJS
module.exports = router;
