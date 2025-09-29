const pool = require("../database");
const RSVP = require('../models/rsvp');

// Create RSVP
exports.createRSVP = async (req, res) => {
  const { event_id, status } = req.body;
  const user_id = req.user.id; 

  if (!event_id) {
    return res.status(400).json({ success: false, message: 'event_id is required' });
  }

  try {
    const existing = await RSVP.getRSVP(user_id, event_id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'RSVP already exists' });
    }

    const rsvpId = await RSVP.createRSVP(user_id, event_id, status || 'attending');
    res.status(201).json({ success: true, message: 'RSVP created', rsvp_id: rsvpId });
  } catch (error) {
    console.error('CREATE RSVP ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get all RSVPs for event
exports.getRSVPsByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const rsvps = await RSVP.getRSVPsByEvent(eventId);
    res.json({ success: true, data: rsvps });
  } catch (error) {
    console.error('GET RSVPS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update RSVP status
exports.updateRSVP = async (req, res) => {
  const { user_id, event_id, status } = req.body;

  if (!user_id || !event_id || !status) {
    return res.status(400).json({ success: false, message: 'user_id, event_id, and status are required' });
  }

  try {
    const affected = await RSVP.updateRSVP(user_id, event_id, status);

    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'RSVP not found' });
    }

    res.json({ success: true, message: 'RSVP status updated' });
  } catch (error) {
    console.error('UPDATE RSVP ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete RSVP
exports.deleteRSVP = async (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ success: false, message: 'user_id and event_id are required' });
  }

  try {
    const affected = await RSVP.deleteRSVP(user_id, event_id);

    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'RSVP not found' });
    }

    res.json({ success: true, message: 'RSVP deleted' });
  } catch (error) {
    console.error('DELETE RSVP ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

//get all rsvps
exports.getAllRsvps = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.rsvp_id   AS RsvpID,
        CONCAT(u.FirstName, ' ', u.LastName) AS UserName,
        u.Email     AS UserEmail,
        e.Title     AS EventTitle,
        r.status    AS Status,
        r.rsvp_date AS CreatedAt
      FROM rsvp r
      INNER JOIN user u   ON r.user_id  = u.UserId
      INNER JOIN events e ON r.event_id = e.EventID
      ORDER BY r.rsvp_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getRSVPsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching RSVPs for user:", userId);
    
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
      ORDER BY r.rsvp_date DESC

  `,
      [userId]
    );
    
    console.log("Found RSVPs:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching user RSVPs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update RSVP by RSVP ID
exports.updateRSVPById = async (req, res) => {
  const { status } = req.body;
  const rsvpId = req.params.id;
  const userId = req.user.id; // from JWT

  if (!status) {
    return res.status(400).json({ success: false, message: 'status is required' });
  }

  try {
    const [result] = await pool.query(
      "UPDATE rsvp SET status = ? WHERE rsvp_id = ? AND user_id = ?",
      [status, rsvpId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'RSVP not found or not yours' });
    }

    res.json({ success: true, message: 'RSVP status updated', status });
  } catch (error) {
    console.error('UPDATE RSVP BY ID ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

