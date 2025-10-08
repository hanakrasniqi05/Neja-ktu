const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/popular', eventController.getPopularEvents);

router.get('/', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

module.exports = router;