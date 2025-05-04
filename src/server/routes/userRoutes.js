const express = require('express');
const router = express.Router();
const {
  protect,
  authorize,
  requireRole,
  requireAnyRole,
  adminOnly
} = require('../middleware/authMiddleware.js');

const {
  register,
  login,
  getMe
} = require('../controllers/userController.js');

router.post('/register', register);
router.post('/login', login);

router.use(protect);
router.get('/me', getMe);

module.exports = router;