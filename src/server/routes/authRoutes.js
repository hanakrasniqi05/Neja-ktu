const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { getMe } = require('../controllers/userController'); // Add this import
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FirstName
 *               - LastName
 *               - Email
 *               - Password
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
// Debug middleware
router.post('/signup', (req, res, next) => {
  console.log("POST /signup");
  console.log("Body:", req.body);
  next();
}, signup);

router.post('/login', login);

// Use the getMe controller that queries the database
router.get('/me', protect, getMe);

// Existing profile route
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;