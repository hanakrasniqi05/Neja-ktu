const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Debug middleware
router.post('/signup', (req, res, next) => {
  console.log("POST /signup");
  console.log("Body:", req.body);
  next();
}, signup);

router.post('/login', login);

// Return logged in user ( /me)
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Existing profile route
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;