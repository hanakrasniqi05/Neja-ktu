const pool = require('../database.js');
const express = require('express');
const router = express.Router();
const { getAllRsvps } = require('../controllers/rsvpController');
const { protect, requireRole, requireAnyRole } = require('../middleware/authMiddleware');

const {
  createRSVP,
  getRSVPsByEvent,
  updateRSVP,
  updateRSVPById,
  deleteRSVP,
  getRSVPsByUser
} = require('../controllers/rsvpController');
/**
 * @swagger
 * tags:
 *   name: RSVP
 *   description: RSVP management
 */

/**
 * @swagger
 * /api/rsvps:
 *   post:
 *     summary: Create RSVP
 *     tags: [RSVP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: RSVP created
 */

/**
 * @swagger
 * /api/rsvps/event/{eventId}:
 *   get:
 *     summary: Get RSVPs for event
 *     tags: [RSVP]
 *     parameters:
 *       - in: path
 *         name: eventId
 *     responses:
 *       200:
 *         description: RSVP list
 */
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

router.get('/', protect, getAllRsvps); 
module.exports = router;
