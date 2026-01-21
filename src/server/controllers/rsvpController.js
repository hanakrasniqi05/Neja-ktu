const pool = require("../database");
const RSVP = require('../models/rsvp');

//create
exports.createRSVP = async (req, res) => {
  const { event_id, status } = req.body;
  const user_id = req.user.id;

  if (!event_id) {
    return res.status(400).json({ success: false, message: 'event_id is required' });
  }
  const [rows]= await pool.query('SELECT * FROM events WHERE EventID = ?', [event_id]);
  if (rows.length === 0) {
    return res.status(404).json ({
      success: false,
      message: 'Cannot RSVP to past events'
    });
  }
  try {
    const existing = await RSVP.getRSVP(user_id, event_id);

    if (existing) {
      if (existing.status === 'not attending') {
        await RSVP.updateRSVP(user_id, event_id, status || 'attending');
        return res.json({ success: true, message: 'RSVP re-activated', rsvp: { user_id, event_id, status: status || 'attending' } });
      }
      return res.status(400).json({ success: false, message: 'RSVP already exists' });
    }

    const rsvpId = await RSVP.createRSVP(user_id, event_id, status || 'attending');
    res.status(201).json({ success: true, message: 'RSVP created', rsvp: { rsvpId, user_id, event_id, status: status || 'attending' } });

  } catch (err) {
    console.error('CREATE RSVP ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update RSVP by user+event
exports.updateRSVP = async (req, res) => {
  const { event_id, status } = req.body;
  const user_id = req.user.id;

  if (!event_id || !status) {
    return res.status(400).json({
      success: false,
      message: 'event_id and status are required'
    });
  }

  try {
    if (status === 'not attending') {
      const affected = await RSVP.deleteRSVP(user_id, event_id);
      if (affected === 0) return res.status(404).json({ success: false, message: 'RSVP not found' });
      return res.json({ success: true, message: 'RSVP removed' });
    }

    const affected = await RSVP.updateRSVP(user_id, event_id, status);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'RSVP not found' });
    }

    res.json({
      success: true,
      message: 'RSVP updated',
      rsvp: { user_id, event_id, status }
    });
  } catch (err) {
    console.error('UPDATE RSVP ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// update by id
exports.updateRSVPById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) return res.status(400).json({ success: false, message: 'rsvp_id and status are required' });

  try {
    const affected = await RSVP.updateRSVPById(id, status);
    if (affected === 0) return res.status(404).json({ success: false, message: 'RSVP not found' });

    res.json({ success: true, message: 'RSVP updated', rsvp: { rsvp_id: id, status } });
  } catch (err) {
    console.error('UPDATE RSVP BY ID ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// delete
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
    const [rows] = await pool.query(`
      SELECT r.rsvp_id AS rsvp_id, r.status, r.rsvp_date, e.EventID, e.Title, e.Description, e.StartDateTime, e.EndDateTime
      FROM rsvp r
      JOIN events e ON r.event_id = e.EventID
      WHERE r.user_id = ?
      ORDER BY r.rsvp_date DESC
    `, [userId]);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('GET RSVPs BY USER ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// get by event
exports.getRSVPsByEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const [rows] = await pool.query(`
      SELECT r.rsvp_id AS rsvp_id, r.user_id, r.status, r.rsvp_date, u.name AS user_name, u.email AS user_email
      FROM rsvp r
      JOIN user u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.rsvp_date DESC
    `, [eventId]);

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('GET RSVPs BY EVENT ERROR:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//get all RSVPs with role-based access
exports.getAllRsvps = async (req, res) => {
  try {
    // Add safety check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const userId = req.user.id;
    const role = req.user.role;

    let query = '';
    let params = [];

    // Debug logging
    console.log('User info:', { userId, role });

    if (role === 'user') {
      query = `
        SELECT 
          r.rsvp_id AS RSVP_ID,
          r.user_id AS UserID,
          CONCAT(u.FirstName, ' ', u.LastName) AS UserName,
          u.Email AS UserEmail,
          r.event_id AS EventID,
          e.Title AS EventTitle,
          r.status AS Status,
          r.rsvp_date AS CreatedAt
        FROM rsvp r
        JOIN user u ON r.user_id = u.UserId  -- Fixed: u.UserId not u.id
        JOIN events e ON r.event_id = e.EventID
        WHERE r.user_id = ?
        ORDER BY r.rsvp_date DESC
      `;
      params = [userId];
    } else if (role === 'company') {
      query = `
        SELECT 
          r.rsvp_id AS RSVP_ID,
          r.user_id AS UserID,
          CONCAT(u.FirstName, ' ', u.LastName) AS UserName,
          u.Email AS UserEmail,
          r.event_id AS EventID,
          e.Title AS EventTitle,
          r.status AS Status,
          r.rsvp_date AS CreatedAt
        FROM rsvp r
        JOIN user u ON r.user_id = u.UserId  -- Fixed: u.UserId not u.id
        JOIN events e ON r.event_id = e.EventID
        WHERE e.company_id = ?
        ORDER BY r.rsvp_date DESC
      `;
      params = [userId];
    } else if (role === 'admin') {
      query = `
        SELECT 
          r.rsvp_id AS RSVP_ID,
          r.user_id AS UserID,
          CONCAT(u.FirstName, ' ', u.LastName) AS UserName,
          u.Email AS UserEmail,
          r.event_id AS EventID,
          e.Title AS EventTitle,
          r.status AS Status,
          r.rsvp_date AS CreatedAt
        FROM rsvp r
        JOIN user u ON r.user_id = u.UserId  -- Fixed: u.UserId not u.id
        JOIN events e ON r.event_id = e.EventID
        ORDER BY r.rsvp_date DESC
      `;
      params = [];
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Role not allowed to view RSVPs' 
      });
    }

    console.log('Executing query:', query);
    console.log('With params:', params);

    const [rows] = await pool.query(query, params);

    console.log('Query results:', rows);

    res.json({ 
      success: true, 
      count: rows.length, 
      data: rows 
    });
  } catch (err) {
    console.error('GET ALL RSVPS ERROR:', err);
    console.error('Error details:', {
      message: err.message,
      sql: err.sql,
      sqlMessage: err.sqlMessage
    });
    
    // Don't send multiple responses
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
};
