const pool = require('../database.js');
const express = require('express');
const router = express.Router();
const { protect, requireRole, requireAnyRole} = require('../middleware/authMiddleware');

const {
  createRSVP,
  getRSVPsByEvent,
  updateRSVP,
  deleteRSVP,
  getRSVPsByUser
} = require('../controllers/rsvpController');

// Add 
router.post('/', protect, requireAnyRole('user'), createRSVP);

// Get all 
router.get('/event/:eventId', getRSVPsByEvent);

// Get by user
router.get("/mine", protect, requireRole("user"), getRSVPsByUser);

// Update  
router.put('/', protect, requireRole('user'), updateRSVP);

// Delete 
router.delete('/', protect, requireRole('user'), deleteRSVP);

module.exports = router;
