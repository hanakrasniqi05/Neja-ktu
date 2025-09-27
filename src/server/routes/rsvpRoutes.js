const pool = require('../database.js');
const express = require('express');
const router = express.Router();
const { protect, requireRole, requireAnyRole } = require('../middleware/authMiddleware');

const {
  createRSVP,
  getRSVPsByEvent,
  updateRSVP,
  updateRSVPById,
  deleteRSVP,
  getRSVPsByUser
} = require('../controllers/rsvpController');

// Add 
router.post('/', protect, requireAnyRole('user'), createRSVP);

// Get by event
router.get('/event/:eventId', getRSVPsByEvent);

// Get by user
router.get("/mine", protect, requireRole("user"), getRSVPsByUser);

// Update by user+event
router.put('/', protect, requireRole('user'), updateRSVP);

// Update by rsvp_id
router.put('/:id', protect, requireRole('user'), updateRSVPById);

// Delete
router.delete('/', protect, requireRole('user'), deleteRSVP);

module.exports = router;
