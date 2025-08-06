const express = require('express');
const router = express.Router();
const {
  registerCompany,
  getPendingCompanies,
  verifyCompany
} = require('../controllers/companyController');
const { protect, adminOnly, verifyCompanyVerified } = require('../middleware/authMiddleware');

router.post('/register', registerCompany);
router.get('/pending', protect, adminOnly, getPendingCompanies);
router.patch('/:id/verify', protect, adminOnly, verifyCompany);

// Shembull rruge për kompaninë e verifikuar
router.get('/dashboard', protect, verifyCompanyVerified, (req, res) => {
  res.json({ success: true, message: "Welcome to your company dashboard" });
});

module.exports = router;
