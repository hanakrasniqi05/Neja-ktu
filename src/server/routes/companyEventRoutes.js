const express = require('express');
const router = express.Router();

const {
  protect,
  verifyCompanyVerified
} = require('../middleware/authMiddleware');

const {
  createEvent,
  getEvents,
  getPopularEvents,
  getMyEvents
} = require('../controllers/eventControllerCompany');

// Route for creating an event (only for verified companies)
router.post(
  '/',
  protect,
  verifyCompanyVerified,
  createEvent
);

// Route for fetching events of the logged-in company
router.get(
  '/my-events',
  protect,
  verifyCompanyVerified,
  getMyEvents
);

// Public routes
router.get('/', getEvents);
router.get('/popular', getPopularEvents);

module.exports = router;