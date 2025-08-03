const express = require('express');
const router = express.Router();

const {
  createRSVP,
  getRSVPsByEvent,
  updateRSVP,
  deleteRSVP
} = require('../controllers/rsvpController');

// Add 
router.post('/', createRSVP);

// Get all 
router.get('/event/:eventId', getRSVPsByEvent);

// Update  
router.put('/', updateRSVP);

// Delete 
router.delete('/', deleteRSVP);

module.exports = router;
