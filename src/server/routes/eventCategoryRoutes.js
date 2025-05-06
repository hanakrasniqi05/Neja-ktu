const express = require('express');
const { getCategories, getEvents } = require('../controllers/eventCategoryController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/events', getEvents);

module.exports = router;