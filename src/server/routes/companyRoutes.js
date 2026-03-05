const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  registerCompany,
  getPendingCompanies,
  verifyCompany,
  getTopCompanies,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyAccount
} = require('../controllers/companyController');
const { protect, adminOnly, verifyCompanyVerified } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {cb(null, path.join(__dirname, '../uploads'));},
  filename: (req, file, cb) => {cb(null, Date.now() + path.extname(file.originalname));}
});

const upload = multer({ storage });
/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management
 */

/**
 * @swagger
 * /api/companies/register:
 *   post:
 *     summary: Register a company
 *     tags: [Companies]
 *     responses:
 *       201:
 *         description: Company registered
 */

/**
 * @swagger
 * /api/companies/top:
 *   get:
 *     summary: Get top companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Top companies
 */

/**
 * @swagger
 * /api/companies/me:
 *   get:
 *     summary: Get company profile
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company profile
 */
// Public routes
router.post('/register', upload.single('logo_path'), registerCompany);
router.get('/top', getTopCompanies);

// Protected routes
router.get('/me', protect, verifyCompanyVerified, getCompanyProfile);  // ADD THIS
router.put('/me', protect, verifyCompanyVerified, upload.single('logo'), updateCompanyProfile);  // ADD THIS

router.get('/dashboard', protect, verifyCompanyVerified, (req, res) => {
  res.json({ success: true, message: "Welcome to your company dashboard" });
});

// Admin-only routes
router.get('/pending', protect, adminOnly, getPendingCompanies);
router.patch('/:id/verify', protect, adminOnly, verifyCompany);

router.delete('/me', protect, verifyCompanyVerified, deleteCompanyAccount);

module.exports = router;