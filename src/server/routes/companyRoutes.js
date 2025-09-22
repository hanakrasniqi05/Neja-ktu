const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  registerCompany,
  getPendingCompanies,
  verifyCompany
} = require('../controllers/companyController');
const { protect, adminOnly, verifyCompanyVerified } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/register', upload.single('logo_path'), registerCompany);
router.get('/pending', protect, adminOnly, getPendingCompanies);
router.patch('/:id/verify', protect, adminOnly, verifyCompany);
router.get('/dashboard', protect, verifyCompanyVerified, (req, res) => {
  res.json({ success: true, message: "Welcome to your company dashboard" });
});

module.exports = router;
