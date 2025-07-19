const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const pool = require('../database.js');

router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const [companies] = await pool.query(
      "SELECT UserId, FirstName, LastName, Email, Role, Verified FROM user WHERE Role = 'company' AND Verified = 0"
    );
    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.patch('/:id/verify', protect, adminOnly, async (req, res) => {
  const companyId = req.params.id;
  const { verified } = req.body;

  try {
    await pool.query("UPDATE user SET Verified = ? WHERE UserId = ? AND Role = 'company'", [verified ? 1 : 0, companyId]);
    res.json({ success: true, message: 'Company verification status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
