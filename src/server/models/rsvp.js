const db = require('../database');

// Create RSVP
async function createRSVP(userId, eventId, status = 'attending') {
    const [result] = await db.execute(
        `INSERT INTO rsvp (user_id, event_id, status)
         VALUES (?, ?, ?)`,
        [userId, eventId, status]
    );
    return result.insertId;
}

// Get RSVP by user and event 
async function getRSVP(userId, eventId) {
    const [rows] = await db.execute(
        `SELECT * FROM rsvp WHERE user_id = ? AND event_id = ?`,
        [userId, eventId]
    );
    return rows[0]; 
}

// Get all RSVP
async function getRSVPsByEvent(eventId) {
    const [rows] = await db.execute(
        `SELECT r.*, u.FirstName, u.LastName
         FROM rsvp r
         JOIN user u ON r.user_id = u.UserId
         WHERE r.event_id = ?`,
        [eventId]
    );
    return rows;
}

// Update RSVP 
async function updateRSVP(userId, eventId, newStatus) {
    const [result] = await db.execute(
        `UPDATE rsvp SET status = ? WHERE user_id = ? AND event_id = ?`,
        [newStatus, userId, eventId]
    );
    return result.affectedRows;
}

// Update RSVP by ID 
async function updateRSVPById(rsvpId, newStatus) {
    const [result] = await db.execute(
        `UPDATE rsvp SET status = ? WHERE rsvp_id = ?`,
        [newStatus, rsvpId]
    );
    return result.affectedRows;
}

// Delete RSVP
async function deleteRSVP(userId, eventId) {
    const [result] = await db.execute(
        `DELETE FROM rsvp WHERE user_id = ? AND event_id = ?`,
        [userId, eventId]
    );
    return result.affectedRows;
}

module.exports = {
    createRSVP,
    getRSVP,
    getRSVPsByEvent,
    updateRSVP,
    deleteRSVP
};
