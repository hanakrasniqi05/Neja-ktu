const express = require('express');
const router = express.Router();
const { getCategories, getEvents } = require('../controllers/eventCategoryController');

router.get('/categories', getCategories); 
router.get('/events', getEvents);

module.exports = router;