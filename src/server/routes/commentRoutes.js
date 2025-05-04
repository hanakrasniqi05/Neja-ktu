const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, commentsController.createComment);
router.get('/:eventId', commentsController.getComments);
router.delete('/:commentId', protect, commentsController.deleteComment);


module.exports = router;
