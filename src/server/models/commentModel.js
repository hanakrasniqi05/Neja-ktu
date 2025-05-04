const db = require('../database');

async function addComment(eventId, userId, content) {
    const [result] = await db.execute(
        'INSERT INTO comments (EventID, UserID, Content) VALUES (?, ?, ?)',
        [eventId, userId, content]
    );
    return result.insertId;
}

async function getCommentsByEvent(eventId) {
    const [rows] = await db.execute(
        `SELECT c.CommentID, c.Content, c.CreatedAt, u.FirstName, u.LastName
         FROM comments c
         JOIN user u ON c.UserID = u.UserId
         WHERE c.EventID = ?
         ORDER BY c.CreatedAt DESC`,
        [eventId]
    );
    return rows;
}

async function deleteComment(commentId, userId) {
    const [result] = await db.execute(
        `DELETE FROM comments WHERE CommentID = ? AND UserID = ?`,
        [commentId, userId]
    );
    return result.affectedRows;
}

module.exports = {
    addComment,
    getCommentsByEvent,
    deleteComment
};
