const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');

const {
  createRSVP,
  getRSVPsByEvent,
  updateRSVP,
  deleteRSVP
} = require('../controllers/rsvpController');

// Add 
router.post('/', protect, requireRole('user'), createRSVP);

// Get all 
router.get('/event/:eventId', getRSVPsByEvent);

// Update  
router.put('/', protect, requireRole('user'), updateRSVP);

// Delete 
router.delete('/', protect, requireRole('user'), deleteRSVP);

module.exports = router;
