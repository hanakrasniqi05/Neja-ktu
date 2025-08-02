const express = require('express');
const router = express.Router();
const {
  registerCompany,
  getPendingCompanies,
  verifyCompany
} = require('../controllers/companyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerCompany);
router.get('/pending', protect, adminOnly, getPendingCompanies);
router.patch('/:id/verify', protect, adminOnly, verifyCompany);

module.exports = router;
