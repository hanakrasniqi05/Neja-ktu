const pool = require("../database");
const RSVP = require('../models/rsvp');

// Create or update RSVP
exports.createOrUpdateRSVP = async (req, res) => {
  const { event_id, status } = req.body;
  const user_id = req.user.id;

  if (!event_id) {
    return res.status(400).json({ success: false, message: 'event_id is required' });
  }

  try {
    const existing = await RSVP.getRSVP(user_id, event_id);

    if (existing) {
      // If existing RSVP is "not attending", allow re-RSVP
      if (existing.status === 'not attending') {
        const updated = await RSVP.updateRSVP(user_id, event_id, status || 'attending');
        return res.json({ success: true, message: 'RSVP re-activated', rsvp: { user_id, event_id, status } });
      }
      // Already RSVP'd
      return res.status(400).json({ success: false, message: 'RSVP already exists' });
    }

    const rsvpId = await RSVP.createRSVP(user_id, event_id, status || 'attending');
    res.status(201).json({ success: true, message: 'RSVP created', rsvp: { rsvpId, user_id, event_id, status } });
  } catch (err) {
    console.error('CREATE OR UPDATE RSVP ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update RSVP by user+event
exports.updateRSVP = async (req, res) => {
  const { user_id, event_id, status } = req.body;
  const uid = req.user.id;

  if (!user_id || !event_id || !status) {
    return res.status(400).json({ success: false, message: 'user_id, event_id, and status are required' });
  }

  if (user_id !== uid) {
    return res.status(403).json({ success: false, message: 'Cannot update another user\'s RSVP' });
  }

  try {
    if (status === 'not attending') {
      const affected = await RSVP.deleteRSVP(user_id, event_id);
      if (affected === 0) return res.status(404).json({ success: false, message: 'RSVP not found' });
      return res.json({ success: true, message: 'RSVP removed' });
    }

    const affected = await RSVP.updateRSVP(user_id, event_id, status);
    if (affected === 0) return res.status(404).json({ success: false, message: 'RSVP not found' });

    res.json({ success: true, message: 'RSVP updated', rsvp: { user_id, event_id, status } });
  } catch (err) {
    console.error('UPDATE RSVP ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete RSVP by RSVP ID or by user+event
exports.deleteRSVP = async (req, res) => {
  const { user_id, event_id } = req.body;
  const uid = req.user.id;

  if (user_id !== uid) {
    return res.status(403).json({ success: false, message: 'Cannot delete another user\'s RSVP' });
  }

  try {
    const affected = await RSVP.deleteRSVP(user_id, event_id);
    if (affected === 0) return res.status(404).json({ success: false, message: 'RSVP not found' });
    res.json({ success: true, message: 'RSVP removed' });
  } catch (err) {
    console.error('DELETE RSVP ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get RSVPs for current user
exports.getRSVPsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT 
        r.rsvp_id AS RsvpID, 
        r.status AS Status, 
        r.rsvp_date AS CreatedAt, 
        e.EventID,
        e.Title,
        e.Description,
        e.StartDateTime,
        e.EndDateTime
      FROM rsvp r
      JOIN events e ON r.event_id = e.EventID
      WHERE r.user_id = ?
      ORDER BY r.rsvp_date DESC`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET USER RSVPs ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
