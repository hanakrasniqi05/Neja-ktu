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
  getMyEvents,
  updateEvent,  
  deleteEvent   
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

// Update event (company only)
router.put(
  '/:id',
  protect,
  verifyCompanyVerified,
  updateEvent
);

// Delete event (company only)
router.delete(
  '/:id',
  protect,
  verifyCompanyVerified,
  deleteEvent
);

// Public routes
router.get('/', getEvents);
router.get('/popular', getPopularEvents);

module.exports = router;