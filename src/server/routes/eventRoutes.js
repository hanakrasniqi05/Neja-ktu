const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Public events
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/events/popular:
 *   get:
 *     summary: Get popular events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Popular events
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Event details
 */
router.get('/popular', eventController.getPopularEvents);

router.get('/', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

module.exports = router;