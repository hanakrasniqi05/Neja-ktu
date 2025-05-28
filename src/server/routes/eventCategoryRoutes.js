const express = require('express');
const router = express.Router();
const { getCategories, getEvents } = require('../controllers/eventCategoryController');

router.get('/categories', eventCategoryController.getCategories); 
router.get('/events', eventCategoryController.getEvents);

module.exports = router;