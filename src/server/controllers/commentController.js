const Comment = require('../models/commentModel');

exports.createComment = async (req, res) => {
    const { eventId, content } = req.body;
    const userId = req.user.id; 

    try {
        const commentId = await Comment.addComment(eventId, userId, content);
        res.status(201).json({ message: 'Comment added', commentId });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getComments = async (req, res) => {
    const eventId = req.params.eventId;

    try {
        const comments = await Comment.getCommentsByEvent(eventId);
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    try {
        const deleted = await Comment.deleteComment(commentId, userId);
        if (deleted) {
            res.json({ message: 'Comment deleted' });
        } else {
            res.status(403).json({ error: 'Unauthorized or not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
