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